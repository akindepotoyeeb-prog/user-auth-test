const API_BASE = "https://django-auth-backend-373p.onrender.com/api/auth";

// Helper to display messages
function showMessage(text, isError = false) {
  const msgDiv = document.getElementById("msg");
  msgDiv.textContent = text;
  msgDiv.className = `message ${isError ? "error" : "success"}`;
  msgDiv.style.display = "block";
}

function clearMessage() {
  const msgDiv = document.getElementById("msg");
  msgDiv.style.display = "none";
}

// Toggle between Login & Register forms
function toggleForm(formType) {
  clearMessage();
  if (formType === "register") {
    document.getElementById("login-box").classList.add("hidden");
    document.getElementById("register-box").classList.remove("hidden");
  } else {
    document.getElementById("register-box").classList.add("hidden");
    document.getElementById("login-box").classList.remove("hidden");
  }
}

// Helper to get a cookie value by name (like csrftoken)
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// 1. Fetch the CSRF cookie when the page loads
async function fetchCsrfToken() {
  try {
    await fetch(`${API_BASE}/csrf/`, {
      method: "GET",
      credentials: "include",
    });
  } catch (err) {
    console.error("Failed to fetch CSRF token", err);
  }
}

// Call this right when your script loads or inside checkAuthStatus
fetchCsrfToken();

// 1. Fetch User Profile (Verifies active session cookie)
async function checkAuthStatus() {
  try {
    const csrftoken = getCookie("csrftoken"); // Get the CSRF token

    const res = await fetch(`${API_BASE}/profile/`, {
      method: "GET",
      credentials: "include", // Sends session cookies with the request
    });

    if (res.ok) {
      const data = await res.json();
      document.getElementById("user-username").textContent = data.username;
      document.getElementById("user-email").textContent = data.email;
      document.getElementById("auth-section").classList.add("hidden");
      document.getElementById("profile-section").classList.remove("hidden");
    } else {
      document.getElementById("auth-section").classList.remove("hidden");
      document.getElementById("profile-section").classList.add("hidden");
    }
  } catch (err) {
    showMessage("Unable to connect to server.", true);
  }
}

// 2. Register Handler
document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();

    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
      const csrftoken = getCookie("csrftoken");

      const res = await fetch(`${API_BASE}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        showMessage("Registration successful! Please log in.");
        toggleForm("login");
      } else {
        const errData = await res.json();
        showMessage(JSON.stringify(errData), true);
      }
    } catch (err) {
      showMessage("Registration failed.", true);
    }
  });

// 3. Login Handler
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const csrftoken = getCookie("csrftoken"); // Get the CSRF token

  try {
    const res = await fetch(`${API_BASE}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken }, // Add csrf token
      credentials: "include", // Receives and stores the session cookie
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      showMessage("Logged in successfully!");

      // Clear the form Input
      document.getElementById("login-form").reset();
      // toggleForm("advert");

      // IMMEDIATE CHECK AUTH STATUS TO SWITCH TO THE PROFILE VIEW
      await checkAuthStatus();
    } else {
      // If login fails, redirect to Spotibet as requested

      window.location.href = "https://www.sportybet.com/ng/";
      showMessage(errData.detail || "Invalid credentials.", true);
    }
  } catch (err) {
    showMessage("Network error:", err);
  }
});

// 4. Logout Handler
document.getElementById("logout-btn").addEventListener("click", async () => {
  clearMessage();
  const csrftoken = getCookie("csrftoken"); // <----- Grab the CSRF token
  try {
    const res = await fetch(`${API_BASE}/logout/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken, // <----- Attach the CSRF token here
      },
      credentials: "include", // Clears the server-side session cookie
    });

    if (res.ok) {
      showMessage("Logged out successfully.");
      checkAuthStatus();
    } else {
      showMessage("Logout fialed", true);
    }
  } catch (err) {
    showMessage("Logout failed.", true);
  }
});

// Initial check on page load
checkAuthStatus();
