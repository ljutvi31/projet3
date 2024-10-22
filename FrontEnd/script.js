async function getApiWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    document.querySelector(".gallery").innerText =
      "Erreur pendant récupération des oeuvres";
    document.querySelector(".gallery").id = "error-message";
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

async function createGalleryElement(newWork = null) {
  if (newWork) {
    // Si un nouveau travail est fourni, ajout simplement à la galerie existante
    const galleryHtml = document.querySelector(".gallery");
    const figureElement = createFigureElement(newWork);
    galleryHtml.appendChild(figureElement);
  } else {
    // Sinon, cree la galerie complète
    const works = await getApiWorks();
    const categories = getCategories(works);
    createFilterButtons(categories, works);
    const galleryHtml = document.querySelector(".gallery");
    galleryHtml.innerHTML = ''; // Vide la galerie existante
    works.forEach((work) => {
      const figureElement = createFigureElement(work);
      galleryHtml.appendChild(figureElement);
    });
  }
}

async function main() {
    await createGalleryElement();
    
    const token = localStorage.getItem("token");
    if (!token) return; // Sort si pas de token
    
    const loginLink = document.querySelector('a[href="login.html"]');
    if (!loginLink) return; // Sort si pas de lien
    
    // Configure le lien de déconnexion
    loginLink.innerText = "Logout";
    loginLink.id = "logout";
    loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}

function initializeEditMode() {
  const token = localStorage.getItem("token");
  const isLoggedIn = token !== null;
  if (isLoggedIn) {
    document.body.classList.add("edit-mode");
    const editBanner = document.querySelector(".edit-banner");
    if (editBanner) editBanner.style.display = "flex";
    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach((button) => (button.style.display = "flex"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeEditMode();
  main();
});