let fechaDesdeHPD = '';
let fechaHastaHPD = '';
let array_transpo = ['Propio', 'Agencia'];
let array_destino = ['Produccion', 'Venta/Prod.', 'Venta', 'Exportacion', 'Regional'];
let line_array    = [];
let defaultState  = 'E';
let defaultOrgCom = '0102';
let semanaOld     = '';
let semanaCurrent = '';

/*
    ahora mismo si esta el pedido servido o no me baso en el estado del mismo
    pero hay pedidos que YA TIENEN LINEAS SERVIDAS pero no han cambiado de estado
    que hacemos con ellos ??
*/

function comprasHojaPlanificacionDescargasInit(){
    document.getElementById('slugTitle').innerHTML = `
        <span>
            <select id="selectOrgHPD" onchange="chagedOrgHPD(event)">
                <option value="0102" selected="0102">01 INTERNACIONAL & 02 NACIONAL</option>
                <option value="03">03 MATERIAL AUXILIAR FROXA</option>
                <option value="05">05 VARIOS FROXA</option>
                <option value="all">TODAS ORG. COMPRAS</option>
            </select>
        </span>
        <span class="b-top-page" onclick="reloadHPD()">🔁 Recargar</span>
        <span class="b-top-page" onclick="createExcelHPD()">📥 Excel</span>
        <span class="ml-11">
            <input class="radio-input" name="pedidos_situacion" type="radio" id="pendientesHPD" value="E" checked>
            <label class="radio-label" for="pendientesHPD">PENDIENTES</label>
            <input class="radio-input" name="pedidos_situacion" type="radio" id="cerradosHPD" value="Z">
            <label class="radio-label" for="cerradosHPD">CERRADOS</label>
        </span>`;
    document.title = "Hoja Planificación de Descargas";

    fechaDesdeHPD = fechaConMeses(-1);
    fechaHastaHPD = fechaConMeses(+3);
    initHPD();

     // 🔔 ESCUCHAR CAMBIO DE RADIO
    document.querySelectorAll('input[name="pedidos_situacion"]').forEach(radio => {
        radio.addEventListener('change', onPedidosSituacionChange);
    });
}

function chagedOrgHPD(event){
    defaultOrgCom = event.target.value;
    initHPD();
}

function reloadHPD(){
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

    let url = `${HTTP_HOST}compras/get/0/0/hoja_planificacion_descargas/?date_from=${fechaDesdeHPD}&date_to=${fechaHastaHPD}&state=${defaultState}&org_com=${defaultOrgCom}`;
    fetch(url).then(r => r.json()).then(r => {
        if(r && r.data && r.data && r.data.res && r.data.res.length > 0){
            line_array    = r.data.res;
            let htmlTable = '';
            r.data.res.map(row => {
                semanaOld =  weekNumberLocal(row.fecha_llegada);

                if(semanaOld != semanaCurrent){
                    htmlTable += `<tr>
                                    <td class="border px-2 py-1 text-center">Semana ${weekNumberLocal(row.fecha_llegada)}</td>
                                </tr>`;
                }
            
                htmlTable += `<tr>
                                <td class="border px-2 py-1 text-center">${formatLongDate(row.fecha_llegada)}</td>
                                <td class="border px-2 py-1 text-center">${row.numero_pedido}</td>
                                <td class="border px-2 py-1 text-left">${row.proveedor_name} [${row.proveedor_code}]</td>
                                <td class="border px-2 py-1 text-left">${row.article_name} [${row.article_code}]</td>
                                <td class="border px-2 py-1 text-right">${fEur0(row.cantidad)}</td>
                                <td class="border px-2 py-1 text-right">${row.presentacion}</td>
                                <td class="border px-2 py-1 text-right">${fEur0(row.precio)}</td>
                                <td class="border px-2 py-1 text-center">${selectTrasporte(row.transporte, row.id)}</td>
                                <td class="border px-2 py-1 text-center">${selectDestino(row.destino, row.id)}</td>
                                <td class="border px-2 py-1 text-center">${stateOrderHPD(row.status_cierre)}</td>
                            </tr>`;
                
                semanaCurrent = weekNumberLocal(row.fecha_llegada);

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
    if(userDontLogin('compras')) return;
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




function onPedidosSituacionChange(event){
    defaultState = event.target.value;
    initHPD();
}

function stateOrderHPD(x){
    if (x == 'E') return 'Pendiente';
    return 'Cerrado';
}



async function createExcelHPD(){

    if (!line_array || line_array.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Hoja Planificación Descargas");

    const COLOR_HEADER = '4F46E5'; // azul logística

    // =====================================================
    // TÍTULO
    // =====================================================
    sheet.mergeCells("A1:H1");
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
        "Destino",
        "Estado"
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
    let semanaExcelCurrent = null;

    line_array.forEach(r => {

        const semana = weekNumberLocal(r.fecha_llegada);

    if (semana !== semanaExcelCurrent) {
        const rowSemana = sheet.addRow([`Semana ${semana}`]);

        // Unir toda la fila
        sheet.mergeCells(`A${rowSemana.number}:H${rowSemana.number}`);

        // Estilo simple (opcional pero recomendable)
        rowSemana.font = { bold: true };
        rowSemana.alignment = { horizontal: 'left' };
        rowSemana.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF3F4F6' } // gris muy claro
        };

        semanaExcelCurrent = semana;
    }

    sheet.addRow([
        formatLongDate(r.fecha_llegada),
        r.numero_pedido,
        `${r.proveedor_name || ''} [${r.proveedor_code || ''}]`,
        `${r.article_name || ''} [${r.article_code || ''}]`,
        Number(r.cantidad || 0),
        r.transporte || '',
        r.destino || '',
        stateOrderHPD(r.status_cierre),
        ]);
    });


    // =====================================================
    // FORMATOS DE COLUMNAS
    // =====================================================
    sheet.columns = [
        { width: 14 }, // Fecha
        { width: 16 }, // Pedido
        { width: 50 }, // Proveedor
        { width: 55 }, // Artículo
        { width: 12 }, // Kg
        { width: 16 }, // Transporte
        { width: 18 }, // Destino
        { width: 18 }  // Estado
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


function weekNumberLocal(dateStr) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(
        ((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7
    );
}
