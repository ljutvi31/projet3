// Fonction pour récupérer les travaux via une API Utilisation de 'await' pour attendre la réponse de l'API
async function getApiWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works"); // Renvoie des données au format JSON
    return await response.json();
  } catch (error) {
    // Affichage de l'erreur dans la console en cas de problème
    console.error("Erreur lors de la récupération des données :", error);
    return [];
  }
}

// Fonction pour créer un élément 'figure' avec une image et une légende
function createFigureElement(work) {
  // Création des éléments <img> et <figcaption> pour chaque travail
  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  imageElement.alt = work.title;

  const figCaptionElement = document.createElement("figcaption");
  figCaptionElement.innerText = work.title;

  // Création de l'élément <figure> et ajout des enfants
  const figureElement = document.createElement("figure");
  figureElement.appendChild(imageElement);
  figureElement.appendChild(figCaptionElement);

  return figureElement;
}

function getCategories(works) {
  // recup des noms de categories sur works
  const categoryNames = works.map((work) => work.category.name);
  const uniqueCategoryNames = new Set(categoryNames); // map est comme une boucle et set permet deviter les doublons et de stocker valeurs uniques
  
  uniqueCategoryNames.add("Tous");
  return [...uniqueCategoryNames];
}

function createFilterButtons(categories) { 
  const filterContainer = document.createElement("div");
  filterContainer.classList.add("filter-container");
  const filterButtons = document.querySelector(".category-menu");
  categories.forEach((category) => { // fonction flechee selection de chaque catgeorie une à une
    const button = document.createElement("button");
    button.innerText = category;
 filterButtons.appendChild(button);
 button.addEventListener('click', function(event){
  onClickFilterButton(category);
 })
  });
}

function onClickFilterButton(category){
  console.log(category);

}


// Fonction principale pour insérer les travaux dans la galerie, récupération des travaux via l'API et des catégories dans travaux
async function createGalleryElement() {
  const works = await getApiWorks();
  const categories = getCategories(works);
  createFilterButtons(categories);

  // Sélection de la galerie où insérer les figures
  const galleryHtml = document.querySelector(".gallery");

  // Boucle à travers chaque travail et création d'éléments de la galerie
  works.forEach((work) => {
    const figureElement = createFigureElement(work); // Crée une figure pour chaque travail
    galleryHtml.appendChild(figureElement); // Ajoute la figure dans la galerie
  });
}

// Exécution de la fonction principale
createGalleryElement();
