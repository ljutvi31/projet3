// Sélectionner les éléments du DOM
const modal = document.getElementById("projectModal");
const editBanner = document.querySelector(".edit-banner");
const editButton = document.querySelector(".edit-button");
const closeButton = document.querySelector(".modal .close");

// Ovrir la modale
function openModal() {
    modal.style.display = "block";
}

// Fermer la modale
function closeModal() {
    modal.style.display = "none";
}

// Ajouter les écouteurs d'événements suur les btn
editBanner.addEventListener("click", openModal);
editButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

// Fermer la modale si l'utilisateur clique en dehors
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        closeModal();
    }
});

//  Charge les images dans la modale
function loadModalImages() {
    const modalGallery = document.querySelector(".modal-gallery");
    // Même logique que pour charger vos projets, mais adaptée pour la modal
    fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
            modalGallery.innerHTML = "";
            data.forEach(item => {
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
        });
}

// Supprimer un projet
function deleteProject(id) {
    console.log("Suppression du projet", id);
}

// A l'ouverture modal, charge les images de la gallerie
editButton.addEventListener("click", loadModalImages);
editBanner.addEventListener("click", loadModalImages);