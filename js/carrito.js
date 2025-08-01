// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const panelCarrito = document.getElementById('panel-carrito');
const overlay = document.getElementById('overlay');
const abrirCarritoBtn = document.getElementById('abrir-carrito');
const cerrarCarritoBtn = document.getElementById('cerrar-carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const finalizarCompraBtn = document.getElementById('finalizar-compra');
const carritoIcon = document.querySelector('.carrito');

// Inicializar eventos
function initEventListeners() {
  // Botones de agregar al carrito
  document.querySelectorAll('.agregar-carrito').forEach(btn => {
    btn.addEventListener('click', agregarAlCarrito);
  });
  
  // Abrir carrito
  abrirCarritoBtn.addEventListener('click', () => {
    panelCarrito.classList.add('visible');
    overlay.classList.add('visible');
  });
  
  // Cerrar carrito
  cerrarCarritoBtn.addEventListener('click', cerrarCarrito);
  overlay.addEventListener('click', cerrarCarrito);
  
  // Vaciar carrito
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
  
  // Finalizar compra
  finalizarCompraBtn.addEventListener('click', finalizarCompra);
  
  // Cerrar carrito al hacer scroll
  window.addEventListener('scroll', cerrarCarrito);
  
  // Cerrar carrito al hacer clic en enlaces del menú
  document.querySelectorAll('nav a').forEach(enlace => {
    enlace.addEventListener('click', cerrarCarrito);
  });
  
  // Botón para subir al inicio
  const btnSubir = document.querySelector('.btn-subir');
  window.addEventListener('scroll', () => {
    btnSubir.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });
  
  btnSubir.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Funciones del carrito
function agregarAlCarrito(e) {
  const btn = e.target;
  const card = btn.closest('.card');
  const id = btn.dataset.id;
  const nombre = card.querySelector('h3').textContent;
  const precio = parseInt(card.querySelector('.precio').textContent.replace('$', ''));
  const img = card.querySelector('img').src;
  
  if (carrito[id]) {
    carrito[id].cantidad++;
  } else {
    carrito[id] = { nombre, precio, cantidad: 1, img };
  }
  
  guardarCarrito();
  renderizarCarrito();
  
  // Animación del icono del carrito
  carritoIcon.classList.add('animado');
  setTimeout(() => {
    carritoIcon.classList.remove('animado');
  }, 400);
  
  // Notificación visual
  const notification = document.createElement('div');
  notification.textContent = '¡Producto añadido!';
  notification.style.position = 'fixed';
  notification.style.top = '100px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#4CAF50';
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '3000';
  notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2s forwards';
  
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2300);
}

function renderizarCarrito() {
  listaCarrito.innerHTML = '';
  let total = 0;
  let cantidadTotal = 0;
  
  if (Object.keys(carrito).length === 0) {
    listaCarrito.innerHTML = '<div class="carrito-vacio">Tu carrito está vacío</div>';
    vaciarCarritoBtn.style.display = 'none';
  } else {
    vaciarCarritoBtn.style.display = 'block';
    
    Object.entries(carrito).forEach(([id, producto]) => {
      const subtotal = producto.precio * producto.cantidad;
      total += subtotal;
      cantidadTotal += producto.cantidad;
      
      const item = document.createElement('div');
      item.classList.add('item-carrito');
      item.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}">
        <div class="detalles-item">
          <h4>${producto.nombre}</h4>
          <div class="contador-precio">
            <div class="cantidad">
              <button class="restar" data-id="${id}">−</button>
              <span>${producto.cantidad}</span>
              <button class="sumar" data-id="${id}">+</button>
            </div>
            <p class="precio-item">$${subtotal}</p>
          </div>
        </div>
        <button class="eliminar-item" data-id="${id}">❌</button>
      `;
      
      listaCarrito.appendChild(item);
    });
    
    // Añadir eventos a los botones de cantidad
    listaCarrito.querySelectorAll('.restar').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (carrito[id].cantidad > 1) {
          carrito[id].cantidad--;
        } else {
          delete carrito[id];
        }
        guardarCarrito();
        renderizarCarrito();
      });
    });
    
    listaCarrito.querySelectorAll('.sumar').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        carrito[id].cantidad++;
        guardarCarrito();
        renderizarCarrito();
      });
    });
    
    listaCarrito.querySelectorAll('.eliminar-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        delete carrito[id];
        guardarCarrito();
        renderizarCarrito();
      });
    });
  }
  
  totalCarrito.textContent = total;
  contadorCarrito.textContent = cantidadTotal;
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cerrarCarrito() {
  panelCarrito.classList.remove('visible');
  overlay.classList.remove('visible');
}

function vaciarCarrito() {
  if (Object.keys(carrito).length === 0) return;
  
  if (confirm('¿Estás seguro que deseas vaciar todo el carrito?')) {
    carrito = {};
    guardarCarrito();
    renderizarCarrito();
  }
}

function finalizarCompra() {
  if (Object.keys(carrito).length === 0) {
    alert('Tu carrito está vacío. Agrega algunos productos antes de finalizar la compra.');
    return;
  }
  
  alert('¡Compra finalizada con éxito! Gracias por tu pedido. 🎉');
  carrito = {};
  guardarCarrito();
  renderizarCarrito();
  cerrarCarrito();
}

// slider de reseñas aca mepieza
function initSlider() {
  const slider = document.querySelector('.grid-reseñas');
  const cards = document.querySelectorAll('.reseña-card');
  const indicadoresContainer = document.createElement('div');
  indicadoresContainer.className = 'slider-indicadores';
  
  // Crea indicadores
  cards.forEach((_, index) => {
    const indicador = document.createElement('div');
    indicador.className = 'slider-indicador' + (index === 0 ? ' activo' : '');
    indicador.addEventListener('click', () => {
      slider.scrollTo({
        left: slider.offsetWidth * index,
        behavior: 'smooth'
      });
    });
    indicadoresContainer.appendChild(indicador);
  });
  
  slider.parentNode.insertBefore(indicadoresContainer, slider.nextSibling);

  // Actualiza indicadores al hacer scroll
  slider.addEventListener('scroll', () => {
    const activeIndex = Math.round(slider.scrollLeft / slider.offsetWidth);
    document.querySelectorAll('.slider-indicador').forEach((ind, idx) => {
      ind.classList.toggle('activo', idx === activeIndex);
    });
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initSlider);
// Sliders finaliza arriba

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  renderizarCarrito();
  
  // Animaciones para las tarjetas
  const cards = document.querySelectorAll('.card, .reseña-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
});