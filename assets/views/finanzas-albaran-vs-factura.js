var excelDataFAF = [];
var dateFromFAF;
var dateToFAF;

function finanzasAlbaranVsFacturaInit() {

    document.title = "Albaran VS Factura";
    document.getElementById('slugTitle').innerHTML = '<span class="b-top-page" onclick="createExcelFAF()">📥 Excel</span>';

    setDateToInputFAF();
    renderVSFAF();
}

function setDateToInputFAF(){
    dateFromFAF = getFirstDayOfCurrentMonth();
    document.getElementById('inputDateFromFAF').value = dateFromFAF;
    dateToFAF   = getLastDayOfCurrentMonth();
    document.getElementById('inputDateToFAF').value = dateToFAF;
}

function changedDateFromFAF(){
    dateFromFAF =  document.getElementById('inputDateFromFAF').value;
    renderVSFAF();
}
function changedDateToFAF(){
    dateToFAF = document.getElementById('inputDateToFAF').value;
    renderVSFAF();
}


async function renderVSFAF() {                                                                                      
    document.getElementById('tableFAF').innerHTML = 'Cargando datos..';
    let lines = await loadData(`finanzas/get/0/0/albaranes_vs_facturas/?date_from=${dateFromFAF}&date_to=${dateToFAF}`);
    lines = lines.data.data || [];
    excelDataFAF = lines;

    let alb98;
    let fact;
    let previosFact = {};
    let albaranesReales;
    let facturasReales;
    let htmlTable = '';

    excelDataFAF.forEach(exp => {                   console.log(exp)
        albaranesReales = exp.albaranes_reales; 
        facturasReales  = exp.facturas_reales; 

        let maxLen = Math.max(albaranesReales.length, facturasReales.length);
      
        let valAlb = 0;
        let valFac = 0;
        let valDif = 0;
        previosFact = {};
        for(let i=0; i<maxLen; i++){
            alb98 = albaranesReales[i] || {};
            fact  = facturasReales[i] || previosFact || {};
            if(fact.NUMERO_FACTURA) previosFact = fact;

            valAlb += parseFloat(alb98.IMPORTE_LIN_NETO_EUR) || 0;
            valFac = parseFloat(fact.LIQUIDO_FACTURA) || 0;
            valDif = valAlb - valFac;

            htmlTable += `
                    <tr>
                        <td class="border px-2 py-1 text-center">${alb98.CAMBIOMES}</td>
                        <td class="border px-2 py-1 text-center">${formatLongDate(alb98.FECHA)}</td>
                        <td class="border px-2 py-1 text-right">${alb98.NUMERO_DOC_EXT}</td>
                        <td class="border px-2 py-1 text-center">${alb98.NUMERO_DOC_INTERNO}</td>
                        <td class="border px-2 py-1 text-center">${alb98.CODIGO_ALMACEN}</td>
                        <td class="border px-2 py-1 text-center">${alb98.CODIGO_PROVEEDOR}</td>
                        <td class="border px-2 py-1 text-right">${fmt2(alb98.IMPORTE_LIN_NETO_DIV_USD)}</td>
                        <td class="border px-2 py-1 text-left">${alb98.CAMBIO}</td>
                        <td class="border px-2 py-1 text-right">${fmt2(alb98.IMPORTE_LIN_NETO_EUR)}</td>

                        <td class="border px-2 py-1 text-right"> </td>

                        <td class="border px-2 py-1 text-center">${fact.FECHA_FACTURA ?? ''}</td>
                        <td class="border px-2 py-1 text-left">${fact.NUMERO_FACTURA ?? ''}</td>
                        <td class="border px-2 py-1 text-center">${maxLen - i == 1 ? fmt2(fact.LIQUIDO_FACTURA_DIV) ?? '': ''}</td>
                        <td class="border px-2 py-1 text-center">${maxLen - i == 1 ? fact.VALOR_CAMBIO ?? '': ''}</td>
                        <td class="border px-2 py-1 text-center">${maxLen - i == 1 ? fmt2(fact.LIQUIDO_FACTURA) ?? '' : ''}</td>
                        <td class="border px-2 py-1 text-right"> ${maxLen - i == 1 ? fmt2(valDif) : ''}</td>
                    </tr>`;
        }           
    });

    if(document.getElementById('tableFAF')) document.getElementById('tableFAF').innerHTML = htmlTable;
    if(excelDataFAF.length == 0){
        document.getElementById('tableFAF').innerHTML   = 'No hay datos..';
    } 
}

function createExcelFAF(){
    let wb = XLSX.utils.book_new();
    let ws_data = [
        ["C/Mes fecha alb.","Fecha alb.","Exp.","Num.","Alm.","Prov.","$ alb.","Cambio alb.","€ alb."," ","Fecha fac.","Num. fac.","$ fac.","Cambio fac.","€ fac.","Dif. alb-fac."]
    ];

    excelDataFAF.forEach(exp => {
        let albaranesReales = exp.albaranes_reales || []; 
        let facturasReales  = exp.facturas_reales  || []; 

        let maxLen = Math.max(albaranesReales.length, facturasReales.length);
        let valAlb = 0;
        let valFac = 0;
        let valDif = 0;  

        let previosFact = {};
        for(let i=0; i<maxLen; i++){
            let alb98 = albaranesReales[i] || {};
            let fact  = facturasReales[i] || previosFact || {};
            if(fact.NUMERO_FACTURA) previosFact = fact;

            valAlb += parseFloat(alb98.IMPORTE_LIN_NETO_EUR) || 0;
            valFac  = parseFloat(fact.LIQUIDO_FACTURA) || 0;
            valDif  = valAlb - valFac;

            ws_data.push([
                toNumberForExcel(alb98.CAMBIOMES) || '',
                formatLongDate(alb98.FECHA) || '',
                alb98.NUMERO_DOC_EXT || '',
                alb98.NUMERO_DOC_INTERNO || '',
                alb98.CODIGO_ALMACEN || '',
                alb98.CODIGO_PROVEEDOR || '',
                toNumberForExcel(alb98.IMPORTE_LIN_NETO_DIV_USD) || '',
                toNumberForExcel(alb98.CAMBIO) || '',
                toNumberForExcel(alb98.IMPORTE_LIN_NETO_EUR) || '',

                ' ',

                fact.FECHA_FACTURA || '',
                fact.NUMERO_FACTURA || '',
                (maxLen - i == 1) && fact.LIQUIDO_FACTURA_DIV > 11 ? toNumberForExcel(fact.LIQUIDO_FACTURA_DIV) : '',
                (maxLen - i == 1) && fact.VALOR_CAMBIO ? toNumberForExcel(fact.VALOR_CAMBIO) : '',
                (maxLen - i == 1) && fact.LIQUIDO_FACTURA ? toNumberForExcel(fact.LIQUIDO_FACTURA) : '',
                (maxLen - i == 1) ? toCents(valDif) : ''
            ]);
        }           
    });
  
    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    const lastRow = ws_data.length;                 // última fila con datos
    const lastColIndex = ws_data[0].length - 1;     // última columna (basado en cabecera)
    ws['!autofilter'] = {
        ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastRow - 1, c: lastColIndex } })
    };
    XLSX.utils.book_append_sheet(wb, ws, "Albaran vs Factura");
    XLSX.writeFile(wb, `albaran_vs_factura_${dateFromFAF}_a_${dateToFAF}.xlsx`);
}
