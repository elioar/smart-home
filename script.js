

document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const fullMenu = document.querySelector('.full-menu');
    const body = document.body;

    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        fullMenu.classList.toggle('active');
        body.style.overflow = fullMenu.classList.contains('active') ? 'hidden' : '';
        
        // Αλλαγή του εικονιδίου
        const icon = burgerMenu.querySelector('i');
        if (fullMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Κλείσιμο menu όταν κάνουμε κλικ σε κάποιο link
    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            fullMenu.classList.remove('active');
            body.style.overflow = '';
            burgerMenu.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });
}); 