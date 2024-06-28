$(document).ready(function() {
    $('#registrationForm').submit(function(event) {
        event.preventDefault();

        // Form Validation
        let name = $('#name').val();
        let email = $('#email').val();
        let phone = $('#phone').val();

        if (!name || !email || !phone) {
            alert('Please fill out all required fields.');
            return;
        }

        // Handle Image Uploads
        let passportPhotoFile = $('#passportPhoto')[0].files[0];
        let certificatePhotoFile = $('#certificatePhoto')[0].files[0];

        // Create FormData object to send both form data and files
        let formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('passportPhoto', passportPhotoFile);
        formData.append('certificatePhoto', certificatePhotoFile);

        // Send formData to Google Sheets via ajax
        $.ajax({
            url: 'https://script.google.com/macros/s/AKfycbxHdbJYXvd_lauCWLcuj02jnp6YmZ8GQKvK-bc6tUhO0q7dhsB05Ex3Nn2vQHoaD7NKrQ/exec',
            type: 'POST',
            data: formData,
            processData: false, // Prevent jQuery from automatically processing the data
            contentType: false, // Prevent jQuery from setting the Content-Type header
            success: function(response) {
                console.log('Success:', response);
                showToastNotification(); // Optional: Show toast notification on successful submission
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error:', textStatus, errorThrown);
                alert('Error submitting form. Please try again later.');
            }
        });
    });

    // Function to show toast notification
    function showToastNotification() {
        let toast = new bootstrap.Toast(document.getElementById('toastNotification'));
        toast.show();
    }

    // Function to display image preview and filename
    function displayImagePreview(file, previewId) {
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                $('#' + previewId).attr('src', e.target.result).show();
            }
            reader.readAsDataURL(file);

            // Display filename in the label
            let labelElement = $('#' + previewId + 'Label');
            if (labelElement.length) {
                labelElement.text(file.name);
            } else {
                console.error('Label element not found for previewId: ' + previewId);
            }
        }
    }

    // Function to handle file selection and display preview
    $('input[type="file"]').change(function(event) {
        let previewId = $(this).data('preview');
        let file = event.target.files[0];
        displayImagePreview(file, previewId);
    });
});
