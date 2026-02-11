
let excelAED = null;

function logisticaAnalisisEstadoDvdsInit(){
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page" onclick="createExcelAED()">📥 Excel </span>`;
    document.title = "Panel de Análisis de DVDs";


    getDVDs();
}



// solo de almacen 02

function getDVDs(){
    document.getElementById('tableAED').innerHTML = '<br> Cargando...';
    suzdalenkoGet(`logistica/get/0/0/analisis_estado_dvd/`,  r => {
        if(r && r.data && r.data.outs && r.data.outs.length > 0){ console.log(r.data.outs);
            excelAED = r.data.outs;
            let html = '';
            r.data.outs.forEach( d => { console.log(d);
        
                        html += `<tr>
                            <td class="border px-2 py-1 text-center">${formatDateToEuropean(d.FECHA)}</td>
                            <td class="border px-2 py-1 text-center">${d.CODIGO_DVD}</td>
                            <td class="border px-2 py-1 text-left">${d.DESCRIPCION}</td>
                            <td class="border px-2 py-1 text-center">${d.CODIGO_ARTICULO}</td>
                            <td class="border px-2 py-1 text-left">${d.DESCRIPCION_ARTICULO}</td>
                            <td class="border px-2 py-1 text-left">${d.NUMERO_LOTE_INT}</td>
                            <td class="border px-2 py-1 text-right">${d.CANTIDAD_ENTRADA}</td>
                            <td class="border px-2 py-1 text-right">${d.SALIDA}</td>
                            <td class="border px-2 py-1 text-right">${d.CANTIDAD_CON}</td>
                        </tr>`;
         
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

    const COLOR_HEADER = 'FFFC8888'; // ExcelJS necesita ARGB (8 chars)

    // ===== TÍTULO =====
    sheet.mergeCells("A1:I1");
    const t = sheet.getCell("A1");
    t.value = `Panel de Análisis de DVDs`;
    t.font = { bold:true, color:{argb:"FFFFFFFF"}, size:11 };
    t.alignment = { horizontal:"center", vertical:"middle" };
    t.fill = { type:"pattern", pattern:"solid", fgColor:{argb:COLOR_HEADER} };

    // ===== CABECERAS (como tu tabla) =====
    const headers = [
        "Fecha",
        "DVD",
        "Descripción",
        "Código",
        "Artículo",
        "Lote",
        "Entrada",
        "Salida",
        "Existencias"
    ];
    sheet.addRow(headers);

    sheet.getRow(2).height = 18;
    sheet.getRow(2).eachCell(c => {
        c.font = { bold:true, color:{argb:"FFFFFFFF"} };
        c.alignment = { horizontal:"center", vertical:"middle", wrapText:true };
        c.fill = { type:"pattern", pattern:"solid", fgColor:{argb:COLOR_HEADER} };
        c.border = { top:{style:"thin"}, left:{style:"thin"}, bottom:{style:"thin"}, right:{style:"thin"} };
    });

    // helper numérico robusto (por si vienen strings "None", "", null, etc.)
    const toNumber = (v) => {
        if (v === null || v === undefined) return 0;
        const s = String(v).trim();
        if (!s || s.toLowerCase() === "none" || s.toLowerCase() === "null") return 0;
        // soporta "1.234,56" y "123,45"
        const normalized = (s.includes(",") && s.includes(".")) ? s.replace(/\./g, "").replace(",", ".")
                          : (s.includes(",") ? s.replace(",", ".") : s);
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
    };

    // ===== DATOS (excelAED plano) =====
    excelAED.forEach(d => {
        const row = sheet.addRow([
            formatDateToEuropean(d.FECHA),
            d.CODIGO_DVD || "",
            d.DESCRIPCION || "",
            d.CODIGO_ARTICULO || "",
            d.DESCRIPCION_ARTICULO || "",
            d.NUMERO_LOTE_INT || "",
            toNumber(d.CANTIDAD_ENTRADA),
            toNumber(d.SALIDA),
            toNumber(d.CANTIDAD_CON),
        ]);

        row.eachCell((cell, colNumber) => {
            cell.border = { top:{style:"thin"}, left:{style:"thin"}, bottom:{style:"thin"}, right:{style:"thin"} };
            // alineación parecida a la tabla: números a la derecha
            if (colNumber >= 7) {
                cell.alignment = { vertical:"middle", horizontal:"right" };
            } else if (colNumber === 1 || colNumber === 2 || colNumber === 4) {
                cell.alignment = { vertical:"middle", horizontal:"center" };
            } else {
                cell.alignment = { vertical:"middle", horizontal:"left" };
            }
        });
    });

    // ===== ANCHOS =====
    sheet.columns = [
        { width: 12 }, // Fecha
        { width: 16 }, // DVD
        { width: 40 }, // Descripción
        { width: 12 }, // Código
        { width: 40 }, // Artículo
        { width: 18 }, // Lote
        { width: 12 }, // Entrada
        { width: 12 }, // Salida
        { width: 12 }, // Existencias
    ];

    // ===== FORMATOS NUMÉRICOS =====
    sheet.getColumn(7).numFmt = "#,##0.00";
    sheet.getColumn(8).numFmt = "#,##0.00";
    sheet.getColumn(9).numFmt = "#,##0.00";

    // ===== CONGELAR + FILTROS =====
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
        a.download = `analisis_estado_dvds.xlsx`;
        a.click();
        URL.revokeObjectURL(a.href);
    });
}
