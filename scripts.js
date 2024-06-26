document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Form Validation
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;

    if (name && email && phone) {
        // Send Data to Google Sheet
        fetch('https://script.google.com/macros/s/AKfycbw-A81wwz_0w0MUlamX1Oh00u2bdcSBJfjNMc4lGrQ5nsZKq_W63euHhjOrlKhlvgej/exec', {
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
