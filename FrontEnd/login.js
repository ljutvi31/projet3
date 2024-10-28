document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const errorMessageElement = document.getElementById("error-message");

  if (!loginForm) {
    return;
  }

  function showError(message) {
    if (errorMessageElement) {
      errorMessageElement.style.display = "block";
      errorMessageElement.textContent = message;
    }
  }

  function hideError() {
    if (errorMessageElement) {
      errorMessageElement.style.display = "none";
    }
  }

  function validateInputs(email, password) {
    if (!email || !password) {
      showError("Veuillez remplir tous les champs");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      showError("Veuillez entrer un email valide");
      return false;
    }

    return true;
  }

  async function attemptLogin(email, password) {
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      return data.token;
    } catch (error) {
      showError("Email ou mot de passe incorrect");
      return null;
    }
  }

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideError();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!validateInputs(email, password)) {
      return;
    }

    const token = await attemptLogin(email, password);

    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "index.html";
    }
  });
});
