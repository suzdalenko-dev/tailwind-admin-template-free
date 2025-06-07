var excelData = []

function expedientesInit() {
    renderCalendarioExpedientes(CURRENT_YEAR);

    document.title = "Expedientes importación";
    document.getElementById('slugTitle').innerHTML = '<span class="b-top-page" onclick="renderCalendarioExpedientes(1)">📥 Excel</span>';
}

function addYearFunc(valueA){
    CURRENT_YEAR = CURRENT_YEAR + valueA;
    renderCalendarioExpedientes(CURRENT_YEAR);
}

async function renderCalendarioExpedientes(x) {
    const tituloYearExpediente = document.getElementById('tituloYearExpediente');
    const firstDayA = new Date(CURRENT_YEAR, 0, 1).toISOString().slice(0, 10);
    const lastDayA = new Date(CURRENT_YEAR, 11, 31).toISOString().slice(0, 10);

    tituloYearExpediente.textContent = `📅 Expedientes importación año ${CURRENT_YEAR}`;

    const expedientesData = await loadData(`finanzas/get/0/0/expedientes_importacion/?dateFrom=${firstDayA}&dateTo=${lastDayA}`);
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
                    <td class="border px-2 py-1 text-center">${formatDate(expediente.FECHA_EXPEDIENTE)}</td>
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
                        <td class="border px-2 py-1 text-center">${formatDate(expediente.FECHA_EXPEDIENTE)}</td>
                        <td class="border px-2 py-1 text-center">${expediente.VALOR_CAMBIO}</td>

                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-center">${formatDate(factura.V_FECHA_FACTURA)}</td>
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

    document.getElementById('expedientes_content').innerHTML = htmlTable;

    if(x == 1){ createExcelExpedientes(); }

    setDefaulContentToLocalStorage();
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
                exp.FECHA_EXPEDIENTE,
                parseFloat(exp.VALOR_CAMBIO).toFixed(10),
                " ",

                // Pendientes
                " ",
                pendiente.V_FECHA || "",
                pendiente.V_NUMERO_DOC_EXT || "",
                pendiente.V_NUMERO_DOC_INTERNO || "",
                pendiente.V_IMPORTE_TOTAL_ALBARAN || "",
                pendiente.V_DIVISA || "",
                pendiente.cambio_en_linea_albaran?.[0]?.V_CAMBIO || "",
                pendiente.valor_albaran_suz || "",
                pendiente.precio_dolar_diario?.VALOR_VENTA || "",
                pendiente.precio_dolar_mensual?.GN1 || "",

                " ",
                // Facturados
                " ",
                facturado.V_FECHA || "",
                facturado.V_NUMERO_DOC_EXT || "",
                facturado.V_NUMERO_DOC_INTERNO || "",
                facturado.V_IMPORTE_TOTAL_ALBARAN || "",
                facturado.V_DIVISA || "",
                facturado.cambio_en_linea_albaran?.[0]?.V_CAMBIO || "",
                facturado.valor_albaran_suz || "",
                facturado.precio_dolar_diario?.VALOR_VENTA || "",
                facturado.precio_dolar_mensual?.GN1 || "",

                " ",
                // No facturables
                " ",
                noFact.V_FECHA || "",
                noFact.V_NUMERO_DOC_EXT || "",
                noFact.V_NUMERO_DOC_INTERNO || "",
                noFact.V_IMPORTE_TOTAL_ALBARAN || "",
                noFact.V_DIVISA || "",
                noFact.cambio_en_linea_albaran?.[0]?.V_CAMBIO || "",
                noFact.valor_albaran_suz || "",
                noFact.precio_dolar_diario?.VALOR_VENTA || "",
                noFact.precio_dolar_mensual?.GN1 || "",

                " ",
                // Factura
                " ",
                factura.V_FECHA_FACTURA || "",
                factura.V_NUMERO_FACTURA || "",
                factura.V_NETO_FACTURA || "",
                factura.V_VALOR_CAMBIO || "",
                factura.valor_factura_suz || "",
                factura.precio_dolar_diario?.VALOR_VENTA || "",
                factura.precio_dolar_mensual?.GN1 || ""
            ]);
        }
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expedientes");
    XLSX.writeFile(workbook, `exp-${CURRENT_YEAR}.xlsx`);
}

