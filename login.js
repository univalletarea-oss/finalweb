// Credenciales de administrador
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "123"
};

// Verificar si ya está logueado
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = 'admin.html'; // Redirige al admin mejorado
    }
}

// Manejar login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'admin.html'; // Redirige al admin mejorado
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});

// Verificar al cargar la página
document.addEventListener('DOMContentLoaded', checkAuth);