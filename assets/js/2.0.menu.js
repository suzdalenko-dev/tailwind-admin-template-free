let menuData = [
  { title: 'Calidad', icon: '🧪', roles: ['calidad;fabrica;produccion;20produccion;'], submenu: [
    { title: 'Trazabilidad', icon: '🔗', view: 'trazabilidad-ordenes-fabricacion', roles: ['calidad;fabrica;produccion;20produccion;'] },
    { title: 'Bloqueos', icon: '🔒', view: 'stock-bloqueado-situacion-calidad', roles: ['calidad;produccion;'] },
    { title: 'Consulta Pal.', icon: '🔎', view: 'consulta-caracteristicas-lote', roles: ['calidad;fabrica;produccion;20produccion;'] },
    { title: 'Evaluación Proveedores', icon: '⭐', view: 'calidad-evaluacion-proveedor', roles: ['calidad;'] },
  ]},
  { title: 'Finanzas', icon: '💰', roles: ['finanzas;20finanzas;20compras;ventas;ventas20;ventas30;'], submenu: [
    { title: 'Expedientes', icon: '💵', submenu: null, view: 'expedientes-albaranes-facturas', roles: ['finanzas'] },
    { title: 'Alb.98 Facturas', icon: '🆚', submenu: null , view: 'finanzas-albaran-vs-factura', roles: ['finanzas'] },
    { title: 'Llegadas Pendientes', icon: '🚢', submenu: null , view: 'finanzas-llegadas-contenedores', roles: ['finanzas;20finanzas;20compras;ventas;ventas20;ventas30;'] },
  ]},
  { title: 'Producción', icon: '🏭', roles: ['produccion;finanzas;20produccion;compras;20compras;'], submenu: [
    { title: 'Costes Art.', icon: '🧮', submenu: null , view: 'proyeccion-costes-con-contenedor', roles: ['produccion']},
    { title: 'Equiv. C/C',  icon: '♻️', submenu: null , view: 'equivalentes-con-contenedor', roles: ['produccion']},
    { title: 'Entradas',    icon: '🚢', submenu: null , view: 'entradas-con-sin-contenedor-calculo-precio-stock', roles: ['produccion']},
    { title: 'Comparación Costes OFs',  icon: '💰', submenu: null , view: 'produccion-comparacion-costes-contabilidad', roles: ['produccion;finanzas;']},
    { title: 'Roturas Stock',  icon: '🛎️', submenu: null , view: 'produccion-aviso-roturas-stock', roles: ['produccion;20produccion;compras;20compras;']},
  ]},
  { title: 'Logística', icon: '🚚', roles: ['logistica;finanzas;'], submenu: [
    { title: 'Cargas Nacional', icon: '🗺️', submenu: null , view: 'logistica-listado-cargas', roles: ['logistica'] },
    { title: 'Cargas Regional', icon: '🗺️', submenu: null , view: 'logistica-listado-cargas-regional', roles: ['logistica'] },
    { title: 'Comparación Alm.98', icon: '🆚', submenu: null , view: 'almacen-importacion-vs-resto', roles: ['logistica;finanzas;'] },
    { title: 'Hoja de Contenedor', icon: '🧾', submenu: null , view: 'logistica-hoja-contenedor', roles: ['logistica;'] },
  ]},
  { title: 'Compras', icon: '🛍️', roles: ['compras;calidad;produccion;20compras;ventas;ventas20;ventas30;'], submenu: [
    { title: 'Llegadas Pendientes', icon: '🚢', submenu: null , view: 'compras-llegadas-contenedores', roles: ['compras;'] },
    { title: 'Stock', icon: '📦', submenu: null , view: 'compras-stock', roles: ['compras;calidad;produccion;20compras;ventas;ventas20;ventas30;'] },
  ]},
  { title: 'Power Bi', icon: '🟡', roles: ['produccion;compras;'], submenu: [
     { title: 'Compras', icon: '', roles: ['compras;'], submenu: [                                             // powerbi1;powerbi2;powerbi3
        { title: 'Consumo Producción', icon: '', submenu: null , view: 'power-bi?name=rotativo-salida-elaboracion', roles: ['compras;'] },
        { title: 'Inventario', icon: '', submenu: null , view: 'power-bi?name=inventario', roles: ['compras;'] },
        { title: 'Proyección Coste', icon: '', submenu: null , view: 'power-bi?name=prevision-entradas', roles: ['compras;'] },
     ]},
     { title: 'Comercial nacional', icon: '', roles: ['ventas;ventas20;'], submenu: [
        { title: 'Global Libra', icon: '', submenu: null , view: 'power-bi?name=global-fuente-datos-libra-edisa', roles: ['ventas;ventas20;'] },
        { title: 'Listado ventas', icon: '', submenu: null , view: 'power-bi?name=listado-ventas-por-cliente', roles: ['ventas;ventas20;'] },
        { title: 'Previsión entradas', icon: '', submenu: null , view: 'power-bi?name=prevision-de-entradas', roles: ['ventas;ventas20;'] },
        { title: 'Plazos de cobro', icon: '', submenu: null , view: 'power-bi?name=plazo-de-cobro', roles: ['ventas;ventas20;'] },
        { title: 'Inventario', icon: '', submenu: null , view: 'power-bi?name=ventas-inventario', roles: ['ventas;ventas20;'] },
        { title: 'Compraración importes', icon: '', submenu: null , view: 'power-bi?name=compraracion-de-importes', roles: ['ventas;ventas20;'] },
     ]},
     { title: 'Informes', icon: '', roles: ['propietario;finanzas;'], submenu: [
        { title: 'Venta Abel', icon: '', submenu: null , view: 'power-bi?name=venta-contabilidad-excel-libra', roles: ['propietario;finanzas;'] },
     ]},
     { title: 'Produccion', icon: '', roles: ['produccion;'], submenu: [
        { title: 'Consumo Producción', icon: '', submenu: null , view: 'power-bi?name=rotativo-salida-elaboracion', roles: ['produccion;'] },
        { title: 'Proyección Coste', icon: '', submenu: null , view: 'power-bi?name=prevision-entradas', roles: ['produccion;'] },
        { title: 'Previsión de Entradas', icon: '', submenu: null , view: 'power-bi?name=produccion-prevision-de-entradas', roles: ['produccion;'] },
        { title: 'Intentario', icon: '', submenu: null , view: 'power-bi?name=produccion-inventario', roles: ['produccion;'] },
        { title: 'Consumo Equival. Libra', icon: '', submenu: null , view: 'power-bi?name=consumo-articulos-equivalentes-libra', roles: ['produccion;'] },
     ]},
  ]},
];