let menuData = [
  { title: 'Calidad', icon: '🧪', roles: ['calidad;fabrica;produccion;20produccion;'], submenu: [
    { title: 'Trazabilidad', icon: '🔗', view: 'trazabilidad-ordenes-fabricacion', roles: ['calidad;fabrica;produccion;20produccion;'] },
    { title: 'Bloqueos', icon: '🔒', view: 'stock-bloqueado-situacion-calidad', roles: ['calidad;produccion;'] },
    { title: 'Consulta Pal.', icon: '🔎', view: 'consulta-caracteristicas-lote', roles: ['calidad;fabrica;produccion;20produccion;'] },
    { title: 'Evaluación Proveedores', icon: '⭐', view: 'calidad-evaluacion-proveedor', roles: ['calidad;'] },
  ]},
  { title: 'Finanzas', icon: '💰', roles: ['finanzas;20finanzas;20compras;ventas;ventas20;'], submenu: [
    { title: 'Expedientes', icon: '💵', submenu: null, view: 'expedientes-albaranes-facturas', roles: ['finanzas'] },
    { title: 'Alb.98 Facturas', icon: '🆚', submenu: null , view: 'finanzas-albaran-vs-factura', roles: ['finanzas'] },
    { title: 'Llegadas Pendientes', icon: '🚢', submenu: null , view: 'finanzas-llegadas-contenedores', roles: ['finanzas;20finanzas;20compras;ventas;ventas20;'] },
  ]},
  { title: 'Producción', icon: '🏭', roles: ['produccion;finanzas;20produccion;'], submenu: [
    { title: 'Costes Art.', icon: '🧮', submenu: null , view: 'proyeccion-costes-con-contenedor', roles: ['produccion']},
    { title: 'Equiv. C/C',  icon: '♻️', submenu: null , view: 'equivalentes-con-contenedor', roles: ['produccion']},
    { title: 'Entradas',    icon: '🚢', submenu: null , view: 'entradas-con-sin-contenedor-calculo-precio-stock', roles: ['produccion']},
    { title: 'Comparación Costes OFs',  icon: '💰', submenu: null , view: 'produccion-comparacion-costes-contabilidad', roles: ['produccion;finanzas;20produccion;']},
  ]},
  { title: 'Logística', icon: '🚚', roles: ['logistica;finanzas;'], submenu: [
    { title: 'Cargas Nacional', icon: '🗺️', submenu: null , view: 'logistica-listado-cargas', roles: ['logistica'] },
    { title: 'Cargas Regional', icon: '🗺️', submenu: null , view: 'logistica-listado-cargas-regional', roles: ['logistica'] },
    { title: 'Comparación Alm.98', icon: '🆚', submenu: null , view: 'almacen-importacion-vs-resto', roles: ['logistica;finanzas;'] },
  ]},
  { title: 'Compras', icon: '🛍️', roles: ['compras;calidad;produccion;20compras;ventas;ventas20;'], submenu: [
    { title: 'Llegadas Pendientes', icon: '🚢', submenu: null , view: 'compras-llegadas-contenedores', roles: ['compras;'] },
    { title: 'Stock', icon: '📦', submenu: null , view: 'compras-stock', roles: ['compras;calidad;produccion;20compras;ventas;ventas20;'] },
  ]},
  { title: 'Power Bi', icon: '🟡', roles: ['powerbi0;'], submenu: [
     { title: 'General', icon: '', roles: ['powerbi1;powerbi2;powerbi3;'], submenu: [
        { title: 'Consumo Producción', icon: '📈', submenu: null , view: 'power-bi?name=rotativo-salida-elaboracion', roles: ['powerbi1'] },
        { title: 'Inventario', icon: '🏷️', submenu: null , view: 'power-bi?name=inventario', roles: ['powerbi2'] },
        { title: 'Proyección Coste', icon: '📅', submenu: null , view: 'power-bi?name=prevision-entradas', roles: ['powerbi3'] },
     ]},
     { title: 'Comercial nacional', icon: '', roles: ['ventas;ventas20;'], submenu: [
        { title: 'Global Libra', icon: '', submenu: null , view: 'power-bi?name=global-fuente-datos-libra-edisa', roles: ['ventas;ventas20;'] },
        { title: 'Listado ventas', icon: '', submenu: null , view: 'power-bi?name=listado-ventas-por-cliente', roles: ['ventas;ventas20;'] },
        { title: 'Previsión entradas', icon: '', submenu: null , view: 'power-bi?name=prevision-de-entradas', roles: ['ventas;ventas20;'] },
        { title: 'Plazos de cobro', icon: '', submenu: null , view: 'power-bi?name=plazo-de-cobro', roles: ['ventas;ventas20;'] },
        { title: 'Inventario', icon: '', submenu: null , view: 'power-bi?name=ventas-inventario', roles: ['ventas;ventas20;'] },
        { title: 'Compraración importes', icon: '', submenu: null , view: 'power-bi?name=compraracion-de-importes', roles: ['ventas;ventas20;'] },
     ]},
  ]},
];