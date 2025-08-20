// File: assets/js/0.menu.js
// Descripción: Script de menú dinámico + guarda estado abierto/cerrado en localStorage


let menuData = [
    { title: 'Calidad', icon: '🧪', roles: ['calidad'], submenu: [
            { title: 'Informes', icon: '📋', submenu: [
                    { title: 'Trazabilidad', icon: '🔗', view: 'trazabilidad-ordenes-fabricacion' },
                    { title: 'Bloqueos', icon: '🔒', view: 'stock-bloqueado-situacion-calidad' },
                ]
            }
        ]
    },
    { title: 'Finanzas', icon: '💰', roles: ['finanzas'], submenu: [
            { title: 'Informes', icon: '📋', submenu: [
                { title: 'Expedientes', icon: '💵', submenu: null, view: 'expedientes-albaranes-facturas' },
            ]},
        ]
    },
    { title: 'Producción', icon: ':🏭', roles: ['produccion'], submenu: [
            { title: 'Informes', icon: '📋', submenu: [
                { title: 'Costes art.', icon: '🧮', submenu: null , view: 'proyeccion-costes-con-contenedor'},
                { title: 'Equiv. C/C', icon: '♻️', submenu: null , view: 'equivalentes-con-contenedor'},
                { title: 'Entradas', icon: '🚢', submenu: null , view: 'entradas-con-sin-contenedor-calculo-precio-stock'},
            ]},
        ]
    },
    { title: 'Logística', icon: '🚚', roles: ['logistica'], submenu: [
            { title: 'Informes', icon: '📋', submenu: [
                { title: 'Cargas', icon: '🗺️', submenu: null , view: 'logistica-listado-cargas'},
            ]},
        ]
    },
    { title: 'Compras', icon: '🛍️', roles: ['compras'], submenu: [
            { title: 'Informes', icon: '📋', submenu: [
                { title: 'Llegadas pendientes', icon:  '🚢', submenu: null , view: 'compras-llegadas-contenedores'},
            ]},
        ]
    }
];

// Variables

let currentUserRoles = window.localStorage.role.split(';').filter(r => r);
let openMenus = {}; // se carga después

// Utils
function slugify(text) {
    return text.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

function hasAccess(roles) {
    if (!roles || roles.length === 0) return true;
    if (currentUserRoles.includes('*')) return true;
    return currentUserRoles.some(role => roles.includes(role));
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

// Toggle submenu
function toggleSubmenu(id) {
    if (!openMenus[id]) {
        openMenus[id] = true;
    } else {
        delete openMenus[id];
    }
    saveOpenMenus();
    renderMenu(); // Redibujar el menú
}

// ⚡ Generador recursivo de submenús
function generateSubmenu(items, parentId = '', parentAccess = true) {
    let html = '';
    items.forEach(item => {
        const submenuId = `${parentId}-${slugify(item.title)}`;
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const view = item.view;

        let access = parentAccess;
        if (parentId === 'menu') { access = hasAccess(item.roles); }
        if (!access) return;

        const isOpen = openMenus.hasOwnProperty(submenuId);

        if (hasSubmenu) {
            html += `
                <div>
                    <button onclick="toggleSubmenu('${submenuId}')" 
                        class="flex justify-between w-full items-center px-2 py-2 hover:bg-gray-100 rounded-md">
                        <span class="flex items-center gap-2">
                            <span class="text-indigo-500">${item.icon}</span>
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
            html += `
                <a href="#${view}" 
                   class="block py-1 px-2 hover:bg-gray-100 rounded-md ml-6 flex items-center gap-2">
                    <span class="text-indigo-500">${item.icon}</span>
                    <span class="text-black">${item.title}</span>
                </a>`;
        }
    });
    return html;
}

// <a href="#${view}"  onclick="loadView('${view}')"

// 🚀 Renderizar menú
function renderMenu() {
    const html = generateSubmenu(menuData, 'menu');
    document.getElementById('menuContainer').innerHTML = html;
}

// 📦 Iniciar
document.addEventListener('DOMContentLoaded', () => {
    openMenus = loadOpenMenus();
    renderMenu();
});
