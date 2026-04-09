let fechaActuaRSE = getTodayDate();
let arrayRSE      = null;

const RSE_KEYS = ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen"];
const RSE_SEARCH_KEY = "searched_rse";

/* =====================================================
   INIT
===================================================== */

function comprasRotativoSalidasElaboracionInit(){
    document.getElementById('slugTitle').innerHTML =
        `<span class="b-top-page" onclick="createExcelRSE()">📥 Excel </span>`;
    document.title = "Rotativo Salidas Elaboracion";

    const dateEl = document.getElementById('date_to_RSE');
    if (dateEl) dateEl.value = fechaActuaRSE;

    setSearchedRSE();
    getDataRSE();
}

/* =====================================================
   FECHA
===================================================== */

function change_date_RSE(){
    fechaActuaRSE = document.getElementById('date_to_RSE').value;
    getDataRSE();
}

/* =====================================================
   BUSCADOR + BROOM
===================================================== */

function setSearchedRSE(){
    const el = document.getElementById('searchRSE');
    if (!el) return;
    el.value = localStorage.getItem(RSE_SEARCH_KEY) || '';
}

function changeSearchedRSE(event){
    const searched = (event.target.value || '').trim();
    localStorage.setItem(RSE_SEARCH_KEY, searched);
    showRSETableFiltered();
}

function clickBroomRSE(){
    const el = document.getElementById('searchRSE');
    if (el) el.value = '';
    localStorage.setItem(RSE_SEARCH_KEY, '');
    showRSETableFiltered();
}

/* =====================================================
   FETCH DATOS
===================================================== */

function getDataRSE(){
    document.getElementById('tableRPE').innerHTML = `<tr><td colspan="15">Cargando...</td></tr>`;

    fetch(HTTP_HOST + 'compras/get/0/0/rotativo_salida_elaboracion/?fechaFinRotativoElaboracion=' + fechaActuaRSE)
        .then(r => r.json())
        .then(r => {
            if (!r || !r.data) {
                arrayRSE = null;
                document.getElementById('tableRPE').innerHTML = `<tr><td colspan="15">Sin datos</td></tr>`;
                return;
            }

            arrayRSE = r.data;

            pintarCabecerasRSE(arrayRSE.headers);
            showRSETableFiltered();
        })
        .catch(e => {
            showM('RSE ERROR ' + e, 'error');
            document.getElementById('tableRPE').innerHTML = `<tr><td colspan="15">Error</td></tr>`;
        });
}

/* =====================================================
   CABECERAS (13 MESES)
===================================================== */

function pintarCabecerasRSE(headers){
    const meses = (headers || []).slice(-13);

    meses.forEach((txt, i) => {
        const th = document.getElementById('rpe' + (i + 1));
        if (th) th.innerHTML = txt || '';
    });
}

/* =====================================================
   FILTRO (REUTILIZABLE) + TABLA
===================================================== */

function getFilteredRowsRSE(){
    if (!arrayRSE || !arrayRSE.rows) return [];

    const q = (localStorage.getItem(RSE_SEARCH_KEY) || '').toLowerCase();

    return arrayRSE.rows.filter(r => {
        if (!q) return true;

        const monthsText = RSE_KEYS.map(k => String(r[k] ?? '')).join(' ');
        const line = `${r.Erp ?? ''} ${r.Descripcion ?? ''} ${monthsText}`.toLowerCase();

        return line.includes(q);
    });
}

function showRSETableFiltered(){
    if (!arrayRSE || !arrayRSE.rows) {
        document.getElementById('tableRPE').innerHTML = `<tr><td colspan="15">Sin datos</td></tr>`;
        return;
    }

    const rows = getFilteredRowsRSE();
    pintarTablaRSE(rows);
}

function pintarTablaRSE(rows){
    let html = '';

    (rows || []).forEach(r => {
        html += `<tr>
            <td class="border px-2 py-1 text-center">${r.Erp ?? ''}</td>
            <td class="border px-2 py-1 text-left">${r.Descripcion ?? ''}</td>`;

        RSE_KEYS.forEach(k => {
            html += `<td class="border px-2 py-1 text-right">
                ${fENN(r[k] || 0)}
            </td>`;
        });

        html += `</tr>`;
    });

    document.getElementById('tableRPE').innerHTML =
        html || `<tr><td colspan="15">Sin datos</td></tr>`;
}

/* =====================================================
   EXCEL (MISMO ORDEN QUE TABLA) + FILTRO APLICADO
===================================================== */

async function createExcelRSE(){
    if (!arrayRSE || !arrayRSE.rows) {
        alert("No hay datos para exportar");
        return;
    }

    const filteredRows = getFilteredRowsRSE();

    if (!filteredRows || filteredRows.length === 0) {
        alert("No hay datos (con el filtro actual) para exportar");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Rotativo Salidas Elaboracion");

    const COLOR_HEADER = '00751b';

    // ===== TÍTULO =====
    sheet.mergeCells("A1:O1");
    const t = sheet.getCell("A1");
    const q = (localStorage.getItem(RSE_SEARCH_KEY) || '').trim();
    t.value = `Rotativo Salidas Elaboración — Hasta ${formatDateToEuropean(fechaActuaRSE)}${q ? ` — Filtro: ${q}` : ''}`;
    t.font = { bold:true, color:{argb:"FFFFFFFF"}, size:11 };
    t.alignment = { horizontal:"center" };
    t.fill = { type:"pattern", pattern:"solid", fgColor:{argb:COLOR_HEADER} };

    // ===== CABECERAS =====
    const headers = [
        "Erp",
        "Descripcion",
        ...(arrayRSE.headers || []).slice(-13)
    ];

    sheet.addRow(headers);
    sheet.getRow(2).eachCell(c => {
        c.font = { bold:true, color:{argb:"FFFFFFFF"} };
        c.alignment = { horizontal:"center" };
        c.fill = { type:"pattern", pattern:"solid", fgColor:{argb:COLOR_HEADER} };
        c.border = { top:{style:"thin"}, left:{style:"thin"}, bottom:{style:"thin"}, right:{style:"thin"} };
    });

    // ===== DATOS =====
    filteredRows.forEach(r => {
        sheet.addRow([
            r.Erp,
            r.Descripcion,
            ...RSE_KEYS.map(k => r[k] || 0)
        ]);
    });

    sheet.columns = headers.map((h, i) => ({ width: i < 2 ? 26 : 14 }));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `rotativo_salidas_elaboracion_${fechaActuaRSE}.xlsx`;
    a.click();
    URL.revokeObjectURL(a.href);
}