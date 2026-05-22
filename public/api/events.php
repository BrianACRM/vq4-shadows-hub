<?php
declare(strict_types=1);

header('Content-Type: application/json');

$ADMIN_PASSWORD = 'sltw2026';
$contentPath = __DIR__ . '/../content.json';

function respond(int $code, array $data): void {
  http_response_code($code);
  echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respond(405, ['ok' => false, 'error' => 'POST required']);
}

$input = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($input)) {
  respond(400, ['ok' => false, 'error' => 'Invalid JSON']);
}

if ($ADMIN_PASSWORD === 'CHANGE_THIS_PASSWORD') {
  respond(500, ['ok' => false, 'error' => 'Admin password is not configured in api/events.php']);
}

if (($input['password'] ?? '') !== $ADMIN_PASSWORD) {
  respond(403, ['ok' => false, 'error' => 'Wrong admin password']);
}

$content = ['events' => []];
if (file_exists($contentPath)) {
  $existing = json_decode((string)file_get_contents($contentPath), true);
  if (is_array($existing)) {
    $content = $existing;
  }
}

if (!isset($content['events']) || !is_array($content['events'])) {
  $content['events'] = [];
}

$action = (string)($input['action'] ?? 'add');

if ($action === 'delete') {
  $index = $input['index'] ?? null;
  if (!is_int($index) || !isset($content['events'][$index])) {
    respond(400, ['ok' => false, 'error' => 'Invalid event index']);
  }
  array_splice($content['events'], $index, 1);
} else {
  $event = $input['event'] ?? null;
  if (!is_array($event)) {
    respond(400, ['ok' => false, 'error' => 'Missing event']);
  }

  $clean = [
    'title' => trim((string)($event['title'] ?? '')),
    'date' => trim((string)($event['date'] ?? '')),
    'time' => trim((string)($event['time'] ?? 'Time TBD')),
    'place' => trim((string)($event['place'] ?? 'Location TBD')),
    'tag' => trim((string)($event['tag'] ?? 'Submitted')),
    'org' => trim((string)($event['org'] ?? 'Command')),
    'desc' => trim((string)($event['desc'] ?? '')),
  ];

  if ($clean['title'] === '' || $clean['date'] === '') {
    respond(400, ['ok' => false, 'error' => 'Event title and date are required']);
  }

  array_unshift($content['events'], $clean);
}

$json = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
if ($json === false || file_put_contents($contentPath, $json, LOCK_EX) === false) {
  respond(500, ['ok' => false, 'error' => 'Could not write content.json']);
}

respond(200, ['ok' => true, 'events' => $content['events']]);
