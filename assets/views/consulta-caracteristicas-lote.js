let allCCL = [];
function consultaCaracteristicasLoteInit(){
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="createExcelCCL()">📥 Excel </span>
        <span class="b-top-page" onclick="createPDFCCL()">📄 PDF </span>
    `;
    document.title = "Consulta caracteristicas de lotes";

    // getDataCCL();
}

function changePaletCCL(x){
    getDataCCL();
}

function changeArticleCCL(x){
    getDataCCL();
}

function searchInputCCl(){
    getDataCCL();
}

function searchPalet(x){
    document.getElementById('searchPaletInputCCL').value   = x;
    document.getElementById('searchArticleInputCCL').value = '';
    getDataCCL();
}

function searchArt(x){
    document.getElementById('searchPaletInputCCL').value   = '';
    document.getElementById('searchArticleInputCCL').value = x;
    getDataCCL();
}

function cleanCCL(){
    document.getElementById('searchPaletInputCCL').value   = '';
    document.getElementById('searchArticleInputCCL').value = '';
    document.getElementById('palArtBody').innerHTML        = '';
}

function getDataCCL(){
    let paletVal   = document.getElementById('searchPaletInputCCL').value.trim();
    let artcileVal = document.getElementById('searchArticleInputCCL').value.trim();

    if(!paletVal){
        paletVal = '';
    }
    if(!artcileVal){
        artcileVal = '';
    }

    fetch(HTTP_HOST+`calidad/get/of/0/caracteristicas_lote/?palet=${paletVal}&article=${artcileVal}`).then(r => r.json()).then(r => {
        if(r && r.data && r.data.res && r.data.res.length > 0){
            allCCL =  r.data.res;
            let html = '';
            allCCL.map(x => {    console.log(x)
                html += `<tr>
                            <td class="border px-2 py-1 text-left hovered" onclick="searchPalet('${notNone(x.NUMERO_PALET)}')">${notNone(x.NUMERO_PALET)}</td>
                            <td class="border px-2 py-1 text-left hovered" onclick="searchArt('${notNone(x.CODIGO_ARTICULO)}')">${notNone(x.CODIGO_ARTICULO)} ${notNone(x.DESCRIP_COMERCIAL)}</td>
                            <td class="border px-2 py-1 text-left">${notNone(x.NUMERO_LOTE_INT)}</td>
                            <td class="border px-2 py-1 text-left">${notNone(x.VALOR_ALFA_1)} ${notNone(x.D_VALOR_ALFA_1)}</td>
                            <td class="border px-2 py-1 text-left">${notNone(x.D_VALOR_ALFA_2)}</td>
                            <td class="border px-2 py-1 text-left">${notNone(x.VALOR_ALFA_3)} ${notNone(x.D_VALOR_ALFA_3)}</td>
                            <td class="border px-2 py-1 text-left">${notNone(x.VALOR_ALFA_4)} ${notNone(x.D_VALOR_ALFA_4)}</td>
                           
                            <td class="border px-2 py-1 text-left">${notNone(x.VALOR_ALFA_7)} ${notNone(x.D_VALOR_ALFA_7)}</td>
                        </tr>`;
            });
            document.getElementById('palArtBody').innerHTML = html;
        } else {
            allCCL = [];
            document.getElementById('palArtBody').innerHTML = '<br><br>Datos no encontrados';
        }
    }).catch(e => {
        showM(e, 'error');
    });
}

/*
<td class="border px-2 py-1 text-left">${notNone(x.VALOR_ALFA_5)} ${notNone(x.D_VALOR_ALFA_5)}</td>
<td class="border px-2 py-1 text-left">${notNone(x.VALOR_ALFA_6)} ${notNone(x.D_VALOR_ALFA_6)}</td>

<td class="border px-2 py-1 text-left">${notNone(x.VALOR_ALFA_8)} ${notNone(x.D_VALOR_ALFA_8)}</td>
<td class="border px-2 py-1 text-left">${notNone(x.VALOR_ALFA_9)} ${notNone(x.D_VALOR_ALFA_9)}</td>
<td class="border px-2 py-1 text-left">${notNone(x.VALOR_ALFA_10)} ${notNone(x.D_VALOR_ALFA_10)}</td>
*/


// EXCEL

function createExcelCCL() {
  try {
    if (!Array.isArray(allCCL) || allCCL.length === 0) {
      (typeof showM === 'function' ? showM('No hay datos para exportar', 'warning') : alert('No hay datos para exportar'));
      return;
    }

    // Helpers (usa tu notNone si existe)
    const safe = (v) => (typeof notNone === 'function' ? notNone(v) : (v == null ? '' : String(v)));
    const join2 = (a, b) => [safe(a), safe(b)].filter(Boolean).join(' ');

    // Cabeceras (mismo orden que pintas en la tabla)
    const header = [
      'Palet',
      'Artículo',
      'Descripción artículo',
      'Lote int',
      'Método de producción',
      'FAO',
      'Arte de pesca',
      'Origen',
      'Código / Especie'
    ];

    // Datos
    const rows = allCCL.map(x => ([
      safe(x.NUMERO_PALET),
      safe(x.CODIGO_ARTICULO),
      safe(x.DESCRIP_COMERCIAL),
      safe(x.NUMERO_LOTE_INT),
      join2(x.VALOR_ALFA_1, x.D_VALOR_ALFA_1),
      safe(x.D_VALOR_ALFA_2),
      join2(x.VALOR_ALFA_3, x.D_VALOR_ALFA_3),
      join2(x.VALOR_ALFA_4, x.D_VALOR_ALFA_4),
      join2(x.VALOR_ALFA_7, x.D_VALOR_ALFA_7)
    ]));

    // Montar workbook/worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);

    // Ajustes de hoja: anchos, congelar cabecera, autofiltro
    ws['!cols'] = [
      { wch: 14 }, // Palet
      { wch: 12 }, // Artículo
      { wch: 30 }, // Descripción
      { wch: 12 }, // Lote int
      { wch: 22 }, // Método prod.
      { wch: 10 }, // FAO
      { wch: 18 }, // Arte de pesca
      { wch: 16 }, // Origen
      { wch: 22 }  // Código / Especie
    ];
    ws['!freeze'] = { xSplit: 0, ySplit: 1 }; // congela primera fila
    if (ws['!ref']) {
      const rng = XLSX.utils.decode_range(ws['!ref']);
      ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: 0, c: rng.e.c } }) };
    }

    XLSX.utils.book_append_sheet(wb, ws, 'CCL');

    // Nombre de archivo con timestamp
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const filename = `CCL_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.xlsx`;

    // Descargar
    XLSX.writeFile(wb, filename);

  } catch (err) {

  }
}



// PDF 

function createPDFCCL() {
  try {
    if (!Array.isArray(allCCL) || allCCL.length === 0) {
      (typeof showM === 'function' ? showM('No hay datos para exportar', 'warn') : alert('No hay datos para exportar'));
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    // Helpers
    const safe  = (v) => (typeof notNone === 'function' ? notNone(v) : (v == null ? '' : String(v)));
    const join2 = (a, b) => [safe(a), safe(b)].filter(Boolean).join(' ');
    const pad   = (n) => String(n).padStart(2, '0');
    const now   = new Date();
    const fdate = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const pageW   = doc.internal.pageSize.getWidth();
    const pageH   = doc.internal.pageSize.getHeight();
    const marginL = 11, marginR = 11, marginTop = 60, marginBot = 11;

    // Lee filtros actuales
    const paletVal   = (document.getElementById('searchPaletInputCCL')?.value || '').trim();
    const articleVal = (document.getElementById('searchArticleInputCCL')?.value || '').trim();

    // Datos de tabla (mismo orden que la vista)
    const head = [[
      'Palet',
      'Artículo',
      'Lote int',
      'Método de producción',
      'FAO',
      'Arte de pesca',
      'Origen',
      'Código / Especie'
    ]];

    const body = allCCL.map(x => ([
      safe(x.NUMERO_PALET),
      `${safe(x.CODIGO_ARTICULO)} ${safe(x.DESCRIP_COMERCIAL)}`.trim(),
      safe(x.NUMERO_LOTE_INT),
      join2(x.VALOR_ALFA_1, x.D_VALOR_ALFA_1),
      safe(x.D_VALOR_ALFA_2),
      join2(x.VALOR_ALFA_3, x.D_VALOR_ALFA_3),
      join2(x.VALOR_ALFA_4, x.D_VALOR_ALFA_4),
      join2(x.VALOR_ALFA_7, x.D_VALOR_ALFA_7)
    ]));

    // Cabecera y pie en cada página
    const title = 'Consulta Características de lotes';
    doc.autoTable({
      head,
      body,
      startY: marginTop,
      margin: { left: marginL, right: marginR, top: marginTop, bottom: marginBot },
      styles: { fontSize: 7, textColor: [0, 0, 0], cellPadding: 3, overflow: 'linebreak', valign: 'top' },
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], halign: 'center' }, // cabecera fondo claro + texto negro
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 121 },
        2: { cellWidth: 54 },
        3: { cellWidth: 121 },
        4: { cellWidth: 111 },
        5: { cellWidth: 121 },
        6: { cellWidth: 90 },
        7: { cellWidth: 131 }
      },
      didDrawPage: function (data) {
        // Header y footer (fuera de la tabla)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);           // fuerza negro
        doc.text(title, pageW / 2, 28, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);           // fuerza negro
        doc.text(`Paleta: ${paletVal || '-' }    Artículo: ${articleVal || '-' }`, marginL, 48);
        doc.text(`Fecha: ${fdate}`, pageW - marginR, 48, { align: 'right' });

        const pageNumber = doc.internal.getNumberOfPages();
        doc.text(`Página ${pageNumber}`, pageW - marginR, pageH - 12, { align: 'right' });
        doc.text(`Registros: ${allCCL.length}`, marginL, pageH - 12);
      }
    });


    const filename = `CCL_${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}.pdf`;
    doc.save(filename);

    
  } catch (err) {
    
  }
}
