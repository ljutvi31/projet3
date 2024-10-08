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

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideError();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Vérification des champs vides
    if (!email || !password) {
      return;
    }

    // Validation de l'email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return;
    }

    // Tentative de connexion si les validations passent
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

      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } catch (error) {
      showError("Email ou mot de passe incorrect");
    }
  });
});