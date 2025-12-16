// ===== GLOBAL VARIABLES =====
let products = JSON.parse(localStorage.getItem('adminProducts')) || [];
let users = JSON.parse(localStorage.getItem('adminUsers')) || [];
let activities = JSON.parse(localStorage.getItem('adminActivities')) || [];
let productIdCounter = 1;
let userIdCounter = 1;
let salesChart = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    initializeData();
    setupNavigation();
    setupEventListeners();
    initializeDateTime();
    initializeCharts();
    loadDashboardData();
    updateCounters();
});

// ===== AUTH CHECK =====
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

// ===== NAVIGATION =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all sections, show target
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                
                // Load specific section data
                if (targetId === 'productos') {
                    updateProductTable();
                } else if (targetId === 'usuarios') {
                    updateUserTable();
                }
            }
        });
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('¿Estás seguro de cerrar sesión?')) {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'login.html';
        }
    });
    
    // Product form
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addProduct();
    });
    
    // User form
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addUser();
    });
}

// ===== DATA INITIALIZATION =====
function initializeData() {
    // Load sample products if none exist
    if (products.length === 0) {
        products = [
            {
                id: 1,
                name: "Nike Air Max 270",
                price: 1750,
                category: "men",
                stock: 15,
                image: "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=400",
                description: "Zapatillas deportivas con tecnología Air",
                createdAt: new Date().toISOString(),
                status: "active"
            },
            {
                id: 2,
                name: "Adidas Ultraboost",
                price: 1540,
                category: "men",
                stock: 8,
                image: "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=400",
                description: "Máxima comodidad para corredores",
                createdAt: new Date().toISOString(),
                status: "active"
            },
            {
                id: 3,
                name: "Nike Air Force 1",
                price: 1330,
                category: "women",
                stock: 22,
                image: "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=400",
                description: "Clásico atemporal",
                createdAt: new Date().toISOString(),
                status: "active"
            }
        ];
        productIdCounter = 4;
        localStorage.setItem('adminProducts', JSON.stringify(products));
    } else {
        // Get highest ID for counter
        productIdCounter = Math.max(...products.map(p => p.id)) + 1;
    }
    
    // Load sample users if none exist
    if (users.length === 0) {
        users = [
            {
                id: 1,
                name: "Administrador Principal",
                email: "admin@zapatillasbolivia.com",
                role: "admin",
                createdAt: new Date().toISOString(),
                status: "active"
            },
            {
                id: 2,
                name: "Juan Pérez",
                email: "juan@ejemplo.com",
                role: "editor",
                createdAt: new Date().toISOString(),
                status: "active"
            }
        ];
        userIdCounter = 3;
        localStorage.setItem('adminUsers', JSON.stringify(users));
    } else {
        userIdCounter = Math.max(...users.map(u => u.id)) + 1;
    }
    
    // Initialize activities if none exist
    if (activities.length === 0) {
        activities = [
            {
                id: 1,
                type: "product_added",
                message: "Nuevo producto agregado: Nike Air Max 270",
                time: "Hace 5 minutos",
                icon: "bi-box-seam",
                color: "primary"
            },
            {
                id: 2,
                type: "user_registered",
                message: "Nuevo usuario registrado: Juan Pérez",
                time: "Hace 1 hora",
                icon: "bi-person-plus",
                color: "success"
            },
            {
                id: 3,
                type: "stock_alert",
                message: "Stock bajo en Adidas Ultraboost",
                time: "Hace 2 horas",
                icon: "bi-exclamation-triangle",
                color: "warning"
            }
        ];
        localStorage.setItem('adminActivities', JSON.stringify(activities));
    }
}

// ===== DASHBOARD FUNCTIONS =====
function loadDashboardData() {
    updateStatsCards();
    loadRecentActivity();
    loadStockAlerts();
    loadRecentProducts();
}

function updateStatsCards() {
    // Total products
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('sidebarProductCount').textContent = products.length;
    
    // Total value
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    document.getElementById('totalValue').textContent = `Bs. ${totalValue.toLocaleString()}`;
    
    // Total users
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('sidebarUserCount').textContent = users.length;
    
    // Low stock count (stock < 10)
    const lowStockCount = products.filter(p => p.stock < 10).length;
    document.getElementById('lowStockCount').textContent = lowStockCount;
    
    // Update product section counters
    document.getElementById('productCount').textContent = `${products.length} productos`;
    document.getElementById('totalValueSection').textContent = `Total: Bs. ${totalValue.toLocaleString()}`;
    document.getElementById('userCount').textContent = `${users.length} usuarios`;
}

function loadRecentActivity() {
    const container = document.getElementById('activityList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Show last 5 activities
    const recentActivities = activities.slice(-5).reverse();
    
    recentActivities.forEach(activity => {
        const activityItem = `
            <div class="activity-item d-flex align-items-start">
                <div class="activity-icon bg-${activity.color} text-white">
                    <i class="bi ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.message}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `;
        container.innerHTML += activityItem;
    });
}

function loadStockAlerts() {
    const container = document.getElementById('stockAlerts');
    if (!container) return;
    
    container.innerHTML = '';
    
    const lowStockProducts = products.filter(p => p.stock < 10);
    
    if (lowStockProducts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-3">
                <i class="bi bi-check-circle text-success display-6 mb-3"></i>
                <p class="mb-0">Todo el stock está en niveles óptimos</p>
            </div>
        `;
        return;
    }
    
    lowStockProducts.forEach(product => {
        const alertItem = `
            <div class="alert-item d-flex justify-content-between align-items-center">
                <div>
                    <div class="product-name">${product.name}</div>
                    <div class="stock-info">Stock: ${product.stock} unidades</div>
                </div>
                <button class="btn btn-sm btn-warning" onclick="replenishStock(${product.id})">
                    <i class="bi bi-plus-circle"></i> Reponer
                </button>
            </div>
        `;
        container.innerHTML += alertItem;
    });
}

function loadRecentProducts() {
    const container = document.getElementById('recentProducts');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Show last 5 products
    const recentProducts = products.slice(-5).reverse();
    
    recentProducts.forEach(product => {
        const statusClass = product.stock < 10 ? 'warning' : 'success';
        const statusText = product.stock < 10 ? 'Bajo Stock' : 'Disponible';
        
        const row = `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${product.image}" alt="${product.name}" 
                             onerror="this.src='https://via.placeholder.com/40/007bff/ffffff?text=IMG'">
                        <div class="ms-3">
                            <strong>${product.name}</strong>
                            <div class="small text-muted">${product.description.substring(0, 30)}...</div>
                        </div>
                    </div>
                </td>
                <td><strong>Bs. ${product.price.toLocaleString()}</strong></td>
                <td><span class="badge bg-primary">${getCategoryName(product.category)}</span></td>
                <td>${new Date(product.createdAt).toLocaleDateString()}</td>
                <td><span class="badge bg-${statusClass}">${statusText}</span></td>
            </tr>
        `;
        container.innerHTML += row;
    });
}

// ===== PRODUCT FUNCTIONS =====
function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    
    if (!name || !price || !category || !stock || !image) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (price <= 0) {
        showNotification('El precio debe ser mayor a 0', 'error');
        return;
    }
    
    if (stock < 0) {
        showNotification('El stock no puede ser negativo', 'error');
        return;
    }
    
    const newProduct = {
        id: productIdCounter++,
        name,
        price,
        category,
        stock,
        image,
        description,
        createdAt: new Date().toISOString(),
        status: "active"
    };
    
    products.push(newProduct);
    localStorage.setItem('adminProducts', JSON.stringify(products));
    
    // Add activity
    addActivity('product_added', `Nuevo producto agregado: ${name}`);
    
    // Update UI
    updateProductTable();
    updateStatsCards();
    loadRecentProducts();
    loadStockAlerts();
    
    // Reset form
    document.getElementById('productForm').reset();
    
    showNotification('Producto agregado exitosamente', 'success');
}

function updateProductTable() {
    const tbody = document.getElementById('productTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${product.id}</strong></td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${product.image}" alt="${product.name}" 
                         class="product-image me-3" 
                         onerror="this.src='https://via.placeholder.com/60/007bff/ffffff?text=Imagen'">
                    <div>
                        <div class="fw-bold">${product.name}</div>
                        ${product.description ? `<small class="text-muted">${product.description}</small>` : ''}
                    </div>
                </div>
            </td>
            <td>
                <span class="badge bg-success fs-6">Bs. ${product.price.toLocaleString()}</span>
            </td>
            <td>
                <span class="badge ${product.stock < 10 ? 'bg-warning' : 'bg-info'} fs-6">
                    ${product.stock} unidades
                </span>
            </td>
            <td>
                <span class="badge badge-${product.category}">${getCategoryName(product.category)}</span>
            </td>
            <td>
                <a href="${product.image}" target="_blank" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-eye"></i> Ver
                </a>
            </td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="editProduct(${product.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        // Show edit modal with product data
        const modalBody = `
            <form id="editProductForm">
                <input type="hidden" id="editProductId" value="${product.id}">
                <div class="mb-3">
                    <label class="form-label">Nombre del Producto</label>
                    <input type="text" class="form-control" id="editProductName" value="${product.name}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Precio (Bs)</label>
                    <input type="number" class="form-control" id="editProductPrice" value="${product.price}" step="0.01" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Stock</label>
                    <input type="number" class="form-control" id="editProductStock" value="${product.stock}" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Actualizar Producto</button>
            </form>
        `;
        
        document.getElementById('editModalBody').innerHTML = modalBody;
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
        
        // Handle form submission
        document.getElementById('editProductForm').addEventListener('submit', function(e) {
            e.preventDefault();
            updateProduct(id);
            modal.hide();
        });
    }
}

function updateProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.name = document.getElementById('editProductName').value;
        product.price = parseFloat(document.getElementById('editProductPrice').value);
        product.stock = parseInt(document.getElementById('editProductStock').value);
        
        localStorage.setItem('adminProducts', JSON.stringify(products));
        
        // Add activity
        addActivity('product_updated', `Producto actualizado: ${product.name}`);
        
        // Update UI
        updateProductTable();
        updateStatsCards();
        loadRecentProducts();
        loadStockAlerts();
        
        showNotification('Producto actualizado exitosamente', 'success');
    }
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        const product = products.find(p => p.id === id);
        products = products.filter(p => p.id !== id);
        localStorage.setItem('adminProducts', JSON.stringify(products));
        
        // Add activity
        if (product) {
            addActivity('product_deleted', `Producto eliminado: ${product.name}`);
        }
        
        // Update UI
        updateProductTable();
        updateStatsCards();
        loadRecentProducts();
        loadStockAlerts();
        
        showNotification('Producto eliminado exitosamente', 'success');
    }
}

function replenishStock(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const newStock = prompt(`Ingresa la cantidad a agregar al stock de ${product.name}:`, "10");
        if (newStock && !isNaN(newStock) && parseInt(newStock) > 0) {
            product.stock += parseInt(newStock);
            localStorage.setItem('adminProducts', JSON.stringify(products));
            
            // Add activity
            addActivity('stock_replenished', `Stock repuesto: ${product.name} (+${newStock} unidades)`);
            
            // Update UI
            updateProductTable();
            updateStatsCards();
            loadRecentProducts();
            loadStockAlerts();
            
            showNotification(`Stock actualizado: ${product.stock} unidades`, 'success');
        }
    }
}

// ===== USER FUNCTIONS =====
function addUser() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;
    
    if (!name || !email || !role || !password || !confirmPassword) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        showNotification('Este correo electrónico ya está registrado', 'error');
        return;
    }
    
    const newUser = {
        id: userIdCounter++,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        status: "active"
    };
    
    users.push(newUser);
    localStorage.setItem('adminUsers', JSON.stringify(users));
    
    // Add activity
    addActivity('user_registered', `Nuevo usuario registrado: ${name}`);
    
    // Update UI
    updateUserTable();
    updateStatsCards();
    
    // Reset form
    document.getElementById('userForm').reset();
    
    showNotification('Usuario registrado exitosamente', 'success');
}

function updateUserTable() {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${user.id}</strong></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role}">${getRoleName(user.role)}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="editUser(${user.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        const newRole = prompt(`Cambiar rol de ${user.name}:`, user.role);
        if (newRole && ['admin', 'editor', 'customer'].includes(newRole)) {
            user.role = newRole;
            localStorage.setItem('adminUsers', JSON.stringify(users));
            
            // Add activity
            addActivity('user_updated', `Rol actualizado: ${user.name} (${getRoleName(newRole)})`);
            
            // Update UI
            updateUserTable();
            
            showNotification('Rol de usuario actualizado', 'success');
        }
    }
}

function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (user && user.email === 'admin@zapatillasbolivia.com') {
        showNotification('No se puede eliminar el administrador principal', 'error');
        return;
    }
    
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        users = users.filter(u => u.id !== id);
        localStorage.setItem('adminUsers', JSON.stringify(users));
        
        // Add activity
        if (user) {
            addActivity('user_deleted', `Usuario eliminado: ${user.name}`);
        }
        
        // Update UI
        updateUserTable();
        updateStatsCards();
        
        showNotification('Usuario eliminado exitosamente', 'success');
    }
}

// ===== HELPER FUNCTIONS =====
function getCategoryName(category) {
    const categories = {
        'men': 'Hombres',
        'women': 'Mujeres',
        'kids': 'Niños'
    };
    return categories[category] || 'Sin categoría';
}

function getRoleName(role) {
    const roles = {
        'admin': 'Administrador',
        'editor': 'Editor',
        'customer': 'Cliente'
    };
    return roles[role] || 'Sin rol';
}

function addActivity(type, message) {
    const activity = {
        id: activities.length + 1,
        type,
        message,
        time: "Hace unos momentos",
        icon: getActivityIcon(type),
        color: getActivityColor(type)
    };
    
    activities.push(activity);
    if (activities.length > 20) {
        activities = activities.slice(-20);
    }
    
    localStorage.setItem('adminActivities', JSON.stringify(activities));
    loadRecentActivity();
}

function getActivityIcon(type) {
    const icons = {
        'product_added': 'bi-box-seam',
        'product_updated': 'bi-pencil',
        'product_deleted': 'bi-trash',
        'user_registered': 'bi-person-plus',
        'user_updated': 'bi-person-gear',
        'user_deleted': 'bi-person-dash',
        'stock_alert': 'bi-exclamation-triangle',
        'stock_replenished': 'bi-arrow-up-circle'
    };
    return icons[type] || 'bi-info-circle';
}

function getActivityColor(type) {
    const colors = {
        'product_added': 'primary',
        'product_updated': 'info',
        'product_deleted': 'danger',
        'user_registered': 'success',
        'user_updated': 'warning',
        'user_deleted': 'danger',
        'stock_alert': 'warning',
        'stock_replenished': 'success'
    };
    return colors[type] || 'info';
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function initializeDateTime() {
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const dateTimeStr = now.toLocaleDateString('es-ES', options);
        const element = document.getElementById('currentDateTime');
        if (element) {
            element.textContent = dateTimeStr;
        }
    }
    
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
}

function initializeCharts() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    salesChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Ventas (Bs.)',
                data: [12500, 19000, 15000, 22000, 18000, 25000, 21000],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4361ee',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Bs. ' + (value / 1000).toFixed(0) + 'k';
                        }
                    }
                }
            }
        }
    });
}

function showSection(sectionId) {
    const navLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (navLink) {
        navLink.click();
    }
}

function exportData() {
    const data = {
        products: products,
        users: users,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `zapatillas-bolivia-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Datos exportados exitosamente', 'success');
}

function generateReport() {
    showNotification('Generando reporte... Esta función estará disponible pronto.', 'info');
}

function updateCounters() {
    updateStatsCards();
    updateProductTable();
    updateUserTable();
}

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.AdminDashboard = {
    getProducts: () => products,
    getUsers: () => users,
    refreshData: () => updateCounters(),
    addProduct: addProduct,
    addUser: addUser
};