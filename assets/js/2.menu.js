// File: assets/js/0.menu.js
// Descripción: Script de menú dinámico + guarda estado abierto/cerrado en localStorage

let menuData = [
    /*
    {
        title: 'Administración',
        icon: '📁',
        roles: ['admin', 'gerente'],
        submenu: [
            { title: 'Gestión Usuarios', icon: '👥', submenu: [
                { title: 'Crear Usuario', icon: '➕', submenu: null, view: 'crear-usuario' },
                { title: 'Lista de Usuarios', icon: '📃', submenu: null, view: 'lista-usuarios' }
            ]},
            { title: 'Informes Generales', icon: '📈', submenu: [
                { title: 'Resumen Mensual', icon: '🗓️', submenu: null }
            ]}
        ]
    },
    {
        title: 'Calidad',
        icon: '✅',
        roles: ['calidad'],
        submenu: [
            { title: 'Reportes Calidad', icon: '📑', submenu: null },
            { title: 'Verificación', icon: '✔️', submenu: [
                { title: 'Muestras Aleatorias', icon: '🎯', submenu: null }
            ]}
        ]
    },
    {
        title: 'Compras',
        icon: '👒',
        roles: ['compras'],
        submenu: [
            { title: 'Nueva Orden', icon: '📝', submenu: null },
            { title: 'Proveedores', icon: '🏷️', submenu: [
                { title: 'Alta Proveedor', icon: '➕', submenu: null },
                { title: 'Lista Proveedores', icon: '📃', submenu: null }
            ]}
        ]
    },
    {
        title: 'Finanzas',
        icon: '💰',
        roles: ['finanzas'],
        submenu: [
            { title: 'Pagos', icon: '💳', submenu: [
                { title: 'Cuentas a Cobrar', icon: '📥', submenu: null },
                { title: 'Cuentas a Pagar', icon: '📤', submenu: null }
            ]},
            { title: 'Resumen Financiero', icon: '📊', submenu: null }
        ]
    },
    {
        title: 'Laboratorio',
        icon: '🔬',
        roles: ['laboratorio'],
        submenu: [
            { title: 'Análisis', icon: '🧪', submenu: [
                { title: 'Microbiología', icon: '🦠', submenu: null },
                { title: 'Química', icon: '⚗️', submenu: null }
            ]},
            { title: 'Informes', icon: '📋', submenu: null }
        ]
    },
    {
        title: 'Logística',
        icon: '🚚',
        roles: ['logistica'],
        submenu: [
            { title: 'Ruta', icon: '🗘️', submenu: null }
        ]
    }, */
    { title: 'Producción', icon: '🏭', roles: ['salaproduccion'], submenu: [
            { title: 'Fabrica', icon: '📦', submenu: [
                    { title: 'Órdenes Fabricación', icon: '🥫' },
                ]
            },
            { title: 'Precios', icon: '💲', submenu: [
                    { title: 'Proyección', icon: '📈', submenu: null },
                    { title: 'Artículos', icon: '🛒', submenu: null },
                ]
            }
        ]
    } 
    /*
    {
        title: 'Taller',
        icon: '🚰',
        roles: ['taller'],
        submenu: [
            { title: 'Control Equipos', icon: '🔍', submenu: null },
            { title: 'Mantenimiento', icon: '🔧', submenu: null }
        ]
    },
    {
        title: 'Ventas',
        icon: '💼',
        roles: ['ventas'],
        submenu: [
            { title: 'Historial Ventas', icon: '📜', submenu: null },
            { title: 'Nueva Venta', icon: '➕', submenu: [
                    { title: 'Cliente Existente', icon: '👤', submenu: null },
                    { title: 'Cliente Nuevo', icon: '🆕', submenu: null }
                ]
            }
        ]
    }
    */
];

// Variables
let rolesDB = "gerente;ventas;laboratorio;salaproduccion";
let currentUserRoles = rolesDB.split(';').filter(r => r);
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
    if (currentUserRoles.includes('admin') || currentUserRoles.includes('gerente')) return true;
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
        const view = item.view || slugify(item.title);

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
                <a href="#${view}" onclick="loadView('${view}')" 
                   class="block py-1 px-2 hover:bg-gray-100 rounded-md ml-6 flex items-center gap-2">
                    <span class="text-indigo-500">${item.icon}</span>
                    <span class="text-black">${item.title}</span>
                </a>`;
        }
    });
    return html;
}

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
