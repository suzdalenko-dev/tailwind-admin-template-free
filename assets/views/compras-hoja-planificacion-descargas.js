let fechaDesdeHPD = '';
let fechaHastaHPD = '';
let array_transpo = ['Propio', 'Agencia'];
let array_destino = ['Produccion', 'Venta/Prod.', 'Venta', 'Exportacion', 'Regional'];
let line_array    = [];

function comprasHojaPlanificacionDescargasInit(){
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page" onclick="createExcelHPD()">📥 Excel </span>`;
    document.title = "Hoja Planificación de Descargas";

    fechaDesdeHPD = getFirstDayOfCurrentMonth();
    fechaHastaHPD = getLastDayOfCurrentMonth();
    initHPD();
}

function change_date_HPD(){
    fechaDesdeHPD = document.getElementById('date_from_HPD').value;
    fechaHastaHPD = document.getElementById('date_to_HPD').value;
    initHPD();
}

function initHPD(){
    document.getElementById('date_from_HPD').value = fechaDesdeHPD;
    document.getElementById('date_to_HPD').value   = fechaHastaHPD;
    document.getElementById('tableHPD').innerHTML  = '<br>Cargando datos..';

    let url = `${HTTP_HOST}compras/get/0/0/hoja_planificacion_descargas/?date_from=${fechaDesdeHPD}&date_to=${fechaHastaHPD}`;
    fetch(url).then(r => r.json()).then(r => {
        if(r && r.data && r.data && r.data.res && r.data.res.length > 0){
            line_array    = r.data.res;
            let htmlTable = '';
            r.data.res.map(row => {
                htmlTable += `<tr>
                                <td class="border px-2 py-1 text-center">${formatLongDate(row.fecha_llegada)}</td>
                                <td class="border px-2 py-1 text-center">${row.numero_pedido}</td>
                                <td class="border px-2 py-1 text-left">${row.proveedor_name} [${row.proveedor_code}]</td>
                                <td class="border px-2 py-1 text-left">${row.article_name} [${row.article_code}]</td>
                                <td class="border px-2 py-1 text-right">${fEur0(row.cantidad)}</td>
                                <td class="border px-2 py-1 text-center">${selectTrasporte(row.transporte, row.id)}</td>
                                <td class="border px-2 py-1 text-center">${selectDestino(row.destino, row.id)}</td>
                            </tr>`;
            });
            document.getElementById('tableHPD').innerHTML = htmlTable;
        } else {
            document.getElementById('tableHPD').innerHTML = '<br>No hay datos que mostrar.';
        }
    }).catch(e => showM(e, 'error'));
}

// <td class="border expanded px-2 py-1 text-center">

function selectTrasporte(val, id){
    let html = `<select onchange="changeHPD(event, ${id}, 'transporte')" class="hovered"><option value=""> </option>`
    let selected = '';
    for (let i = 0; i < array_transpo.length; i++){
        if (val == array_transpo[i]) {
            selected = 'selected';
        }
        html += `<option value="${array_transpo[i]}" ${selected}>${array_transpo[i]} </option>`;
        selected = '';
    }
    html += '</select>';
    return html;
}

function selectDestino(val, id){
    let html = `<select onchange="changeHPD(event, ${id}, 'destino')" class="hovered"><option value=""> </option>`;
    let selected = '';
    for (let i = 0; i < array_destino.length; i++){
         if (val == array_destino[i]) {
            selected = 'selected';
        }
        html += `<option value="${array_destino[i]}" ${selected}>${array_destino[i]} </option>`;
        selected = '';
    }
    html += '</select>';
    return html;
}

function changeHPD(event, id, entity){
    let value = event.target.value;
    uploadHPD(entity, id, value);
}

function uploadHPD(entity, id, value){
    let url  = HTTP_HOST+'compras/put/0/0/upload_hoja_descarga/';
    let form = new FormData();
        form.append('entity', entity);
        form.append('id', id);
        form.append('value', value);
    fetch(url, {method:'POST', body:form}).then(r => r.json()).then(res => {
        initHPD();

    }) .catch(e => {
        showM(e, 'error');
         initHPD();
    })
}








async function createExcelHPD(){

    if (!line_array || line_array.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Hoja Planificación Descargas");

    const COLOR_HEADER = '1f4acc'; // azul logística

    // =====================================================
    // TÍTULO
    // =====================================================
    sheet.mergeCells("A1:G1");
    const t = sheet.getCell("A1");
    t.value = `Hoja Planificación de Descargas — ${formatLongDate(fechaDesdeHPD)} a ${formatLongDate(fechaHastaHPD)}`;
    t.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    t.alignment = { horizontal: "center", vertical: "middle" };
    t.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER } };

    // =====================================================
    // CABECERAS
    // =====================================================
    const headers = [
        "Fecha llegada",
        "Nº Pedido",
        "Proveedor",
        "Artículo",
        "Kg",
        "Transporte",
        "Destino"
    ];

    sheet.addRow(headers);

    sheet.getRow(2).eachCell(c => {
        c.font = { bold: true, color: { argb: "FFFFFFFF" } };
        c.alignment = { horizontal: "center" };
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER } };
        c.border = {
            top:    { style: "thin" },
            left:   { style: "thin" },
            bottom: { style: "thin" },
            right:  { style: "thin" }
        };
    });

    // =====================================================
    // DATOS
    // =====================================================
    line_array.forEach(r => {
        sheet.addRow([
            formatLongDate(r.fecha_llegada),
            r.numero_pedido,
            `${r.proveedor_name || ''} [${r.proveedor_code || ''}]`,
            `${r.article_name || ''} [${r.article_code || ''}]`,
            Number(r.cantidad || 0),
            r.transporte || '',
            r.destino || ''
        ]);
    });

    // =====================================================
    // FORMATOS DE COLUMNAS
    // =====================================================
    sheet.columns = [
        { width: 14 }, // Fecha
        { width: 16 }, // Pedido
        { width: 30 }, // Proveedor
        { width: 35 }, // Artículo
        { width: 12 }, // Kg
        { width: 16 }, // Transporte
        { width: 18 }  // Destino
    ];

    // Formato numérico para Kg
    sheet.getColumn(5).numFmt = '#,##0.00';

    // Bordes a todas las filas de datos
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 2) {
            row.eachCell(c => {
                c.border = {
                    top:    { style: "thin" },
                    left:   { style: "thin" },
                    bottom: { style: "thin" },
                    right:  { style: "thin" }
                };
            });
        }
    });

    // =====================================================
    // DESCARGA
    // =====================================================
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `hoja_planificacion_descargas_${fechaDesdeHPD}_a_${fechaHastaHPD}.xlsx`;
    a.click();
}
