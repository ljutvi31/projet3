// Fonction pour récupérer les travaux via une API Utilisation de 'await' pour attendre la réponse de l'API
async function getApiWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    // Renvoie des données au format JSON
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

// Fonction principale pour insérer les travaux dans la galerie et  Récupération des travaux via l'API
async function createGalleryElement() {
  const works = await getApiWorks();

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
