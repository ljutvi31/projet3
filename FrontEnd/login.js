document.addEventListener("DOMContentLoaded", function () { //garantit que le script est exécuté uniquement une fois que le DOM est prêt.
    const loginForm = document.getElementById("loginForm");
  
    if (loginForm) { //vérifie que l'élément du formulaire existe sur la page avant de tenter d'ajouter un événement.
      loginForm.addEventListener("submit", async function (event) { //Un écouteur d'événement ajouté àl'envoi du formulaire (utilisateur clique sur "Se connecter")
        event.preventDefault(); // Empêche l'envoi automatique du formulaire
        const email = document.getElementById("email").value; //Récup valeurs saisies dans les champs'email et mot de passe
        const password = document.getElementById("password").value;
  
        try { //Tentative de connexion via une requête POST
          const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST", // signifie que des données (email et mot de passe) sont envoyées au serveur.
            headers: { "Content-Type": "application/json",}, // requête indiquant que les données sont envoyées au format JSON
            body: JSON.stringify({  // Le corps de la requête contient les données envoyées (email et mot de passe) au format JSON
                email: email,password: password,
            }),
          });
  
          const data = await response.json(); // Après que le serveur ait répondu, la réponse est convertie en format JSON. data contient le token si ok
  
          if (response.ok) {
            // Connexion réussie, redirection vers la page d'accueil avec les optins administrateur
            localStorage.setItem("token", data.token); // Stock le token
            window.location.href = "index.html"; // Redirige vers la page d'accueil
          } else {
            // Affiche un message d'erreur si l'authentification échoue
            errorMessage.style.display = "block"; //Affiche l'élément du message d'erreur
            errorMessage.innerText = // Change le texte de l'erreur pour informer l'utilisateur.
              "Erreur dans l’identifiant ou le mot de passe";
          }
        } catch (error) { //Gestion des erreurs réseau ou autres erreurs non liées à l'authentification
          console.error("Erreur lors de la tentative de connexion :", error); //Si une erreur se produit lors de la tentative de connexion, attrape l'erreur et l'affiche dans la console
        }
      });
    }
  });