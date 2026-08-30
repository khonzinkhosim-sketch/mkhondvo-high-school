const scriptURL = "https://script.google.com/macros/s/AKfycbzxnOV1sNdYibysXX1J-r92ExJWc9aODye2LYvjHWGaH9frclKMe4rMYLocukC2k8jUig/exec";

const form = document.getElementById("applicationForm");

form.addEventListener("submit", async function(e) {

    e.preventDefault();

    const submitButton = form.querySelector("button");

    submitButton.disabled = true;
    submitButton.innerHTML = "Submitting...";

    try {

        const formData = new FormData(form);

        const reportFile = formData.get("report");
        const birthFile = formData.get("birthCertificate");

        const reportBase64 = await convertFile(reportFile);
        const birthBase64 = await convertFile(birthFile);

        console.log(
            "Application level being sent:",
            formData.get("level")
        );

        console.log(
            "Gender:",
            formData.get("gender")
        );

        console.log(
            "Email:",
            formData.get("email")
        );

        console.log(
            "Address:",
            formData.get("address")
        );


        const applicationData = {

            level: formData.get("level"),

            studentName: formData.get("studentName"),

            dateOfBirth: formData.get("dateOfBirth"),

            gender: formData.get("gender"),

            currentSchool: formData.get("currentSchool"),

            parentName: formData.get("parentName"),

            phone: formData.get("phone"),

            email: formData.get("email"),

            address: formData.get("address"),


            report: {
                name: reportFile.name,
                data: reportBase64
            },


            birthCertificate: {
                name: birthFile.name,
                data: birthBase64
            }

        };


        const response = await fetch(scriptURL, {

            method: "POST",

            body: JSON.stringify(applicationData)
        });


        const text = await response.text();

        console.log("Server response:", text);


        const result = JSON.parse(text);


        // ==========================================
        // SUCCESSFUL APPLICATION
        // ==========================================

        if (result.success) {

            form.style.display = "none";

            document.getElementById("successMessage").style.display = "block";

            document.getElementById("applicationID").innerHTML =
                result.applicationID;

            return;
        }


        // ==========================================
        // DUPLICATE APPLICATION
        // ==========================================

        if (result.duplicate) {

            form.style.display = "none";

            document.getElementById("successMessage").style.display = "block";

            document.getElementById("applicationID").innerHTML =
                result.applicationID;

            const messageElement =
                document.getElementById("successMessage");

            messageElement.innerHTML = `
                <h2>Application Already Submitted</h2>

                <p>
                    An application for this student has already
                    been submitted.
                </p>

                <p>
                    <strong>Application ID:</strong>
                    ${result.applicationID}
                </p>

                <p>
                    Please keep this Application ID for future reference.
                </p>
            `;

            return;
        }


        // ==========================================
        // SERVER ERROR
        // ==========================================

        alert(
            result.error ||
            result.message ||
            "Something went wrong. Please try again."
        );

        submitButton.disabled = false;
        submitButton.innerHTML = "Submit Application";

    } catch (error) {

        console.error("Submission error:", error);

        alert(
            "Unable to submit the application. " +
            "Please check your internet connection and try again."
        );

        submitButton.disabled = false;
        submitButton.innerHTML = "Submit Application";

    }

});


function convertFile(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            const base64 = reader.result.split(",")[1];

            resolve(base64);

        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}