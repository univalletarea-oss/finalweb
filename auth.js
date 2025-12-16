// Variables globales
let currentForm = 'login';
let users = JSON.parse(localStorage.getItem('storeUsers')) || [];

// Clase para manejar notificaciones
class Notification {
    constructor() {
        this.element = document.getElementById('notification');
        this.title = document.getElementById('notificationTitle');
        this.message = document.getElementById('notificationMessage');
        this.timeout = null;
    }

    show(type, title, message, duration = 3000) {
        // Limpiar timeout anterior
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.element.classList.remove('show');
        }

        // Configurar tipo
        this.element.className = 'notification';
        this.element.classList.add(type, 'show');
        this.title.textContent = title;
        this.message.textContent = message;

        // Ocultar después de la duración
        this.timeout = setTimeout(() => {
            this.element.classList.remove('show');
        }, duration);
    }
}

// Inicializar notificaciones
const notification = new Notification();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializePasswordToggle();
    initializeForms();
    initializeStatsAnimation();
});

// Configurar pestañas
function initializeTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const formWrappers = document.querySelectorAll('.form-wrapper');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Actualizar pestañas activas
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Animación de transición de formularios
            if (tabName === 'login') {
                formWrappers.forEach(wrapper => {
                    wrapper.classList.remove('active');
                });
                document.getElementById('loginFormWrapper').classList.add('active');
                currentForm = 'login';
            } else {
                formWrappers.forEach(wrapper => {
                    wrapper.classList.remove('active');
                });
                document.getElementById('registerFormWrapper').classList.add('active');
                currentForm = 'register';
            }
        });
    });
}

// Mostrar/ocultar contraseñas
function initializePasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });
}

// Animación de estadísticas
function initializeStatsAnimation() {
    const stats = {
        productCount: 150,
        clientCount: 2500,
        cityCount: 9
    };

    Object.keys(stats).forEach(statId => {
        const element = document.getElementById(statId);
        if (element) {
            animateCounter(element, stats[statId], 2000);
        }
    });
}

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.id === 'clientCount' ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.id === 'clientCount' ? '+' : '');
        }
    }, 16);
}

// Configurar formularios
function initializeForms() {
    // Formulario de Login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Validación básica
        if (!validateEmail(email)) {
            showError('loginEmail', 'Por favor ingresa un email válido');
            return;
        }
        
        if (password.length < 6) {
            showError('loginPassword', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        // Simulación de autenticación
        loginUser(email, password);
    });
    
    // Formulario de Registro
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        const city = document.getElementById('registerCity').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Validaciones
        if (name.length < 3) {
            showError('registerName', 'El nombre debe tener al menos 3 caracteres');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('registerEmail', 'Por favor ingresa un email válido');
            return;
        }
        
        if (!validatePhone(phone)) {
            showError('registerPhone', 'Ingresa un número de teléfono válido');
            return;
        }
        
        if (!city) {
            showError('registerCity', 'Por favor selecciona tu ciudad');
            return;
        }
        
        if (password.length < 8) {
            showError('registerPassword', 'La contraseña debe tener al menos 8 caracteres');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('registerConfirmPassword', 'Las contraseñas no coinciden');
            return;
        }
        
        if (!document.getElementById('acceptTerms').checked) {
            notification.show('error', 'Error', 'Debes aceptar los términos y condiciones');
            return;
        }
        
        // Registrar usuario
        registerUser(name, email, phone, city, password);
    });
    
    // Enlace de "Olvidé mi contraseña"
    document.getElementById('forgotPassword').addEventListener('click', function(e) {
        e.preventDefault();
        notification.show('info', 'Restablecer Contraseña', 'Función en desarrollo. Próximamente disponible.');
    });
}

// Mostrar error en campo
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const parent = field.closest('.input-with-icon');
    
    // Agregar clase de error
    parent.classList.add('shake');
    field.style.borderColor = '#dc3545';
    
    // Mostrar notificación
    notification.show('error', 'Error de Validación', message);
    
    // Remover animación después de completar
    setTimeout(() => {
        parent.classList.remove('shake');
    }, 500);
}

// Validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validar teléfono (Bolivia)
function validatePhone(phone) {
    const re = /^(\+591)?[6-7]\d{7}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Registrar usuario
function registerUser(name, email, phone, city, password) {
    // Verificar si el usuario ya existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        notification.show('error', 'Error', 'Este email ya está registrado');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        city,
        password, // En producción, esto debería estar hasheado
        role: 'customer',
        createdAt: new Date().toISOString()
    };
    
    // Guardar usuario
    users.push(newUser);
    localStorage.setItem('storeUsers', JSON.stringify(users));
    
    // Mostrar éxito
    notification.show('success', '¡Cuenta creada!', `Bienvenido/a ${name}`);
    
    // Limpiar formulario y cambiar a login
    setTimeout(() => {
        document.getElementById('registerForm').reset();
        document.querySelector('[data-tab="login"]').click();
    }, 2000);
}

// Iniciar sesión
function loginUser(email, password) {
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        notification.show('success', '¡Bienvenido!', `Hola ${user.name}`);
        
        // Guardar sesión
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }));
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    } else {
        notification.show('error', 'Error', 'Email o contraseña incorrectos');
    }
}

// Verificar si hay sesión activa
function checkSession() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.role === 'admin' && window.location.pathname.includes('auth.html')) {
            window.location.href = 'admin.html';
        }
    }
}

// Inicializar verificación de sesión
checkSession();