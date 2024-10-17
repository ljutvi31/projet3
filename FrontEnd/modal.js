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
    loadModalImages(); // Charge les images lors de l'ouverture
}

// Fermer toutes les modales
function closeModal() {
    modal.classList.remove("is-active");
    addPhotoModal.classList.remove("is-active");
    // Réinitialiser le formulaire lors de la fermeture
    if (addPhotoForm) {
        addPhotoForm.reset();
    }
}

// Ouvrir la modale d'ajout de photo
function openAddPhotoModal() {
    modal.classList.remove("is-active");
    addPhotoModal.classList.add("is-active");
    loadCategories();
}

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
            modalGallery.appendChild(figure);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        modalGallery.innerHTML = "<p>Une erreur s'est produite lors du chargement des images.</p>";
    }
}

// Charger les catégories dans le select
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
            loadModalImages(); // Recharge les images dans la modale
            createGalleryElement(); // Recharge la galerie principale
        } else {
            throw new Error("Erreur lors de la suppression");
        }
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Une erreur est survenue lors de la suppression du projet");
    }
}

// Gestionnaires d'événements
editBanner.addEventListener("click", openModal);
editButton.addEventListener("click", openModal);
closeButtons.forEach(button => button.addEventListener("click", closeModal));
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
            closeModal();
            loadModalImages(); // Recharge les images dans la modale
            createGalleryElement(); // Recharge la galerie principale
        } else {
            throw new Error("Erreur lors de l'ajout de la photo");
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de la photo:", error);
        alert("Une erreur est survenue lors de l'ajout de la photo");
    }
});

// Sélection de l'élément de prévisualisation
const photoPreview = document.getElementById("photoPreview");

// Prévisualiser la photo lorsque l'utilisateur sélectionne un fichier
photoUpload.addEventListener("change", () => {
    const file = photoUpload.files[0];
    if (file) {
        const reader = new FileReader();

        // Lorsque le fichier est chargé, mettre à jour la source de l'image de prévisualisation
        reader.onload = (e) => {
            photoPreview.src = e.target.result;
            photoPreview.style.display = "block"; // Rendre l'image visible
        };

        reader.readAsDataURL(file); // Lire le fichier en tant qu'URL pour l'afficher
    } else {
        photoPreview.style.display = "none"; // Masquer la prévisualisation si aucun fichier n'est sélectionné
    }
});

// Ouvrir la modale d'ajout de photo
function openAddPhotoModal() {
    modal.classList.remove("is-active");
    addPhotoModal.classList.add("is-active");
    loadCategories();
    
    // Réinitialiser l'image de prévisualisation
    const photoPreview = document.getElementById("photoPreview");
    photoPreview.style.display = "none"; // Masquer l'image de prévisualisation
    photoPreview.src = ""; // Réinitialiser la source de l'image
}