document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Form Validation
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;

    if (name && email && phone) {
        // Show Toast Notification
        $('.toast').toast('show');

        // Send Data to Email
        // This part should be handled by the server-side script
        console.log('Form data:', { name, email, phone });

        // Reset Form
        document.getElementById('registrationForm').reset();
    }
});
