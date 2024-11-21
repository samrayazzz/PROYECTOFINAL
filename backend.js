// **Cargar productos dinámicamente** (Página principal)
function cargarProductos() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(productos => {
            const productList = document.querySelector('.product-list');
            productList.innerHTML = '';  // Limpiar la lista actual de productos

            productos.forEach(producto => {
                const productoElement = document.createElement('div');
                productoElement.classList.add('product');
                productoElement.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <div class="price">${producto.precio}</div>
                    <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                `;
                productList.appendChild(productoElement);
            });
        })
        .catch(error => mostrarMensajeError("Error al cargar productos: " + error));
}

// **Mostrar detalles del producto** (Detalles del producto)
function mostrarDetallesProducto(id) {
    fetch(`/api/productos/${id}`)
        .then(response => response.json())
        .then(producto => {
            document.querySelector('.producto-detalle .nombre').textContent = producto.nombre;
            document.querySelector('.producto-detalle .descripcion').textContent = producto.descripcion;
            document.querySelector('.producto-detalle .precio').textContent = producto.precio;
            document.querySelector('.producto-detalle img').src = producto.imagen;
        })
        .catch(error => mostrarMensajeError("Error al cargar el producto: " + error));
}

// **Filtrar productos por búsqueda** (Búsqueda de productos)
function buscarProductos() {
    const query = document.getElementById('busqueda').value.toLowerCase();
    
    fetch(`/api/productos`)
        .then(response => response.json())
        .then(productos => {
            const filteredProducts = productos.filter(producto => 
                producto.nombre.toLowerCase().includes(query)
            );
            mostrarProductos(filteredProducts);
        })
        .catch(error => mostrarMensajeError("Error al buscar productos: " + error));
}

// **Mostrar productos filtrados por búsqueda** 
function mostrarProductos(productos) {
    const productList = document.querySelector('.product-list');
    productList.innerHTML = '';

    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('product');
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <div class="price">${producto.precio}</div>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        productList.appendChild(productoElement);
    });
}

// **Paginación de productos** (Página principal)
let paginaActual = 1;
const productosPorPagina = 10;

function cargarProductosPagina() {
    fetch(`/api/productos?page=${paginaActual}&limit=${productosPorPagina}`)
        .then(response => response.json())
        .then(productos => {
            mostrarProductos(productos);
        })
        .catch(error => mostrarMensajeError("Error al cargar productos: " + error));
}

document.getElementById('siguiente').addEventListener('click', () => {
    paginaActual++;
    cargarProductosPagina();
});

document.getElementById('anterior').addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        cargarProductosPagina();
    }
});

// **Agregar al carrito** (Carrito de compras)
let carrito = [];

function agregarAlCarrito(id) {
    fetch(`/api/productos/${id}`)
        .then(response => response.json())
        .then(producto => {
            carrito.push(producto);
            actualizarCarrito();
        })
        .catch(error => mostrarMensajeError("Error al agregar al carrito: " + error));
}

function actualizarCarrito() {
    const carritoElement = document.querySelector('.carrito-lista');
    carritoElement.innerHTML = '';
    carrito.forEach(producto => {
        const carritoItem = document.createElement('div');
        carritoItem.classList.add('carrito-item');
        carritoItem.innerHTML = `
            <p>${producto.nombre}</p>
            <span>${producto.precio}</span>
            <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
        `;
        carritoElement.appendChild(carritoItem);
    });
    actualizarTotal();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    actualizarCarrito();
}

function actualizarTotal() {
    const total = carrito.reduce((total, producto) => total + parseFloat(producto.precio.replace('$', '')), 0);
    document.querySelector('.total-carrito').textContent = `Total: $${total.toFixed(2)}`;
}

document.getElementById('vaciar-carrito').addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
});

// **Inicio de sesión** (Login)
function iniciarSesion(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const datos = {
        email,
        password
    };

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            mostrarMensajeExito('Iniciado sesión correctamente');
            window.location.href = '/';
        } else {
            mostrarMensajeError('Error en el inicio de sesión');
        }
    })
    .catch(error => mostrarMensajeError("Error al iniciar sesión: " + error));
}

document.querySelector('.login-section form').addEventListener('submit', iniciarSesion);

// **Registro de usuario** (Form de registro)
function registrarUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email-registro').value;
    const password = document.getElementById('password-registro').value;

    const datos = {
        nombre,
        email,
        password
    };

    fetch('/api/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            mostrarMensajeExito('Usuario registrado correctamente');
            window.location.href = '/login';
        } else {
            mostrarMensajeError('Error al registrar usuario');
        }
    })
    .catch(error => mostrarMensajeError("Error al registrar usuario: " + error));
}

document.querySelector('.registro-section form').addEventListener('submit', registrarUsuario);

// **Mostrar mensajes de éxito**
function mostrarMensajeExito(mensaje) {
    const mensajeElement = document.getElementById('mensaje');
    mensajeElement.textContent = mensaje;
    mensajeElement.style.color = 'green';
    mensajeElement.style.display = 'block';
}

// **Mostrar mensajes de error**
function mostrarMensajeError(mensaje) {
    const mensajeElement = document.getElementById('mensaje');
    mensajeElement.textContent = mensaje;
    mensajeElement.style.color = 'red';
    mensajeElement.style.display = 'block';
}

// **Carga de productos al cargar la página** (Página principal)
window.addEventListener('DOMContentLoaded', cargarProductos);

// **Mostrar detalles de producto al cargar la página**
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');  // Obtener el ID del producto desde la URL
    if (productoId) {
        mostrarDetallesProducto(productoId);
    }
});
