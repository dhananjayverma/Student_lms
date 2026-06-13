const sessionKey = "cuims-authenticated";
const userKey = "cuims-user";
const form = document.querySelector("#login-form");
const authCard = document.querySelector(".auth-card");
const userIdInput = form?.querySelector('input[name="userId"]');
const passwordInput = form?.querySelector('input[name="password"]');
const passwordField = form?.querySelector(".password-field");
const submitButton = form?.querySelector(".auth-submit");
const secondActions = form?.querySelector(".auth-second-actions");
const message = document.querySelector("#auth-message");

if (localStorage.getItem(sessionKey) === "true") {
  window.location.href = "index.html";
}

let isPasswordStep = false;

const showPasswordStep = () => {
  isPasswordStep = true;
  passwordField.hidden = false;
  secondActions.hidden = false;
  passwordInput.required = true;
  submitButton.textContent = "Login";
  authCard?.classList.add("password-step");

  if (message) {
    message.textContent = "Enter your password to login.";
  }

  passwordInput.focus();
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!userIdInput.value.trim()) {
    userIdInput.focus();
    return;
  }

  if (!isPasswordStep) {
    showPasswordStep();
    return;
  }

  if (!passwordInput.value.trim()) {
    passwordInput.focus();
    return;
  }

  localStorage.setItem(sessionKey, "true");
  localStorage.setItem(userKey, JSON.stringify({
    name: "Dhananjay Kumar Verma",
    userId: userIdInput.value.trim()
  }));

  if (message) {
    message.classList.add("success");
    message.textContent = "Success. Opening your dashboard...";
  }

  window.setTimeout(() => {
    window.location.href = "index.html";
  }, 400);
});
