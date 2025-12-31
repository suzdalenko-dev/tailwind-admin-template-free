let fechaActuaRSE = getTodayDate();
let arrayRSE      = null;
const RSE_KEYS = ["one","two","three","four","five","six", "seven","eight","nine","ten","eleven","twelve"];


function comprasRotativoSalidasElaboracionInit(){
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page" onclick="createExcelRSE()">📥 Excel </span>`;
    document.title = "Rotativo Salidas Elaboracion";


    document.getElementById('date_to_RSE').value = fechaActuaRSE;
    getDataRSE();
}

function change_date_RSE(){
    fechaActuaRSE = document.getElementById('date_to_RSE').value;
    getDataRSE();
}

function createExcelRSE(){

}

/* =====================================================
   FETCH DATOS
===================================================== */

function getDataRSE(){
    document.getElementById('tableRPE').innerHTML =`<tr><td colspan="14">Cargando...</td></tr>`;
    fetch(HTTP_HOST +'compras/get/0/0/rotativo_salida_elaboracion/?fechaFinRotativoElaboracion=' + fechaActuaRSE).then(r => r.json())
    .then(r => {
        if (!r || !r.data) {
            document.getElementById('tableRPE').innerHTML = `<tr><td colspan="14">Sin datos</td></tr>`;
            return;
        }

        arrayRSE = r.data;
        pintarCabecerasRSE(r.data.headers);
        pintarTablaRSE(r.data.rows);
    }).catch(e => {
        showM('RSE ERROR ' + e, 'error');
        document.getElementById('tableRPE').innerHTML =`<tr><td colspan="14">Error</td></tr>`;
    });
}


/* =====================================================
   CABECERAS (12 ÚLTIMOS MESES)
===================================================== */

function pintarCabecerasRSE(headers){
    // headers = ["Erp","Descripcion", ... 14 meses ...]
    const meses = headers.slice(-12); // ⬅️ SOLO LOS 12 ÚLTIMOS

    meses.forEach((txt, i) => {
        const th = document.getElementById('rpe' + (i + 1));
        if (th) th.innerHTML = txt;
    });
}

/* =====================================================
   TABLA
===================================================== */

function pintarTablaRSE(rows){
    let html = '';

    rows.forEach(r => {
        html += `<tr>
            <td class="border px-2 py-1 text-center">${r.Erp}</td>
            <td class="border px-2 py-1 text-left">${r.Descripcion}</td>`;

        // one → first visible month
        RSE_KEYS.forEach(k => {
            html += `<td class="border px-2 py-1 text-right">
                ${fENN(r[k] || 0)}
            </td>`;
        });

        html += `</tr>`;
    });

    document.getElementById('tableRPE').innerHTML =
        html || `<tr><td colspan="14">Sin datos</td></tr>`;
}


/* =====================================================
   EXCEL (MISMO ORDEN QUE TABLA)
===================================================== */

async function createExcelRSE(){

    if (!arrayRSE || !arrayRSE.rows) {
        alert("No hay datos para exportar");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Rotativo Salidas Elaboracion");

    const COLOR_HEADER = '00751b';

    // ===== TÍTULO =====
    sheet.mergeCells("A1:N1");
    const t = sheet.getCell("A1");
    t.value = `Rotativo Salidas Elaboración — Hasta ${formatDateToEuropean(fechaActuaRSE)}`;
    t.font = { bold:true, color:{argb:"FFFFFFFF"}, size:11 };
    t.alignment = { horizontal:"center" };
    t.fill = { type:"pattern", pattern:"solid", fgColor:{argb:COLOR_HEADER} };

    // ===== CABECERAS =====
    const headers = [
        "Erp","Descripcion",
        ...arrayRSE.headers.slice(-12)
    ];

    sheet.addRow(headers);
    sheet.getRow(2).eachCell(c => {
        c.font = { bold:true, color:{argb:"FFFFFFFF"} };
        c.alignment = { horizontal:"center" };
        c.fill = { type:"pattern", pattern:"solid", fgColor:{argb:COLOR_HEADER} };
        c.border = { top:{style:"thin"}, left:{style:"thin"}, bottom:{style:"thin"}, right:{style:"thin"} };
    });

    // ===== DATOS =====
    arrayRSE.rows.forEach(r => {
        sheet.addRow([
            r.Erp,
            r.Descripcion,
            ...RSE_KEYS.map(k => fENN(r[k]) || 0)
        ]);
    });

    sheet.columns = headers.map(() => ({ width: 14 }));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `rotativo_salidas_elaboracion_${fechaActuaRSE}.xlsx`;
    a.click();
}