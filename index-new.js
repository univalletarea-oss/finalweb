// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initializeLoading();
    initializeNavbar();
    initializeBackToTop();
    initializeAnimations();
    initializeProductFilters();
    initializeCountdown();
    initializeTestimonials();
    initializeNewsletter();
    initializeProductCards();
    
    // Cargar productos dinámicamente
    loadProducts();
    
    // Inicializar contador de visitas
    initializeVisitorCounter();
});

// ===== LOADING SCREEN =====
function initializeLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    // Mostrar loading por 1.5 segundos
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        
        // Remover del DOM después de la animación
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    }, 1500);
}

// ===== NAVBAR INTERACTIVO =====
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Efecto de scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Navegación suave
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                
                // Actualizar link activo
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Desplazamiento suave
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== ANIMACIONES ON SCROLL =====
function initializeAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// ===== FILTROS DE PRODUCTOS =====
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Actualizar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar productos
            const filter = this.dataset.filter;
            
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.6s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== COUNTDOWN TIMER =====
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    
    if (!countdownElement) return;
    
    // Fecha objetivo (24 horas desde ahora)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    
    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;
        
        if (difference <= 0) {
            countdownElement.innerHTML = '<div class="timer-digit">00:00:00</div>';
            return;
        }
        
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        countdownElement.innerHTML = `
            <div class="timer-digit">${hoursStr}</div>
            <div class="timer-digit">${minutesStr}</div>
            <div class="timer-digit">${secondsStr}</div>
        `;
    }
    
    // Actualizar cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== TESTIMONIOS AUTOMÁTICOS =====
function initializeTestimonials() {
    const testimonials = [
        {
            text: "Las mejores zapatillas que he comprado en Bolivia. Excelente calidad y entrega rápida.",
            name: "Carlos Mendoza",
            city: "La Paz",
            rating: 5
        },
        {
            text: "Gran variedad de marcas y precios competitivos. Muy recomendado.",
            name: "Ana Gutiérrez",
            city: "Santa Cruz",
            rating: 5
        },
        {
            text: "Compré para toda mi familia. Excelente servicio al cliente.",
            name: "Miguel Ríos",
            city: "Cochabamba",
            rating: 4
        }
    ];
    
    // Si hay contenedor de testimonios, llenarlo
    const container = document.getElementById('testimonialsContainer');
    if (container) {
        testimonials.forEach(testimonial => {
            const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
            
            const testimonialHTML = `
                <div class="testimonial-card">
                    <div class="testimonial-content">
                        ${testimonial.text}
                    </div>
                    <div class="testimonial-author">
                        <div class="author-info">
                            <h5 class="mb-0">${testimonial.name}</h5>
                            <p class="mb-0">${testimonial.city} • ${stars}</p>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML += testimonialHTML;
        });
    }
}

// ===== NEWSLETTER =====
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                // Simular suscripción
                showNotification('¡Gracias por suscribirte!', 'Te enviaremos las mejores ofertas.');
                this.reset();
                
                // Guardar en localStorage
                saveSubscription(email);
            } else {
                showNotification('Por favor ingresa un email válido.', 'error');
            }
        });
    }
}

// ===== PRODUCTOS INTERACTIVOS =====
function initializeProductCards() {
    // Wishlist
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-wishlist')) {
            const button = e.target.closest('.btn-wishlist');
            const productId = button.dataset.product;
            
            button.classList.toggle('active');
            
            if (button.classList.contains('active')) {
                button.innerHTML = '<i class="bi bi-heart-fill"></i>';
                showNotification('Producto añadido a favoritos');
                addToWishlist(productId);
            } else {
                button.innerHTML = '<i class="bi bi-heart"></i>';
                showNotification('Producto removido de favoritos');
                removeFromWishlist(productId);
            }
        }
        
        // Añadir al carrito
        if (e.target.closest('.btn-add-cart')) {
            const button = e.target.closest('.btn-add-cart');
            const productId = button.dataset.product;
            
            button.innerHTML = '<i class="bi bi-check-lg me-2"></i>Añadido';
            button.classList.add('added');
            
            setTimeout(() => {
                button.innerHTML = '<i class="bi bi-cart-plus me-2"></i>Añadir al carrito';
                button.classList.remove('added');
            }, 2000);
            
            addToCart(productId);
            showNotification('Producto añadido al carrito', 'success');
        }
    });
}

// ===== CARGAR PRODUCTOS DINÁMICAMENTE =====
function loadProducts() {
    const products = [
        {
            id: 1,
            name: "Nike Air Max 270",
            category: "men",
            price: 1750,
            oldPrice: 2100,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Tecnología Air para máxima amortiguación",
            badge: "Nuevo"
        },
        {
            id: 2,
            name: "Adidas Ultraboost",
            category: "men",
            price: 1540,
            oldPrice: 1800,
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Comodidad extrema para corredores",
            badge: "Popular"
        },
        {
            id: 3,
            name: "Nike Air Force 1",
            category: "women",
            price: 1330,
            oldPrice: 1500,
            image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Clásico atemporal con estilo urbano",
            badge: null
        },
        {
            id: 4,
            name: "Converse Chuck Taylor",
            category: "women",
            price: 840,
            oldPrice: 1000,
            image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Icono del streetwear para cualquier ocasión",
            badge: "Oferta"
        }
    ];
    
    const container = document.getElementById('productsContainer');
    
    if (container) {
        products.forEach(product => {
            const categoryText = product.category === 'men' ? 'Hombres' : 
                               product.category === 'women' ? 'Mujeres' : 'Niños';
            
            const productHTML = `
                <div class="col-md-6 col-lg-3" data-category="${product.category}">
                    <div class="product-card animate-on-scroll">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <div class="product-info">
                            <span class="product-category">${categoryText}</span>
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-description">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    ${product.oldPrice ? 
                                        `<span class="product-price-old">Bs. ${product.oldPrice}</span>` : ''}
                                    <span class="product-price">Bs. ${product.price}</span>
                                </div>
                            </div>
                            <div class="product-actions mt-3">
                                <button class="btn-add-cart" data-product="${product.id}">
                                    <i class="bi bi-cart-plus me-2"></i>Añadir al carrito
                                </button>
                                <button class="btn-wishlist" data-product="${product.id}">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML += productHTML;
        });
    }
}

// ===== FUNCIONES UTILITARIAS =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'success') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 30px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border: none;
        border-radius: 10px;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-3 fs-4"></i>
            <div>
                <strong>${type === 'success' ? '¡Éxito!' : 'Error'}</strong>
                <div class="small">${message}</div>
            </div>
        </div>
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

function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = total;
        cartCount.style.display = total > 0 ? 'flex' : 'none';
    }
}

function saveSubscription(email) {
    let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }
}

function initializeVisitorCounter() {
    let visitors = localStorage.getItem('siteVisitors') || 0;
    visitors = parseInt(visitors) + 1;
    localStorage.setItem('siteVisitors', visitors);
    
    // Actualizar contador en el hero si existe
    const visitorElement = document.getElementById('visitorCount');
    if (visitorElement) {
        visitorElement.textContent = visitors.toLocaleString();
    }
}

// ===== SCROLL REVEAL EFFECT =====
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('animated');
        }
    });
});