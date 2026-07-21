document.addEventListener("DOMContentLoaded", () => {

    const urlInput = document.querySelector(".url-input");
    const generateBtn = document.querySelector(".generate-btn");
    const downloadBtn = document.querySelector(".download-btn");
    const clearBtn = document.querySelector(".clear-btn");
    const shareBtn = document.querySelector(".share-btn");

    const qrPlaceholder = document.querySelector(".qr-placeholder");
    const qrIcon = document.querySelector(".qr-icon");
    const errorMessage = document.querySelector(".error-message");


    downloadBtn.disabled = true;


    // Create QR Image
    const qrImage = document.createElement("img");

    qrImage.className = "qr-image";
    qrImage.style.display = "none";

    qrPlaceholder.appendChild(qrImage);



    // Show Error
    function showError(message) {

        errorMessage.textContent = message;

        urlInput.classList.add("error");

    }



    // Clear Error
    function clearError() {

        errorMessage.textContent = "";

        urlInput.classList.remove("error");

    }





    // Generate QR Code
    function generateQRCode() {


        const url = urlInput.value.trim();


        clearError();



        if (!url) {

            showError("Please enter a URL.");

            return;

        }




        try {


            const parsedURL = new URL(url);



            if (
                parsedURL.protocol !== "http:" &&
                parsedURL.protocol !== "https:"
            ) {

                throw new Error();

            }



        } catch {


            showError("Please enter a valid URL.");

            return;

        }





        generateBtn.disabled = true;

        generateBtn.textContent = "Generating...";



        const apiURL =
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;




        qrImage.src = apiURL;




        qrImage.onload = () => {


            qrIcon.style.display = "none";


            qrImage.style.display = "block";


            downloadBtn.disabled = false;



            generateBtn.disabled = false;


            generateBtn.textContent =
            "✨ Generate QR Code";


        };




        qrImage.onerror = () => {


            showError(
                "Failed to generate QR code."
            );


            generateBtn.disabled = false;


            generateBtn.textContent =
            "✨ Generate QR Code";


        };


    }






    // Download QR Code
    downloadBtn.addEventListener(
        "click",
        async () => {


        if (!qrImage.src) return;



        try {


            const response =
            await fetch(qrImage.src);



            const blob =
            await response.blob();



            const blobURL =
            URL.createObjectURL(blob);



            const link =
            document.createElement("a");



            link.href = blobURL;

            link.download = "qr-code.png";



            document.body.appendChild(link);


            link.click();



            document.body.removeChild(link);



            URL.revokeObjectURL(blobURL);



        } catch {


            showError(
                "Unable to download QR code."
            );


        }


    });







    // Clear Button
    clearBtn.addEventListener(
        "click",
        () => {


        urlInput.value = "";


        clearError();



        qrImage.src = "";

        qrImage.style.display = "none";



        qrIcon.style.display = "block";



        downloadBtn.disabled = true;



        generateBtn.disabled = false;


        generateBtn.textContent =
        "✨ Generate QR Code";



        urlInput.focus();



    });








    // Share Button
    shareBtn.addEventListener(
        "click",
        async () => {


        const url =
        urlInput.value.trim();



        if (!url) {


            showError(
                "Enter a URL before sharing."
            );


            return;

        }





        if (navigator.share) {


            try {


                await navigator.share({

                    title:"QR Code",

                    text:"Check this link",

                    url:url

                });



            } catch {

                // User cancelled share

            }



        } else {


            navigator.clipboard.writeText(url);


            alert(
                "Link copied to clipboard!"
            );


        }



    });






    // Generate Button
    generateBtn.addEventListener(
        "click",
        generateQRCode
    );






    // Enter Key Support
    urlInput.addEventListener(
        "keypress",
        (event) => {


        if (event.key === "Enter") {

            generateQRCode();

        }


    });



});