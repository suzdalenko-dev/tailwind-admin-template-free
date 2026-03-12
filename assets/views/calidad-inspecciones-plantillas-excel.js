function calidadInspeccionesPlantillasExcelInit(){
    document.title = 'Plantillas Excel';
    document.getElementById('slugTitle').innerHTML = '<span class="b-top-page" onclick="loadTemplateCIPE()">➕ Cargar Plantilla</span>';

    getTemplatesCIPE();
}

function loadTemplateCIPE(){
    if(!document.getElementById('inputPlantillaExcel')){
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'inputPlantillaExcel';
        input.accept = '.xlsx';
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
        getTemplatesCIPE();
    })
    .catch(e => {
        getTemplatesCIPE();
        showM(e, 'error');
    });
}

function getTemplatesCIPE(){
    document.getElementById('tableCIPE').innerHTML = '<br> Cargando..';
    fetch(HTTP_HOST+'calidad/all/0/0/inspecciones_calidad/').then(r => r.json()).then(r => {
        console.log(r)
        if (r && r.data && r.data.templates.length > 0){
            let html = '';
            r.data.templates.map(l => {
                html += `<tr>
                    <td class="border px-2 py-1 text-left">${l.fecha}</td>
                    <td class="border px-2 py-1 text-center hovered">${l.name}</td>
                    <td class="border px-2 py-1 text-center hovered"><span onclick="clickLineTemplate(${l.id}, 'edit_name', '${l.name}')">✏️</span> <span onclick="clickLineTemplate(${l.id}, 'delete', '${l.name}')">🗑️</span></td>
                </tr>`;
                console.log(l)
                document.getElementById('tableCIPE').innerHTML = html;
            });
        } else {
            document.getElementById('tableCIPE').innerHTML = '<br> Plantillas no encontradas.';
        }
    }).catch(e => {
        showM(e, 'error');
    })
}

function clickLineTemplate(id, action, name){
    let proceder = false;
    let prompt_name = '';
    if (action == 'edit_name'){
        prompt_name = prompt('¿Renombrar plantilla?', 'Plantilla');
        if(prompt_name){
            proceder = true;
        } else {
            return;
        }
    }
    if (action == 'delete'){
        let delete1 = prompt(`¿Borrar plantilla? \n ${name} \r Escribe borrar`, '');
        if (delete1 == 'borrar'){
            proceder = true;
        } else {
            return;
        }
    }
    if(proceder){
        let formData = new FormData();
        formData.append('plantilla_id', id);
        formData.append('prompt_name', prompt_name);

        fetch(HTTP_HOST+`calidad/${action}/0/0/inspecciones_calidad/`, {
            method: 'POST', body: formData
        }).then(r => r.json()).then(r => {
            getTemplatesCIPE();
        }).catch(e => {
            getTemplatesCIPE();
        });
    }
    proceder = false;
}