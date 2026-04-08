let dataPIAA = [];

function produccionIndustriaAjustesArticuloInit(){ 
    document.title = 'Ajustes Artículo';
    document.getElementById('slugTitle').innerHTML = ``;
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page" onclick="createExcelPIAA()">📥 Excel </span>`;

    getListArticle();
}

function getListArticle(){
    document.getElementById('tablePIAA').innerHTML = '<tr><td class="border px-2 py-1 text-center" colspan="4">Cargando..</td></tr>';
    
    fetch(HTTP_HOST + '/zzircon/get/0/list_article_frito/').then(r => r.json()).then(r => {
        let html = '';

        if(r && r.data && r.data.length > 0){
            dataPIAA = r.data;

            r.data.map(x => {
                let selectedNull = '';
                let selectedNo   = '';
                let selectedSi   = '';

                if(x.estado_frito === null || x.estado_frito === '' || x.estado_frito === undefined){
                    selectedNull = 'selected';
                } else if(Number(x.estado_frito) == 1){
                    selectedSi = 'selected';
                } else {
                    selectedNo = 'selected';
                }

                let selectedLineaNull = '';
                let selectedLinea0    = '';
                let selectedLinea1    = '';
                let selectedLinea2    = '';
                let selectedLinea3    = '';

                if(x.numero_linea === null || x.numero_linea === '' || x.numero_linea === undefined){
                    selectedLineaNull = 'selected';
                } else if(Number(x.numero_linea) == 0){
                    selectedLinea0 = 'selected';
                } else if(Number(x.numero_linea) == 1){
                    selectedLinea1 = 'selected';
                } else if(Number(x.numero_linea) == 2){
                    selectedLinea2 = 'selected';
                } else if(Number(x.numero_linea) == 3){
                    selectedLinea3 = 'selected';
                }

                let selectedKpiEncoladas   = '';
                let selectedKpiEnharinadas = '';
                let selectedKpiNoAplica    = '';

                if(x.kpi_familia == 'RABAS ENCOLADAS'){
                    selectedKpiEncoladas = 'selected';
                } else if(x.kpi_familia == 'RABAS ENHARINADAS'){
                    selectedKpiEnharinadas = 'selected';
                } else {
                    selectedKpiNoAplica = 'selected';
                }

                let bgRow = '';
                if(
                    x.estado_frito === null || x.estado_frito === '' || x.estado_frito === undefined ||
                    x.numero_linea === null || x.numero_linea === '' || x.numero_linea === undefined
                ){
                    bgRow = 'style="background:#fff7cc;"';
                }

                html += `<tr ${bgRow}>
                    <td class="border px-2 py-1 text-left">${x.name == null ? x.article_erp : x.name}</td>
                    <td class="border px-2 py-1 text-center">
                        <select class="border rounded px-2 py-1" onchange="changeEstadoFrito('${x.article_erp}', this.value)">
                            <option value="" ${selectedNull}>Sin revisar</option>
                            <option value="0" ${selectedNo}>No</option>
                            <option value="1" ${selectedSi}>Sí</option>
                        </select>
                    </td>
                    <td class="border px-2 py-1 text-center">
                        <select class="border rounded px-2 py-1" onchange="changeNumeroLinea('${x.article_erp}', this.value)">
                            <option value="" ${selectedLineaNull}>Sin línea</option>
                            <option value="0" ${selectedLinea0}>FUERA DE LINEA</option>
                            <option value="1" ${selectedLinea1}>1</option>
                            <option value="2" ${selectedLinea2}>2</option>
                            <option value="3" ${selectedLinea3}>3</option>
                        </select>
                    </td>
                    <td class="border px-2 py-1 text-center">
                        <select class="border rounded px-2 py-1" onchange="changeKpiFamilia('${x.article_erp}', this.value)">
                            <option value="RABAS ENCOLADAS" ${selectedKpiEncoladas}>RABAS ENCOLADAS</option>
                            <option value="RABAS ENHARINADAS" ${selectedKpiEnharinadas}>RABAS ENHARINADAS</option>
                            <option value="NO APLICA" ${selectedKpiNoAplica}>NO APLICA</option>
                        </select>
                    </td>
                </tr>`;
            });

            document.getElementById('tablePIAA').innerHTML = html;
        } else {
            dataPIAA = [];
            document.getElementById('tablePIAA').innerHTML = '<tr><td class="border px-2 py-1 text-center" colspan="4">No hay datos..</td></tr>';
        }
    }).catch(e => {
        dataPIAA = [];
        showM(e, 'error');
        document.getElementById('tablePIAA').innerHTML = '<tr><td class="border px-2 py-1 text-center" colspan="4">Error al cargar..</td></tr>';
    });
}

function changeEstadoFrito(article_erp, estado){
    fetch(
        HTTP_HOST + 'zzircon/update/0/list_article_frito/?article_erp=' + 
        encodeURIComponent(article_erp) + 
        '&estado=' + 
        encodeURIComponent(estado)
    )
    .then(r => r.json())
    .then(r => {
        getListArticle();
        if(r && r.data && r.data.ok == 1){
            showM('Guardado correctamente', 'success');
        } else {
            showM('No se pudo guardar', 'error');
        }
    }).catch(e => {
        showM(e, 'error');
    });
}

function changeNumeroLinea(article_erp, numero_linea){
    fetch(
        HTTP_HOST + 'zzircon/update/0/list_article_frito/?article_erp=' + 
        encodeURIComponent(article_erp) + 
        '&numero_linea=' + 
        encodeURIComponent(numero_linea)
    )
    .then(r => r.json())
    .then(r => {
        getListArticle();
        if(r && r.data && r.data.ok == 1){
            showM('Guardado correctamente', 'success');
        } else {
            showM('No se pudo guardar', 'error');
        }
    }).catch(e => {
        showM(e, 'error');
    });
}

function changeKpiFamilia(article_erp, kpi_familia){
    fetch(
        HTTP_HOST + 'zzircon/update/0/list_article_frito/?article_erp=' + 
        encodeURIComponent(article_erp) + 
        '&kpi_familia=' + 
        encodeURIComponent(kpi_familia)
    )
    .then(r => r.json())
    .then(r => {
        getListArticle();
        if(r && r.data && r.data.ok == 1){
            showM('Guardado correctamente', 'success');
        } else {
            showM('No se pudo guardar', 'error');
        }
    }).catch(e => {
        showM(e, 'error');
    });
}

function createExcelPIAA(){
    if(!dataPIAA || dataPIAA.length === 0){
        showM("No hay datos para exportar", "warning");
        return;
    }

    let ws_data = [
        ['Artículo', 'Frito Sí/No', 'Número de línea de producción', 'Grupo KPI de Rendimiento']
    ];

    dataPIAA.forEach(x => {
        let articulo = x.name == null ? x.article_erp : x.name;
        let estado_frito = 'Sin revisar';
        let numero_linea = 'Sin línea';
        let kpi_familia  = 'NO APLICA';

        if(x.estado_frito !== null && x.estado_frito !== '' && x.estado_frito !== undefined){
            estado_frito = Number(x.estado_frito) == 1 ? 'Sí' : 'No';
        }

        if(x.numero_linea !== null && x.numero_linea !== '' && x.numero_linea !== undefined){
            if(Number(x.numero_linea) == 0){
                numero_linea = 'FUERA DE LINEA';
            } else {
                numero_linea = x.numero_linea;
            }
        }

        if(x.kpi_familia !== null && x.kpi_familia !== '' && x.kpi_familia !== undefined){
            kpi_familia = x.kpi_familia;
        }

        ws_data.push([
            articulo,
            estado_frito,
            numero_linea,
            kpi_familia
        ]);
    });

    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PIAA");

    let now = new Date();
    let timestamp =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") + "_" +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0");

    let nombreArchivo = `Articulos_Fritos_Linea_KPI_${timestamp}.xlsx`;

    XLSX.writeFile(wb, nombreArchivo);
}

/*
40008 No
*/