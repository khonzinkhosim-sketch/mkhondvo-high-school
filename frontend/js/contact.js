const contactScriptURL =
    "https://script.google.com/macros/s/AKfycbzxnOV1sNdYibysXX1J-r92ExJWc9aODye2LYvjHWGaH9frclKMe4rMYLocukC2k8jUig/exec";


const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener("submit", async function(e) {

    e.preventDefault();


    const submitButton =
        contactForm.querySelector("button");


    submitButton.disabled = true;

    submitButton.innerHTML = "Sending...";


    try {

        const formData =
            new FormData(contactForm);


        const contactData = {

            type: "contact",

            name: formData.get("name"),

            email: formData.get("email"),

            subject: formData.get("subject"),

            message: formData.get("message")

        };


        console.log(
            "Contact message being sent:",
            contactData
        );


        const response = await fetch(
            contactScriptURL,
            {
                method: "POST",

                body: JSON.stringify(contactData),

                headers: {
                    "Content-Type": "text/plain"
                }
            }
        );


        const text =
            await response.text();


        console.log(
            "Server response:",
            text
        );


        const result =
            JSON.parse(text);


        if (result.success) {

            contactForm.style.display =
                "none";


            document.getElementById(
                "contactSuccess"
            ).style.display =
                "block";


            return;
        }


        alert(
            result.error ||
            result.message ||
            "Unable to send your message."
        );


        submitButton.disabled =
            false;

        submitButton.innerHTML =
            "Send Message";


    } catch (error) {

        console.error(
            "Contact submission error:",
            error
        );


        alert(
            "Unable to send your message. " +
            "Please check your internet connection and try again."
        );


        submitButton.disabled =
            false;

        submitButton.innerHTML =
            "Send Message";

    }

});