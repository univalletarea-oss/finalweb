// Validación del formulario de registro
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
    }
    
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    registerModal.hide();
});

// Validación del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulación de validación
    if (email && password) {
        alert('Inicio de sesión exitoso');
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        
        // Actualizar interfaz para usuario logueado
        updateUserInterface(true);
    } else {
        alert('Por favor, completa todos los campos');
    }
});

// Inicializar tooltips
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Función para formatear precios en Bolivianos
function formatPrice(price) {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB'
    }).format(price);
}

// Actualizar interfaz según estado de autenticación
function updateUserInterface(isLoggedIn) {
    const authLinks = document.querySelectorAll('.auth-link');
    if (isLoggedIn) {
        authLinks.forEach(link => {
            link.innerHTML = '<i class="bi bi-person-check"></i> Mi Cuenta';
        });
    }
}

// Manejo de botones "Talla"
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-outline-secondary') && e.target.textContent === 'Talla') {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('.card-title').textContent;
        alert(`Selecciona tu talla para: ${productName}`);
    }
});

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
    
    // Mostrar precio en Bolivianos en consola para verificación
    console.log('Tienda Zapatillas Bolivia - Precios en Bolivianos (Bs.)');
    
    // Ejemplo de uso de formatPrice
    console.log('Precio formateado:', formatPrice(1750)); // Muestra: Bs. 1,750.00
    
    // Añadir evento a botones "Más Detalles"
    const detailButtons = document.querySelectorAll('.btn-outline-primary');
    detailButtons.forEach(button => {
        if (button.textContent === 'Más Detalles') {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.card-title').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                const productImage = productCard.querySelector('.product-img').src;
                
                // Actualizar modal con información del producto
                const modal = document.getElementById('detailsModal');
                modal.querySelector('.modal-title').textContent = productName;
                modal.querySelector('.lead').textContent = productPrice;
                modal.querySelector('.img-fluid').src = productImage;
                modal.querySelector('h3').textContent = productName;
            });
        }
    });
});

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Ejemplo de uso:
// showNotification('Producto añadido al carrito', 'success');