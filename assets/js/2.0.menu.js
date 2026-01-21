let menuData = [
  { title: 'Calidad', icon: '🧪', roles: ['calidad;fabrica;produccion;produccion20;produccion30;'], submenu: [
    { title: 'Trazabilidad', icon: '🔗', view: 'trazabilidad-ordenes-fabricacion', roles: ['calidad;fabrica;produccion;produccion20;produccion30;'] },
    { title: 'Bloqueos', icon: '🔒', view: 'stock-bloqueado-situacion-calidad', roles: ['calidad;produccion;produccion20;produccion30;'] },
    { title: 'Consulta Pal.', icon: '🔎', view: 'consulta-caracteristicas-lote', roles: ['calidad;fabrica;produccion;produccion20;produccion30;'] },
    { title: 'Evaluación Proveedores', icon: '⭐', view: 'calidad-evaluacion-proveedor', roles: ['calidad;'] },
    { title: 'Productos MSC/ASC', icon: '🌱', view: 'calidad-productos-msc-asc', roles: ['calidad;'] },
  ]},
  { title: 'Finanzas', icon: '💰', roles: ['finanzas;finanzas20;compras20;ventas;ventas20;exportacion;logistica;'], submenu: [
    { title: 'Expedientes', icon: '💵', submenu: null, view: 'expedientes-albaranes-facturas', roles: ['finanzas'] },
    { title: 'Alb.98 Facturas', icon: '🆚', submenu: null , view: 'finanzas-albaran-vs-factura', roles: ['finanzas'] },
    { title: 'Llegadas Pendientes', icon: '🚢', submenu: null , view: 'finanzas-llegadas-contenedores', roles: ['finanzas;finanzas20;compras20;ventas;ventas20;exportacion;logistica;'] },
  ]},
  { title: 'Producción', icon: '🏭', roles: ['produccion;finanzas;produccion20;compras;compras20;calidad;produccion30;ventas;'], submenu: [
    { title: 'Costes Art.', icon: '🧮', submenu: null , view: 'proyeccion-costes-con-contenedor', roles: ['produccion;produccion20;ventas;']},
    { title: 'Equiv. C/C',  icon: '♻️', submenu: null , view: 'equivalentes-con-contenedor', roles: ['produccion;produccion20;']},
    { title: 'Entradas',    icon: '🚢', submenu: null , view: 'entradas-con-sin-contenedor-calculo-precio-stock', roles: ['produccion;produccion20;']},
    { title: 'Comparación Costes OFs',  icon: '💰', submenu: null , view: 'produccion-comparacion-costes-contabilidad', roles: ['produccion;produccion20;finanzas;produccion30;']},
    { title: 'Roturas Stock',  icon: '🛎️', submenu: null , view: 'produccion-aviso-roturas-stock', roles: ['produccion;produccion20;compras;compras20;calidad;produccion30;']},
    { title: 'OFs Número Personas', icon: '👷‍♂️', submenu: null , view: 'produccion-ofs-numero-personas', roles: ['produccion;produccion20;'] },
  ]},
  { title: 'Logística', icon: '🚚', roles: ['logistica;finanzas;'], submenu: [
    { title: 'Cargas Nacional', icon: '🗺️', submenu: null , view: 'logistica-listado-cargas', roles: ['logistica'] },
    { title: 'Cargas Regional', icon: '🗺️', submenu: null , view: 'logistica-listado-cargas-regional', roles: ['logistica'] },
    { title: 'Comparación Alm.98', icon: '🆚', submenu: null , view: 'almacen-importacion-vs-resto', roles: ['logistica;finanzas;'] },
    { title: 'Hoja de Contenedor', icon: '🧾', submenu: null , view: 'logistica-hoja-contenedor', roles: ['logistica;'] },
    { title: 'Cierre de HC', icon: '📄', submenu: null , view: 'logistica-cierre-hojas-carga', roles: ['logistica;'] },
    { title: 'Análisis de Pedido', icon: '📊', submenu: null , view: 'logistica-analisis-pedido-completo-picking', roles: ['logistica;'] },
  ]},
  { title: 'Compras', icon: '🛍️', roles: ['compras;calidad;produccion;compras20;ventas;ventas20;exportacion;produccion20;'], submenu: [
    { title: 'Llegadas Pendientes', icon: '🚢', submenu: null , view: 'compras-llegadas-contenedores', roles: ['compras;produccion;'] },
    { title: 'Stock', icon: '📦', submenu: null , view: 'compras-stock', roles: ['compras;calidad;produccion;compras20;ventas;ventas20;exportacion;produccion20;'] },
    { title: 'Rotativo Salidas Elab.', icon: '🔄', submenu: null , view: 'compras-rotativo-salidas-elaboracion', roles: ['compras;calidad;produccion;compras20;ventas;ventas20;exportacion;produccion20;'] },
    { title: 'Hoja Plan. Descargas', icon: '⬇️', submenu: null , view: 'compras-hoja-planificacion-descargas', roles: ['compras;compras20;'] },
  ]},
  { title: 'Admin', icon: '🛠️', roles: ['admin;'], submenu: [
    { title: 'Usuarios', icon: '👤', submenu: null , view: 'admin-usuarios', roles: ['admin;'] },
  ]},


  
  { title: 'Power Bi', icon: '🟡', roles: ['produccion;compras;ventas;ventas20;calidad;produccion20;finanzas;propietario;powerbi0;exportacion;produccion30;mantenimiento;compras20;regional00;'], submenu: [
     { title: 'Compras', icon: '', roles: ['compras;compras20;'], submenu: [
        { title: 'Salidas Elaboración', icon: '', submenu: null , view: 'power-bi?name=rotativo-salida-elaboracion', roles: ['compras;compras20;'] },
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
     { title: 'Exportación', icon: '', roles: ['exportacion;'], submenu: [
        { title: 'Plazos de cobro', icon: '', submenu: null , view: 'power-bi?name=plazo-de-cobro', roles: ['exportacion;'] },
     ]},
     { title: 'Informes propiedad', icon: '', roles: ['propietario;finanzas;'], submenu: [
        { title: 'Venta Comercial', icon: '', submenu: null , view: 'power-bi?name=venta-excel-libra-vista-comercial', roles: ['propietario;finanzas;'] },
     ]},
     { title: 'Produccion', icon: '', roles: ['produccion;produccion20;produccion30;'], submenu: [
        { title: 'Consumo Producción', icon: '', submenu: null , view: 'power-bi?name=rotativo-salida-elaboracion', roles: ['produccion;produccion20;produccion30;'] },
        { title: 'Proyección Coste', icon: '', submenu: null , view: 'power-bi?name=prevision-entradas', roles: ['produccion;produccion20;'] },
        { title: 'Previsión de Entradas', icon: '', submenu: null , view: 'power-bi?name=produccion-prevision-de-entradas', roles: ['produccion;produccion20;'] },
        { title: 'Inventario', icon: '', submenu: null , view: 'power-bi?name=produccion-inventario', roles: ['produccion;produccion20;'] },
        { title: 'Consumo Equival. Libra', icon: '', submenu: null , view: 'power-bi?name=consumo-articulos-equivalentes-libra', roles: ['produccion;produccion20;produccion30;'] },
        { title: 'Balanza Mermas', icon: '', submenu: null , view: 'power-bi?name=balanza-mermas-produccion-calidad', roles: ['produccion;produccion20;produccion30;'] },
     ]},
     { title: 'Calidad', icon: '', roles: ['calidad;'], submenu: [
        { title: 'Consumo Producción', icon: '', submenu: null , view: 'power-bi?name=rotativo-salida-elaboracion', roles: ['calidad;'] },
        { title: 'Consumo Equival. Libra', icon: '', submenu: null , view: 'power-bi?name=consumo-articulos-equivalentes-libra', roles: ['calidad;'] },
        { title: 'Control de Roturas', icon: '', submenu: null , view: 'power-bi?name=calidad-control-de-roturas', roles: ['calidad;'] },
        { title: 'Informe Venta/Stock', icon: '', submenu: null , view: 'power-bi?name=calidad-venta-stock', roles: ['calidad;'] },
        { title: 'Balanza Mermas', icon: '', submenu: null , view: 'power-bi?name=balanza-mermas-produccion-calidad', roles: ['calidad;'] },
     ]},
     { title: 'Mantenimiento', icon: '', roles: ['mantenimiento;'], submenu: [
        { title: 'Balanza Mermas', icon: '', submenu: null , view: 'power-bi?name=balanza-mermas-produccion-calidad', roles: ['mantenimiento;'] },
     ]},
     { title: 'Regional', icon: '', roles: ['regional00;'], submenu: [
        { title: 'Tabla dinamica. regional', icon: '', submenu: null , view: 'power-bi?name=regional-tabla-dinamica', roles: ['regional00;'] },
     ]},
  ]},
];

// como hacer dinamico