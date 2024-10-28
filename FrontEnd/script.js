const gallery = document.querySelector(".gallery");
const categoryMenu = document.querySelector(".category-menu");

async function getApiWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    gallery.innerText = "Erreur pendant récupération des oeuvres";
    gallery.id = "error-message";
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

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.innerText = category;
    categoryMenu.appendChild(button);
    button.addEventListener("click", function () {
      const allButtons = categoryMenu.querySelectorAll("button");
      allButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      gallery.innerHTML = "";
      onClickFilterWorks(category, works);
    });
  });
}

function onClickFilterWorks(category, works) {
  works.forEach((work) => {
    if (work.category.name === category || category === "Tous") {
      const figureElement = createFigureElement(work);
      gallery.appendChild(figureElement);
    }
  });
}

async function createGalleryElement(newWork = null) {
  if (newWork) {
    const figureElement = createFigureElement(newWork);
    gallery.appendChild(figureElement);
  } else {
    const works = await getApiWorks();
    const categories = getCategories(works);
    createFilterButtons(categories, works);
    gallery.innerHTML = "";
    works.forEach((work) => {
      const figureElement = createFigureElement(work);
      gallery.appendChild(figureElement);
    });
  }
}

async function main() {
  await createGalleryElement();
  const token = localStorage.getItem("token");

  if (token) {
    const loginLink = document.querySelector('a[href="login.html"]');
    if (loginLink) {
      loginLink.innerText = "Logout";
      loginLink.id = "logout";
      loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    document.body.classList.add("edit-mode");
    const editBanner = document.querySelector(".edit-banner");
    const editButtons = document.querySelectorAll(".edit-button");

    if (editBanner) editBanner.style.display = "flex";
    editButtons.forEach((button) => (button.style.display = "flex"));
  }
  main();
});
