function produccionIndustriaAjustesArticuloInit(){ 
    document.title = 'Ajustes Artículo';
    document.getElementById('slugTitle').innerHTML = ``;

    getListArticle();
}

function getListArticle(){
    document.getElementById('tablePIAA').innerHTML = '<tr><td class="border px-2 py-1 text-center" colspan="3">Cargando..</td></tr>';
    
    fetch(HTTP_HOST + '/zzircon/get/0/list_article_frito/').then(r => r.json()).then(r => {
        let html = '';

        if(r && r.data && r.data.length > 0){
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

                let bgRow = '';
                if(x.estado_frito === null || x.estado_frito === '' || x.estado_frito === undefined){
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
                </tr>`;
            });

            document.getElementById('tablePIAA').innerHTML = html;
        } else {
            document.getElementById('tablePIAA').innerHTML = '<tr><td class="border px-2 py-1 text-center" colspan="3">No hay datos..</td></tr>';
        }
    }).catch(e => {
        showM(e, 'error');
        document.getElementById('tablePIAA').innerHTML = '<tr><td class="border px-2 py-1 text-center" colspan="3">Error al cargar..</td></tr>';
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