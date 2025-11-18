let ordenesFabricacion = [];
let mesesOF = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let fechaActualOF = new Date();
let inputTOF = '';

/* ============================================================
   1) FILTRO LOCAL DE ÓRDENES SIN VOLVER A HACER FETCH
   ============================================================ */
function filtrarOrdenesOF() {
    const filtro = inputTOF.trim().toLowerCase();
    if (filtro === "") return ordenesFabricacion;

    return ordenesFabricacion.filter(ord => {
        return (
            ord.CODIGO_ARTICULO.toLowerCase().includes(filtro) ||
            ord.NOMBRE_ARTICULO.toLowerCase().includes(filtro) ||
            (ord.LOTES || "").toLowerCase().includes(filtro)
        );
    });
}

/* ============================================================
   2) INPUT CAMBIO → FILTRA Y REPINTA
   ============================================================ */
function changeTOF(event) {
    inputTOF = event.target.value.toLowerCase();
    renderCalendario(ordenesFabricacion, fechaActualOF.getFullYear(), fechaActualOF.getMonth());
}

/* ============================================================
   3) CAMBIO DE MES
   ============================================================ */
function cambiarMes(delta) {
    inputTOF = ''; // limpiar el filtro al cambiar de mes
    document.getElementById('inputTOF').value = '';
    fechaActualOF.setMonth(fechaActualOF.getMonth() + delta);
    renderCalendario(ordenesFabricacion, fechaActualOF.getFullYear(), fechaActualOF.getMonth());
}

/* ============================================================
   4) RENDER DEL CALENDARIO
   ============================================================ */
async function renderCalendario(ordenes, year, month) {

    // 4.1 - Obtener datos del mes
    let ExampleData = await getMonthBounds();
    ordenes = ExampleData.data;

    // 4.2 - Guardar datos originales siempre
    ordenesFabricacion = ordenes;

    // 4.3 - Aplicar filtro local
    let ordenesFiltradas = filtrarOrdenesOF();

    // 4.4 - Título
    const titulo = document.getElementById('tituloMes');
    titulo.textContent = `📅 Calendario de Órdenes de Fabricación - ${mesesOF[month]} ${year}`;

    // 4.5 - Render estructura
    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const calendario = document.getElementById('calendario');
    calendario.innerHTML = '';

    // Encabezado
    diasSemana.forEach(dia => {
        const cell = document.createElement('div');
        cell.textContent = dia;
        cell.className = 'font-bold text-center text-gray-700';
        calendario.appendChild(cell);
    });

    // Primer día del mes
    let primerDia = new Date(year, month, 1).getDay();
    primerDia = (primerDia === 0) ? 6 : primerDia - 1;

    // Días totales del mes
    let diasEnMes = new Date(year, month + 1, 0).getDate();

    // Huecos iniciales
    for (let i = 0; i < primerDia; i++) {
        calendario.appendChild(document.createElement('div'));
    }

    // 4.6 - Días del calendario
    for (let dia = 1; dia <= diasEnMes; dia++) {

        const fechaStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

        const ordenesDelDia = ordenesFiltradas.filter(o =>
            o.FECHA_INI_FABRI_PREVISTA.slice(0, 10) === fechaStr
        );

        const cell = document.createElement('div');
        cell.className = 'border p-2 rounded shadow text-xs overflow-y-auto bg-white hover:bg-gray-50 transition height-calendar';
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
            item.innerHTML = `
                <strong class="hovered" onclick="showCustomOfA(${ord.ORDEN_DE_FABRICACION})">
                    ${ord.CODIGO_ARTICULO} ${ord.NOMBRE_ARTICULO}
                </strong>
                <br>
                <span class="text-gray-700">${ord.ORDEN_DE_FABRICACION} ${getOfState(ord.SITUACION_OF)}</span>
                <span>${replaceEntr(ord.LOTES)}</span>
            `;

            cell.appendChild(item);
        });

        calendario.appendChild(cell);
    }

    setDefaulContentToLocalStorage();
}

/* ============================================================
   5) GO TO DETAIL
   ============================================================ */
function showCustomOfA(ofId) {
    location.href = '/dashboard/#trazabilidad-ordenes-fabricacion-desglose?id=' + ofId;
}

/* ============================================================
   6) FETCH FECHAS PARA RANGO
   ============================================================ */
async function getMonthBounds() {

    let firstDayMonth = new Date(fechaActualOF.getFullYear(), fechaActualOF.getMonth(), 1);
    let lastDayMonth = new Date(fechaActualOF.getFullYear(), fechaActualOF.getMonth() + 1, 0);

    let formatDateOF = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    firstDayMonth = formatDateOF(firstDayMonth);
    lastDayMonth  = formatDateOF(lastDayMonth);

    let calendarData = await fetch(
        HTTP_HOST + 'calidad/get/of/calendar/ofs_list_calendar/?from=' + firstDayMonth + '&to=' + lastDayMonth
    );

    calendarData = await calendarData.json();
    return calendarData;
}

/* ============================================================
   7) INIT
   ============================================================ */
function trazabilidadOrdenesFabricacionInit() {
    inputTOF = '';
    document.getElementById('inputTOF').value = '';
    document.title = "Calendario OFs";
    document.getElementById('slugTitle').innerHTML = '';
    renderCalendario(ordenesFabricacion, fechaActualOF.getFullYear(), fechaActualOF.getMonth());
}
