<?php
// Empfängt die Buchungsanfrage und leitet sie per E-Mail an den Verein. Nichts wird gespeichert.
// Läuft nur auf Webspace mit PHP (nicht auf GitHub Pages). [VEREIN KLÄREN: Hoster mit PHP und Standort EU]
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const EMPFAENGER = 'info@fidele-eifellaender.de';   // [VEREIN KLÄREN: Vereinsmail bestätigen]
const ABSENDER   = 'anfrage@fidele-eifellaender.de'; // [VEREIN KLÄREN: Absenderadresse der eigenen Domain anlegen]

function out(int $code, array $d): never { http_response_code($code); echo json_encode($d); exit; }
function clean(string $k, int $max): string {
  $v = $_POST[$k] ?? '';
  if (!is_string($v)) return '';
  $v = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '');
  return mb_substr($v, 0, $max);
}
function line(string $v): string { return str_replace(["\r", "\n"], ' ', $v); }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(405, ['ok' => false]);
if (clean('website', 100) !== '') out(200, ['ok' => true]);               // Honeypot: Bots bekommen scheinbar Erfolg
$t = (int) clean('t', 20);
if ($t > 0 && (time() * 1000 - $t) < 3000) out(200, ['ok' => true]);      // zu schnell ausgefüllt

$f = [];
foreach (['fest'=>80,'fest_sonst'=>80,'datum'=>10,'beginn'=>12,'dauer'=>30,'plz'=>5,'ort'=>80,'location'=>120,
          'umgebung'=>30,'gaeste'=>30,'name'=>80,'email'=>120,'tel'=>30,'nachricht'=>1000] as $k => $m) $f[$k] = clean($k, $m);

if ($f['fest']==='' || $f['datum']==='' || $f['beginn']==='' || $f['dauer']==='' || $f['ort']==='' || $f['name']==='' ||
    !filter_var($f['email'], FILTER_VALIDATE_EMAIL) || !preg_match('/^\d{5}$/', $f['plz']) ||
    !preg_match('/^\d{4}-\d{2}-\d{2}$/', $f['datum']) || clean('datenschutz', 5) !== 'ja') {
  out(422, ['ok' => false, 'error' => 'Bitte alle Pflichtangaben prüfen.']);
}

$fest = $f['fest'] === 'Anderes Fest' && $f['fest_sonst'] !== '' ? 'Anderes Fest: ' . $f['fest_sonst'] : $f['fest'];
$body = "Neue Buchungsanfrage über die Website\n\n"
  . "Festart:    $fest\nDatum:      {$f['datum']}, {$f['beginn']}\nDauer:      {$f['dauer']}\n"
  . "Ort:        {$f['plz']} {$f['ort']}\nLocation:   {$f['location']}\nUmgebung:   {$f['umgebung']}\nGäste:      {$f['gaeste']}\n\n"
  . "Name:       {$f['name']}\nE-Mail:     {$f['email']}\nTelefon:    {$f['tel']}\n\nNachricht:\n{$f['nachricht']}\n";

$subject = mb_encode_mimeheader('Buchungsanfrage: ' . line($fest) . ' am ' . $f['datum'], 'UTF-8');
$headers = 'From: ' . ABSENDER . "\r\nReply-To: " . $f['email'] . "\r\nContent-Type: text/plain; charset=UTF-8\r\nX-Mailer: fidele-website";
$ok = mail(EMPFAENGER, $subject, $body, $headers);
out($ok ? 200 : 500, ['ok' => $ok]);
