// Sélection des éléments du DOM
const modal = document.getElementById("projectModal");
const addPhotoModal = document.getElementById("addPhotoModal");
const editBanner = document.querySelector(".edit-banner");
const editButton = document.querySelector(".edit-button");
const closeButtons = document.querySelectorAll(".modal .close");
const backButton = document.querySelector(".back-button");
const addPhotoBtn = document.querySelector(".add-photo-btn");
const addPhotoForm = document.getElementById("addPhotoForm");
const photoUpload = document.getElementById("photoUpload");
const photoTitle = document.getElementById("photoTitle");
const photoCategory = document.getElementById("photoCategory");
const validateBtn = document.querySelector(".validate-btn");

// Ouvrir la modale principale
function openModal() {
  modal.classList.add("is-active");
  loadModalImages();
}
// ferme les modales
function closeModal() {
  modal.classList.remove("is-active");
  addPhotoModal.classList.remove("is-active");
  if (addPhotoForm) {
    addPhotoForm.reset();
  }
}

// Ouvrir la modale d'ajout de photo
function openAddPhotoModal() {
  modal.classList.remove("is-active");
  addPhotoModal.classList.add("is-active");
  loadCategories();

  // Réinitialiser l'image de prévisualisation
  const photoPreview = document.getElementById("photoPreview");
  photoPreview.style.display = "none";
  photoPreview.src = "";
}

// Charger les images dans la modale
async function loadModalImages() {
  const modalGallery = document.querySelector(".modal-gallery");

  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    modalGallery.innerHTML = "";

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
      modalGallery.appendChild(figure);
    });
  } catch (error) {
    modalGallery.innerHTML =
      "<p>Une erreur s'est produite lors du chargement des images.</p>";
  }
}

// Charger les catégories dans le select
async function loadCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    // Videle select
    photoCategory.innerHTML = "";

    // creation et ajout l'option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Choisissez une catégorie";
    photoCategory.appendChild(defaultOption);

    // Ajouter chaque catégorie
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      photoCategory.appendChild(option);
    });
  } catch (error) {

    // Gérer l'erreur de manière sécurisée
    photoCategory.innerHTML = ""; 
    const errorOption = document.createElement("option");
    errorOption.textContent = "Erreur de chargement des catégories";
    photoCategory.appendChild(errorOption);
  }
}

// Supprime un projet
async function deleteProject(id) {
  if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      loadModalImages();
      createGalleryElement(); // Recrée la galerie complète après suppression
    } else {
      throw new Error("Erreur lors de la suppression");
    }
  } catch (error) {
    alert("Une erreur est survenue lors de la suppression du projet");
  }
}

// Gestionnaires d'événements
editBanner.addEventListener("click", openModal);
editButton.addEventListener("click", openModal);
closeButtons.forEach((button) => button.addEventListener("click", closeModal));
addPhotoBtn.addEventListener("click", openAddPhotoModal);

// Retour à la première modale
backButton.addEventListener("click", () => {
  addPhotoModal.classList.remove("is-active");
  modal.classList.add("is-active");
  addPhotoForm.reset();
});

// Fermer les modales en cliquant à l'extérieur
window.addEventListener("click", (event) => {
  if (event.target === modal || event.target === addPhotoModal) {
    closeModal();
  }
});

// Fermer les modales avec la touche Echap
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Activer le bouton valider quand une image est sélectionnée
photoUpload.addEventListener("change", () => {
  validateBtn.classList.add("active");
});

// Gestion du formulaire d'ajout de photo
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
      const newWork = await response.json();
      closeModal();
      createGalleryElement(newWork); 
      loadModalImages();
    } else {
      throw new Error("Erreur lors de l'ajout de la photo");
    }
  } catch (error) {
    alert("Une erreur est survenue lors de l'ajout de la photo");
  }
});

// Prévisualise la photo lorsque sélection fichier
photoUpload.addEventListener("change", () => {
  const file = photoUpload.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const photoPreview = document.getElementById("photoPreview");
      photoPreview.src = e.target.result;
      photoPreview.style.display = "block";
    };

    reader.readAsDataURL(file);
  } else {
    const photoPreview = document.getElementById("photoPreview");
    photoPreview.style.display = "none";
  }
});

// au clic, retour à l'interface d'ajout de photo
photoPreview.addEventListener("click", showUploadInterface);

// Fonction pour afficher l'interface d'ajout
function showUploadInterface() {
  photoPreview.style.display = "none";
}
