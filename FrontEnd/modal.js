// Sélectionner les éléments du DOM
const modal = document.getElementById("projectModal");
const editBanner = document.querySelector(".edit-banner");
const editButton = document.querySelector(".edit-button");
const closeButton = document.querySelector(".modal .close");

// Ouvrir la modale
function openModal() {
  modal.classList.add("is-active"); // Ajoute la classe pour afficher la modale
}

// Fermer la modale
function closeModal() {
  modal.classList.remove("is-active"); // Enlève la classe pour cacher la modale
}

// Ajouter les écouteurs d'événements sur les boutons
editBanner.addEventListener("click", openModal);
editButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

// Fermer la modale si l'utilisateur clique en dehors
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

// Fermer la modale si la touche Échap est pressée
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal(); // Appelle la fonction pour fermer la modale
  }
});

// Charger les images dans la modale
async function loadModalImages() {
  const modalGallery = document.querySelector(".modal-gallery");

  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    modalGallery.innerHTML = ""; // Vide la galerie avant de charger les nouvelles images
    data.forEach((item) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.title;

      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fa-solid fa-trash-can";
      deleteIcon.addEventListener("click", () => deleteProject(item.id));

      figure.appendChild(img);
      figure.appendChild(deleteIcon);
      modalGallery.appendChild(figure); // Ajoute l'image à la galerie
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    modalGallery.innerHTML = "<p>Une erreur s'est produite lors du chargement des images.</p>";
  }
}

// Charger les images à l'ouverture de la modale
editButton.addEventListener("click", loadModalImages);
editBanner.addEventListener("click", loadModalImages);

//modale 2, ajout des classes aux variables
const addPhotoModal = document.getElementById("addPhotoModal");
const addPhotoBtn = document.querySelector(".add-photo-btn");
const addPhotoForm = document.getElementById("addPhotoForm");
const photoUpload = document.getElementById("photoUpload");
const photoTitle = document.getElementById("photoTitle");
const photoCategory = document.getElementById("photoCategory");
const validateBtn = document.querySelector(".validate-btn");
// ajout ecoute au btn d'ajout
addPhotoBtn.addEventListener("click", openAddPhotoModal);

function openAddPhotoModal() {
  closeModal(); // Ferme la première modale
  addPhotoModal.classList.add("is-active");
  loadCategories();
}

function closeAddPhotoModal() {
  addPhotoModal.classList.remove("is-active");
}

addPhotoModal.querySelector(".close").addEventListener("click", closeAddPhotoModal);

async function loadCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    photoCategory.innerHTML = categories.map(category => 
      `<option value="${category.id}">${category.name}</option>`
    ).join("");
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
  }
}

photoUpload.addEventListener("change", () => {
  validateBtn.classList.add("active");
});

addPhotoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append("image", photoUpload.files[0]);
  formData.append("title", photoTitle.value);
  formData.append("category", photoCategory.value);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      closeAddPhotoModal();
      loadModalImages(); // Recharge les images dans la première modale
      createGalleryElement(); // Recharge la galerie principale
    } else {
      console.error("Erreur lors de l'ajout de la photo");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la photo:", error);
  }
});