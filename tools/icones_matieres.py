"""Régénère les icônes de MATIÈRES de assets/veritas-matieres.svg (les profils p-* sont conservés).

Style « pur » : grille 24, un seul trait (1,6 px, extrémités rondes), deux tons d'aplat
(clair + moyen) et la teinte de base pour l'accent ; aucun détail sous 1,5 px, rien qui ne
tienne à 20 px. Couleurs : palette du menu « Plus » du site (charte LWS).
Usage : python tools/icones_matieres.py"""
import re, os

RAC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = os.path.join(RAC, "assets", "veritas-matieres.svg")

P = {  # clair, moyen, base, trait
    "bleu": ("#E4ECFA", "#9FBEEA", "#1E499B", "#0C2A6A"), "or": ("#FFF3CC", "#FFC93C", "#D9A21B", "#5E4300"),
    "rose": ("#FBE4EE", "#E79BBE", "#B03A6E", "#5C1A38"), "teal": ("#DDF2F4", "#7CCCD3", "#0E7C86", "#084349"),
    "vert": ("#E0F5E5", "#86D094", "#007E11", "#004A0A"), "orange": ("#FDEBDD", "#F5B57A", "#C24E00", "#5E2600"),
    "violet": ("#ECE8F8", "#ADA4DE", "#5B4FA8", "#2C2466"), "marine": ("#E4E9F2", "#8C9BC0", "#0C2A6A", "#061638"),
}
T = 'stroke="{S}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'
ICONES = {
 "m-francais": ("bleu", '<path d="M3 5.5c2.7-.9 5.6-.6 8.2 1v13c-2.6-1.6-5.5-1.9-8.2-1z" fill="{L}" {T}/><path d="M21 5.5c-2.7-.9-5.6-.6-8.2 1v13c2.6-1.6 5.5-1.9 8.2-1z" fill="{M}" {T}/><path d="M5.6 9.6h3M5.6 12.6h3" {T} stroke="{B}"/><path d="M15.6 7.4v4.6l1.4-1 1.4 1V7" fill="{B}" {T}/>'),
 "m-anglais": ("rose", '<path d="M4 4.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-9.5L6 20v-3.5H4A1.5 1.5 0 0 1 2.5 15V6A1.5 1.5 0 0 1 4 4.5z" fill="{L}" {T}/><path d="M7 9h10M7 12.5h6" {T} stroke="{B}" stroke-width="2"/>'),
 "m-maths": ("teal", '<path d="M4 3.5v17h17z" fill="{L}" {T}/><path d="M8 12.5v4h4z" fill="#fff" {T}/><path d="M4 8h2M4 12h2M4 16h2" {T}/><circle cx="17" cy="6.5" r="3" fill="{M}" {T}/>'),
 "m-pct": ("vert", '<path d="M14.8 3.5v6.2l5 8.6A1.8 1.8 0 0 1 18.2 21H5.8a1.8 1.8 0 0 1-1.6-2.7l5-8.6V3.5" fill="#fff" {T}/><path d="M6.8 14.5h10.4l2.6 3.8A1.8 1.8 0 0 1 18.2 21H5.8a1.8 1.8 0 0 1-1.6-2.7z" fill="{M}"/><path d="M14.8 3.5v6.2l5 8.6A1.8 1.8 0 0 1 18.2 21H5.8a1.8 1.8 0 0 1-1.6-2.7l5-8.6V3.5M8 3.5h8" fill="none" {T}/><circle cx="10.5" cy="17.8" r="1.1" fill="#fff"/><circle cx="13.6" cy="11.8" r="1" fill="{B}"/>'),
 "m-svt": ("vert", '<path d="M20.5 3.5C11 3.5 4 8.2 4 15.4c0 1.7.4 3.1 1.1 4.4 8.6.3 15.5-5.3 15.4-16.3z" fill="{L}" {T}/><path d="M3 21 15.5 8.5M9 15h4.2M12 12V8" {T}/>'),
 "m-histoire": ("orange", '<path d="M6.5 4.5h11.5v13a2.5 2.5 0 0 1-2.5 2.5H5" fill="{L}" {T}/><path d="M4 7.5V5.6a1.6 1.6 0 0 1 3.2 0v1.9z" fill="{M}" {T}/><path d="M15.5 20a2.5 2.5 0 0 0 2.5-2.5h-5a2.5 2.5 0 0 0 2.5 2.5z" fill="{M}" {T}/><path d="M10 9h5M10 12h5M10 15h3" {T} stroke="{B}"/>'),
 "m-geo": ("bleu", '<circle cx="12" cy="10.5" r="7.5" fill="{L}" {T}/><path d="M12 3c-2.2 2-3.4 4.6-3.4 7.5S9.8 16 12 18c2.2-2 3.4-4.6 3.4-7.5S14.2 5 12 3zM4.5 10.5h15" fill="none" {T} stroke="{B}"/><path d="M12 18v2.5M8.5 21h7" {T}/>'),
 "m-ecm": ("or", '<path d="M12 2.8l7.5 2.8v5.6c0 4.6-3.2 8.2-7.5 9.8-4.3-1.6-7.5-5.2-7.5-9.8V5.6z" fill="{L}" {T}/><path d="m12 7.4 1.3 2.7 3 .4-2.2 2.1.5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.2-2.1 3-.4z" fill="{M}" {T} stroke-width="1.3"/>'),
 "m-philo": ("violet", '<path d="M12 3.5c4.7 0 8.5 3 8.5 6.7s-3.8 6.7-8.5 6.7c-1 0-2-.1-2.9-.4L5 18.5l1.1-3.1C4.5 14.2 3.5 12.3 3.5 10.2 3.5 6.5 7.3 3.5 12 3.5z" fill="{L}" {T}/><path d="M10.1 8.4a1.9 1.9 0 1 1 2.7 1.8c-.5.3-.8.7-.8 1.3v.4" fill="none" {T} stroke="{B}" stroke-width="1.8"/><circle cx="12" cy="14" r="1.05" fill="{B}"/><circle cx="3.8" cy="20.6" r="1.2" fill="{L}" {T} stroke-width="1.3"/>'),
 "m-info": ("marine", '<rect x="4" y="4.5" width="16" height="11" rx="1.6" fill="{L}" {T}/><path d="M9.4 8.3 7.6 10l1.8 1.7M14.6 8.3l1.8 1.7-1.8 1.7" fill="none" {T} stroke="{B}"/><path d="M2 17.5h20l-1 2a1.4 1.4 0 0 1-1.3.8H4.3a1.4 1.4 0 0 1-1.3-.8z" fill="{M}" {T}/>'),
 "m-langues": ("rose", '<path d="M3.5 3.5h9A1.5 1.5 0 0 1 14 5v5a1.5 1.5 0 0 1-1.5 1.5H8L5 14v-2.5H3.5A1.5 1.5 0 0 1 2 10V5a1.5 1.5 0 0 1 1.5-1.5z" fill="{L}" {T}/><path d="M11.5 9.5h9A1.5 1.5 0 0 1 22 11v5a1.5 1.5 0 0 1-1.5 1.5H19V20l-3-2.5h-4.5A1.5 1.5 0 0 1 10 16v-5a1.5 1.5 0 0 1 1.5-1.5z" fill="{B}" {T}/><path d="M13.5 12.7h6M13.5 15h3.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>'),
 "m-lcn": ("orange", '<ellipse cx="12" cy="6" rx="6.5" ry="2.4" fill="{L}" {T}/><path d="M5.5 6c0 3.8 1.7 6.4 3.3 8l-.6 6.5h7.6l-.6-6.5c1.6-1.6 3.3-4.2 3.3-8 0 1.3-2.9 2.4-6.5 2.4S5.5 7.3 5.5 6z" fill="{M}" {T}/><path d="m8 10.2 2 2.2 2-2.2 2 2.2 2-2.2" fill="none" {T}/>'),
 "m-orient": ("teal", '<circle cx="12" cy="12" r="9" fill="{L}" {T}/><path d="M12 5.8 14.3 12H9.7z" fill="{B}" {T} stroke-width="1.3"/><path d="M12 18.2 9.7 12h4.6z" fill="#fff" {T} stroke-width="1.3"/>'),
 "m-antique": ("marine", '<path d="M3 7.5 12 3l9 4.5z" fill="{L}" {T}/><rect x="4" y="7.5" width="16" height="2.2" fill="{M}" {T}/><path d="M6.5 9.7v7.8M10.5 9.7v7.8M13.5 9.7v7.8M17.5 9.7v7.8" {T}/><rect x="3" y="17.5" width="18" height="3" rx=".8" fill="{M}" {T}/>'),
 "m-eps": ("orange", '<path d="M2.5 9h3.5M2 12.5h3M2.5 16h3" {T} stroke="{M}"/><circle cx="14" cy="12" r="7.5" fill="{L}" {T}/><path d="m14 8.6 3 2.2-1.1 3.6h-3.8L11 10.8z" fill="{B}" {T} stroke-width="1.3"/><path d="M14 8.6V4.5M17 10.8l3.9-1.4M15.9 14.4l2.4 3.4M12.1 14.4l-2.4 3.4M11 10.8 7.1 9.4" {T} stroke-width="1.3"/>'),
 "m-arts": ("violet", '<path d="M12 3C6.5 3 2.5 6.8 2.5 11.5c0 4 3.2 6.8 6.4 6.8 1.8 0 2.2-1.4 1.4-2.6-.9-1.3.1-2.7 1.7-2.7h2.6c3.8 0 6.9-2 6.9-5.4C21.5 5.5 17.3 3 12 3z" fill="{L}" {T}/><circle cx="7.3" cy="10" r="1.5" fill="{B}"/><circle cx="10.5" cy="6.8" r="1.5" fill="#FFC93C"/><circle cx="15" cy="6.8" r="1.5" fill="#0E7C86"/><circle cx="17.8" cy="9.8" r="1.4" fill="#B03A6E"/>'),
 "m-tm": ("vert", '<path d="M2.5 20.5h19" {T}/><path d="M15.5 20.5v-6.5" {T}/><path d="M15.5 15c-3.4.2-5-1.6-5-4.4 3.2 0 5 1.6 5 4.4zM15.5 13.4c0-2.8 1.8-4.6 5-4.6 0 3-1.8 4.6-5 4.6z" fill="{M}" {T}/><path d="M4 3.5l5.5 10" {T}/><path d="M7.8 12.4l3.6-2.2 1.1 3.5-3.4 1.3z" fill="{B}" {T} stroke-width="1.3"/>'),
 "m-esf": ("rose", '<path d="M5 10v10.5h14V10" fill="{L}" {T}/><path d="M3 11 12 3.5 21 11" fill="none" {T}/><path d="M12 18.2s-4-2.4-4-5.1a2.1 2.1 0 0 1 4-1 2.1 2.1 0 0 1 4 1c0 2.7-4 5.1-4 5.1z" fill="{B}" {T} stroke-width="1.3"/>'),
}

def rendu(cle, pal, corps):
    L, M, B, S = P[pal]
    c = corps.replace("{T}", T)
    c = c.replace("{L}", L).replace("{M}", M).replace("{B}", B).replace("{S}", S)
    # attribut répété (trait de base puis surcharge) : sur chaque élément, la DERNIÈRE valeur gagne
    def dedoublonne(m):
        nom, attrs, fin = m.group(1), re.findall(r'([\w:-]+)="([^"]*)"', m.group(2)), m.group(3)
        d = {}
        for k, v in attrs: d.pop(k, None); d[k] = v
        return "<" + nom + "".join(f' {k}="{v}"' for k, v in d.items()) + fin
    c = re.sub(r'<(\w+)((?:\s+[\w:-]+="[^"]*")*)\s*(/?>)', dedoublonne, c)
    return f'<symbol id="{cle}" viewBox="0 0 24 24" shape-rendering="geometricPrecision">{c}</symbol>'

s = open(F, encoding="utf-8").read()
profils = s[s.index("<!-- ===== Profils"):s.rindex("</svg>")]
entete = ('<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n'
          '<!-- VÉRITAS — icônes de MATIÈRES, style « pur » (07/11/2026), générées par tools/icones_matieres.py.\n'
          '     Grille 24, trait unique 1,6 px, deux tons d\'aplat + teinte de base ; palette du menu « Plus » (charte LWS).\n'
          '     Usage : <svg width="24" height="24"><use href="/assets/veritas-matieres.svg#m-francais"/></svg> -->\n')
corps = "\n".join(rendu(k, p, c) for k, (p, c) in ICONES.items())
open(F, "w", encoding="utf-8").write(entete + corps + "\n\n" + profils + "</svg>\n")
print(len(ICONES), "icônes de matières écrites ; profils conservés :", profils.count("<symbol"))
