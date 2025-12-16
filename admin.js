// Arrays para almacenar datos
let products = [];
let users = [];

// Contadores para IDs
let productIdCounter = 1;
let userIdCounter = 1;

// Verificar autenticación
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

// Cerrar sesión
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    }
}

// Formatear precio en Bolivianos
function formatPrice(price) {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB'
    }).format(price);
}

// Navegación entre secciones
function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover active de todos los links
            navLinks.forEach(l => l.classList.remove('active'));
            // Agregar active al link clickeado
            this.classList.add('active');
            
            // Ocultar todas las secciones
            contentSections.forEach(section => section.style.display = 'none');
            
            // Mostrar la sección correspondiente
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).style.display = 'block';
        });
    });
}

// Actualizar contadores
function updateCounters() {
    document.getElementById('productCount').textContent = `${products.length} productos`;
    document.getElementById('userCount').textContent = `${users.length} usuarios`;
    
    // Calcular valor total en Bolivianos
    const totalValue = products.reduce((sum, product) => sum + parseFloat(product.price), 0);
    document.getElementById('totalValue').textContent = `Total: ${formatPrice(totalValue)}`;
}

// Manejo del formulario de productos
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productCategory = document.getElementById('productCategory').value;
    const productImage = document.getElementById('productImage').value;
    const productDescription = document.getElementById('productDescription').value;
    
    if (!productName || !productPrice || !productCategory || !productImage) {
        alert('❌ Por favor completa todos los campos obligatorios');
        return;
    }
    
    // Crear nuevo producto
    const newProduct = {
        id: productIdCounter++,
        name: productName,
        price: parseFloat(productPrice),
        category: productCategory,
        image: productImage,
        description: productDescription,
        createdAt: new Date().toISOString()
    };
    
    // Agregar producto
    products.push(newProduct);
    
    // Actualizar tabla y contadores
    updateProductTable();
    updateCounters();
    
    // Limpiar formulario
    document.getElementById('productForm').reset();
    
    alert('✅ Producto agregado correctamente');
});

// Actualizar tabla de productos
function updateProductTable() {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${product.id}</strong></td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${product.image}" alt="${product.name}" 
                         class="product-image me-3" 
                         onerror="this.src='https://via.placeholder.com/60x60/007bff/ffffff?text=Imagen'">
                    <div>
                        <div class="fw-bold">${product.name}</div>
                        ${product.description ? `<small class="text-muted">${product.description}</small>` : ''}
                    </div>
                </div>
            </td>
            <td>
                <span class="badge bg-success fs-6">${formatPrice(product.price)}</span>
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
        tableBody.appendChild(row);
    });
}

// Obtener nombre de categoría
function getCategoryName(category) {
    switch(category) {
        case 'men': return 'Hombres';
        case 'women': return 'Mujeres';
        case 'kids': return 'Niños';
        default: return 'Sin categoría';
    }
}

// Editar producto
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productDescription').value = product.description || '';
        
        // Cambiar botón a actualizar
        const submitButton = document.querySelector('#productForm button[type="submit"]');
        submitButton.innerHTML = '<i class="bi bi-check-circle"></i> Actualizar Producto';
        submitButton.classList.remove('btn-primary');
        submitButton.classList.add('btn-warning');
        
        // Cambiar evento del formulario
        const originalHandler = document.getElementById('productForm').onsubmit;
        document.getElementById('productForm').onsubmit = function(e) {
            e.preventDefault();
            
            product.name = document.getElementById('productName').value;
            product.price = parseFloat(document.getElementById('productPrice').value);
            product.category = document.getElementById('productCategory').value;
            product.image = document.getElementById('productImage').value;
            product.description = document.getElementById('productDescription').value;
            product.updatedAt = new Date().toISOString();
            
            updateProductTable();
            document.getElementById('productForm').reset();
            
            // Restaurar botón original
            submitButton.innerHTML = '<i class="bi bi-plus-circle"></i> Agregar Producto';
            submitButton.classList.remove('btn-warning');
            submitButton.classList.add('btn-primary');
            
            // Restaurar evento original
            document.getElementById('productForm').onsubmit = originalHandler;
            
            alert('✅ Producto actualizado correctamente');
        };
    }
}

// Eliminar producto
function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        products = products.filter(p => p.id !== id);
        updateProductTable();
        updateCounters();
        alert('✅ Producto eliminado correctamente');
    }
}

// Manejo del formulario de usuarios
document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userRole = document.getElementById('userRole').value;
    const userPassword = document.getElementById('userPassword').value;
    const userConfirmPassword = document.getElementById('userConfirmPassword').value;
    
    if (!userName || !userEmail || !userRole || !userPassword || !userConfirmPassword) {
        alert('❌ Por favor completa todos los campos');
        return;
    }
    
    if (userPassword.length < 8) {
        alert('❌ La contraseña debe tener al menos 8 caracteres');
        return;
    }
    
    if (userPassword !== userConfirmPassword) {
        alert('❌ Las contraseñas no coinciden');
        return;
    }
    
    // Verificar si el email ya existe
    if (users.some(u => u.email === userEmail)) {
        alert('❌ Este correo electrónico ya está registrado');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: userIdCounter++,
        name: userName,
        email: userEmail,
        role: userRole,
        createdAt: new Date().toISOString()
    };
    
    // Agregar usuario
    users.push(newUser);
    
    // Actualizar tabla y contadores
    updateUserTable();
    updateCounters();
    
    // Limpiar formulario
    document.getElementById('userForm').reset();
    
    alert('✅ Usuario agregado correctamente');
});

// Actualizar tabla de usuarios
function updateUserTable() {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${user.id}</strong></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role}">${getRoleName(user.role)}</span></td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="editUser(${user.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Obtener nombre del rol
function getRoleName(role) {
    switch(role) {
        case 'admin': return 'Administrador';
        case 'editor': return 'Editor';
        case 'customer': return 'Cliente';
        default: return 'Sin rol';
    }
}

// Editar usuario
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userPassword').value = '';
        document.getElementById('userConfirmPassword').value = '';
        
        // Cambiar botón a actualizar
        const submitButton = document.querySelector('#userForm button[type="submit"]');
        submitButton.innerHTML = '<i class="bi bi-check-circle"></i> Actualizar Usuario';
        submitButton.classList.remove('btn-success');
        submitButton.classList.add('btn-warning');
        
        // Cambiar evento del formulario
        const originalHandler = document.getElementById('userForm').onsubmit;
        document.getElementById('userForm').onsubmit = function(e) {
            e.preventDefault();
            
            const userPassword = document.getElementById('userPassword').value;
            const userConfirmPassword = document.getElementById('userConfirmPassword').value;
            
            if (userPassword && userPassword.length < 8) {
                alert('❌ La contraseña debe tener al menos 8 caracteres');
                return;
            }
            
            if (userPassword !== userConfirmPassword) {
                alert('❌ Las contraseñas no coinciden');
                return;
            }
            
            user.name = document.getElementById('userName').value;
            user.email = document.getElementById('userEmail').value;
            user.role = document.getElementById('userRole').value;
            user.updatedAt = new Date().toISOString();
            
            updateUserTable();
            document.getElementById('userForm').reset();
            
            // Restaurar botón original
            submitButton.innerHTML = '<i class="bi bi-person-plus"></i> Agregar Usuario';
            submitButton.classList.remove('btn-warning');
            submitButton.classList.add('btn-success');
            
            // Restaurar evento original
            document.getElementById('userForm').onsubmit = originalHandler;
            
            alert('✅ Usuario actualizado correctamente');
        };
    }
}

// Eliminar usuario
function deleteUser(id) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        users = users.filter(u => u.id !== id);
        updateUserTable();
        updateCounters();
        alert('✅ Usuario eliminado correctamente');
    }
}

// Cargar datos de ejemplo con precios en Bolivianos
function loadSampleData() {
    if (products.length === 0) {
        products = [
            {
                id: 1,
                name: "NIKE Air Max 270",
                price: 750, // Precio en Bolivianos
                category: "men",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Zapatillas deportivas con tecnología Air",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Adidas Ultraboost", 
                price: 680, // Precio en Bolivianos
                category: "men",
                image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Máxima comodidad para corredores",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: "Nike Air Force 1",
                price: 620, // Precio en Bolivianos
                category: "women",
                image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Clásico atemporal",
                createdAt: new Date().toISOString()
            }
        ];
        productIdCounter = 4;
    }
    
    if (users.length === 0) {
        users = [
            {
                id: 1,
                name: "Administrador Principal",
                email: "admin@zapatillasbolivia.com",
                role: "admin",
                createdAt: new Date().toISOString()
            }
        ];
        userIdCounter = 2;
    }
    
    updateProductTable();
    updateUserTable();
    updateCounters();
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupNavigation();
    loadSampleData();
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
});