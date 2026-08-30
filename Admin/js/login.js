document.addEventListener("DOMContentLoaded", () => {

const loginForm = document.getElementById("adminLoginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginError = document.getElementById("loginError");

// Temporary development credentials
const STAFF_USERNAME = "admin";
const STAFF_PASSWORD = "admin123";

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Hide previous error
    loginError.style.display = "none";

    // Check credentials
    if (
        username === STAFF_USERNAME &&
        password === STAFF_PASSWORD
    ) {

        // Store login state
        sessionStorage.setItem("mkhondvoStaffLoggedIn", "true");
        sessionStorage.setItem("mkhondvoStaffUsername", username);

        // Prevent double-clicking
        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        // Go to dashboard
        window.location.href = "./dashboard.html";

    } else {

        loginError.textContent =
            "Invalid username or password.";

        loginError.style.display = "block";

        passwordInput.value = "";
        passwordInput.focus();
    }
});

});