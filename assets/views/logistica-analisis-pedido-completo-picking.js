let pedidosLAP  = null;
let dateFromLAP = getTodayDate();
let dateToLAP   = getTodayDate();

function logisticaAnalisisPedidoCompletoPickingInit(){
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="changedDateLAP()">🔁 Recargar </span>
        <span class="b-top-page" onclick="createExcelLAP()">📥 Excel </span>
    `;
    document.title = "Panel de Análisis de Pedido";

    setDateLAP();
    getLAPData();
}

function changedDateLAP(){
    dateFromLAP = document.getElementById('inputFromLAP').value;
    dateToLAP   = document.getElementById('inputToLAP').value;
    getLAPData();
}

function setDateLAP(){
    document.getElementById('inputFromLAP').value = dateFromLAP;
    document.getElementById('inputToLAP').value   = dateToLAP;
}

function getLAPData(){
    document.getElementById('tableLAP').innerHTML = '<br> Cargando..'    

    fetch(HTTP_HOST+'logistica/action/0/0/analisis_pedidos_dia_carga/?date_from='+dateFromLAP+'&date_to='+dateToLAP).then(r => r.json()).then(r => {
        pedidosLAP = r.data;
        if(r && r.data && r.data.pedidos && r.data.pedidos.length > 0){
            let html = '';
            r.data.pedidos.map(l => {
                html += `<tr>
                    <td class="border px-2 py-1 text-left">${l.order_id}</td>
                    <td class="border px-2 py-1 text-center">${l.fecha_pedido}</td>
                    <td class="border px-2 py-1 text-center">${l.fecha_carga}</td>
                    <td class="border px-2 py-1 text-center">${notNone(l.fecha_entrega)}</td>
                    <td class="border px-2 py-1 text-right">${fEur0(l.palets_total)}</td>
                    <td class="border px-2 py-1 text-right">${fEur0(l.kg)}</td>
                    <td class="border px-2 py-1 text-left">${l.cliente}</td>
                    <td class="border px-2 py-1 text-right">${fEur0(l.palets_complet)}</td>
                    <td class="border px-2 py-1 text-right">${fEur0(l.palets_de_pick)}</td>
                    <td class="border px-2 py-1 text-center">${l.num_referencias}</td>
                    <td class="border px-2 py-1 text-center">${l.lineas_pedido}</td>
                    <td class="border px-2 py-1 text-center">${fENN(l.cant_cajas)}</td>
                    <td class="border px-2 py-1 text-center">${l.serie_hoja_carga}</td>
                    <td class="border px-2 py-1 text-center">${l.numero_hoja_carga}</td>
                </tr>`;
            });
            let rLAP = r.data.resumen;

            html += `<tr>
                    <td class="border px-2 py-1 text-left"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-right"><b>${fEur0(rLAP.TOTAL_PALETS)}</b></td>
                    <td class="border px-2 py-1 text-right"><b>${fEur0(rLAP.TOTAL_KG)}</b></td>
                    <td class="border px-2 py-1 text-left"></td>
                    <td class="border px-2 py-1 text-right"><b>${fEur0(rLAP.PALET_COMPLETOS_PC)}</b></td>
                    <td class="border px-2 py-1 text-right"><b>${fEur0(rLAP.PALET_PICKING_PC)}</b></td>
                    <td class="border px-2 py-1 text-center"><b>${rLAP.TOTAL_REFERENCIAS}</b></td>
                    <td class="border px-2 py-1 text-center"><b>${rLAP.TOTAL_LINEAS_PED}</b></td>
                    <td class="border px-2 py-1 text-center"><b>${fEur0(rLAP.TOTAL_CAJAS)}</b></td>
                    <td class="border px-2 py-1 text-left"></td>
                    <td class="border px-2 py-1 text-left"></td>
                </tr>`;

                html += `<tr>
                    <td class="border px-2 py-1 text-left"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-right"></td>
                    <td class="border px-2 py-1 text-right"></td>
                    <td class="border px-2 py-1 text-left"></td>
                    <td class="border px-2 py-1 text-right"><b>% ${fEur0(rLAP.PORCENTAJE_COMPLETOS)}</b></td>
                    <td class="border px-2 py-1 text-right"><b>% ${fEur0(rLAP.PORCENTAJE_PICKING)}</b></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-left"></td>
                    <td class="border px-2 py-1 text-left"></td>
                </tr>`;
           
            document.getElementById('tableLAP').innerHTML = html;
        } else {
            document.getElementById('tableLAP').innerHTML = '<br> No hay pedidos para las fechas seleccionadas..';
        }
    }).catch(e => {
        showM('LAP ERROR '+e, 'error');
        document.getElementById('tableLAP').innerHTML = e;
    });
}


/* EXCEL */

async function createExcelLAP() {

    if (!pedidosLAP || !pedidosLAP.pedidos) {
        alert("No hay datos para exportar");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Analisis Pedido");

    const COLOR_HEADER = "FF4F46E5";   // mismo color que usas

    // ========= TÍTULO (FILA 1, MISMO TAMAÑO QUE EL RESTO) =========
    sheet.mergeCells("A1:N1");
    const t = sheet.getCell("A1");

    t.value = `Panel de Análisis de Pedido  —  Desde ${formatDateToEuropean(dateFromLAP)}  Hasta ${formatDateToEuropean(dateToLAP)}`;
    t.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };   // tamaño normal
    t.alignment = { horizontal: "center" };
    t.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER } };

    // ========= CABECERAS (FILA 2) =========
    const headers = [
        "Pedido","Fecha Pedido","Fecha Carga","Fecha Entrega",
        "Palets","Kg","Cliente",
        "Pal. Complet.","Pal. Picking",
        "Num. Referen.","Ped. Lineas","Cant. Cajas",
        "Serie HC","Num. HC"
    ];

    sheet.addRow(headers);
    const headerRow = sheet.getRow(2);

    headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };   // texto blanco
        cell.alignment = { horizontal: "center" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLOR_HEADER }   // MISMO COLOR DEL TÍTULO
        };
        cell.border = {
            top:{style:"thin"},left:{style:"thin"},
            bottom:{style:"thin"},right:{style:"thin"}
        };
    });

    // ========= DATOS (desde fila 3) =========
    pedidosLAP.pedidos.forEach(l => {
        sheet.addRow([
            l.order_id,
            l.fecha_pedido,
            l.fecha_carga,
            notNone(l.fecha_entrega),
            l.palets_total,
            l.kg,
            l.cliente,
            l.palets_complet,
            l.palets_de_pick,
            l.num_referencias,
            l.lineas_pedido,
            l.cant_cajas,
            l.serie_hoja_carga,
            l.numero_hoja_carga
        ]);
    });

    // ========= TOTALES =========
    const r = pedidosLAP.resumen;

    sheet.addRow([
        "", "", "", "",
        r.TOTAL_PALETS,
        r.TOTAL_KG,
        "",
        r.PALET_COMPLETOS_PC,
        r.PALET_PICKING_PC,
        r.TOTAL_REFERENCIAS,
        r.TOTAL_LINEAS_PED,
        r.TOTAL_CAJAS,
        "", ""
    ]).eachCell(c => c.font = { bold: true });

    // ========= PORCENTAJES =========
    sheet.addRow([
        "", "", "", "",
        "",
        "",
        "",
        "% " + r.PORCENTAJE_COMPLETOS,
        "% " + r.PORCENTAJE_PICKING,
        "", "", "", "", ""
    ]);

    // ========= ANCHO COLUMNAS =========
    sheet.columns = [
        { width: 14 },{ width: 14 },{ width: 14 },{ width: 14 },
        { width: 10 },{ width: 12 },{ width: 40 },
        { width: 12 },{ width: 12 },{ width: 14 },
        { width: 12 },{ width: 14 },{ width: 10 },{ width: 10 }
    ];

    // ========= DESCARGAR =========
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `analisis_pedidos_${dateFromLAP}_${dateToLAP}.xlsx`;
    a.click();
}
