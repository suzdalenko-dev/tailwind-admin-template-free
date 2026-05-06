let llpt_data = [];
let inputDesdeLLPT = '';
let inputHastaLLPT = '';

function logisticaListadoPedidosTotalInit() {
    document.title = 'Listado pedidos total';

    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="createExcelLLPT()">📥 Excel</span>
    `;

    setDatesLLPT();
    getlinesLLPT();
}

function setDatesLLPT() {
    inputDesdeLLPT = getFirstDayOfCurrentMonthLLPT();
    inputHastaLLPT = getLastDayOfCurrentMonthLLPT();

    document.getElementById('inputDesdeLHC').value = inputDesdeLLPT;
    document.getElementById('inputHastaLHC').value = inputHastaLLPT;
}

function funcDesdeLLPT() {
    inputDesdeLLPT = document.getElementById('inputDesdeLHC').value;
    getlinesLLPT();
}

function funcHastaLLPT() {
    inputHastaLLPT = document.getElementById('inputHastaLHC').value;
    getlinesLLPT();
}

async function getlinesLLPT() {
    document.getElementById('tableLLPT').innerHTML = '<br> Cargando..';

    const desde = document.getElementById('inputDesdeLHC').value || inputDesdeLLPT;
    const hasta = document.getElementById('inputHastaLHC').value || inputHastaLLPT;

    inputDesdeLLPT = desde;
    inputHastaLLPT = hasta;

    fetch(HTTP_HOST + `logistica/get/0/0/abel_pedidos_total/?date_from=${desde}&date_to=${hasta}`)
        .then(r => r.json())
        .then(r => {
            if (r && Array.isArray(r.res)) {
                llpt_data = r.res;
            } else if (r && Array.isArray(r.data.res)) {
                llpt_data = r.data.res;
            } else {
                llpt_data = [];
            }

            paintTableLLPT();
        })
        .catch(e => {
            console.error(e);
            if (typeof showM === 'function') {
                showM(e, 'error');
            }
        });
}

function paintTableLLPT() {
    let html = '';

    llpt_data.forEach(i => {
        html += `
            <tr>
                <td class="border px-2 py-1 text-center">${i.PEDIDO ?? ''}</td>
                <td class="border px-2 py-1 text-center">${formatDateLLPT(i.FECHA_PEDIDO)}</td>
                <td class="border px-2 py-1 text-center">${formatDateLLPT(i.FECHA_CARGA)}</td>
                <td class="border px-2 py-1 text-center">${i.ORGANIZACION_COMERCIAL ?? ''}</td>
                <td class="border px-2 py-1 text-right">${fEur0(i.PALETS)}</td>
                <td class="border px-2 py-1 text-right">${fEur0(i.KG)}</td>
                <td class="border px-2 py-1 text-right">${fEur0(i.IMPORTE)}</td>
                <td class="border px-2 py-1 text-left">${joinValsLLPT(i.CODIGO_RAPIDO, i.NOMBRE)}</td>
            </tr>
        `;
    });

    document.getElementById('tableLLPT').innerHTML = html;
}

function createExcelLLPT() {
    if (!llpt_data || !Array.isArray(llpt_data)) return;

    const HEAD = [
        'Pedido',
        'Fecha Pedido',
        'Fecha Carga',
        'Org. Comercial',
        'Palets',
        'Kg',
        'Importe',
        'Cliente',
        'Agente'
    ];

    const AOA = [HEAD];

    llpt_data.forEach(i => {
        AOA.push([
            i.PEDIDO ?? '',
            formatDateLLPT(i.FECHA_PEDIDO),
            formatDateLLPT(i.FECHA_CARGA),
            i.ORGANIZACION_COMERCIAL ?? '',
            i.PALETS == 'None' ? '' : i.PALETS,
            parseFloat(i.KG || 0),
            parseFloat(i.IMPORTE || 0),
            joinValsLLPT(i.CODIGO_RAPIDO, i.NOMBRE),
            joinValsLLPT(i.AGENTE, i.NOMBRE_AGENTE)
        ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(AOA);

    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    ws['!cols'] = [
        { wch: 18 }, // Pedido
        { wch: 14 }, // Fecha Pedido
        { wch: 14 }, // Fecha Carga
        { wch: 14 }, // Org Comercial
        { wch: 10 }, // Palets
        { wch: 14 }, // Kg
        { wch: 14 }, // Importe
        { wch: 45 }, // Cliente
        { wch: 35 }, // Agente
    ];

    const range = XLSX.utils.decode_range(ws['!ref']);

    const numberCols = ['E', 'F', 'G'];

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        numberCols.forEach(col => {
            const addr = `${col}${R + 1}`;
            const cell = ws[addr];

            if (cell && typeof cell.v === 'number') {
                cell.t = 'n';

                if (col === 'G') {
                    cell.z = '#,##0.00';
                } else {
                    cell.z = '#,##0.##';
                }
            }
        });
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos total');

    const ts = new Date();
    const stamp = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, '0')}-${String(ts.getDate()).padStart(2, '0')}__${String(ts.getHours()).padStart(2, '0')}-${String(ts.getMinutes()).padStart(2, '0')}`;

    const fileName = `listado_pedidos_total_${inputDesdeLLPT}_${inputHastaLLPT}_${stamp}.xlsx`;

    XLSX.writeFile(wb, fileName);
}

/* ===========================
   Helpers
   =========================== */

function getFirstDayOfCurrentMonthLLPT() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
}

function getLastDayOfCurrentMonthLLPT() {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const lastDay = new Date(y, m, 0).getDate();

    return `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}

function formatDateLLPT(v) {
    if (!v) return '';

    const s = String(v);

    // Si viene tipo 2026-05-04T00:00:00
    if (s.includes('-')) {
        const p = s.slice(0, 10).split('-');
        if (p.length === 3) {
            return `${p[2]}/${p[1]}/${p[0]}`;
        }
    }

    return s;
}

function toNumLLPT(v) {
    if (v === null || v === undefined || v === '') return '';

    if (typeof v === 'number') return v;

    const s = String(v).trim();

    if (!s) return '';

    const n = Number(s.replace(/\./g, '').replace(',', '.'));

    return Number.isFinite(n) ? n : '';
}

function formatNumberLLPT(v) {
    const n = toNumLLPT(v);

    if (n === '') return '';

    return n.toLocaleString('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function formatEuroLLPT(v) {
    const n = toNumLLPT(v);

    if (n === '') return '';

    return n.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function joinValsLLPT(...values) {
    return values
        .filter(v => v !== null && v !== undefined && String(v).trim() !== '')
        .join(' ')
        .trim();
}