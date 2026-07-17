document.addEventListener('DOMContentLoaded', () => {

    const urlInput = document.querySelector('.url-input');
    const generateBtn = document.querySelector('.generate-btn');
    const downloadBtn = document.querySelector('.download-btn');
    const qrPlaceholder = document.querySelector('.qr-placeholder');
    const qrIcon = document.querySelector('.qr-icon');
    const errorMessage = document.querySelector('.error-message');

    // Disable download initially
    downloadBtn.disabled = true;

    // Create QR image element
    const qrImage = document.createElement('img');
    qrImage.className = 'qr-image';
    qrImage.style.display = 'none';
    qrPlaceholder.appendChild(qrImage);

    // Show error
    function showError(message) {
        errorMessage.textContent = message;
        urlInput.classList.add('error');
        urlInput.focus();
    }

    // Clear error
    function clearError() {
        errorMessage.textContent = '';
        urlInput.classList.remove('error');
    }

    // Generate QR Code
    function generateQRCode() {

        const url = urlInput.value.trim();

        clearError();

        // Empty input validation
        if (!url) {
            showError("Please enter a URL.");
            return;
        }

        // URL validation
        try {
            const parsed = new URL(url);

            if (
                parsed.protocol !== "http:" &&
                parsed.protocol !== "https:"
            ) {
                throw new Error();
            }

        } catch {
            showError("Please enter a valid URL.");
            return;
        }

        // Loading state
        generateBtn.textContent = "Generating...";
        generateBtn.disabled = true;
        qrPlaceholder.classList.add("loading");

        // Build API URL
        const apiUrl =
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

        qrImage.src = apiUrl;

        qrImage.onload = () => {
            // Hide icon, show image
            if (qrIcon) qrIcon.style.display = 'none';
            qrImage.style.display = 'block';
            downloadBtn.disabled = false;

            if (qrIcon) {
                qrIcon.style.display = "none";
            }

            qrImage.style.display = "block";

            generateBtn.textContent = "Generate QR Code";
            generateBtn.disabled = false;

            qrPlaceholder.classList.remove("loading");
            qrPlaceholder.classList.remove("shimmer");

            downloadBtn.disabled = false;
        };

        qrImage.onerror = () => {

            showError("Failed to generate QR code.");

            generateBtn.textContent = "Generate QR Code";
            generateBtn.disabled = false;

            qrPlaceholder.classList.remove("loading");
        };
    }

    // Download QR
    downloadBtn.addEventListener("click", async () => {

        if (!qrImage.src) return;

        try {

            const response = await fetch(qrImage.src);
            const blob = await response.blob();

            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = blobUrl;
            link.download = "qr-code.png";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(blobUrl);

        } catch {

            showError("Unable to download QR code.");

        }

    });

    // Generate button
    generateBtn.addEventListener("click", generateQRCode);

    // Enter key support
    urlInput.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {
            generateQRCode();
        }

    });
  downloadBtn.addEventListener("click", async () => {
    if (!qrImage.src) return;

    try {
        const response = await fetch(qrImage.src);
        const blob = await response.blob();

        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "qr-code.png";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        alert("Unable to download the QR code.");
        console.error(error);
    }
}); 
});
