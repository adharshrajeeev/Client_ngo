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

    const languageDropdownItems = document.querySelectorAll('.dropdown-item[data-lang]');
    const textElements = {
        welcomeMessage: document.querySelector('.jumbotron .display-4'),
        journeyMessage: document.querySelector('.jumbotron .lead'),
        aboutUs: document.querySelector('#about h2'),
        aboutUsText: document.querySelector('#about p'),
        ourMisson: document.querySelector("#mission h2"),
        ourMissionText: document.querySelector("#mission p"),
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
        textElements.ourMisson.textContent = translation.ourMisson;
        textElements.ourMissionText.textContent = translation.ourMissionText;

        // Update card section translations
        $('.card').each(function(index) {
            const cardTitle = $(this).find('.card-title');
            const cardText = $(this).find('.card-text');

            if (cardTitle.length > 0 && translation.cards && translation.cards[index]) {
                cardTitle.text(translation.cards[index].title);
                cardText.text(translation.cards[index].text);
            }
        });
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
        aboutUsText: "Our organization is dedicated to guiding students towards successful academic careers. We believe in providing comprehensive and trustworthy information to help you make informed decisions about your education. With a focus on integrity and transparency, we strive to be your reliable partner in the college admission process.",
        registerNow: "Late Medical Entry Registration »",
        ourMisson: "Our Mission",
        ourMissionText: "Our mission is to empower students with accurate information and trustworthy guidance in choosing the perfect college or institution. As an authoritative body recognized under CHECK oversight, we provide a safe haven from fraudulent consultants and unverified courses, ensuring your educational path is secure and promising."
    },
    hi: {
        welcomeMessage: "हमारे कॉलेज में आपका स्वागत है",
        journeyMessage: "आपकी सफलता की यात्रा यहां से शुरू होती है",
        aboutUs: "हमारे बारे में",
        aboutUsText: "हमारा संगठन छात्रों को सफल शैक्षणिक करियर की ओर मार्गदर्शन करने के लिए समर्पित है। हमें विश्वसनीय और विश्वसनीय जानकारी प्रदान करने में विश्वास है ताकि आप अपने शिक्षा के बारे में सूचित निर्णय ले सकें। ईमानदारी और पारदर्शिता पर ध्यान केंद्रित करके, हम कॉलेज प्रवेश प्रक्रिया में आपका विश्वसनीय साथी बनने का प्रयास करते हैं।",
        registerNow: "  लेट मेडिकल एंट्री »",
        ourMisson: "हमारा मिशन",
        ourMissionText: "हमारा मिशन छात्रों को सही जानकारी और विश्वसनीय मार्गदर्शन प्रदान करना है ताकि वे सही कॉलेज या संस्थान चुन सकें। एक CHECK पर देखरेख के तहत मान्यता प्राप्त देहायक शरण अप्रमाणिक सलाहकारों और अप्रमाणिक पाठ्यक्रमों से सुरक्षित और वादात्मक शिक्षात्मक पथ सुनिश्चित करते हैं।"
    }

};

function changeFontSize(action) {
    const root = document.documentElement;
    let currentFontSize = parseFloat(window.getComputedStyle(root).getPropertyValue('font-size'));
    if (action === 'increase') {
        currentFontSize += 1;
    } else if (action === 'decrease') {
        currentFontSize -= 1;
    } else {
        currentFontSize = 16; // Default font size
    }
    root.style.fontSize = currentFontSize + 'px';
}