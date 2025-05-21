let ordenesFabricacion = [
    { fecha: '2025-05-03', nombre: 'Lote A - Yogurt', estado: 'En Proceso' },
    { fecha: '2025-05-07', nombre: 'Lote B - Leche', estado: 'Completado' },
    { fecha: '2025-05-15', nombre: 'Lote C - Queso', estado: 'Pendiente' },
    { fecha: '2025-05-15', nombre: 'Lote F - Queso', estado: 'Pendiente' },
    { fecha: '2025-05-15', nombre: 'Lote D - Crema', estado: 'En Proceso' },
    { fecha: '2025-05-23', nombre: 'Lote E - Flan', estado: 'Cancelado' },
    { fecha: '2025-06-05', nombre: 'Lote F - Yogurt Frutado', estado: 'Pendiente' },
    { fecha: '2025-06-18', nombre: 'Lote G - Leche Descremada', estado: 'En Proceso' },
    { fecha: '2025-04-10', nombre: 'Lote H - Crema Batida', estado: 'Completado' },
    { fecha: '2025-04-22', nombre: 'Lote I - Postres', estado: 'Cancelado' }
];

let mesesOF = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let fechaActualOF = new Date();



function cambiarMes(delta) {
    fechaActualOF.setMonth(fechaActualOF.getMonth() + delta);
    renderCalendario(ordenesFabricacion, fechaActualOF.getFullYear(), fechaActualOF.getMonth());
}

async function renderCalendario(ordenes, year, month) {

    let ExampleData = await getMonthBounds();
    ordenes = ExampleData.data;

    const titulo = document.getElementById('tituloMes');
    titulo.textContent = `📅 Calendario de Órdenes de Fabricación - ${mesesOF[month]} ${year}`;

    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const calendario = document.getElementById('calendario');
    calendario.innerHTML = '';

    // Encabezado de días
    diasSemana.forEach(dia => {
        const cell = document.createElement('div');
        cell.textContent = dia;
        cell.className = 'font-bold text-center text-gray-700';
        calendario.appendChild(cell);
    });

    let primerDia = new Date(year, month, 1).getDay();
    primerDia = (primerDia === 0) ? 6 : primerDia - 1;

    let diasEnMes = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) { calendario.appendChild(document.createElement('div')); }

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fechaStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
        const ordenesDelDia = ordenes.filter(o => o.FECHA_INI_FABRI_PREVISTA.slice(0, 10) == fechaStr);

        const cell = document.createElement('div');
        cell.className = 'border p-2 rounded shadow text-xs h-32 overflow-y-auto bg-white hover:bg-gray-50 transition';
        cell.innerHTML = `<div class="text-center mb-1">${dia}</div>`;

        ordenesDelDia.forEach(ord => {
            const estadoColor = {
                'R': 'bg-yellow-200',
                'A': 'bg-green-200',
                'C': 'bg-blue-200',
                'B': 'bg-red-200'
            }[ord.SITUACION_OF] || 'bg-gray-200';

            const item = document.createElement('div');
            item.className = `p-1 rounded mb-1 ${estadoColor}`;
            item.innerHTML = `<strong class="hovered" onclick="showCustomOf(${ord.ORDEN_DE_FABRICACION})">${ord.CODIGO_ARTICULO} ${ord.NOMBRE_ARTICULO}</strong>
                            <br>
                            <span class="text-gray-700">${ord.ORDEN_DE_FABRICACION} ${getOfState(ord.SITUACION_OF)}</span>`;
            cell.appendChild(item);
        });

        calendario.appendChild(cell);
    }
}

async function getMonthBounds() {
    // month is 0-based (0 = January, 11 = December)

    let firstDayMonth = new Date(fechaActualOF.getFullYear(), fechaActualOF.getMonth(), 1); // 1st day of the month
    let lastDayMonth = new Date(fechaActualOF.getFullYear(), fechaActualOF.getMonth() + 1, 0); // 0th day of next month = last day of current  
    let formatDateOF = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() es base 0
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    firstDayMonth = formatDateOF(firstDayMonth);
    lastDayMonth  = formatDateOF(lastDayMonth);
    console.log([firstDayMonth, lastDayMonth])

    let miX = await fetch(HTTP_HOST+'calidad/get/of/calendar/ofs_list_calendar/?from='+firstDayMonth+'&to='+lastDayMonth);
        miX = await miX.json();

    return miX;
}

function getOfState(x){
    if(x == 'A') return 'Abierta';
    if(x == 'C') return 'Cerrada';
    if(x == 'B') return 'Anulada';
    if(x == 'R') return 'Retenida';
    return 'None';
}

function ordenesFabricacionInit() {
    document.title = "ordenesFabricacionInit";
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page">1</span>
                                                    <span class="b-top-page">2</span>
                                                    <span class="b-top-page">3</span>
                                                    <span class="b-top-page">4</span>`;

    document.getElementById('slugTitle').innerHTML = '';

    renderCalendario(ordenesFabricacion, fechaActualOF.getFullYear(), fechaActualOF.getMonth());
}





/* 2. SECOND - SHOW PRODUCTION ORDER DETAIL */

async function showCustomOf(ofId){
    let miX = await fetch(HTTP_HOST+'calidad/get/of/'+ofId+'/of_trazabilidad/');
        miX = await miX.json();
    let htmlOfsTop = '';
    if(miX.data[0]['OF']){
        miX.data[0]['OF'].map(of => {
        htmlOfsTop += `<tr><td class="border px-2 py-1 text-center">${of.ORDEN_DE_FABRICACION}</td>
                           <td class="border px-2 py-1 text-center">${String(of.FECHA_INI_FABRI_PREVISTA).slice(0, 10)}</td>
                           <td class="border px-2 py-1 text-center">${String(of.FECHA_INI_FABRI_PREVISTA).slice(0, 10)}</td>
                           <td class="border px-2 py-1 text-center">${of.CODIGO_ARTICULO}</td>
                           <td class="border px-2 py-1 text-center">${of.NOMBRE_ARTICULO}</td>
                           <td class="border px-2 py-1 text-center">${of.CANTIDAD_A_FABRICAR} ${of.CODIGO_PRESENTACION}</td>
                           <td class="border px-2 py-1 text-center">${getOfState(of.SITUACION_OF)}</td></tr>`;
        });
    }
    
    let htmlMP = '';
    if(miX.data[0]['MATERIAL_PEDIDO']){
        miX.data[0]['MATERIAL_PEDIDO'].map(mp => {
         htmlMP += `<tr><td class="border px-2 py-1 text-center">${mp.CODIGO_COMPONENTE}</td>
                        <td class="border px-2 py-1 text-center">${mp.COMPO_DESC_COMERCIAL}</td>
                        <td class="border px-2 py-1 text-center">${mp.CANTIDAD_TECNICA} ${mp.CODIGO_PRESENTACION}</td></tr>`;
        });
    }
    

    let htmlMC = '';
    if(miX.data[0]['MATERIAL_CONSUMIDO']){
        miX.data[0]['MATERIAL_CONSUMIDO'].map(mc => {
         htmlMC += `<tr><td class="border px-2 py-1 text-center">${String(mc.FECHA_CREACION).slice(0,10)}</td>
                        <td class="border px-2 py-1 text-center">${String(mc.FECHA_CADUCIDAD).slice(0,10)}</td>
                        <td class="border px-2 py-1 text-center">${mc.CODIGO_ARTICULO_CONSUMIDO}</td>
                        <td class="border px-2 py-1 text-center">${mc.DESCRIP_CONSUMIDO}</td>
                        <td class="border px-2 py-1 text-center">${mc.NUMERO_LOTE_INT_CONSUMIDO}</td>
                        <td class="border px-2 py-1 text-center">${mc.CANTIDAD_UNIDAD1} ${mc.CODIGO_PRESENTACION}</td>
                    </tr>`;
        });
    }
    

    let htmlMProd = '';
    if(miX.data[0]['MATERIAL_PRODUCIDO']){
        miX.data[0]['MATERIAL_PRODUCIDO'].map(mc => {
            htmlMProd += `<tr><td class="border px-2 py-1 text-center">${String(mc.FECHA_CREACION).slice(0,10)}</td>
                        <td class="border px-2 py-1 text-center">${String(mc.FECHA_CADUCIDAD).slice(0,10)}</td>
                        <td class="border px-2 py-1 text-center">${mc.CODIGO_ARTICULO}</td>
                        <td class="border px-2 py-1 text-center">${mc.DESCRIP_COMERCIAL}</td>
                        <td class="border px-2 py-1 text-center">${mc.NUMERO_LOTE_INT}</td>
                        <td class="border px-2 py-1 text-center">${mc.CANTIDAD_UNIDAD1} ${mc.CODIGO_PRESENTACION}</td>
                        <td class="border px-2 py-1 text-center">${mc.NUMERO_PALET}</td>
                    </tr>`;
        });
    }
    

    let htmlPI = '';
    if(miX.data[0]['PARTE_INSPECCION']){
         miX.data[0]['PARTE_INSPECCION'].map(piA => {
         htmlPI += `<tr><td class="border px-2 py-1 text-center">${piA.ORDEN_FABRICACION}</td>
                        <td class="border px-2 py-1 text-center">${piA.NUMERO_PARTE}</td>
                        <td class="border px-2 py-1 text-center">${piA.CODIGO_ARTICULO}</td>
                        <td class="border px-2 py-1 text-center">${piA.FECHA_ENTRADA}</td>
                        <td class="border px-2 py-1 text-center">${piA.FECHA_VERIFICACION}</td>
                        <td class="border px-2 py-1 text-center">${piA.CANT_ACEPTADA} ${piA.CODIGO_PRESENTACION}</td>
                        <td class="border px-2 py-1 text-center">${piA.CANT_RECIBIDA} ${piA.CODIGO_PRESENTACION}</td>
                        <td class="border px-2 py-1 text-center">${piA.CODIGO_VERIFICADOR}</td>
                    </tr>`;
        });
    }
   

    let ofDetailHtml = `
        <h2 class="text-xl mb-6">Detalles de Producción ID ${ofId}</h2>
        <div class="space-y-6">
            <div>
                <h3 class="text-sm mb-2">OF</h3>
                <table class="w-full table-auto border border-gray-300 text-sm ">
                    <thead>
                        <tr class="twcolor">
                            <th>Id</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Entrega</th>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>${htmlOfsTop}</tbody>
                </table>
            </div>

            <div>
                <h3 class="text-sm mb-2">Materiales pedidos</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>${htmlMP}</tbody>
                </table>
            </div>

            <div>
                <h3 class="text-sm mb-2">Materiales consumidos</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th>Fecha creación</th>
                            <th>Fecha caducidad</th>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Lote</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>${htmlMC}</tbody>
                </table>
            </div>

            <div>
                <h3 class="text-sm mb-2">Materiales producidos</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th>Fecha creación</th>
                            <th>Fecha caducidad</th>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Lote</th>
                            <th>Cantidad</th>
                            <th>Paleta</th>
                        </tr>
                    </thead>
                    <tbody>${htmlMProd}</tbody>
                </table>
            </div>

            <div>
                <h3 class="text-sm mb-2">Parte inspección</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th>OF id</th>
                            <th>Parte</th>
                            <th>Código</th>
                            <th>Fecha entrada</th>
                            <th>Fecha verificacion</th>
                            <th>Cantidad aceptada</th>
                            <th>Cantidad recibida</th>
                            <th>Usuario</th>
                        </tr>
                    </thead>
                    <tbody>${htmlPI}</tbody>
                </table>
            </div>
        </div>`;


    document.getElementById('htmlContent').innerHTML = ofDetailHtml;

    
}




/* 3. SHOW INSPECTION PART */