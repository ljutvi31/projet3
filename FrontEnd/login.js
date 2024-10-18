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


// J'ai ajouté une fonction validateInputs qui retourne false si les validations échouent. 
// Cela permet un return précoce dans le gestionnaire d'événements du formulaire si les validations ne passent pas.

// J'ai créé une fonction attemptLogin qui gère la tentative de connexion et retourne le token si la connexion réussit, ou null en cas d'échec. 
// Cela permet d'utiliser un return dans le bloc try/catch.

// Dans le gestionnaire d'événements du formulaire, j'ai ajouté un return après l'appel à validateInputs si les validations échouent.
// J'ai également ajouté une vérification du token retourné par attemptLogin avant de le stocker et de rediriger l'utilisateur.
// Ces modifications rendent le code plus modulaire et plus facile à lire, en utilisant des return pour contrôler le flux d'exécution à différents points du processus de connexion. 
// Cela améliore également la gestion des erreurs et la séparation des préoccupations dans le code.