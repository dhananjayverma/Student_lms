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

/* ═══════════════════════════════════════════
   Background Slideshow Controller
═══════════════════════════════════════════ */
(function () {
  const SLIDE_DURATION = 6000; // ms per slide (6s)
  const slides = document.querySelectorAll(".bg-slide");
  const dots   = document.querySelectorAll(".bg-dot");
  let current  = 0;
  let timer    = null;

  // Activate a specific slide + restart its zoom animation
  function goTo(index) {
    slides.forEach((s, i) => {
      if (i === index) {
        s.style.opacity = "1";
        s.style.zIndex  = "2"; // active: above all others
        // Restart Ken Burns zoom by toggling the class
        s.classList.remove("kb-active");
        void s.offsetWidth; // reflow trick
        s.classList.add("kb-active");
      } else {
        s.style.opacity = "0";
        s.style.zIndex  = "1"; // keep visible during crossfade
        s.classList.remove("kb-active");
      }
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    current = index;
  }

  // Auto-advance
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, SLIDE_DURATION);
  }

  // Init — disable CSS animation (JS controls opacity + zoom class)
  slides.forEach(s => {
    s.style.animation  = "none";
    s.style.transition = "opacity 1.6s cubic-bezier(0.4, 0, 0.2, 1)";
    s.style.opacity    = "0";
    s.style.zIndex     = "1";
  });
  goTo(0);
  startTimer();

  // Dots — click to jump
  dots.forEach((dot, i) => {
    dot.style.pointerEvents = "auto";
    dot.style.cursor = "pointer";
    dot.addEventListener("click", () => {
      goTo(i);
      startTimer(); // reset timer from this slide
    });
  });
})();
