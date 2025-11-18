let ordenesFabricacion = [];
let mesesOF = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let fechaActualOF = new Date();

function changeTOF(event){
    let inputVal = event.target.value;
}

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
            item.innerHTML = `<strong class="hovered" onclick="showCustomOfA(${ord.ORDEN_DE_FABRICACION})">${ord.CODIGO_ARTICULO} ${ord.NOMBRE_ARTICULO}</strong>
                            <br>
                            <span class="text-gray-700">${ord.ORDEN_DE_FABRICACION} ${getOfState(ord.SITUACION_OF)}</span>`;
            cell.appendChild(item);
        });

        calendario.appendChild(cell);
    }

    setDefaulContentToLocalStorage();
}

function showCustomOfA(ofId){
    location.href ='/dashboard/#trazabilidad-ordenes-fabricacion-desglose?id='+ofId;
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

    let calendarData = await fetch(HTTP_HOST+'calidad/get/of/calendar/ofs_list_calendar/?from='+firstDayMonth+'&to='+lastDayMonth);
        calendarData = await calendarData.json();

    return calendarData;
}


function trazabilidadOrdenesFabricacionInit() {
    document.title = "Calendario OFs";
    document.getElementById('slugTitle').innerHTML = '';

    renderCalendario(ordenesFabricacion, fechaActualOF.getFullYear(), fechaActualOF.getMonth());
}

