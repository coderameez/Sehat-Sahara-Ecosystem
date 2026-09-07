/**
 * ==============================================================================
 * SEHAT SAHARA — GOOGLE APPS SCRIPT WEBHOOK & AUTO SHEET STYLER
 * ==============================================================================
 * 
 * 1-CLICK SHEET SETUP:
 * Apps Script editor ke top toolbar me function dropdown se "setupSheets" select
 * karein aur "Run" button dabayein!
 * Ye automatically aapki Google Sheet ko 2 gorgeous professional tabs me format
 * kar dega:
 *   1. "Contact Inquiries" (Emerald themed, auto-width, frozen header)
 *   2. "Hospital Onboarding" (Emerald themed, auto-width, frozen header)
 */

// RUN THIS FUNCTION ONCE TO AUTO-FORMAT YOUR SHEETS BEAUTIFULLY!
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    ss.rename("Sehat Sahara — Inquiries & Onboarding");
  } catch (e) {}

  // 1. CONTACT INQUIRIES TAB
  var contactSheet = ss.getSheetByName('Contact Inquiries');
  if (!contactSheet) {
    contactSheet = ss.insertSheet('Contact Inquiries');
  }
  contactSheet.clear();
  var contactHeaders = [
    'Timestamp (PKT)',
    'Full Name',
    'Email Address',
    'Phone Number',
    'Subject',
    'Message',
    'Status'
  ];
  contactSheet.appendRow(contactHeaders);
  
  // Style Header
  var contactHeaderRange = contactSheet.getRange(1, 1, 1, contactHeaders.length);
  contactHeaderRange
    .setFontWeight('bold')
    .setFontColor('#FFFFFF')
    .setBackground('#0D5226')
    .setFontSize(11)
    .setVerticalAlignment('middle');
  contactSheet.setRowHeight(1, 40);
  contactSheet.setFrozenRows(1);

  // Column Widths
  contactSheet.setColumnWidth(1, 170); // Timestamp
  contactSheet.setColumnWidth(2, 180); // Name
  contactSheet.setColumnWidth(3, 220); // Email
  contactSheet.setColumnWidth(4, 150); // Phone
  contactSheet.setColumnWidth(5, 200); // Subject
  contactSheet.setColumnWidth(6, 350); // Message
  contactSheet.setColumnWidth(7, 120); // Status

  // 2. HOSPITAL ONBOARDING TAB
  var hospSheet = ss.getSheetByName('Hospital Onboarding');
  if (!hospSheet) {
    hospSheet = ss.insertSheet('Hospital Onboarding');
  }
  hospSheet.clear();
  var hospHeaders = [
    'Timestamp (PKT)',
    'Hospital / Clinic Name',
    'Facility Type',
    'City',
    'Contact Person',
    'Phone Number',
    'Official Email',
    'Doctors Count',
    'Branches',
    'Message / Requirements',
    'Review Status'
  ];
  hospSheet.appendRow(hospHeaders);

  // Style Header
  var hospHeaderRange = hospSheet.getRange(1, 1, 1, hospHeaders.length);
  hospHeaderRange
    .setFontWeight('bold')
    .setFontColor('#FFFFFF')
    .setBackground('#0A3D1D')
    .setFontSize(11)
    .setVerticalAlignment('middle');
  hospSheet.setRowHeight(1, 40);
  hospSheet.setFrozenRows(1);

  // Column Widths
  hospSheet.setColumnWidth(1, 170); // Timestamp
  hospSheet.setColumnWidth(2, 220); // Facility Name
  hospSheet.setColumnWidth(3, 140); // Type
  hospSheet.setColumnWidth(4, 130); // City
  hospSheet.setColumnWidth(5, 180); // Contact Person
  hospSheet.setColumnWidth(6, 150); // Phone
  hospSheet.setColumnWidth(7, 220); // Email
  hospSheet.setColumnWidth(8, 120); // Doctors
  hospSheet.setColumnWidth(9, 100); // Branches
  hospSheet.setColumnWidth(10, 320); // Message
  hospSheet.setColumnWidth(11, 130); // Review Status

  // Remove default blank 'Sheet1' if exists and other sheets present
  var sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(sheet1);
    } catch (e) {}
  }

  return "Setup completed successfully!";
}

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.formType === 'contact') {
      var sheet = ss.getSheetByName('Contact Inquiries');
      if (!sheet) {
        setupSheets();
        sheet = ss.getSheetByName('Contact Inquiries');
      }
      sheet.appendRow([
        data.submittedAt || new Date().toLocaleString(),
        data.name || '',
        data.email || '',
        data.phone || '',
        data.subject || '',
        data.message || '',
        'New Inquiry'
      ]);
      // Format new row
      var lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1, 1, 7).setVerticalAlignment('middle');
      sheet.setRowHeight(lastRow, 32);

    } else if (data.formType === 'hospital_onboarding') {
      var sheet = ss.getSheetByName('Hospital Onboarding');
      if (!sheet) {
        setupSheets();
        sheet = ss.getSheetByName('Hospital Onboarding');
      }
      sheet.appendRow([
        data.submittedAt || new Date().toLocaleString(),
        data.facilityName || '',
        data.facilityType || '',
        data.city || '',
        data.contactPerson || '',
        data.phone || '',
        data.email || '',
        data.approxDoctors || '',
        data.numBranches || '',
        data.message || '',
        'Pending Verification'
      ]);
      // Format new row
      var lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1, 1, 11).setVerticalAlignment('middle');
      sheet.setRowHeight(lastRow, 32);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success', message: 'Data saved to Google Sheet' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    'Sehat Sahara Webhook is Live! Send POST requests from the website forms.'
  );
}
