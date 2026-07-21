document.addEventListener("DOMContentLoaded", () => {

    const urlInput = document.querySelector(".url-input");
    const generateBtn = document.querySelector(".generate-btn");
    const downloadBtn = document.querySelector(".download-btn");
    const clearBtn = document.querySelector(".clear-btn");
    const qrPlaceholder = document.querySelector(".qr-placeholder");
    const qrIcon = document.querySelector(".qr-icon");
    const errorMessage = document.querySelector(".error-message");

    downloadBtn.disabled = true;

    const qrImage = document.createElement("img");
    qrImage.className = "qr-image";
    qrImage.style.display = "none";
    qrPlaceholder.appendChild(qrImage);

    function showError(message) {
        errorMessage.textContent = message;
        urlInput.classList.add("error");
        urlInput.focus();
    }

    function clearError() {
        errorMessage.textContent = "";
        urlInput.classList.remove("error");
    }

    function resetGenerator() {
        urlInput.value = "";
        clearError();

        qrImage.src = "";
        qrImage.style.display = "none";

        if (qrIcon) {
            qrIcon.style.display = "block";
        }

        qrPlaceholder.classList.add("shimmer");
        qrPlaceholder.classList.remove("loading");

        downloadBtn.disabled = true;

        generateBtn.disabled = false;
        generateBtn.textContent = "Generate QR Code";

        urlInput.focus();
    }

    function generateQRCode() {

        const url = urlInput.value.trim();

        clearError();

        if (!url) {
            showError("Please enter a URL.");
            return;
        }

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

        generateBtn.textContent = "Generating...";
        generateBtn.disabled = true;

        qrPlaceholder.classList.add("loading");

        const apiUrl =
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

        qrImage.src = apiUrl;

        qrImage.onload = () => {

            if (qrIcon) {
                qrIcon.style.display = "none";
            }

            qrImage.style.display = "block";

            qrPlaceholder.classList.remove("loading");
            qrPlaceholder.classList.remove("shimmer");

            downloadBtn.disabled = false;

            generateBtn.disabled = false;
            generateBtn.textContent = "Generate QR Code";

        };

        qrImage.onerror = () => {

            showError("Failed to generate QR code.");

            generateBtn.disabled = false;
            generateBtn.textContent = "Generate QR Code";

            qrPlaceholder.classList.remove("loading");

        };

    }

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

    generateBtn.addEventListener("click", generateQRCode);

    clearBtn.addEventListener("click", resetGenerator);

    urlInput.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {
            generateQRCode();
        }

    });

});