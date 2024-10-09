document.addEventListener("DOMContentLoaded", function () {
    const editGalleryBtn = document.getElementById("edit-gallery-btn");
    const modal = document.getElementById("modal");
    const closeModalBtn = document.querySelector(".close");
    const addPhotoBtn = document.getElementById("add-photo-btn");
    const galleryView = document.querySelector(".gallery-view");
    const addPhotoView = document.querySelector(".add-photo-view");
    
    // Fonction pour afficher la modale
    function openModal() {
      modal.classList.remove("hidden");
      galleryView.classList.add("active");
      addPhotoView.classList.remove("active");
    }
  
    // Fonction pour fermer la modale
    function closeModal() {
      modal.classList.add("hidden");
    }
  
    // Ouvrir la modale quand on clique sur le bouton Modifier
    editGalleryBtn.addEventListener("click", openModal);
  
    // Fermer la modale quand on clique sur la croix
    closeModalBtn.addEventListener("click", closeModal);
  
    // Fermer la modale quand on clique en dehors du contenu de la modale
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  
    // Changer de vue vers "Ajouter une photo"
    addPhotoBtn.addEventListener("click", function () {
      galleryView.classList.remove("active");
      addPhotoView.classList.add("active");
    });
    
    // Gérer le formulaire d'ajout de photo
    const addPhotoForm = document.getElementById("add-photo-form");
    addPhotoForm.addEventListener("submit", function (event) {
      event.preventDefault();
      // Gestion de l'ajout de photo ici
      console.log("Formulaire soumis");
    });
  });