let dateFromCII = getTodayMinusYears(1);
let dateToCII   = getTodayMinusYears(0);

function calidadInspeccionesInformeInit(){
    document.title = 'Informes Inspección Calidad';
    document.getElementById('slugTitle').innerHTML = '';

    initDateCII();
    getInspectionData();
}

function initDateCII(){
    document.getElementById('ifFromDateCII').value = dateFromCII;
    document.getElementById('idToDateCII').value   = dateToCII;
}

function changeDateCII(){
    dateFromCII = document.getElementById('ifFromDateCII').value;
    dateToCII   = document.getElementById('idToDateCII').value;
    getInspectionData();
}

function getInspectionData(){
    document.getElementById('tableCII').innerHTML = '<br> Cargando..';

    fetch(HTTP_HOST + `calidad/get_inspection_data/0/0/inspecciones_calidad/?date_from=${dateFromCII}&date_to=${dateToCII}`)
        .then(r => r.json())
        .then(r => {
            if (r && r.status === 200 && r.data && Array.isArray(r.data.cab_lins) && r.data.cab_lins.length > 0) {
                let html = '';

                r.data.cab_lins.forEach(l => {
                    html += `<tr>
                        <td class="border px-2 py-1 text-left">${escapeHtml(l.id)}</td>
                        <td class="border px-2 py-1 text-left">${escapeHtml(l.fecha_inicio || '')}</td>
                        <td class="border px-2 py-1 text-left">${escapeHtml(l.name || '')}</td>
                        <td class="border px-2 py-1 text-left">${escapeHtml(l.operario || '')}</td>
                        <td class="border px-2 py-1 text-left">${escapeHtml(getS(l.state))}</td>
                        <td class="border px-2 py-1 text-center hovered"><span onclick="downloadCII(${Number(l.id)})">⬇️</span></td>
                        <td class="border px-2 py-1 text-center hovered"><span onclick="deleteCII(${Number(l.id)})">🗑️</span></td>
                    </tr>`;
                });

                document.getElementById('tableCII').innerHTML = html;
            } else {
                document.getElementById('tableCII').innerHTML = '<br> Documentos no encontrados';
            }
        })
        .catch(e => {
            console.error(e);
            document.getElementById('tableCII').innerHTML = '<br> Error al cargar datos';
            showM('Error al cargar inspecciones', 'error');
        });
}

function downloadCII(id){
    fetch(HTTP_HOST + `calidad/download_excel_insp/0/0/inspecciones_calidad/?cab_res=${id}`)
        .then(r => r.json())
        .then(r => {
            if (r && r.status === 200 && r.data) {
                createExcelFileCII(r.data);
            } else {
                showM((r && r.message) ? r.message : 'No se pudo descargar la inspección', 'error');
            }
        })
        .catch(e => {
            console.error(e);
            showM('Error al obtener los datos del Excel', 'error');
        });
}

function deleteCII(id){
    let deleteQ = prompt('Eliminar resultados inspección #' + id + ' \nEscribe borrar');

    if (deleteQ !== 'borrar') return;

    // CAMBIA ESTA URL por la real de borrado que tengas en backend
    fetch(HTTP_HOST + `calidad/delete_inspection_result/0/0/inspecciones_calidad/?cab_res=${id}`)
        .then(r => r.json())
        .then(r => {
            if (r && r.status == 200) {
                showM('Inspección eliminada');
                getInspectionData();
            } else {
                showM((r && r.message) ? r.message : 'No se pudo eliminar', 'error');
            }
        })
        .catch(e => {
            console.error(e);
            showM('Error al eliminar la inspección', 'error');
        });
}

function getS(x){
    if (Number(x) === 1) return 'Completado';
    return 'Borrador';
}

async function createExcelFileCII(raw){
    try {
        const workbook = new ExcelJS.Workbook();

        const name       = raw['cabezera.name'] || 'Inspeccion';
        const fecha      = raw['cabezera.fecha_inicio'].slice(0, 10) || '';
        const operario   = raw['cabezera.operario'] || '';
        const estado     = getS(raw['cabezera.state']);
        const cabRes     = raw['cab_res'] || '';
        const lines      = Array.isArray(raw.lines_respons) ? raw.lines_respons : [];

        const sheetName = sanitizeExcelSheetName(name || 'Inspeccion');
        const fileName  = sanitizeExcelFileName(`${name}_${fecha}`) + '.xlsx';

        const sheet = workbook.addWorksheet(sheetName);

        const COLOR_GREEN = '00751B';
        const COLOR_GRAY  = 'D9D9D9';
        const COLOR_WHITE = 'FFFFFFFF';

        function setBorder(cell) {
            cell.border = {
                top:    { style: 'thin' },
                left:   { style: 'thin' },
                bottom: { style: 'thin' },
                right:  { style: 'thin' }
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

        // Fila 1: título en una sola línea
        sheet.mergeCells('A1:E1');
        sheet.getCell('A1').value = `INSPECCIÓN: ${name} | FECHA: ${fecha} | OPERARIO: ${operario}`;
        styleCell(sheet.getCell('A1'), COLOR_GREEN, true, COLOR_WHITE, 'center');
        sheet.getRow(1).height = 24;

        // Fila 2: info extra
        sheet.mergeCells('A2:E2');
        sheet.getCell('A2').value = `ID: ${cabRes} | ESTADO: ${estado}`;
        styleCell(sheet.getCell('A2'), null, false, null, 'left');
        sheet.getRow(2).height = 20;

        // Fila 4: cabeceras
        const headerRowIndex = 4;
        const headerRow = sheet.getRow(headerRowIndex);

        headerRow.getCell(1).value = raw['question_lines.column1'] || 'ZONA';
        headerRow.getCell(2).value = raw['question_lines.column2'] || 'MAQUINA';
        headerRow.getCell(3).value = raw['question_lines.column3'] || 'COMPONENTE';
        headerRow.getCell(4).value = 'RESPUESTA';
        headerRow.getCell(5).value = 'OBSERVACIONES';

        headerRow.eachCell(cell => {
            styleCell(cell, COLOR_GREEN, true, COLOR_WHITE, 'center');
        });
        headerRow.height = 22;
        headerRow.commit();

        // Datos
        let rowIndex = headerRowIndex + 1;

        lines.forEach(item => {
            const row = sheet.getRow(rowIndex);

            row.getCell(1).value = item.column1 || '';
            row.getCell(2).value = item.column2 || '';
            row.getCell(3).value = item.column3 || '';
            row.getCell(4).value = item.column_res || '';
            row.getCell(5).value = item.observations || '';

            for (let i = 1; i <= 5; i++) {
                styleCell(row.getCell(i), null, false, null, i === 4 ? 'center' : 'left');
            }

            row.commit();
            rowIndex++;
        });

        // Auto filtro
        sheet.autoFilter = {
            from: { row: headerRowIndex, column: 1 },
            to:   { row: headerRowIndex, column: 5 }
        };

        // Congelar cabecera
        sheet.views = [{ state: 'frozen', ySplit: headerRowIndex }];

        // Anchos
        sheet.getColumn(1).width = 28; // ZONA
        sheet.getColumn(2).width = 42; // MAQUINA
        sheet.getColumn(3).width = 55; // COMPONENTE
        sheet.getColumn(4).width = 16; // RESPUESTA
        sheet.getColumn(5).width = 40; // OBSERVACIONES

        // Centrar verticalmente todas las filas usadas
        sheet.eachRow((row) => {
            row.alignment = { vertical: 'middle' };
        });

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

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}