// ============================================================
// Google Apps Script — Paste this into Extensions > Apps Script
// in your Google Sheet
// ============================================================
//
// SETUP INSTRUCTIONS:
// 1. Create a new Google Sheet
// 2. Name the first sheet "Submissions"
// 3. Add headers in Row 1: Timestamp | Name | Email | Subject | Phone | Message
// 4. Go to Extensions > Apps Script
// 5. Replace the default code with this entire file
// 6. Click Deploy > New deployment
// 7. Select "Web app"
// 8. Set "Execute as" = Me
// 9. Set "Who has access" = Anyone
// 10. Click Deploy and copy the URL
// 11. Paste the URL into src/environments/environment.ts as GOOGLE_SHEETS_URL
//
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Submissions");

    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.setName("Submissions");
      sheet.appendRow(["Timestamp", "Name", "Email", "Subject", "Phone", "Message"]);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.subject || "",
      data.phone || "",
      data.message || ""
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Data saved" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", message: "Contact form API is running" })
  ).setMimeType(ContentService.MimeType.JSON);
}
