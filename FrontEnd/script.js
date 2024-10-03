async function getApiWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return [];
  }
}

function createFigureElement(work) {
  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  imageElement.alt = work.title;

  const figCaptionElement = document.createElement("figcaption");
  figCaptionElement.innerText = work.title;

  const figureElement = document.createElement("figure");
  figureElement.appendChild(imageElement);
  figureElement.appendChild(figCaptionElement);

  return figureElement;
}

function getCategories(works) {
  const categoryNames = works.map((work) => work.category.name);
  const uniqueCategoryNames = new Set(categoryNames);

  return ["Tous", ...uniqueCategoryNames];
}

function createFilterButtons(categories, works) {
  const filterContainer = document.createElement("div");
  filterContainer.classList.add("filter-container");
  const filterButtons = document.querySelector(".category-menu");
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.innerText = category;
    filterButtons.appendChild(button);
    button.addEventListener("click", function (event) {
      // Ajoute et retire .active sur le bouton cliqué
      const allButtons = document.querySelectorAll(".category-menu button");
      allButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      const galleryHtml = document.querySelector(".gallery");
      galleryHtml.innerHTML = "";

      onClickFilterWorks(category, works);
    });
  });
}
function getCategoryIdByName(works, categoryName) {
  if (categoryName === "Tous") {
    return 0;
  }
  return works.find((work) => work.category.name === categoryName).categoryId;
}

function onClickFilterWorks(category, works) {
  const galleryHtml = document.querySelector(".gallery");
  works.forEach((work) => {
    if (work.category.name === category || category === "Tous") {
      const figureElement = createFigureElement(work);
      galleryHtml.appendChild(figureElement);
    }
  });
}
async function createGalleryElement() {
  const works = await getApiWorks();
  const categories = getCategories(works);
  createFilterButtons(categories, works);

  const galleryHtml = document.querySelector(".gallery");
  works.forEach((work) => {
    const figureElement = createFigureElement(work);
    galleryHtml.appendChild(figureElement);
  });
}

async function main() {
  await createGalleryElement();
}
main();

document.addEventListener("DOMContentLoaded", function () {
  //garantit que le script est exécuté uniquement une fois que le DOM est prêt.
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    //vérifie que l'élément du formulaire existe sur la page avant de tenter d'ajouter un événement.
    loginForm.addEventListener("submit", async function (event) {
      //Un écouteur d'événement ajouté àl'envoi du formulaire (utilisateur clique sur "Se connecter")
      event.preventDefault(); // Empêche l'envoi automatique du formulaire
      const email = document.getElementById("email").value; //Récup valeurs saisies dans les champs'email et mot de passe
      const password = document.getElementById("password").value;

      try {
        //Tentative de connexion via une requête POST
        const response = await fetch("http://localhost:5678/api/login", {
          method: "POST", // signifie que des données (email et mot de passe) sont envoyées au serveur.
          headers: {
            // requête indiquant que les données sont envoyées au format JSON
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Le corps de la requête contient les données envoyées (email et mot de passe) au format JSON
            email: email,
            password: password,
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
      } catch (error) {
        //Gestion des erreurs réseau ou autres erreurs non liées à l'authentification
        console.error("Erreur lors de la tentative de connexion :", error); //Si une erreur se produit lors de la tentative de connexion, attrape l'erreur et l'affiche dans la console
      }
    });
  }
});
