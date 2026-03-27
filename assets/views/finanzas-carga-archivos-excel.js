let defaultFileName = 'Q1002';

function finanzasCargaArchivosExcelInit(){
    document.getElementById('slugTitle').innerHTML = `<span onclick="selectFileFCAE('Q1002')" class="b-links">Q1002</span>
                                                      <span onclick="selectFileFCAE('Q1006')" class="b-links">Q1006</span>
                                                      <span onclick="selectFileFCAE('Q1008')" class="b-links">Q1008</span>
                                                      <span onclick="selectFileFCAE('Q1011')" class="b-links">Q1011</span>
                                                      <span class="b-links" onclick="loadTemplateFCAE()">➕ Cargar Excel</span>
                                                      <span class="b-links" onclick="procesarArchivosFCAE()">⚙️ Procesar</span>
                                                      `;
    document.title = 'Listado de archivos Excel para el dashboard financiero';


}

function selectFileFCAE(fileName){

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