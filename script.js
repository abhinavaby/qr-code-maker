document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.querySelector('.url-input');
    const generateBtn = document.querySelector('.generate-btn');
    const qrPlaceholder = document.querySelector('.qr-placeholder');
    const qrIcon = document.querySelector('.qr-icon');

    // Create image element for QR code
    const qrImage = document.createElement('img');
    qrImage.className = 'qr-image';
    qrImage.style.display = 'none'; // Hide initially
    qrPlaceholder.appendChild(qrImage);

    function generateQRCode() {
        const url = urlInput.value.trim();

        if (!url) {
            // Simple shake animation or error state could go here
            urlInput.focus();
            return;
        }

        // Show loading state
        generateBtn.textContent = 'Generating...';
        generateBtn.disabled = true;
        qrPlaceholder.classList.add('loading');

        // Construct API URL
        // Using a public API for QR generation
        const cleanUrl = encodeURIComponent(url);
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${cleanUrl}`;

        // Load image
        qrImage.src = apiUrl;

        qrImage.onload = () => {
            // Hide icon, show image
            if (qrIcon) qrIcon.style.display = 'none';
            qrImage.style.display = 'block';

            // Remove loading state
            generateBtn.textContent = 'Generate QR Code';
            generateBtn.disabled = false;
            qrPlaceholder.classList.remove('loading');
            qrPlaceholder.classList.remove('shimmer'); // Stop shimmer once loaded
        };

        qrImage.onerror = () => {
            alert('Failed to generate QR code. Please try again.');
            generateBtn.textContent = 'Generate QR Code';
            generateBtn.disabled = false;
            qrPlaceholder.classList.remove('loading');
        };
    }

    // Event listeners
    generateBtn.addEventListener('click', generateQRCode);

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateQRCode();
        }
    });
});
