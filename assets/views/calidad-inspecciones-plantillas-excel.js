function calidadInspeccionesPlantillasExcelInit(){
    document.title = 'Plantillas Excel';
    document.getElementById('slugTitle').innerHTML = '<span class="b-top-page" onclick="loadTemplateCIPE()">➕ Cargar Plantilla</span>';
}

function loadTemplateCIPE(){
    if(!document.getElementById('inputPlantillaExcel')){
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'inputPlantillaExcel';
        input.accept = '.xlsx,.xls';
        input.style.display = 'none';
        input.addEventListener('change', onPlantillaExcelSelected);
        document.body.appendChild(input);
    }

    const input = document.getElementById('inputPlantillaExcel');
    if(!input) return;
    input.value = '';
    input.click();
}

function onPlantillaExcelSelected(e){
    const file = e.target.files[0];
    if(!file) return;

    const fileName = (file.name || '').toLowerCase().trim();

    if(!fileName.endsWith('.xlsx')){ // && !fileName.endsWith('.xls')
        alert('El archivo seleccionado no es un Excel válido .xlsx');
        e.target.value = '';
        return;
    }

    console.log('Archivo Excel seleccionado:', file);
    console.log('Nombre:', file.name);
    console.log('Tamaño:', file.size);

    uploadPlantillaExcel(file);
}

function uploadPlantillaExcel(file){
    let formData = new FormData();
    formData.append('file', file);

    fetch(HTTP_HOST + 'calidad/upload/0/0/inspecciones_calidad/', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(r => {
        if(r && r.status == 200){ console.log(r)
            showM('Plantilla subida correctamente', 'success');
            console.log(r);
        } else {
            showM(r.data.error || 'Error subiendo la plantilla', 'error');
        }
    })
    .catch(e => {
        showM(e, 'error');
    });
}