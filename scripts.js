$(document).ready(function() {
    $('#registrationForm').submit(function(event) {
        event.preventDefault();

        // Remove was-validated class initially
        $(this).removeClass('was-validated');

        // Check form validity
        if (this.checkValidity() === false) {
            event.stopPropagation();
            $(this).addClass('was-validated');
            return;
        }

        // Show loader on submit button
        $('#submitButton').prop('disabled', true);
        $('.spinner-border').show();
        $('#loadingModal').modal('show');

        // Proceed with form submission logic
        let name = $('#name').val();
        let email = $('#email').val();
        let phone = $('#phone').val();
        let certificatePhotoFile = $('#certificatePhoto')[0].files[0];

        if (!name || !email || !phone || !certificatePhotoFile) {
            alert('Please fill out all required fields and upload the certificate photo.');
            $('#submitButton').prop('disabled', false);
            $('.spinner-border').hide();
            $('#loadingModal').modal('hide');
            return;
        }

        // Phone number validation on blur
        let phoneValue = $('#phone').val().trim();
        if (phoneValue.length !== 10 || isNaN(phoneValue)) {
            $('#phone').addClass('is-invalid');
            $('#submitButton').prop('disabled', false);
            $('.spinner-border').hide();
            $('#loadingModal').modal('hide');
            return;
        }

        // Create FormData object to send both form data and files
        let formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);

        let reader = new FileReader();
        reader.onloadend = function() {
            let base64data = reader.result.split(',')[1]; // Get the Base64 part of the string
            formData.append('certificatePhotoBase64', base64data);

            // Send formData to Google Sheets via ajax
            const scriptUrl = "https://script.google.com/macros/s/AKfycbyZiWp7YWwTau0B4MRxDUDDb9J2fNMQDl0bXhX_w25BEYzECn-aDTP_SaMdLs98U5srFQ/exec"
            $.ajax({
                url: scriptUrl,
                type: 'POST',
                data: formData,
                processData: false, // Prevent jQuery from automatically processing the data
                contentType: false, // Prevent jQuery from setting the Content-Type header
                success: function(response) {
                    console.log('Success:', response);
                    showSuccessToastNotification(); // Show success toast notification
                    clearForm(); // Clear the form after successful submission
                    $('#submitButton').prop('disabled', false);
                    $('.spinner-border').hide();
                    $('#loadingModal').modal('hide');
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Error:', textStatus, errorThrown);
                    console.error('jqXHR:', jqXHR);
                    // showErrorToastNotification(); // Show error toast notification
                    clearForm(); // Clear the form even if there was an error
                    $('#submitButton').prop('disabled', false);
                    $('.spinner-border').hide();
                    $('#loadingModal').modal('hide');
                }
            });
        };
        reader.readAsDataURL(certificatePhotoFile);
    });

    // Function to show success toast notification
    function showSuccessToastNotification() {
        let toast = new bootstrap.Toast(document.getElementById('toastNotification'));
        toast.show();
    }

    // Function to show error toast notification
    function showErrorToastNotification() {
        let toast = new bootstrap.Toast(document.getElementById('errorToastNotification'));
        toast.show();
    }

    // Function to clear the form
    function clearForm() {
        $('#registrationForm')[0].reset();
        $('#certificatePhotoPreview').hide();
        $('.custom-file-label').text('Choose file');
        $('.form-control').removeClass('is-valid').removeClass('is-invalid');
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
            $('#' + previewId).siblings('.custom-file-label').text(file.name);
        }
    }

    // Function to handle file selection and display preview
    $('input[type="file"]').change(function(event) {
        let previewId = $(this).data('preview');
        let file = event.target.files[0];
        displayImagePreview(file, previewId);
    });

    // Phone number validation on blur
    $('#phone').blur(function() {
        let phoneValue = $(this).val().trim();
        if (phoneValue.length !== 10 || isNaN(phoneValue)) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    // Add event listeners to validate fields on interaction
    $('#name, #email, #phone, #certificatePhoto').on('input', function() {
        $(this).removeClass('is-invalid').addClass('is-valid');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const languageDropdownItems = document.querySelectorAll('.dropdown-item[data-lang]');
    const textElements = {
        welcomeMessage: document.querySelector('.jumbotron .display-4'),
        journeyMessage: document.querySelector('.jumbotron .lead'),
        aboutUs: document.querySelector('#about h2'),
        aboutUsText: document.querySelector('#about p'),
        registerNow: document.querySelector('.card-title a.register-link')
    };

    function setLanguage(lang) {
        const translation = translations[lang];
        if (!translation) return;

        textElements.welcomeMessage.textContent = translation.welcomeMessage;
        textElements.journeyMessage.textContent = translation.journeyMessage;
        textElements.aboutUs.textContent = translation.aboutUs;
        textElements.aboutUsText.textContent = translation.aboutUsText;
        textElements.registerNow.textContent = translation.registerNow;
    }

    languageDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = e.target.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });

    // Set default language
    setLanguage('en');
});

const translations = {
    en: {
        welcomeMessage: "Welcome to Our College",
        journeyMessage: "Your journey to success starts here",
        aboutUs: "About Us",
        aboutUsText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis egestas rhoncus.",
        registerNow: "Register Now »"
    },
    hi: {
        welcomeMessage: "हमारे कॉलेज में आपका स्वागत है",
        journeyMessage: "आपकी सफलता की यात्रा यहां से शुरू होती है",
        aboutUs: "हमारे बारे में",
        aboutUsText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis egestas rhoncus.",
        registerNow: "अभी पंजीकरण करें »"
    }
};
