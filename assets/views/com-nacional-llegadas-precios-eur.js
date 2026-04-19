var allLinesCNLPE = [];

function comNacionalLlegadasPreciosEurInit() {
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="createExceCNLPE()">📥 Excel </span>
        <span class="b-top-page" onclick="createPDFCNLPE()">📄 PDF </span>
    `;
    document.title = "Llegadas pendientes";

    setInputDateCNLPE();
    setSearchedInputCNLPE();
    getAllContainerCNLPE();
}

/* 1. fechas */
function setInputDateCNLPE() {
    let firstInput = document.getElementById('firstDataInputCNLPE');
    let secondInput = document.getElementById('secondDataInputCNLPE');

    firstInput.value = window.localStorage.getItem('first_date_cnlpe') || getTodayMinusOneMonth();
    secondInput.value = window.localStorage.getItem('second_date_cnlpe') || addMonthsFunc(22);

    window.localStorage.setItem('first_date_cnlpe', firstInput.value);
    window.localStorage.setItem('second_date_cnlpe', secondInput.value);
}

function firstDateChangeCNLPE(e) {
    window.localStorage.setItem('first_date_cnlpe', e.target.value);
    getAllContainerCNLPE();
}

function secondDateChangeCNLPE(e) {
    window.localStorage.setItem('second_date_cnlpe', e.target.value);
    getAllContainerCNLPE();
}

/* 2. búsqueda */
function setSearchedInputCNLPE() {
    document.getElementById('searchInputCNLPE').value = window.localStorage.getItem('searched_line_cnlpe') || '';
}

function changeSearchedInputCNLPE(e) {
    window.localStorage.setItem('searched_line_cnlpe', e.target.value.trim());
    renderTableCNLPE();
}

function clickBroomCNLPE() {
    document.getElementById('searchInputCNLPE').value = '';
    window.localStorage.setItem('searched_line_cnlpe', '');
    renderTableCNLPE();
}

/* 3. traer datos desde backend */
function getAllContainerCNLPE() {
    const first = window.localStorage.getItem('first_date_cnlpe');
    const second = window.localStorage.getItem('second_date_cnlpe');

    document.getElementById('tableLLEI').innerHTML = '<tr><td colspan="17">Cargando...</td></tr>';

    fetch(HTTP_HOST + `ventas/get/0/0/expedientes_euro_costs/?first=${first}&second=${second}`)
    .then(r => r.json())
    .then(r => {
        allLinesCNLPE = r.data.result || [];
        renderTableCNLPE();
    })
    .catch(e => {
        console.error(e);
        document.getElementById('tableLLEI').innerHTML = '<tr><td colspan="17">Error cargando datos</td></tr>';
    });
}

/* 4. renderizar tabla */
function renderTableCNLPE() {
    const inputValue = (localStorage.getItem('searched_line_cnlpe') || '').toLowerCase();
    let html = '';

    const nn = (v) => (v === null || v === undefined || v === 'None') ? '' : String(v);

    allLinesCNLPE.forEach(group => {
        const filtered = (group.lines || []).filter(line => {
            if (!inputValue) return true;

            const text = (
                nn(line.CODIGO_FAMILIA) +
                nn(line.D_CODIGO_FAMILIA) +
                nn(line.ARTICULO) +
                nn(line.DESCRIP_COMERCIAL) +
                nn(line.CONTENEDOR) +
                nn(line.D_CLAVE_ARANCEL) +
                nn(line.FECHA_PREV_LLEGADA) +
                nn(line.D_PLANTILLA) +
                nn(line.PROVEEDOR) +
                nn(line.D_PROVEEDOR_HOJA) +
                nn(line.NUM_EXPEDIENTE) + '-' + nn(line.NUM_HOJA) +
                nn(line.BUQUE)
            ).toLowerCase();

            return text.includes(inputValue);
        });

        if (filtered.length === 0) return;

        filtered.forEach(y => {
            let rowStyle = '';

            if (nn(y.BACK_COLOR).toUpperCase() === 'BLUE') {
                rowStyle = ' style="background-color:#e0efff;"';
            }

            html += `<tr${rowStyle}>
                <td class="fontssmall border px-2 py-1 text-left">${nn(y.D_CODIGO_FAMILIA)}</td>
                <td class="fontssmall border px-2 py-1 text-left">${nn(y.ARTICULO)} ${nn(y.DESCRIP_COMERCIAL)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${nn(y.CONTENEDOR)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEurEntero(y.CANTIDAD1)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEur000(y.PRECIO)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEur0000(y.VALOR_CAMBIO)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEur000(y.PRECIO_CON_GASTOS)}</td>
                <td class="fontssmall border px-2 py-1 text-left">${nn(y.LUGAR_EMBARQUE)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEur000(y._PRECIO_EUR_ACTUAL)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEur0000(y._VALOR_CAMBIO_ACTUAL)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEur000(y._GASTOS)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEur000(y._PRECIO_EUR_ACTUAL_CG) == '0,00' ? '' : fEur000(y._PRECIO_EUR_ACTUAL_CG)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${formatDate(y.FECHA_EMBARQUE)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${formatDate(y.FECHA_PREV_LLEGADA)}</td>
                <td class="fontssmall border px-2 py-1 text-left">${nn(y.LUGAR_DESEMBARQUE)}</td>
                <td class="fontssmall border px-2 py-1 text-left">${nn(y.D_PROVEEDOR_HOJA).slice(0, 22)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${nn(y.NUM_EXPEDIENTE)}-${nn(y.NUM_HOJA)}</td>
            </tr>`;
        });

        html += `
           <br>
        `;
    });

    document.getElementById('tableLLEI').innerHTML = html || '<tr><td colspan="17">Sin resultados</td></tr>';
}

/* helpers */
function formatDate(dt) {
    if (!dt || dt === 'None') return '';
    const d = new Date(dt);
    if (isNaN(d.getTime())) return '';
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}











function getFilteredLinesForExportCNLPE() {
    const inputValue = (localStorage.getItem('searched_line_cnlpe') || '').toLowerCase();
    const nn = (v) => (v === null || v === undefined || v === 'None') ? '' : String(v);

    const rows = [];

    allLinesCNLPE.forEach(group => {
        const filtered = (group.lines || []).filter(line => {
            if (!inputValue) return true;

            const text = (
                nn(line.CODIGO_FAMILIA) + ' ' +
                nn(line.D_CODIGO_FAMILIA) + ' ' +
                nn(line.ARTICULO) + ' ' +
                nn(line.DESCRIP_COMERCIAL) + ' ' +
                nn(line.CONTENEDOR) + ' ' +
                nn(line.D_CLAVE_ARANCEL) + ' ' +
                nn(line.FECHA_PREV_LLEGADA) + ' ' +
                nn(line.D_PLANTILLA) + ' ' +
                nn(line.PROVEEDOR) + ' ' +
                nn(line.D_PROVEEDOR_HOJA) + ' ' +
                nn(line.NUM_EXPEDIENTE) + '-' + nn(line.NUM_HOJA) + ' ' +
                nn(line.BUQUE)
            ).toLowerCase();

            return text.includes(inputValue);
        });

        filtered.forEach(y => {
            rows.push({
                backColorBlue: nn(y.BACK_COLOR).toUpperCase() === 'BLUE',
                data: [
                    nn(y.D_CODIGO_FAMILIA),
                    `${nn(y.ARTICULO)} ${nn(y.DESCRIP_COMERCIAL)}`.trim(),
                    nn(y.CONTENEDOR),
                    fEurEntero(y.CANTIDAD1),
                    fEur000(y.PRECIO),
                    fEur0000(y.VALOR_CAMBIO),
                    fEur000(y.PRECIO_CON_GASTOS),
                    nn(y.LUGAR_EMBARQUE),
                    fEur000(y._PRECIO_EUR_ACTUAL),
                    fEur0000(y._VALOR_CAMBIO_ACTUAL),
                    fEur000(y._GASTOS),
                    fEur000(y._PRECIO_EUR_ACTUAL_CG) == '0,00' ? '' : fEur000(y._PRECIO_EUR_ACTUAL_CG),
                    formatDate(y.FECHA_EMBARQUE),
                    formatDate(y.FECHA_PREV_LLEGADA),
                    nn(y.LUGAR_DESEMBARQUE),
                    nn(y.D_PROVEEDOR_HOJA).slice(0, 22),
                    `${nn(y.NUM_EXPEDIENTE)}-${nn(y.NUM_HOJA)}`
                ]
            });
        });

        if (filtered.length > 0) {
            rows.push({
                isSeparator: true,
                data: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
            });
        }
    });

    while (rows.length && rows[rows.length - 1].isSeparator) {
        rows.pop();
    }

    return rows;
}

function getExportFileNameCNLPE(ext) {
    const first = window.localStorage.getItem('first_date_cnlpe') || '';
    const second = window.localStorage.getItem('second_date_cnlpe') || '';
    return `llegadas_${first || 'desde'}_${second || 'hasta'}.${ext}`;
}

function getNowStrCNLPE() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function createExceCNLPE() {
    if (typeof XLSX === 'undefined') {
        console.error('XLSX no está cargado.');
        return;
    }

    const rows = getFilteredLinesForExportCNLPE();

    if (!rows.length) {
        alert('No hay datos para exportar');
        return;
    }

    const headers = [[
        'Familia',
        'Artículo',
        'Contenedor',
        'Cantidad',
        'Precio',
        'Valor cambio',
        'Precio c/gastos',
        'Lugar embarque',
        'Precio eur actual',
        'Valor cambio actual',
        'Gastos',
        'Precio eur actual c/g',
        'Fecha embarque',
        'Fecha prev. llegada',
        'Lugar desembarque',
        'Proveedor',
        'Expediente'
    ]];

    const data = headers.concat(
        rows.map(r => r.isSeparator ? ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] : r.data)
    );

    const ws = XLSX.utils.aoa_to_sheet(data);

    ws['!cols'] = [
        { wch: 18 },
        { wch: 38 },
        { wch: 16 },
        { wch: 12 },
        { wch: 12 },
        { wch: 14 },
        { wch: 16 },
        { wch: 22 },
        { wch: 15 },
        { wch: 18 },
        { wch: 12 },
        { wch: 18 },
        { wch: 14 },
        { wch: 16 },
        { wch: 22 },
        { wch: 24 },
        { wch: 16 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Llegadas');

    XLSX.writeFile(wb, getExportFileNameCNLPE('xlsx'));
}

function createPDFCNLPE() {
    const hasJsPDF = !!(window.jspdf && window.jspdf.jsPDF);
    if (!hasJsPDF) {
        console.error('jsPDF no está cargado.');
        return;
    }

    const { jsPDF } = window.jspdf;

    if (!(jsPDF.API && typeof jsPDF.API.autoTable === 'function')) {
        console.error('jspdf-autotable no está cargado.');
        return;
    }

    const rows = getFilteredLinesForExportCNLPE();

    if (!rows.length) {
        alert('No hay datos para exportar');
        return;
    }

    const first = (window.localStorage.getItem('first_date_cnlpe') || '').trim();
    const second = (window.localStorage.getItem('second_date_cnlpe') || '').trim();
    const inputValue = (window.localStorage.getItem('searched_line_cnlpe') || '').trim();

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'A4'
    });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 11;

    function drawHeader(pageNo = 1) {
        doc.setFillColor(248);
        doc.rect(0, 0, pageW, 46, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`FROXA S.A.   ${getNowStrCNLPE()}`, margin, 18);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const title = `Llegadas pendientes (${first} - ${second})${inputValue ? `   •   Filtro: "${inputValue}"` : ''}`;
        doc.text(title, pageW / 2, 32, { align: 'center' });

        doc.setDrawColor(210);
        doc.setLineWidth(0.5);
        doc.line(margin, 38, pageW - margin, 38);
    }

    function drawFooter(pageNo = 1) {
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text(`Página ${pageNo}`, pageW - margin, pageH - 10, { align: 'right' });
        doc.setTextColor(0);
    }

    const HEAD = [[
        'Familia',
        'Artículo',
        'Cont.',
        'Cant.',
        'Precio',
        'V. Camb.',
        'P. c/g.',
        'Lugar emb.',
        'P. eur act.',
        'V. camb. act.',
        'Gastos',
        'P. eur act. c/g',
        'F. emb.',
        'F. prev.',
        'Lugar des.',
        'Proveedor',
        'Exp.'
    ]];

    const body = [];
    const normalRowFlags = [];

    rows.forEach(r => {
        if (r.isSeparator) {
            body.push([{
                content: '',
                colSpan: 17,
                styles: {
                    lineWidth: { top: 1 },
                    lineColor: [0, 0, 0],
                    minCellHeight: 0,
                    cellPadding: 0,
                    fillColor: [255, 255, 255]
                }
            }]);
            normalRowFlags.push(null);
        } else {
            body.push(r.data);
            normalRowFlags.push(r);
        }
    });

    doc.autoTable({
        head: HEAD,
        body,
        margin: { left: margin, right: margin, top: 48 },
        theme: 'plain',
        showHead: 'everyPage',
        styles: {
            fontSize: 6,
            cellPadding: { top: 1, right: 0.1, bottom: 1, left: 0.1 },
            minCellHeight: 10,
            overflow: 'ellipsize',
            halign: 'center',
            valign: 'middle',
            textColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: [67, 56, 202],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            cellPadding: { top: 1, right: 0.1, bottom: 1, left: 0.1 }
        },
        columnStyles: {
            0:  { halign: 'left',   cellWidth: 45 },
            1:  { halign: 'left',   cellWidth: 110, overflow: 'linebreak' },
            2:  { halign: 'center', cellWidth: 35 },
            3:  { halign: 'center', cellWidth: 28 },
            4:  { halign: 'center', cellWidth: 32 },
            5:  { halign: 'center', cellWidth: 36 },
            6:  { halign: 'center', cellWidth: 38 },
            7:  { halign: 'left',   cellWidth: 55 },
            8:  { halign: 'center', cellWidth: 38 },
            9:  { halign: 'center', cellWidth: 40 },
            10: { halign: 'center', cellWidth: 32 },
            11: { halign: 'center', cellWidth: 45 },
            12: { halign: 'center', cellWidth: 36 },
            13: { halign: 'center', cellWidth: 36 },
            14: { halign: 'left',   cellWidth: 50 },
            15: { halign: 'left',   cellWidth: 58, overflow: 'linebreak' },
            16: { halign: 'center', cellWidth: 38 }
        },
        didParseCell: function (data) {
            if (data.section !== 'body') return;

            const rawRow = normalRowFlags[data.row.index];

            if (!rawRow) {
                data.cell.text = '';
                return;
            }

            if (rawRow.backColorBlue) {
                data.cell.styles.fillColor = [224, 239, 255];
            }
        },
        didDrawPage: function (hookData) {
            drawHeader(hookData.pageNumber);
            drawFooter(hookData.pageNumber);
        }
    });

    doc.save(getExportFileNameCNLPE('pdf'));
}