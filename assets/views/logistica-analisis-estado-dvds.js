
let fromAED = '';
let toAED = '';
let excelAED = null;

function logisticaAnalisisEstadoDvdsInit(){
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page" onclick="createExcelAED()">📥 Excel </span>`;
    document.title = "Panel de Análisis de DVDs";

    setTimeAED();
    getDVDs();
}

function setTimeAED(){
    document.getElementById('inputFromAED').value = primerDiaAgno();
    document.getElementById('inputToAED').value   = ultimoDiaAgno();
    fromAED = document.getElementById('inputFromAED').value;
    toAED = document.getElementById('inputToAED').value;
}


function getDVDs(){
    document.getElementById('tableAED').innerHTML = '<br> Cargando...';
    suzdalenkoGet(`logistica/get/0/0/analisis_estado_dvd/?from=${fromAED}&to=${toAED}`,  r => { console.log(r);
        if(r && r.data && r.data.outs && r.data.outs.length > 0){
            excelAED = r.data.outs;
            let html = '';
            r.data.outs.forEach( d => { // console.log(d);
                let FECHA = d.FECHA ? d.FECHA : '';
                let CODIGO = d.CODIGO ? d.CODIGO : '';
                let DESCRIPCION = d.DESCRIPCION ? d.DESCRIPCION : '';

                let entradas = d.entradas;
                if(entradas && entradas.length > 0){
                    entradas.forEach( entrada => { console.log(entrada);
                        html += `<tr>
                            <td class="border px-2 py-1 text-center">${formatDateToEuropean(FECHA)}</td>
                            <td class="border px-2 py-1 text-center">${CODIGO}</td>
                            <td class="border px-2 py-1 text-center">${DESCRIPCION}</td>
                            <td class="border px-2 py-1 text-center">${entrada.CODIGO_ARTICULO}</td>
                            <td class="border px-2 py-1 text-left">${entrada.CODIGO_ARTICULO}</td>
                            <td class="border px-2 py-1 text-left">${entrada.NUMERO_LOTE_INT}</td>
                            <td class="border px-2 py-1 text-right">${entrada.CANTIDAD_ALMACEN1}</td>
                            <td class="border px-2 py-1 text-right">${entrada.consumido}</td>
                            <td class="border px-2 py-1 text-right">${entrada.stock_actual}</td>
                        </tr>`;
                    });
                } else {
                    html += `<tr>
                        <td class="border px-2 py-1 text-center">${formatDateToEuropean(FECHA)}</td>
                        <td class="border px-2 py-1 text-center">${CODIGO}</td>
                        <td class="border px-2 py-1 text-center">${DESCRIPCION}</td>
                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-left"></td>
                        <td class="border px-2 py-1 text-left"></td>
                        <td class="border px-2 py-1 text-right"></td>
                        <td class="border px-2 py-1 text-right"></td>
                        <td class="border px-2 py-1 text-right"></td>
                    </tr>`;
                }

            });
            document.getElementById('tableAED').innerHTML = html;
        } else {
            document.getElementById('tableAED').innerHTML = '<br> No hay datos para mostrar.';
        }
    });
}


function createExcelAED(){
    if (!excelAED || !Array.isArray(excelAED) || excelAED.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Análisis Estado DVDs");

    const COLOR_HEADER = 'fc8888';

    // ===== TÍTULO =====
    sheet.mergeCells("A1:I1");
    const t = sheet.getCell("A1");
    t.value = `Análisis Estado DVDs — ${formatDateToEuropean(fromAED)} a ${formatDateToEuropean(toAED)}`;
    t.font = { bold:true, color:{argb:"FFFFFFFF"}, size:11 };
    t.alignment = { horizontal:"center" };
    t.fill = { type:"pattern", pattern:"solid", fgColor:{argb:COLOR_HEADER} };

    // ===== CABECERAS =====
    const headers = [
        "Fecha",
        "Código",
        "Descripción",
        "ERP Artículo",
        "Artículo",
        "Lote",
        "Cantidad",
        "Consumido",
        "Stock actual"
    ];

    sheet.addRow(headers);

    sheet.getRow(2).eachCell(c => {
        c.font = { bold:true, color:{argb:"FFFFFFFF"} };
        c.alignment = { horizontal:"center", vertical:"middle", wrapText:true };
        c.fill = { type:"pattern", pattern:"solid", fgColor:{argb:COLOR_HEADER} };
        c.border = { top:{style:"thin"}, left:{style:"thin"}, bottom:{style:"thin"}, right:{style:"thin"} };
    });

    // ===== DATOS (aplanar) =====
    excelAED.forEach(d => {
        const FECHA = d.FECHA || '';
        const CODIGO = d.CODIGO || '';
        const DESCRIPCION = d.DESCRIPCION || '';

        const entradas = Array.isArray(d.entradas) ? d.entradas : [];

        if (entradas.length > 0) {
            entradas.forEach(e => {
                const row = sheet.addRow([
                    formatDateToEuropean(FECHA),
                    CODIGO,
                    DESCRIPCION,
                    e.CODIGO_ARTICULO || '',
                    e.CODIGO_ARTICULO || '',   // si tienes descripción real del artículo, ponla aquí
                    e.NUMERO_LOTE_INT || '',
                    Number(e.CANTIDAD_ALMACEN1 || 0),
                    Number(e.consumido || 0),
                    Number(e.stock_actual || 0),
                ]);

                // bordes + alineación
                row.eachCell((cell, colNumber) => {
                    cell.border = { top:{style:"thin"}, left:{style:"thin"}, bottom:{style:"thin"}, right:{style:"thin"} };
                    cell.alignment = {
                        vertical: "middle",
                        horizontal: (colNumber >= 7 ? "right" : (colNumber <= 4 ? "center" : "left"))
                    };
                });
            });
        } else {
            const row = sheet.addRow([
                formatDateToEuropean(FECHA),
                CODIGO,
                DESCRIPCION,
                "",
                "",
                "",
                "",
                "",
                ""
            ]);
            row.eachCell(cell => {
                cell.border = { top:{style:"thin"}, left:{style:"thin"}, bottom:{style:"thin"}, right:{style:"thin"} };
                cell.alignment = { vertical:"middle", horizontal:"center" };
            });
        }
    });

    // ===== FORMATOS / ANCHOS =====
    sheet.columns = [
        { width: 12 }, // Fecha
        { width: 10 }, // Código
        { width: 28 }, // Descripción
        { width: 14 }, // ERP Artículo
        { width: 24 }, // Artículo
        { width: 18 }, // Lote
        { width: 12 }, // Cantidad
        { width: 12 }, // Consumido
        { width: 12 }, // Stock actual
    ];

    // Formato numérico para columnas G/H/I (7,8,9)
    sheet.getColumn(7).numFmt = "#,##0.00";
    sheet.getColumn(8).numFmt = "#,##0.00";
    sheet.getColumn(9).numFmt = "#,##0.00";

    // Fijar cabecera (fila 2) y filtros
    sheet.views = [{ state: "frozen", ySplit: 2 }];
    sheet.autoFilter = {
        from: { row: 2, column: 1 },
        to:   { row: 2, column: 9 }
    };

    // ===== DESCARGA =====
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `analisis_estado_dvds_${fromAED}_${toAED}.xlsx`;
        a.click();
        URL.revokeObjectURL(a.href);
    });
}
