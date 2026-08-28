// Google Apps Script - Deploy as Web App
// This script receives form data and stores it in your Google Sheet

function doPost(e) {
  try {
    // Get the spreadsheet and sheet
    const spreadsheetId = '1j1zT8F9H_z7e4xgFl_RUZCpeTbnC4XB7L4vu0UKIVTI';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0];
    
    // Extract form data
    const params = e.parameter;
    const name = params.name || '';
    const email = params.email || '';
    const phone = params.phone || '';
    const message = params.message || '';
    const dateTime = new Date();
    
    // Append data to sheet
    sheet.appendRow([dateTime, name, email, phone, message]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Form submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
