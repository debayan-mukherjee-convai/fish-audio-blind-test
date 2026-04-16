// ═══════════════════════════════════════════════════════════════════════════════
// Fish Audio Blind Test — Google Apps Script
//
// SETUP INSTRUCTIONS:
//   1. Open Google Sheets → create a new blank spreadsheet → name it anything
//   2. Extensions → Apps Script
//   3. Delete the placeholder code and paste ALL of this file
//   4. Save (Ctrl+S)
//   5. Click Deploy → New deployment
//        Type: Web app
//        Execute as: Me
//        Who has access: Anyone
//   6. Click Deploy → copy the Web App URL
//   7. In index.html, replace 'YOUR_APPS_SCRIPT_URL_HERE' with that URL
//   8. Commit & push to GitHub
// ═══════════════════════════════════════════════════════════════════════════════

// Voice keys — must match the order in index.html MAPPING object
const VOICE_KEYS = [
  'adrian', 'laura', 'ethan', 'selene', 'book_record_regular',
  'narrator', 'sleepless_historian', 'paula', 'sarah', 'horror',
  'raiden_shogun', 'voice_dl', 'alhaitham', 'valentino', 'marcus_the_worm',
  'dexter_morgan', 'phat_phapbro', 'taylor_swift', 'ton', 'ronaldo1'
];

const VOICE_LABELS = {
  adrian:              'Adrian',
  laura:               'Laura',
  ethan:               'Ethan',
  selene:              'Selene',
  book_record_regular: 'Book Record Regular',
  narrator:            'Narrator',
  sleepless_historian: 'Sleepless Historian',
  paula:               'Paula',
  sarah:               'Sarah',
  horror:              'Horror',
  raiden_shogun:       'Raiden Shogun',
  voice_dl:            'Voice DL',
  alhaitham:           'Alhaitham',
  valentino:           'Valentino',
  marcus_the_worm:     'Marcus the Worm',
  dexter_morgan:       'Dexter Morgan',
  phat_phapbro:        'Phat Phap (Bro)',
  taylor_swift:        'Taylor Swift',
  ton:                 'Ton',
  ronaldo1:            'Ronaldo1',
};

// ── Write header row if sheet is empty ────────────────────────────────────────
function ensureHeader(sheet) {
  if (sheet.getLastRow() > 0) return;
  const header = [
    'Timestamp',
    'Participant',
    'S2-PRO Votes',
    'S1 Votes',
    ...VOICE_KEYS.map(k => VOICE_LABELS[k]),
  ];
  sheet.appendRow(header);
  sheet.getRange(1, 1, 1, header.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

// ── Handle POST from the webpage ──────────────────────────────────────────────
function doPost(e) {
  try {
    const data        = JSON.parse(e.postData.contents);
    const sheet       = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    ensureHeader(sheet);

    const row = [
      new Date(data.timestamp || new Date()),
      data.participant || 'Anonymous',
      data.totals.s2_pro,
      data.totals.s1,
      ...VOICE_KEYS.map(k => data.votes[k] || ''),
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Handle GET (health check / browser direct visit) ─────────────────────────
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Fish Audio blind test endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
