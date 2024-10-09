function initializeEditMode() {
  const token = localStorage.getItem("token");
  const isLoggedIn = token !== null;
  
  if (isLoggedIn) {
      // Activer le mode édition
      document.body.classList.add('edit-mode');
      
      // Afficher la bannière d'édition
      const editBanner = document.querySelector('.edit-banner');
      if (editBanner) editBanner.style.display = 'flex';
      
      // Afficher tous les boutons modifier
      const editButtons = document.querySelectorAll('.edit-button');
      editButtons.forEach(button => button.style.display = 'flex');
      
      // Changer le texte "login" en "logout"
      const loginLink = document.querySelector('nav a[href="login.html"]');
      if (loginLink) {
          loginLink.textContent = 'logout';
          loginLink.addEventListener('click', function(e) {
              e.preventDefault();
              localStorage.removeItem('token');
              window.location.reload();
          });
      }
  }
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', initializeEditMode);