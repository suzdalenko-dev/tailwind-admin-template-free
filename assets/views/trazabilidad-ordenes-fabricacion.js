let ordenesFabricacion = [];
let mesesOF = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let fechaActualOF = new Date();
let inputTOF = '';

let tableSearchPageOF = 1;
let tableSearchLimitOF = 20;


/* ============================================================
   1.1) BUSCAR AL PULSAR ENTER
   ============================================================ */
function handleSearchInputKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchLoteArt();
    }
}

/* ============================================================
   1) INPUT CAMBIO → SOLO GUARDAR VALOR, NO BUSCAR
   ============================================================ */
function changeTOF(event) {
    inputTOF = String(event.target.value || '').trim().toLowerCase();
}

/* ============================================================
   2) CLICK EN BUSCAR
   ============================================================ */
function searchLoteArt() {
    inputTOF = String(document.getElementById('inputTOF').value || '').trim().toLowerCase();
    tableSearchPageOF = 1;

    if (inputTOF === '') {
        hideTableSearchedArtLote();
        return;
    }

    renderSearchingTableSearchedArtLote();
    getAllOfsBySearch(inputTOF, tableSearchPageOF, tableSearchLimitOF);
}

/* ============================================================
   3) LIMPIAR INPUT Y CERRAR TABLA
   ============================================================ */
function cleanInputTable() {
    inputTOF = '';
    tableSearchPageOF = 1;
    document.getElementById('inputTOF').value = '';
    hideTableSearchedArtLote();
}

/* ============================================================
   4) FETCH SEARCH GLOBAL OFS
   ============================================================ */
async function getAllOfsBySearch(search, page = 1, limit = 20) {
    try {
        let url = HTTP_HOST + 'calidad/get/of/calendar/get_list_ofs_search_func/?search=' + encodeURIComponent(search) + '&page=' + page + '&limit=' + limit;

        let res = await fetch(url);
        res = await res.json();

        if (!res || !res.data || !Array.isArray(res.data.data)) {
            renderTableSearchedArtLote([], 0, page, limit);
            return;
        }

        renderTableSearchedArtLote(
            res.data.data,
            res.data.total || 0,
            res.data.page || page,
            res.data.limit || limit
        );

    } catch (error) {
        console.error('Error buscando OFs:', error);
        renderTableSearchedArtLote([], 0, page, limit);
    }
}

/* ============================================================
   5) PINTAR MENSAJE "BUSCANDO..."
   ============================================================ */
function renderSearchingTableSearchedArtLote() {
    const box = document.getElementById('tableSearchedArtLote');
    const content = document.getElementById('tableSearchedArtLoteContent');
    const pagination = document.getElementById('tableSearchedArtLotePagination');

    box.classList.remove('hidden');

    content.innerHTML = `
        <div class="border rounded p-4 bg-white text-center text-gray-500 animate-pulse">
            🔎 Buscando...
        </div>`;

    pagination.innerHTML = '';
}

/* ============================================================
   6) RENDER TABLA BUSQUEDA OFS
   ============================================================ */
function renderTableSearchedArtLote(rows, total, page, limit) {
    const box = document.getElementById('tableSearchedArtLote');
    const content = document.getElementById('tableSearchedArtLoteContent');
    const pagination = document.getElementById('tableSearchedArtLotePagination');

    box.classList.remove('hidden');

    if (!rows || rows.length === 0) {
        content.innerHTML = `
            <div class="border rounded p-4 bg-white text-center text-gray-500">
                No se han encontrado resultados
            </div>
        `;
        pagination.innerHTML = '';
        return;
    }

    let html = `
        <div class="overflow-x-auto border rounded bg-white shadow">
            <table class="w-full text-sm text-left border-collapse">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-2 border-b">OF</th>
                        <th class="p-2 border-b">Código</th>
                        <th class="p-2 border-b">Artículo</th>
                        <th class="p-2 border-b">Lote</th>
                    </tr>
                </thead>
                <tbody>
    `;

    rows.forEach(row => {
        html += `
            <tr class="hover:bg-gray-50 cursor-pointer"
                onclick="showCustomOfA(${row.ORDEN_DE_FABRICACION})">

                <td class="p-2 border-b font-semibold">
                    ${row.ORDEN_DE_FABRICACION || ''}
                </td>

                <td class="p-2 border-b">
                    ${row.CODIGO_ARTICULO || ''}
                </td>

                <td class="p-2 border-b">
                    ${row.NOMBRE_ARTICULO || ''}
                </td>

                <td class="p-2 border-b text-gray-700">
                    ${row.NUMERO_LOTE_INT || ''}
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    content.innerHTML = html;

    renderTableSearchedArtLotePagination(total, page, limit);
}

/* ============================================================
   7) RENDER PAGINADOR
   ============================================================ */
function renderTableSearchedArtLotePagination(total, page, limit) {
    const pagination = document.getElementById('tableSearchedArtLotePagination');
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';

    html += `
        <input type="button"
               value="Anterior"
               class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}"
               ${page <= 1 ? 'disabled' : `onclick="changePageSearchOF(${page - 1})"`}>
    `;

    html += `<span class="px-3">Página ${page} de ${totalPages}</span>`;

    html += `
        <input type="button"
               value="Siguiente"
               class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
               ${page >= totalPages ? 'disabled' : `onclick="changePageSearchOF(${page + 1})"`}>
    `;

    pagination.innerHTML = html;
}

/* ============================================================
   8) CAMBIAR PAGINA BUSQUEDA
   ============================================================ */
function changePageSearchOF(page) {
    tableSearchPageOF = page;
    renderSearchingTableSearchedArtLote();
    getAllOfsBySearch(inputTOF, tableSearchPageOF, tableSearchLimitOF);
}

/* ============================================================
   9) HIDE TABLA BUSQUEDA
   ============================================================ */
function hideTableSearchedArtLote() {
    const box = document.getElementById('tableSearchedArtLote');
    const content = document.getElementById('tableSearchedArtLoteContent');
    const pagination = document.getElementById('tableSearchedArtLotePagination');

    box.classList.add('hidden');
    content.innerHTML = '';
    pagination.innerHTML = '';
}

/* ============================================================
   10) FECHA TABLA
   ============================================================ */
function formatDateOFTable(fecha) {
    if (!fecha) return '';

    let d = new Date(fecha);

    if (isNaN(d.getTime())) {
        return String(fecha).slice(0, 10);
    }

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}

/* ============================================================
   11) FILTRO LOCAL DE ÓRDENES DEL MES
   ============================================================ */
function filtrarOrdenesOF() {
    const filtro = String(inputTOF || '').trim().toLowerCase();

    if (filtro === '') return ordenesFabricacion;

    return ordenesFabricacion.filter(ord => {
        return (
            String(ord.CODIGO_ARTICULO || '').toLowerCase().includes(filtro) ||
            String(ord.NOMBRE_ARTICULO || '').toLowerCase().includes(filtro) ||
            String(ord.LOTES || '').toLowerCase().includes(filtro)
        );
    });
}

/* ============================================================
   12) CAMBIO DE MES
   ============================================================ */
function cambiarMes(delta) {
    inputTOF = '';
    tableSearchPageOF = 1;
    document.getElementById('inputTOF').value = '';
    hideTableSearchedArtLote();

    fechaActualOF.setMonth(fechaActualOF.getMonth() + delta);

    renderCalendario(ordenesFabricacion, fechaActualOF.getFullYear(), fechaActualOF.getMonth());
}

/* ============================================================
   13) RENDER DEL CALENDARIO
   ============================================================ */
async function renderCalendario(ordenes, year, month) {
    let exampleData = await getMonthBounds();

    ordenes = exampleData.data || [];
    ordenesFabricacion = ordenes;

    let ordenesFiltradas = filtrarOrdenesOF();

    const titulo = document.getElementById('tituloMes');
    titulo.textContent = `📅 Calendario de Órdenes de Fabricación - ${mesesOF[month]} ${year}`;

    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const calendario = document.getElementById('calendario');
    calendario.innerHTML = '';

    diasSemana.forEach(dia => {
        const cell = document.createElement('div');
        cell.textContent = dia;
        cell.className = 'font-bold text-center text-gray-700';
        calendario.appendChild(cell);
    });

    let primerDia = new Date(year, month, 1).getDay();
    primerDia = (primerDia === 0) ? 6 : primerDia - 1;

    let diasEnMes = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) {
        calendario.appendChild(document.createElement('div'));
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fechaStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        const ordenesDelDia = ordenesFiltradas.filter(o =>
            String(o.FECHA_INI_FABRI_PREVISTA || '').slice(0, 10) === fechaStr
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
                    ${ord.CODIGO_ARTICULO || ''} ${ord.NOMBRE_ARTICULO || ''}
                </strong>
                <br>
                <span class="text-gray-700">${ord.ORDEN_DE_FABRICACION || ''} ${getOfState(ord.SITUACION_OF)}</span>
                <span>${replaceEntr(ord.LOTES || '')}</span>
            `;

            cell.appendChild(item);
        });

        calendario.appendChild(cell);
    }

    setDefaulContentToLocalStorage();
}

/* ============================================================
   14) GO TO DETAIL
   ============================================================ */
function showCustomOfA(ofId) {
    location.href = '/dashboard/#trazabilidad-ordenes-fabricacion-desglose?id=' + ofId;
}

/* ============================================================
   15) FETCH FECHAS PARA RANGO
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
    lastDayMonth = formatDateOF(lastDayMonth);

    let calendarData = await fetch(
        HTTP_HOST + 'calidad/get/of/calendar/ofs_list_calendar/?from=' + firstDayMonth + '&to=' + lastDayMonth
    );

    calendarData = await calendarData.json();

    if (calendarData && calendarData.data) {
        return {
            data: calendarData.data
        };
    }

    return {
        data: []
    };
}

/* ============================================================
   16) INIT
   ============================================================ */
function trazabilidadOrdenesFabricacionInit() {
    inputTOF = '';
    tableSearchPageOF = 1;

    document.getElementById('inputTOF').value = '';
    document.title = 'Calendario OFs';
    document.getElementById('slugTitle').innerHTML = '';

    hideTableSearchedArtLote();

    renderCalendario(ordenesFabricacion, fechaActualOF.getFullYear(), fechaActualOF.getMonth());
}