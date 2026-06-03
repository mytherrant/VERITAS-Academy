#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VÉRITAS — index_corpus.py
=========================
Indexe les fichiers locaux (épreuves, cours, référentiels MINESEC) dans
api/data/biblio_index.db, au format EXACT attendu par api/rag.php :

    files     : id, path, filename, author, title, year, format, pages, indexed_at
    passages  : table FTS5 (file_id, text)

Caractéristiques de sûreté
--------------------------
- Stdlib uniquement (sqlite3, re, html, pathlib, datetime, shutil, argparse).
- Sauvegarde HORODATÉE de la base avant toute écriture.
- `CREATE TABLE IF NOT EXISTS` : fonctionne aussi bien pour enrichir une base
  existante (bibliothèque) que pour en créer une de zéro — n'efface JAMAIS
  les entrées déjà présentes.
- Idempotent PAR CHEMIN : ré-indexer un fichier remplace proprement ses
  anciens passages (pas de doublons).

Usage
-----
    python index_corpus.py
    python index_corpus.py --dirs evaluations cours reference "D:/Bibliothèque"
    python index_corpus.py --db api/data/biblio_index.db --author "Centre VÉRITAS"

Puis : uploadez api/data/biblio_index.db sur le serveur (FTP) → RAG actif.
"""
import argparse
import html
import re
import shutil
import sqlite3
import sys
from datetime import datetime
from pathlib import Path

DEFAULT_DB = "api/data/biblio_index.db"
DEFAULT_DIRS = ["evaluations", "cours", "reference"]
EXTS = {".html", ".htm", ".txt", ".md", ".docx", ".epub"}
CHUNK = 800      # caractères par passage
OVERLAP = 120    # chevauchement entre passages (continuité du sens)
MIN_LEN = 40     # ignorer les fragments trop courts


def extract_docx(path: Path) -> str:
    """Extrait le texte d'un .docx (zip XML) — stdlib uniquement, pas de dépendance."""
    import zipfile
    try:
        z = zipfile.ZipFile(str(path))
        xml = z.read("word/document.xml").decode("utf-8", "replace")
    except Exception:
        return ""
    xml = re.sub(r"</w:p>", "\n", xml)
    xml = re.sub(r"<w:tab[^>]*/>", " ", xml)
    txt = re.sub(r"<[^>]+>", "", xml)
    txt = html.unescape(txt)
    return re.sub(r"[ \t]+", " ", re.sub(r"\n{2,}", "\n", txt)).strip()


def strip_html(raw: str) -> str:
    raw = re.sub(r"(?is)<(script|style)\b[^>]*>.*?</\1>", " ", raw)
    raw = re.sub(r"(?s)<[^>]+>", " ", raw)
    raw = html.unescape(raw)
    return re.sub(r"\s+", " ", raw).strip()


def extract_epub(path: Path) -> str:
    """Extrait le texte d'un .epub (zip de fichiers (X)HTML) — stdlib uniquement."""
    import zipfile
    parts = []
    try:
        z = zipfile.ZipFile(str(path))
        names = sorted(n for n in z.namelist()
                       if n.lower().endswith((".xhtml", ".html", ".htm")))
        for n in names:
            try:
                parts.append(strip_html(z.read(n).decode("utf-8", "replace")))
            except Exception:  # noqa: BLE001
                continue
    except Exception:  # noqa: BLE001
        return ""
    return re.sub(r"\s+", " ", " ".join(parts)).strip()


def extract_title(raw: str, fallback: str) -> str:
    for pat in (r"(?is)<title[^>]*>(.*?)</title>", r"(?is)<h1[^>]*>(.*?)</h1>"):
        m = re.search(pat, raw)
        if m:
            t = strip_html(m.group(1))
            if t:
                return t[:200]
    return fallback


def chunks(text: str, size: int = CHUNK, overlap: int = OVERLAP):
    text = text.strip()
    n = len(text)
    if n == 0:
        return
    i = 0
    while i < n:
        end = min(i + size, n)
        if end < n:  # couper de préférence sur une fin de phrase
            cut = text.rfind(". ", i + int(size * 0.6), end)
            if cut != -1:
                end = cut + 1
        piece = text[i:end].strip()
        if piece:
            yield piece
        if end >= n:
            break
        i = max(end - overlap, i + 1)


def ensure_schema(con: sqlite3.Connection) -> None:
    # N'écrase rien si les tables existent déjà (base bibliothèque).
    con.execute(
        """CREATE TABLE IF NOT EXISTS files(
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               path TEXT, filename TEXT, author TEXT, title TEXT,
               year TEXT, format TEXT, pages INTEGER, indexed_at TEXT)"""
    )
    con.execute(
        """CREATE VIRTUAL TABLE IF NOT EXISTS passages
               USING fts5(file_id UNINDEXED, text,
                          tokenize='unicode61 remove_diacritics 2')"""
    )


def reindex_file(con: sqlite3.Connection, path: Path, author: str) -> int:
    fmt = path.suffix.lower().lstrip(".")
    if fmt == "docx":
        text = extract_docx(path)
        title = path.stem
    elif fmt == "epub":
        text = extract_epub(path)
        title = path.stem
    else:
        try:
            raw = path.read_text(encoding="utf-8", errors="ignore")
        except Exception as e:  # noqa: BLE001
            print(f"  ⚠ lecture impossible {path}: {e}")
            return 0
        if fmt in ("html", "htm"):
            text = strip_html(raw)
            title = extract_title(raw, path.stem)
        else:
            text = re.sub(r"\s+", " ", raw).strip()
            title = path.stem
    if len(text) < MIN_LEN:
        return 0

    rel = str(path).replace("\\", "/")
    # Idempotence : retirer l'ancienne version de CE fichier (par chemin).
    row = con.execute("SELECT id FROM files WHERE path = ?", (rel,)).fetchone()
    if row:
        con.execute("DELETE FROM passages WHERE file_id = ?", (row[0],))
        con.execute("DELETE FROM files WHERE id = ?", (row[0],))

    con.execute(
        """INSERT INTO files(path, filename, author, title, year, format, pages, indexed_at)
           VALUES(?,?,?,?,?,?,?,?)""",
        (rel, path.name, author, title, "", fmt, None,
         datetime.now().isoformat(timespec="seconds")),
    )
    # Récupérer l'id réel par chemin (robuste même si id n'est pas un rowid alias).
    fid = con.execute("SELECT id FROM files WHERE path = ?", (rel,)).fetchone()[0]

    n = 0
    for ch in chunks(text):
        if len(ch) >= MIN_LEN:
            con.execute("INSERT INTO passages(file_id, text) VALUES(?, ?)", (fid, ch))
            n += 1
    return n


def main() -> int:
    ap = argparse.ArgumentParser(description="Indexe le corpus VÉRITAS pour le RAG MINESEC.")
    ap.add_argument("--db", default=DEFAULT_DB, help="Chemin de la base SQLite (défaut: %(default)s)")
    ap.add_argument("--dirs", nargs="*", default=DEFAULT_DIRS, help="Dossiers à indexer")
    ap.add_argument("--author", default="Centre VÉRITAS (MINESEC)", help="Auteur/source par défaut")
    args = ap.parse_args()

    # Console Windows : forcer UTF-8 pour afficher accents/emojis sans planter (cp1252).
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except Exception:  # noqa: BLE001
            pass

    db = Path(args.db)
    db.parent.mkdir(parents=True, exist_ok=True)

    if db.exists():
        bak = db.with_name(db.name + ".bak-" + datetime.now().strftime("%Y%m%d-%H%M%S"))
        shutil.copy2(db, bak)
        print(f"📦 Sauvegarde de sécurité : {bak}")

    con = sqlite3.connect(str(db))
    try:
        ensure_schema(con)
        tot_files = tot_pass = 0
        for d in args.dirs:
            root = Path(d)
            if not root.exists():
                print(f"  ⚠ dossier absent, ignoré : {d}")
                continue
            for p in sorted(root.rglob("*")):
                if p.is_file() and p.suffix.lower() in EXTS:
                    np = reindex_file(con, p, args.author)
                    if np:
                        tot_files += 1
                        tot_pass += np
                        print(f"  ✓ {p}  ({np} passages)")
        con.commit()
        fc = con.execute("SELECT COUNT(*) FROM files").fetchone()[0]
        pc = con.execute("SELECT COUNT(*) FROM passages").fetchone()[0]
    finally:
        con.close()

    print(f"\n✅ Indexés cette passe : {tot_files} fichiers · {tot_pass} passages.")
    print(f"   Base totale : {fc} fichiers · {pc} passages → {db}")
    print("   → Uploadez api/data/biblio_index.db sur le serveur (FTP) pour activer le RAG.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
