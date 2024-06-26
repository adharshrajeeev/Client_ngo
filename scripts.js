document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Form Validation
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;

    if (name && email && phone) {
        // Send Data to Google Sheet
        fetch('your-web-app-url', {
            method: 'POST',
            body: JSON.stringify({ name: name, email: email, phone: phone }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                // Show Toast Notification
                $('.toast').toast('show');

                // Reset Form
                document.getElementById('registrationForm').reset();
            } else {
                alert('There was an error submitting the form. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting the form. Please try again.');
        });
    }
});


function doPost(e) {
    var sheet = SpreadsheetApp.openById("your-sheet-id").getSheetByName("Sheet1");
    var data = JSON.parse(e.postData.contents);
    
    var newRow = [
      data.name,
      data.email,
      data.phone
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
  }
  