<?php
// This directory stores VÉRITAS cloud sync backups.
// Direct listing is intentionally blocked.
http_response_code(403);
echo json_encode(['error' => 'Accès direct interdit']);
