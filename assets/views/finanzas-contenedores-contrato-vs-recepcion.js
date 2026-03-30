var allLinesFCCVR = [];
var date_from_FCCR = addMonthsSafe(-3);
var date_to_FCCR   = addMonthsSafe(0);

function finanzasContenedoresContratoVsRecepcionInit(){
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="createExceFCCVR()">📥 Excel </span>
        <span class="b-top-page" onclick="createPDFFCCVR()">📄 PDF </span>
    `;
    document.title = "Contrato vs Almacén";

    setInputDateFCCVR();
    setSearchedDateFCCVR();
    getAllContratoVsAlmacenFCCVR();
}

/* 1. trabajo con fechas */
function setInputDateFCCVR(){
    let firstDataInput  = document.getElementById('firstDataInputFCCVR');
    let secondDataInput = document.getElementById('secondDataInputFCCVR');

    firstDataInput.value  = date_from_FCCR;
    secondDataInput.value = date_to_FCCR;
}



function firstDateChangeFCCVR(event){
    date_from_FCCR = event.target.value;
    getAllContratoVsAlmacenFCCVR();
}

function secondDateChangeFCCVR(event){
    date_to_FCCR = event.target.value;
    getAllContratoVsAlmacenFCCVR();
}

/* 2. trabajo de búsqueda */
function setSearchedDateFCCVR(){
    let searchInput = document.getElementById('searchInpuFCCVR');
    if(searchInput){
        searchInput.value = window.localStorage.getItem('searched_line_fccvr') || '';
    }
}

function changeSearchedInputFCCVR(event){
    let searched = event.target.value.trim();
    window.localStorage.setItem('searched_line_fccvr', searched);
    showTableFCCVR();
}

function clickBroomFCCVR(){
    let inp = document.getElementById('searchInpuFCCVR');
    if(inp){
        inp.value = '';
    }
    window.localStorage.setItem('searched_line_fccvr', '');
    showTableFCCVR();
}

/* 3. traer datos */
function getAllContratoVsAlmacenFCCVR(){
    document.getElementById('tableFCCVR').innerHTML = '<tr><td colspan="9">Cargando..</td></tr>';
    
    fetch(HTTP_HOST + `finanzas/get/0/0/finanzas_cont_vs_alm/?first=${date_from_FCCR}&second=${date_to_FCCR}`)
    .then(r => r.json())
    .then(r => {
        allLinesFCCVR = (r && r.data) ? r.data : [];
        showTableFCCVR();
    })
    .catch(e => {
        showM('err1 ' + e, 'error');
        document.getElementById('tableFCCVR').innerHTML = '<tr><td colspan="9">Error cargando datos</td></tr>';
    });
}

function showTableFCCVR() {
    const inputValue = (localStorage.getItem('searched_line_fccvr') || '').toLowerCase();
    let html = '';
    const r = allLinesFCCVR;

    if (!r || !r.length) {
        document.getElementById('tableFCCVR').innerHTML = '<tr><td colspan="9">Sin datos</td></tr>';
        return;
    }

    const match = (y) => {
        if (!inputValue) return true;

        const lineData = (
            (y.NUM_EXPEDIENTE || '') + ' ' +
            (y.FECHA_PREV_LLEGADA || '') 
        //    String(y.CANTIDAD_00 || '') +
        //    String(y.IMPORTE_00 || '') +
        //    String(y.CANTIDAD_ENTRADA || '') +
        //    String(y.IMPORTE_ENTRADA || '')
        ).toLowerCase();

        return lineData.includes(inputValue);
    };

    const filtered = r.filter(match);

    if (!filtered.length) {
        document.getElementById('tableFCCVR').innerHTML = '<tr><td colspan="9">Sin resultados</td></tr>';
        return;
    }

    filtered.forEach(y => {
        const cantidad00 = parseFloat(y.CANTIDAD_00 || 0);
        const importe00 = parseFloat(y.IMPORTE_00 || 0);
        const cantidadEntrada = parseFloat(y.CANTIDAD_ENTRADA || 0);
        const importeEntrada = parseFloat(y.IMPORTE_ENTRADA || 0);

        const difKg = cantidad00 - cantidadEntrada;
        const difImporte = importe00 - importeEntrada;

        html += `<tr>
            <td class="fontssmall border px-2 py-1 text-center">${y.NUM_EXPEDIENTE ?? ''}</td>
            <td class="fontssmall border px-2 py-1 text-center">${y.FECHA_PREV_LLEGADA ?? ''}</td>
            <td class="fontssmall border px-2 py-1 text-center">${fEurEntero(cantidad00)}</td>
            <td class="fontssmall border px-2 py-1 text-center">${fEurEntero(cantidadEntrada)}</td>
            <td class="fontssmall border px-2 py-1 text-center ${difKg !== 0 ? 'font-bold text-red-600' : ''}">${fEurEntero(difKg)}</td>
            <td class="fontssmall border px-2 py-1 text-center">${fEur000(importe00)}</td>
            <td class="fontssmall border px-2 py-1 text-center">${fEur000(importeEntrada)}</td>
            <td class="fontssmall border px-2 py-1 text-center ${difImporte !== 0 ? 'font-bold text-red-600' : ''}">${fEur000(difImporte)}</td>
        </tr>`;
    });
    //  <td class="fontssmall border px-2 py-1 text-center ${difImporte !== 0 ? 'font-bold text-red-600' : ''}">${difImporte === 0 ? 'OK' : 'REVISAR'}</td>
    document.getElementById('tableFCCVR').innerHTML = html;
}

/* EXCEL */
function createExceFCCVR() {
    const r = allLinesFCCVR;
    if (!r || !r.length) return;

    const first  = (localStorage.getItem('first_date_fccvr')  || '').trim();
    const second = (localStorage.getItem('second_date_fccvr') || '').trim();
    const inputValue = (localStorage.getItem('searched_line_fccvr') || '').toLowerCase();

    const nn = v => (v === null || v === undefined || v === 'None') ? '' : v;
    const nnum = v => {
        if (v === null || v === undefined || v === '') return '';
        if (typeof v === 'number') return v;
        const s = String(v).replace(/\s+/g,'').replace(',', '.');
        const n = parseFloat(s);
        return isFinite(n) ? n : '';
    };

    const match = (y) => {
        if (!inputValue) return true;
        const lineData = (
            (y.NUM_EXPEDIENTE || '') + ' ' +
            (y.FECHA_PREV_LLEGADA || '') 
        //    String(y.CANTIDAD_00 || '') +
        //    String(y.IMPORTE_00 || '') +
        //    String(y.CANTIDAD_ENTRADA || '') +
        //    String(y.IMPORTE_ENTRADA || '')
        ).toLowerCase();

        return lineData.includes(inputValue);
    };

    const filtered = r.filter(match);

    const HEAD = [
        'Expediente',
        'Fecha Prev. Llegada',
        'Kg Contrato',
        'Kg Entrada',
        'Dif. Kg',
        'Imp. Contrato',
        'Imp. Entrada',
        'Dif. Importe',
        'Estado'
    ];

    const AOA = [HEAD];

    filtered.forEach(y => {
        const cantidad00 = parseFloat(y.CANTIDAD_00 || 0);
        const importe00 = parseFloat(y.IMPORTE_00 || 0);
        const cantidadEntrada = parseFloat(y.CANTIDAD_ENTRADA || 0);
        const importeEntrada = parseFloat(y.IMPORTE_ENTRADA || 0);

        const difKg = cantidad00 - cantidadEntrada;
        const difImporte = importe00 - importeEntrada;

        AOA.push([
            nn(y.NUM_EXPEDIENTE),
            nn(y.FECHA_PREV_LLEGADA),
            nnum(cantidad00),
            nnum(cantidadEntrada),
            nnum(difKg),
            nnum(importe00),
            nnum(importeEntrada),
            nnum(difImporte),
            difImporte === 0 ? 'OK' : 'REVISAR'
        ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(AOA);

    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    ws['!cols'] = [
        { wch: 14 },
        { wch: 18 },
        { wch: 14 },
        { wch: 14 },
        { wch: 12 },
        { wch: 14 },
        { wch: 14 },
        { wch: 14 },
        { wch: 12 }
    ];

    const tabBase = `Contrato vs Almacén ${first} a ${second}`;
    const safeTab = tabBase.replace(/[\\/?*\[\]:]/g, '-').slice(0, 31) || 'ContratoVsAlmacen';
    XLSX.utils.book_append_sheet(wb, ws, safeTab);

    const fileName = `contrato_vs_almacen_${first || 'desde'}_${second || 'hasta'}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

/* PDF */
function createPDFFCCVR() {
    const hasJsPDF = !!(window.jspdf && window.jspdf.jsPDF);
    if (!hasJsPDF) { console.error('jsPDF no está cargado.'); return; }
    const { jsPDF } = window.jspdf;
    if (!(jsPDF.API && typeof jsPDF.API.autoTable === 'function')) {
        console.error('jspdf-autotable no está cargado.');
        return;
    }

    const r = allLinesFCCVR;
    if (!r || !r.length) return;

    const first  = (fLDate(localStorage.getItem('first_date_fccvr'))  || '').trim();
    const second = (fLDate(localStorage.getItem('second_date_fccvr')) || '').trim();
    const inputValue = (localStorage.getItem('searched_line_fccvr') || '').toLowerCase();

    const nn = v => (v === null || v === undefined || v === 'None') ? '' : v;

    const match = y => {
        if (!inputValue) return true;
        const lineData = (
            (y.NUM_EXPEDIENTE || '') +  ' ' +
            (y.FECHA_PREV_LLEGADA || '') 
        //    String(y.CANTIDAD_00 || '') +
        //    String(y.IMPORTE_00 || '') +
        //    String(y.CANTIDAD_ENTRADA || '') +
        //    String(y.IMPORTE_ENTRADA || '')
        ).toLowerCase();

        return lineData.includes(inputValue);
    };

    const filtered = r.filter(match);

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 11;

    const drawHeader = (pageNo = 1) => {
        doc.setFillColor(248);
        doc.rect(0, 0, pageW, 46, 'F');

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(`FROXA S.A.   ${getCurrentDateTime()}`, margin, 18);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const title = `Contrato vs Almacén (${first} - ${second})${inputValue ? `   •   Filtro: "${inputValue}"` : ''}`;
        doc.text(title, pageW / 2, 32, { align: "center" });

        doc.setDrawColor(210);
        doc.setLineWidth(0.5);
        doc.line(margin, 38, pageW - margin, 38);
    };

    const drawFooter = (pageNo=1) => {
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text(`Página ${pageNo}`, pageW - margin, pageH - 10, { align: 'right' });
        doc.setTextColor(0);
    };

    const HEAD = [
        'Expediente',
        'Fecha Prev. Llegada',
        'Kg Contrato',
        'Kg Entrada',
        'Dif. Kg',
        'Imp. Contrato',
        'Imp. Entrada',
        'Dif. Importe',
        'Estado'
    ];

    const body = filtered.map(y => {
        const cantidad00 = parseFloat(y.CANTIDAD_00 || 0);
        const importe00 = parseFloat(y.IMPORTE_00 || 0);
        const cantidadEntrada = parseFloat(y.CANTIDAD_ENTRADA || 0);
        const importeEntrada = parseFloat(y.IMPORTE_ENTRADA || 0);

        const difKg = cantidad00 - cantidadEntrada;
        const difImporte = importe00 - importeEntrada;

        return [
            nn(y.NUM_EXPEDIENTE),
            nn(y.FECHA_PREV_LLEGADA),
            fmt0(cantidad00),
            fmt0(cantidadEntrada),
            fmt0(difKg),
            fmt3(importe00),
            fmt3(importeEntrada),
            fmt3(difImporte),
            difImporte === 0 ? 'OK' : 'REVISAR'
        ];
    });

    doc.autoTable({
        head: [HEAD],
        body,
        margin: { left: margin, right: margin, top: 48 },
        theme: 'plain',
        showHead: 'everyPage',
        styles: {
            fontSize: 8,
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
            minCellHeight: 12,
            overflow: 'ellipsize'
        },
        headStyles: {
            fillColor: [67,56,202],
            textColor: [255,255,255],
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: { textColor: [0,0,0] },
        columnStyles: {
            0:{cellWidth:70, halign:'center'},
            1:{cellWidth:90, halign:'center'},
            2:{cellWidth:75, halign:'center'},
            3:{cellWidth:75, halign:'center'},
            4:{cellWidth:65, halign:'center'},
            5:{cellWidth:80, halign:'center'},
            6:{cellWidth:80, halign:'center'},
            7:{cellWidth:85, halign:'center'},
            8:{cellWidth:60, halign:'center'}
        },
        didDrawPage: hookData => {
            drawHeader(hookData.pageNumber);
            drawFooter(hookData.pageNumber);
        }
    });

    const fileName = `contrato_vs_almacen_${first || 'desde'}_${second || 'hasta'}.pdf`;
    doc.save(fileName);
}