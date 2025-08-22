// File: assets/js/0.menu.js
// Descripción: Menú dinámico con control de roles a cualquier nivel
// + persistencia de estado abierto/cerrado en localStorage

let menuData = [
  { title: 'Calidad', icon: '🧪', roles: ['calidad;fabrica;'], submenu: [
      { title: 'Informes', icon: '📋', submenu: [
          { title: 'Trazabilidad', icon: '🔗', view: 'trazabilidad-ordenes-fabricacion', roles: ['calidad;fabrica;'] },
          { title: 'Bloqueos', icon: '🔒', view: 'stock-bloqueado-situacion-calidad', roles: ['calidad;'] },
          { title: 'Consulta pal.', icon: '🔎', view: 'consulta-caracteristicas-lote', roles: ['calidad;fabrica;'] },
      ] }
  ] },
  { title: 'Finanzas', icon: '💰', roles: ['finanzas'], submenu: [
      { title: 'Informes', icon: '📋', submenu: [
        { title: 'Expedientes', icon: '💵', submenu: null, view: 'expedientes-albaranes-facturas', roles: ['finanzas'] },
      ]},
  ]},
  { title: 'Producción', icon: '🏭', roles: ['produccion'], submenu: [
      { title: 'Informes', icon: '📋', submenu: [
        { title: 'Costes art.', icon: '🧮', submenu: null , view: 'proyeccion-costes-con-contenedor', roles: ['produccion']},
        { title: 'Equiv. C/C',  icon: '♻️', submenu: null , view: 'equivalentes-con-contenedor', roles: ['produccion']},
        { title: 'Entradas',    icon: '🚢', submenu: null , view: 'entradas-con-sin-contenedor-calculo-precio-stock', roles: ['produccion']},
      ]},
  ]},
  { title: 'Logística', icon: '🚚', roles: ['logistica'], submenu: [
      { title: 'Informes', icon: '📋', submenu: [
        { title: 'Cargas', icon: '🗺️', submenu: null , view: 'logistica-listado-cargas', roles: ['logistica'] },
      ]},
  ]},
  { title: 'Compras', icon: '🛍️', roles: ['compras'], submenu: [
      { title: 'Informes', icon: '📋', submenu: [
        { title: 'Llegadas pendientes', icon: '🚢', submenu: null , view: 'compras-llegadas-contenedores', roles: ['compras'] },
      ]}
  ]},
  { title: 'Power Bi', icon: '🟡', roles: ['powerbi0;'], submenu: [
     { title: 'Principal', icon: '📋', submenu: [
        { title: 'Consumo producción', icon: '📈', submenu: null , view: 'power-bi?name=rotativo-salida-elaboracion', roles: ['powerbi0'] },
        { title: 'Inventario', icon: '🏷️', submenu: null , view: 'power-bi?name=inventario', roles: ['powerbi0'] },
        { title: 'Prevision entradas', icon: '📅', submenu: null , view: 'power-bi?name=prevision-entradas', roles: ['powerbi0'] },
     ]},
  ]},
];

// =====================
// Variables
// =====================
let currentUserRoles = ((window.localStorage.role || '')
  .split(';')
  .map(r => r.trim())
  .filter(Boolean));

let openMenus = {}; // se carga después

// =====================
// Utils
// =====================
function slugify(text) {
  return (text || '').toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Normaliza roles: soporta arrays, null y strings con roles separados por ';'
function normalizeRoles(roles) {
  if (!roles) return [];
  const arr = Array.isArray(roles) ? roles : [roles];
  const flat = arr.flatMap(r =>
    String(r).split(';').map(x => x.trim()).filter(Boolean)
  );
  return [...new Set(flat)]; // únicos
}

function hasAccess(roles) {
  const required = normalizeRoles(roles);
  if (required.length === 0) return true;       // sin restricción
  if (currentUserRoles.includes('*')) return true; // superusuario
  return currentUserRoles.some(r => required.includes(r));
}

function loadOpenMenus() {
  try {
    return JSON.parse(localStorage.getItem('openMenus')) || {};
  } catch {
    return {};
  }
}

function saveOpenMenus() {
  localStorage.setItem('openMenus', JSON.stringify(openMenus));
}

// =====================
// Toggle submenu
// =====================
function toggleSubmenu(id) {
  if (!openMenus[id]) {
    openMenus[id] = true;
  } else {
    delete openMenus[id];
  }
  saveOpenMenus();
  renderMenu(); // Redibujar el menú
}

// =====================
// Generador recursivo
// =====================
function generateSubmenu(items, parentId = '', parentAccess = true) {
  let html = '';
  items.forEach(item => {
    const submenuId = `${parentId}-${slugify(item.title)}`;
    const hasSubmenu = Array.isArray(item.submenu) && item.submenu.length > 0;
    const view = item.view;

    // Acceso = lo que heredas del padre Y lo que exige el propio item (si lo indica)
    const access = parentAccess && hasAccess(item.roles);
    if (!access) return;

    const isOpen = openMenus.hasOwnProperty(submenuId);

    if (hasSubmenu) {
      html += `
        <div>
          <button onclick="toggleSubmenu('${submenuId}')"
                  class="flex justify-between w-full items-center px-2 py-2 hover:bg-gray-100 rounded-md">
            <span class="flex items-center gap-2">
              <span class="text-indigo-500">${item.icon || ''}</span>
              <span class="text-black">${item.title}</span>
            </span>
            <span class="text-gray-400 text-[8px]" data-icon-for="${submenuId}">
              ${isOpen ? '▲' : '▼'}
            </span>
          </button>
          <div id="${submenuId}" class="ml-4 mt-1 ${isOpen ? '' : 'hidden'} space-y-1">
            ${generateSubmenu(item.submenu, submenuId, access)}
          </div>
        </div>`;
    } else {
      // Elemento hoja
      html += `
        <a href="#${view || ''}"
           class="block py-1 px-2 hover:bg-gray-100 rounded-md ml-6 flex items-center gap-2"
           data-view="${view || ''}">
          <span class="text-indigo-500">${item.icon || ''}</span>
          <span class="text-black">${item.title}</span>
        </a>`;
    }
  });
  return html;
}

// =====================
// Renderizar menú
// =====================
function renderMenu() {
  const html = generateSubmenu(menuData, 'menu');
  const el = document.getElementById('menuContainer');
  if (el) el.innerHTML = html;
}

// =====================
// Iniciar
// =====================
document.addEventListener('DOMContentLoaded', () => {
  openMenus = loadOpenMenus();
  renderMenu();
});
