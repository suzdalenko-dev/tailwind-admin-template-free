function finanzasCargaArchivosExcelInit(){
    document.getElementById('slugTitle').innerHTML = `<span class="b-links" onclick="loadTemplateFCAE()">➕ Cargar Excel</span>
                                                      <span class="b-links" onclick="procesarArchivosFCAE()">⚙️ Procesar</span>`;
    document.title = 'Listado de archivos Excel para el dashboard financiero';

    loadFCAE();
}

function loadFCAE(){
    const tbody = document.getElementById('tableFCAE');
    tbody.innerHTML = '<tr><td colspan="5" class="border px-2 py-2 text-center">Cargando..</td></tr>';

    fetch(HTTP_HOST + 'finanzas/get/0/0/dashboard_ms/').then(r => r.json()).then(r => {
            const lines = (((r || {}).data || {}).lines) || [];
            if (!lines.length) {
                tbody.innerHTML = '<tr><td colspan="5" class="border px-2 py-2 text-center">No hay datos</td></tr>';
                return;
            }
            let html = '';
            lines.forEach(line => {
                const files = Array.isArray(line.files) ? line.files : [];
                const q1002 = files.find(f => String(f || '').toLowerCase().startsWith('q1002 ')) || '-';
                const q1006 = files.find(f => String(f || '').toLowerCase().startsWith('q1006 ')) || '-';
                const q1008 = files.find(f => String(f || '').toLowerCase().startsWith('q1008 ')) || '-';
                const q1011 = files.find(f => String(f || '').toLowerCase().startsWith('q1011 ')) || '-';
                html += `<tr>
                            <td class="border px-2 py-1 text-left">${line.fecha || ''}</td>
                            <td class="border px-2 py-1 text-left">${q1002}</td>
                            <td class="border px-2 py-1 text-left">${q1006}</td>
                            <td class="border px-2 py-1 text-left">${q1008}</td>
                            <td class="border px-2 py-1 text-left">${q1011}</td>
                        </tr>`;
            });
            tbody.innerHTML = html;
        }).catch(e => {
            tbody.innerHTML = '<tr><td colspan="5" class="border px-2 py-2 text-center">Error cargando datos</td></tr>';
            showM('Error ' + e);
        });
}


function loadTemplateFCAE(){
    if(!document.getElementById('inputExcel')){
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'inputExcel';
        input.accept = '.xlsx';
        input.style.display = 'none';
        input.addEventListener('change', onPlantillaExcelFile);
        document.body.appendChild(input);
    }

    const input = document.getElementById('inputExcel');
    if(!input) return;
    input.value = '';
    input.click();
}


function onPlantillaExcelFile(e){
    const file = e.target.files[0];
    if(!file) return;
    const fileName = (file.name || '').toLowerCase().trim();
    if(!fileName.endsWith('.xlsx')){ // && !fileName.endsWith('.xls')
        alert('El archivo seleccionado no es un Excel válido .xlsx');
        e.target.value = '';
        return;
    }
    uploadExcelFile(file);
}

function uploadExcelFile(file){
    let formData = new FormData();
    formData.append('file', file);

    fetch(HTTP_HOST + 'finanzas/x/0/0/upload_excel_file/', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(r => {
        if(r && r.data.error){ 
            showM(r.data.error || 'Error subiendo el Excel', 'error');
        } else if (r && r.data.res) {
            showM('Archivo Cargado');
        } else {
            showM('Error desconocido', 'error');
        }
    }).catch(e => {

        showM(e, 'error');
    });
}


function procesarArchivosFCAE(){
   fetch(HTTP_HOST + 'finanzas/x/0/0/update_excels_data/').then(r => r.json()).then(r => {
    showM('Archivos procesados '+ r.data.total_files);
   }).catch(e => {
    showM(e, 'error');
   })
}