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
  // for (let i = 0; i < works.length; i++) {
  //   if (works[i].category.name === categoryNames) {
  //     return works[i].categoryId;
  //   }
  // }
}

// function onClickSortWorks(category, works) {
//   //tri du cours
//   const categoryId = getCategoryIdByName(works, category);
//   const galleryHtml = document.querySelector(".gallery");
//   works.sort((a, b) => {
//     if (category === "Tous") {
//       return a.id - b.id;
//     } else if (a.categoryId === categoryId) {
//       return -1;
//     }
//     return 1;
//   });
//   works.forEach((work) => {
//     const figureElement = createFigureElement(work);
//     galleryHtml.appendChild(figureElement);
//   });
// }

function onClickFilterWorks(category, works) { 
  const galleryHtml = document.querySelector(".gallery");
works.forEach((work) => {
  if(work.category.name === category || category==="Tous") {
    const figureElement = createFigureElement(work);
    galleryHtml.appendChild(figureElement);
  }
})
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
