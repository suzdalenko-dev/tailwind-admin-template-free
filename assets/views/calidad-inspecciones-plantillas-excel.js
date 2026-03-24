function calidadInspeccionesPlantillasExcelInit(){
    document.title = 'Plantillas Excel';
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="openQualityInspection()">🔍 Realizar inspección de calidad</span>
        <span class="b-top-page" onclick="loadTemplateCIPE()">➕ Cargar Plantilla</span>
    `;

    getTemplatesCIPE();
}

function openQualityInspection(){
    window.location.href = '/dashboard/calidad-inspeccion';
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
                    <td class="border px-2 py-1 text-left">${l.name}</td>
                    <td class="border px-2 py-1 text-center hovered"><span onclick="clickDownloadCIPE(${l.id})">⬇️</span> </td>
                    <td class="border px-2 py-1 text-center hovered"><span onclick="clickLineTemplate(${l.id}, 'edit_name', '${l.name}')">✏️</span> </td>
                    <td class="border px-2 py-1 text-center hovered"><span onclick="clickLineTemplate(${l.id}, 'delete', '${l.name}')">🗑️</span></td>
                </tr>`;
            });
            document.getElementById('tableCIPE').innerHTML = html;
        } else {
            document.getElementById('tableCIPE').innerHTML = '<br> Plantillas no encontradas.';
        }
    }).catch(e => {
        showM(e, 'error');
    })
}

function clickDownloadCIPE(template_id){
    fetch(HTTP_HOST+'calidad/download/0/0/inspecciones_calidad/?template_id='+template_id).then(r => r.json()).then(r => {
        if (r && r.status == 200 && r.data) {
            createExcelCIPE(r.data);
        } else {
            showM('No se ha podido descargar la plantilla', 'error');
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



/// download excel:
function clickDownloadCIPE(template_id){
    fetch(HTTP_HOST + 'calidad/download/0/0/inspecciones_calidad/?template_id=' + template_id)
    .then(r => r.json())
    .then(r => {
        if (r && r.status == 200 && r.data) {
            createExcelCIPE(r.data);
        } else {
            showM('No se ha podido descargar la plantilla', 'error');
        }
    }).catch(e => {
        showM(e, 'error');
    });
}

function clickDownloadCIPE(template_id){
    fetch(HTTP_HOST + 'calidad/download/0/0/inspecciones_calidad/?template_id=' + template_id)
    .then(r => r.json())
    .then(r => {
        if (r && r.status == 200 && r.data) {
            createExcelCIPE(r.data);
        } else {
            showM('No se ha podido descargar la plantilla', 'error');
        }
    }).catch(e => {
        showM(e, 'error');
    });
}

async function createExcelCIPE(raw) {
    try {
        const workbook = new ExcelJS.Workbook();

        const sheetName = sanitizeExcelSheetName(raw.fecha || 'Plantilla');
        const fileName = sanitizeExcelFileName(raw.name || 'plantilla_inspeccion') + '.xlsx';

        const sheet = workbook.addWorksheet(sheetName);

        const COLOR_HEADER = '00751B';

        function setBorder(cell) {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }

        function styleCell(cell, fillColor = null, bold = false, fontColor = null, align = 'left') {
            if (fillColor) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: fillColor }
                };
            }

            cell.font = {
                bold: !!bold,
                color: fontColor ? { argb: fontColor } : undefined
            };

            cell.alignment = {
                horizontal: align,
                vertical: 'middle',
                wrapText: true
            };

            setBorder(cell);
        }

        const lines = Array.isArray(raw.lines) ? raw.lines : [];

        // La primera línea real del archivo son las cabeceras
        // ZONA | MAQUINA | COMPONENTE
        lines.forEach((item, index) => {
            const row = sheet.getRow(index + 1);

            row.getCell(1).value = item.column1 || '';
            row.getCell(2).value = item.column2 || '';
            row.getCell(3).value = item.column3 || '';

            if (index === 0) {
                row.eachCell(cell => {
                    styleCell(cell, COLOR_HEADER, true, 'FFFFFFFF', 'center');
                });
            } else {
                row.eachCell(cell => {
                    styleCell(cell, null, false, null, 'left');
                });
            }

            row.commit();
        });

        // Anchos
        sheet.getColumn(1).width = 28; // ZONA
        sheet.getColumn(2).width = 40; // MAQUINA
        sheet.getColumn(3).width = 80; // COMPONENTE

        // Congelar cabecera
        sheet.views = [{ state: 'frozen', ySplit: 1 }];

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();

        setTimeout(() => URL.revokeObjectURL(a.href), 1000);

    } catch (e) {
        console.error(e);
        showM('Error al generar el Excel', 'error');
    }
}

function sanitizeExcelFileName(name) {
    return String(name || 'archivo')
        .replace(/[\\\/:*?"<>|]+/g, '_')
        .trim();
}

function sanitizeExcelSheetName(name) {
    return String(name || 'Hoja1')
        .replace(/[\[\]\*\/\\\?\:]+/g, ' ')
        .trim()
        .slice(0, 31) || 'Hoja1';
}


