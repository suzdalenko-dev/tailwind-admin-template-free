let dataPCCC = []
let currentMonthPCCC;
let dateFromPCCC = '2025-01-01';
let dateTOPCCC   = '2025-12-31';
function produccionComparacionCostesContabilidadInit(){
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page" onclick="createExcelPCCC()">📥 Excel </span>`;
    document.title = "Comparación de costes en producción y contabilidad";

    initPagePCCC()
}

function initPagePCCC(){
    currentMonthPCCC = parseHashRoute();
    currentMonthPCCC = currentMonthPCCC.params.month;
    
    if(!currentMonthPCCC){
        let globalMonthPCCC = getCurrentYearMonth();
        window.location = `/dashboard/#produccion-comparacion-costes-contabilidad?month=${globalMonthPCCC}`
    } else {
        setPageTitlePCCC(currentMonthPCCC);
        let [mm, yyyy] = currentMonthPCCC.split("/").map(Number);
        dateFromPCCC   = `${yyyy}-${String(mm).padStart(2, "0")}-01`;
        let lastDay = new Date(yyyy, mm, 0).getDate();
        dateToPCCC = `${yyyy}-${String(mm).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
        getDateRangePCCC(dateFromPCCC, dateToPCCC);
    }
}

function cambiarMesPCCC(delta){
    let [mm, yyyy] = currentMonthPCCC.split("/").map(Number);
    let d = new Date(yyyy, mm - 1, 1);
    d.setMonth(d.getMonth() + delta);
    let newMonth = String(d.getMonth() + 1).padStart(2, "0");
    let newYear = d.getFullYear();

    currentMonthPCCC = `${newMonth}/${newYear}`;
    setPageTitlePCCC(currentMonthPCCC);    
}

function setPageTitlePCCC(monthYear){
    document.getElementById('titlePCCC').innerHTML = `Comparación de costes en producción y contabilidad ${monthYear}`;
    window.location = `/dashboard/#produccion-comparacion-costes-contabilidad?month=${monthYear}`
}

function getDateRangePCCC(from, to){
    fetch(HTTP_HOST+'produccion/get/0/0/produccion_vs_contabilidad/?from='+from+'&to='+to).then(r => r.json()).then(r => { console.log(r.data.res[0]);
        if(r && r.data && r.data.res && r.data.res.length > 0){
            dataPCCC = r.data.res;
            document.getElementById('loadPCCC').innerHTML = '';
            let htmlPCCC = '';
            let sumaCerradas    = 0;
            let absolutCerradas = 0;

            let suma_total      = 0;
            let suma_absoluta   = 0;
            let dif = 0;
            r.data.res.map(x => {
                htmlPCCC += `
                    <tr>
                        <td class="border px-2 py-1 text-center">${x.ORDEN_DE_FABRICACION}</td>
                        <td class="border px-2 py-1 text-left">${x.NOMBRE_OF}</td>
                        <td class="border px-2 py-1 text-right">${formatLongDate(x.FECHA_CIERRE)}</td>
                        <td class="border px-2 py-1 text-right">${fmt0(x.KG_FABRICADOS)}</td>
                        <td class="border px-2 py-1 text-right">${fmt2(x.TOTAL_COSTE_INDRECTO_AND_MANO_OBRA)}</td>
                        <td class="border px-2 py-1 text-right">${fmt2(x.IMP_CONTA)}</td>
                        <td class="border px-2 py-1 text-right">${fmt2(x.TOTAL_COSTE_INDRECTO_AND_MANO_OBRA - x.IMP_CONTA)}</td>
                    </tr>
                `;
                dif = x.TOTAL_COSTE_INDRECTO_AND_MANO_OBRA - x.IMP_CONTA;
                if(x.STATUS_OF == 'C'){
                    sumaCerradas += dif;
                    absolutCerradas += Math.abs(dif);
                }
                suma_total += dif;
                suma_absoluta += Math.abs(dif);
            });
            document.getElementById('tablePCCC').innerHTML = htmlPCCC;
            document.getElementById('ofCerrdasSumaTotalPCCC').innerHTML = fmt2(sumaCerradas);
            document.getElementById('ofCerradassumaAbsolutaPCCC').innerHTML = fmt2(absolutCerradas);
            document.getElementById('sumaTotalPCCC').innerHTML = fmt2(suma_total);
            document.getElementById('sumaAbsolutaPCCC').innerHTML = fmt2(suma_absoluta);
        } else {
            showM('No hay datos para este periodo', 'warning');
            document.getElementById('loadPCCC').innerHTML = 'No hay datos..';
        }
    }).catch(e => {
        showM(e, 'error');
    });
} 


function createExcelPCCC(){
    if(!dataPCCC || dataPCCC.length === 0){
        showM("No hay datos para exportar", "warning");
        return;
    }

    let sumaCerradas    = 0;
    let absolutCerradas = 0;
    let suma_total      = 0;
    let suma_absoluta   = 0;

    // Calcular sumas
    dataPCCC.forEach(x => {
        let dif = x.TOTAL_COSTE_INDRECTO_AND_MANO_OBRA - x.IMP_CONTA;
        if (x.STATUS_OF === "C") {
            sumaCerradas += dif;
            absolutCerradas += Math.abs(dif);
        }
        suma_total += dif;
        suma_absoluta += Math.abs(dif);
    });

    // Encabezado con sumas
    let ws_data = [
        [
            "OFs cerradas (sum. diferencias)",
            "OFs cerradas (sum. diferencias absolutas)",
            "Total (sum de diferencias)",
            "Total absoluto"
        ],
        [
            sumaCerradas,
            absolutCerradas,
            suma_total,
            suma_absoluta
        ],
        [], // línea vacía
        ["OF", "Nombre", "Fecha Cierre", "Kg", "Coste Producción", "Coste Contabilidad", "Diferencia"]
    ];

    // Agregar los datos
    dataPCCC.forEach(x => {
        let dif = x.TOTAL_COSTE_INDRECTO_AND_MANO_OBRA - x.IMP_CONTA;
        ws_data.push([
            x.ORDEN_DE_FABRICACION,
            x.NOMBRE_OF,
            formatLongDate(x.FECHA_CIERRE),
            x.KG_FABRICADOS * 1,
            x.TOTAL_COSTE_INDRECTO_AND_MANO_OBRA * 1,
            x.IMP_CONTA * 1,
            dif * 1
        ]);
    });

    // Crear hoja y libro
    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PCCC");

    // Nombre del archivo con fecha y hora actual (incluye hora, min, sec)
    let now = new Date();
    let timestamp = 
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") + "_" +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0");

    let nombreArchivo = `Comparacion_Costes_PCCC_${timestamp}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(wb, nombreArchivo);
}
