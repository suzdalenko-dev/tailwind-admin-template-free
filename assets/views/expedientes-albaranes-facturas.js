var excelData = [];
var dateFromEAF;
var dateToEAF;

function expedientesAlbaranesFacturasInit() {

    document.title = "Expedientes importación";
    document.getElementById('slugTitle').innerHTML = '<span class="b-top-page" onclick="createExcelExpedientes()">📥 Excel</span>';

    setDateToInputEAF();

    renderCalendarioExpedientes();
}

function setDateToInputEAF(){
    dateFromEAF = getFirstDayOfCurrentMonth();
    document.getElementById('inputDateFromEAL').value = dateFromEAF;
    dateToEAF   = getLastDayOfCurrentMonth();
    document.getElementById('inputDateHastaToEAL').value = dateToEAF;
}

function changedDateFromEAL(){
    dateFromEAF =  document.getElementById('inputDateFromEAL').value;
    document.getElementById('expedientes_content').innerHTML = 'Cargando datos..';
    renderCalendarioExpedientes();
}
function changedDateToEAL(){
   dateToEAF = document.getElementById('inputDateHastaToEAL').value;
   document.getElementById('expedientes_content').innerHTML = 'Cargando datos..';
   renderCalendarioExpedientes();
}


async function renderCalendarioExpedientes(x) {
    const expedientesData = await loadData(`finanzas/get/0/0/expedientes_importacion/?dateFrom=${dateFromEAF}&dateTo=${dateToEAF}`);
    const expedientes = expedientesData.data || [];
    excelData = expedientes;

    let tableContent = '';

    expedientes.forEach(expediente => {
        const facturas = expediente.FACTURAS || [];

        if (facturas.length === 0) {
            // Si no hay facturas, muestra solo el expediente con columnas vacías
            tableContent += `
                <tr>
                    <td class="border px-2 py-1 text-center">${expediente.CODIGO}</td>
                    <td class="border px-2 py-1 text-center">${expediente.PROVEEDOR}</td>
                    <td class="border px-2 py-1 text-center">${formatLongDate(expediente.FECHA_EXPEDIENTE)}</td>
                    <td class="border px-2 py-1 text-center">${expediente.VALOR_CAMBIO}</td>

                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                    <td class="border px-2 py-1 text-center"></td>
                </tr>`;
        } else {
            // Si hay facturas, renderiza una fila por cada una
            facturas.forEach(factura => {
                tableContent += `
                    <tr>
                        <td class="border px-2 py-1 text-center">${expediente.CODIGO}</td>
                        <td class="border px-2 py-1 text-center">${expediente.PROVEEDOR}</td>
                        <td class="border px-2 py-1 text-center">${formatLongDate(expediente.FECHA_EXPEDIENTE)}</td>
                        <td class="border px-2 py-1 text-center">${expediente.VALOR_CAMBIO}</td>

                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-center">${formatLongDate(factura.V_FECHA_FACTURA)}</td>
                        <td class="border px-2 py-1 text-center">${factura.V_NUMERO_FACTURA}</td>
                        <td class="border px-2 py-1 text-center">${toLN(factura.V_NETO_FACTURA)}</td>
                        <td class="border px-2 py-1 text-center">${factura.V_VALOR_CAMBIO}</td>
                        <td class="border px-2 py-1 text-center">${toFL(factura.valor_factura_suz)}</td>
                        <td class="border px-2 py-1 text-center">${factura.precio_dolar_diario?.VALOR_COMPRA || ''}</td>
                        <td class="border px-2 py-1 text-center">${factura.precio_dolar_mensual?.GN1 || ''}</td>
                    </tr>`;
            });
        }
    });

    const htmlTable = `
        <div style="overflow-x: auto; width: 100%;">
            <table class="w-full table-auto border border-gray-300 text-sm">
                <thead>
                    <tr class="twcolor">
                        <th class="topLeft">Expediente</th>
                        <th>Proveedor</th>
                        <th>Fecha expediente</th>
                        <th>Valor cambio</th>
                        <th>Factura</th>
                        <th>Fecha</th>
                        <th>Numero_fac</th>
                        <th>Importe $</th>
                        <th>Cambio factura</th>
                        <th>Importe €</th>
                        <th>Cambio dia</th>
                        <th class="topRight">Cambio mes</th>    
                    </tr>
                </thead>
                <tbody>${tableContent}</tbody>
            </table>
        </div>`;

    if(document.getElementById('expedientes_content')) document.getElementById('expedientes_content').innerHTML = htmlTable;
    if(expedientes.length == 0){
        document.getElementById('expedientes_content').innerHTML = 'No hay datos..';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toISOString().slice(0, 10);
}


function createExcelExpedientes() {
    const headers = [
        "EXPEDIENTE", "PROVEEDOR", "FECHA_EXPEDIENTE", "VALOR CAMBIO EXPEDIENTE", " ",
        "PENDIENTE", "FECHA", "NUMERO ALB", "DOC INTERNO", "TOTAL NETTO $", "DIVISA", "VALOR CAMBIO ALB", "TOTAL NETTO €", "CAMBIO DIA", "CAMBIO MES", " ",
        "FACTURADOS", "FECHA", "NUMERO ALB", "DOC INTERNO", "TOTAL NETTO $", "DIVISA", "VALOR CAMBIO ALB", "TOTAL NETTO €", "CAMBIO DIA", "CAMBIO MES", " ",
        "NO FACTURABLES", "FECHA", "NUMERO ALB", "DOC INTERNO", "TOTAL NETTO $", "DIVISA", "VALOR CAMBIO ALB", "TOTAL NETTO €", "CAMBIO DIA", "CAMBIO MES", " ",
        "FACTURAS", "FECHA", "NUMERO FACTURA", "IMPORTE $", "CAMBIO EN FACTURA", "IMPORTE €", "CAMBIO DIA", "CAMBIO MES"
    ];

    const rows = [headers];

    excelData.forEach(exp => {
        const pendientes = exp.ALB_PENDIENTE_DE_FACTURAR || [];
        const facturados = exp.ALB_FACTURADOS || [];
        const noFacturables = exp.ALB_NO_FACTURABLES || [];
        const facturas = exp.FACTURAS || [];

        const maxLen = Math.max(pendientes.length, facturados.length, noFacturables.length, facturas.length, 1);

        for (let i = 0; i < maxLen; i++) {
            const pendiente = pendientes[i] || {};
            const facturado = facturados[i] || {};
            const noFact = noFacturables[i] || {};
            const factura = facturas[i] || {};

            rows.push([
                exp.CODIGO,
                `${exp.PROVEEDOR} ${exp.NOMBRE_PROVEEDOR}`,
                formatLongDate(exp.FECHA_EXPEDIENTE),
                exp.VALOR_CAMBIO * 1,
                " ",

                // Pendientes
                " ",
                formatLongDate(pendiente.V_FECHA) || "",
                pendiente.V_NUMERO_DOC_EXT || "",
                pendiente.V_NUMERO_DOC_INTERNO || "",
                toNumberForExcel(pendiente.V_IMPORTE_TOTAL_ALBARAN) || "",
                pendiente.V_DIVISA || "",
                toNumberForExcel(pendiente.cambio_en_linea_albaran?.[0]?.V_CAMBIO) || "",
                pendiente.valor_albaran_suz || "",
                toNumberForExcel(pendiente.precio_dolar_diario?.VALOR_VENTA) || "",
                toNumberForExcel(pendiente.precio_dolar_mensual?.GN1) || "",

                " ",
                // Facturados
                " ",
                formatLongDate(facturado.V_FECHA) || "",
                facturado.V_NUMERO_DOC_EXT || "",
                facturado.V_NUMERO_DOC_INTERNO || "",
                toNumberForExcel(facturado.V_IMPORTE_TOTAL_ALBARAN) || "",
                facturado.V_DIVISA || "",
                toNumberForExcel(facturado.cambio_en_linea_albaran?.[0]?.V_CAMBIO) || "",
                facturado.valor_albaran_suz || "",
                toNumberForExcel(facturado.precio_dolar_diario?.VALOR_VENTA) || "",
                toNumberForExcel(facturado.precio_dolar_mensual?.GN1) || "",

                " ",
                // No facturables
                " ",
                formatLongDate(noFact.V_FECHA) || "",
                noFact.V_NUMERO_DOC_EXT || "",
                noFact.V_NUMERO_DOC_INTERNO || "",
                toNumberForExcel(noFact.V_IMPORTE_TOTAL_ALBARAN)  || "",
                noFact.V_DIVISA  || "",
                toNumberForExcel(noFact.cambio_en_linea_albaran?.[0]?.V_CAMBIO) || "",
                noFact.valor_albaran_suz || "",
                toNumberForExcel(noFact.precio_dolar_diario?.VALOR_VENTA) || "",
                toNumberForExcel(noFact.precio_dolar_mensual?.GN1) || "",

                " ",
                // Factura
                " ",
                formatLongDate(factura.V_FECHA_FACTURA) || "",
                factura.V_NUMERO_FACTURA || "",
                toNumberForExcel(factura.V_NETO_FACTURA)  || "",
                toNumberForExcel(factura.V_VALOR_CAMBIO)  || "",
                factura.valor_factura_suz || "",
                toNumberForExcel(factura.precio_dolar_diario?.VALOR_VENTA) || "",
                toNumberForExcel(factura.precio_dolar_mensual?.GN1) || ""
            ]);
        }
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    const lastRow = rows.length;                                     // última fila con datos
    const lastCol = XLSX.utils.encode_col(headers.length - 1);       // última columna con datos
    worksheet['!autofilter'] = { ref: `A1:${lastCol}${lastRow}` };   // rango a filtrar

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expedientes");
    XLSX.writeFile(workbook, `exp-${dateFromEAF}_${dateToEAF}.xlsx`);
}

