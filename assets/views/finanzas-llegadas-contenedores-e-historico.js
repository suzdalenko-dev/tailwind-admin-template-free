var allLinesLLEI = [];

function finanzasLlegadasContenedoresEHistoricoInit(){
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="createExceLLEI()">📥 Excel </span>
        <span class="b-top-page" onclick="createPDFLLEI()">📄 PDF </span>
    `;
    document.title = "Llegadas e Histórico";

    setInputDateLLEI();
    setSearchedDateLLEI();
    getAllContainerLLEI();
}

/* 1. trabajo con fechas */
function setInputDateLLEI(){
    let firstDataInput = document.getElementById('firstDataInputLLEI');
    let secondDataInput = document.getElementById('secondDataInputLLEI');

    if(window.localStorage.getItem('first_date_llei')){
        firstDataInput.value = window.localStorage.getItem('first_date_llei');
    } else {
        firstDataInput.value = getTodayMinusOneMonth();
        window.localStorage.setItem('first_date_llei', firstDataInput.value);
    }

    if(window.localStorage.getItem('second_date_llei')){
        secondDataInput.value = window.localStorage.getItem('second_date_llei');
    } else {
        secondDataInput.value = addMonthsFunc(22);
        window.localStorage.setItem('second_date_llei', secondDataInput.value);
    }
}

function firstDateChangeLLEI(event){
    let firstDate = event.target.value;
    window.localStorage.setItem('first_date_llei', firstDate);
    getAllContainerLLEI();
}

function secondDateChangeLLEI(event){
    let secondDate = event.target.value;
    window.localStorage.setItem('second_date_llei', secondDate);
    getAllContainerLLEI();
}

/* 2. trabajo de busqueda */
function setSearchedDateLLEI(){
    let searchInputL = document.getElementById('searchInputLLEI');
    searchInputL.value = window.localStorage.getItem('searched_line_llei') || '';
}

function changeSearchedInputLLEI(event){
    let searched = event.target.value.trim();
    window.localStorage.setItem('searched_line_llei', searched);
    show2TablesLLEI();
}

function clickBroomLLEI(){
    document.getElementById('searchInputLLEI').value = '';
    window.localStorage.setItem('searched_line_llei', '');
    show2TablesLLEI();
}

/* 3. traer datos */
function getAllContainerLLEI(){
    let first  = window.localStorage.getItem('first_date_llei');
    let second = window.localStorage.getItem('second_date_llei');

    document.getElementById('tableLLEI').innerHTML = '<tr><td colspan="20">Cargando..</td></tr>';
    
    fetch(HTTP_HOST + `finanzas/get/0/0/finanzas_llegadas_todas/?first=${first}&second=${second}`)
    .then(r => r.json())
    .then(r => {
        allLinesLLEI = r;
        show2TablesLLEI();
    })
    .catch(e => {
        showM('err1 ' + e, 'error');
        document.getElementById('tableLLEI').innerHTML = '<tr><td colspan="20">Error cargando datos</td></tr>';
    });
}

function show2TablesLLEI() {
    const inputValue = (localStorage.getItem('searched_line_llei') || '').toLowerCase();
    let html = '';
    const r = allLinesLLEI;

    if (!r || !r.data) {
        document.getElementById('tableLLEI').innerHTML = '';
        return;
    }

    const match = (y) => {
        if (!inputValue) return true;
        const lineData = (
            (y.CODIGO_FAMILIA || '') +
            (y.D_CODIGO_FAMILIA || '') +
            (y.ARTICULO || '') +
            (y.DESCRIP_COMERCIAL || '') +
            (y.CONTENEDOR || '') +
            (y.D_CLAVE_ARANCEL || '') +
            (y.FECHA_PREV_LLEGADA || '') +
            (y.D_PLANTILLA || '') +
            (y.PROVEEDOR || '') +
            (y.D_PROVEEDOR_HOJA || '') +
            ((y.NUM_EXPEDIENTE || '') + '-' + (y.NUM_HOJA || '')) +
            (y.BUQUE || '') +
            (y.C_BAN || '') +
            (y.FECHA_CONTRATO || '') +
            (y.LUGAR_EMBARQUE || '') +
            (y.LUGAR_DESEMBARQUE || '') +
            (y.DOCUMENTACION_X_CONTENEDOR || '')+(y.SITUACION_LOGISTICA || '')
        ).toLowerCase();

        return lineData.includes(inputValue);
    };

    r.data.forEach(group => {
        const filtered = (group.lines || []).filter(match);
        if (filtered.length === 0) return;

        filtered.forEach(y => {
            html += `<tr>
                <td class="fontssmall border px-2 py-1 text-center">${y.CODIGO_FAMILIA ?? ''}</td>
                <td class="fontssmall border px-2 py-1 text-center">${y.D_CODIGO_FAMILIA ?? ''}</td>
                <td class="fontssmall border px-2 py-1 text-left" title="${notNone(y.OBSERVACIONES)}">${y.ARTICULO ?? ''}</td>
                <td class="fontssmall border px-2 py-1 text-left" title="${notNone(y.OBSERVACIONES)}">${(y.DESCRIP_COMERCIAL || '').slice(0, 33)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${y.C_BAN ?? ''}</td>
                <td class="fontssmall border px-2 py-1 text-center">${y.FECHA_CONTRATO ?? ''}</td>
                <td class="fontssmall border px-2 py-1 text-center">${y.CONTENEDOR ?? ''}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEurEntero(y.CANTIDAD1)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEur000(y.PRECIO)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEur0000(y.VALOR_CAMBIO)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fEur000(y.PRECIO_CON_GASTOS)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${notNone(y.DOCUMENTACION_X_CONTENEDOR)}</td>
                <td class="fontssmall border px-2 py-1 text-left">${replaceEntr(y.LUGAR_EMBARQUE)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fLDate(y.FECHA_EMBARQUE)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${fLDate(y.FECHA_PREV_LLEGADA)}</td>
                <td class="fontssmall border px-2 py-1 text-left">${replaceEntr(y.LUGAR_DESEMBARQUE)}</td>
                <td class="fontssmall border px-2 py-1 text-left">${(y.D_PROVEEDOR_HOJA || '').slice(0, 22)}</td>
                <td class="fontssmall border px-2 py-1 text-left">${y.D_DESCRIPCION_EXPEDIENTE ?? ''}</td>
                <td class="fontssmall border px-2 py-1 text-center">${y.NUM_EXPEDIENTE ?? ''}-${y.NUM_HOJA ?? ''}</td>
                <td class="fontssmall border px-2 py-1 text-left">${notNone(y.BUQUE)}</td>
                <td class="fontssmall border px-2 py-1 text-center">${notNone(y.CODIGO_ENTRADA)}</td>
            </tr>`;
        });

        html += '<br>';
    });

    document.getElementById('tableLLEI').innerHTML = html;
}

/* EXCEL */
function createExceLLEI() {
    const r = allLinesLLEI;
    if (!r || !r.data) return;

    const first  = (localStorage.getItem('first_date_llei')  || '').trim();
    const second = (localStorage.getItem('second_date_llei') || '').trim();
    const inputValue = (localStorage.getItem('searched_line_llei') || '').toLowerCase();

    const nn = v => (v === null || v === undefined || v === 'None') ? '' : v;
    const nnum = v => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'number') return v;
        const s = String(v).replace(/\s+/g,'').replace(',', '.');
        const n = parseFloat(s);
        return isFinite(n) ? n : '';
    };
    const toDateStr = v => {
        const s = nn(v);
        if (!s) return '';
        const m = String(s).slice(0,10).split('-');
        return (m.length === 3) ? `${m[2]}/${m[1]}/${m[0]}` : s;
    };
    const replaceEntr2 = v => String(nn(v)).replace(/\r?\n/g, ' ').trim();
    const notNone2 = v => nn(v);

    const match = (y) => {
        if (!inputValue) return true;
        const lineData = (
            (y.CODIGO_FAMILIA || '') +
            (y.D_CODIGO_FAMILIA || '') +
            (y.ARTICULO || '') +
            (y.DESCRIP_COMERCIAL || '') +
            (y.C_BAN || '') +
            (y.FECHA_CONTRATO || '') +
            (y.CONTENEDOR || '') +
            (y.D_CLAVE_ARANCEL || '') +
            (y.FECHA_PREV_LLEGADA || '') +
            (y.D_PLANTILLA || '') +
            (y.PROVEEDOR || '') +
            (y.D_PROVEEDOR_HOJA || '') +
            ((y.NUM_EXPEDIENTE || '') + '-' + (y.NUM_HOJA || '')) +
            (y.BUQUE || '') + (y.SITUACION_LOGISTICA || '')
        ).toLowerCase();
        return lineData.includes(inputValue);
    };

    const groups = Array.isArray(r.data)
        ? r.data
        : Object.entries(r.data).map(([id, lines]) => ({ id, lines }));

    const HEAD = [
        'Cód. Fam',
        'Descr. Fam',
        'Cód. Art',
        'Descr. Art',
        'C. Ban',
        'F. Contrato',
        'Cont.',
        'Kg',
        'Precio',
        'Cambio',
        'Coste c/g',
        'Doc.',
        'Origen',
        'Embarque',
        'Llegada',
        'Puerto',
        'Proveedor',
        'Cont.Prov.',
        'Exp.',
        'Buque', 'Cod. Ent.'
    ];

    const AOA = [HEAD];

    const groupsWithRows = groups
        .map(g => ({ rows: (g.lines || []).filter(match) }))
        .filter(x => x.rows.length > 0);

    groupsWithRows.forEach((entry, idx) => {
        entry.rows.forEach(y => {
            AOA.push([
                y.CODIGO_FAMILIA,
                nn(y.D_CODIGO_FAMILIA),
                nn(y.ARTICULO),
                nn(y.DESCRIP_COMERCIAL).slice(0, 50),
                y.C_BAN,
                y.FECHA_CONTRATO,
                nn(String(y.CONTENEDOR || '').trim()),
                nnum(y.CANTIDAD1),
                nnum(y.PRECIO),
                nnum(y.VALOR_CAMBIO),
                nnum(y.PRECIO_CON_GASTOS),
                notNone2(y.DOCUMENTACION_X_CONTENEDOR),
                replaceEntr2(y.LUGAR_EMBARQUE),
                toDateStr(y.FECHA_EMBARQUE),
                toDateStr(y.FECHA_PREV_LLEGADA),
                replaceEntr2(y.LUGAR_DESEMBARQUE),
                nn(y.D_PROVEEDOR_HOJA),
                nn(y.D_DESCRIPCION_EXPEDIENTE),
                `${nn(y.NUM_EXPEDIENTE)}-${nn(y.NUM_HOJA)}`,
                nn(y.BUQUE), y.CODIGO_ENTRADA
            ]);
        });

        if (idx < groupsWithRows.length - 1) {
            AOA.push(new Array(HEAD.length).fill(''));
        }
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(AOA);

    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    ws['!cols'] = [
        { wch: 10 }, { wch: 20 }, { wch: 12 }, { wch: 40 }, { wch: 8 },
        { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 14 }, { wch: 16 }, { wch: 18 }, { wch: 16 }, { wch: 16 },
        { wch: 18 }, { wch: 24 }, { wch: 20 }, { wch: 14 }, { wch: 22 }
    ];

    const tabBase = `Llegadas e Histórico ${first} a ${second}`;
    const safeTab = tabBase.replace(/[\\/?*\[\]:]/g, '-').slice(0, 31) || 'LlegadasHist';
    XLSX.utils.book_append_sheet(wb, ws, safeTab);

    const fileName = `llegadas_historico_${first || 'desde'}_${second || 'hasta'}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

/* PDF */
function createPDFLLEI() {
    const hasJsPDF = !!(window.jspdf && window.jspdf.jsPDF);
    if (!hasJsPDF) { console.error('jsPDF no está cargado.'); return; }
    const { jsPDF } = window.jspdf;
    if (!(jsPDF.API && typeof jsPDF.API.autoTable === 'function')) {
        console.error('jspdf-autotable no está cargado.');
        return;
    }

    const r = allLinesLLEI;
    if (!r || !r.data) return;

    const first  = (fLDate(localStorage.getItem('first_date_llei'))  || '').trim();
    const second = (fLDate(localStorage.getItem('second_date_llei')) || '').trim();
    const inputValue = (localStorage.getItem('searched_line_llei') || '').toLowerCase();

    const nn = v => (v === null || v === undefined || v === 'None') ? '' : v;
    const toDateStr = v => {
        const s = nn(v); if (!s) return '';
        const [Y,M,D] = String(s).slice(0,10).split('-');
        return (Y && M && D) ? `${D}/${M}/${Y}` : s;
    };
    const replaceEntr2 = v => String(nn(v)).replace(/\r?\n/g, ' ').trim();
    const notNone2 = v => nn(v);

    const match = y => {
        if (!inputValue) return true;
        const line = (
            (y.CODIGO_FAMILIA || '') +
            (y.D_CODIGO_FAMILIA || '') +
            (y.ARTICULO || '') +
            (y.DESCRIP_COMERCIAL || '') +
            (y.CONTENEDOR || '') +
            (y.D_CLAVE_ARANCEL || '') +
            (y.FECHA_PREV_LLEGADA || '') +
            (y.D_PLANTILLA || '') +
            (y.PROVEEDOR || '') +
            (y.D_PROVEEDOR_HOJA || '') +
            ((y.NUM_EXPEDIENTE || '') + '-' + (y.NUM_HOJA || '')) +
            (y.BUQUE || '')
        ).toLowerCase();
        return line.includes(inputValue);
    };

    const groups = Array.isArray(r.data) ? r.data : Object.entries(r.data).map(([id, lines]) => ({ id, lines }));

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
        const title = `Llegadas e Histórico (${first} - ${second})${inputValue ? `   •   Filtro: "${inputValue}"` : ''}`;
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
        'Artículo',
        'C.Ban',
        'F.Contrato',
        'Cont.',
        'Kg',
        'Precio',
        'Cambio',
        'Coste c/g',
        'Doc.',
        'Origen',
        'Embarque',
        'Llegada',
        'Puerto',
        'Proveedor',
        'Cont. Prov.',
        'Exp.',
        'Buque'
    ];

    const groupsWithRows = groups
        .map(g => ({ rows: (g.lines || []).filter(match) }))
        .filter(x => x.rows.length > 0);

    const body = [];
    groupsWithRows.forEach((entry, idx) => {
        entry.rows.forEach(y => {
            const col1 = `${nn(y.ARTICULO)} ${(nn(y.DESCRIP_COMERCIAL)).slice(0,55)}`.trim();
            body.push([
                col1,
                y.C_BAN,
                y.FECHA_CONTRATO,
                nn(String(y.CONTENEDOR || '').trim()),
                fmt0(y.CANTIDAD1),
                fmt3(y.PRECIO),
                fmt4(y.VALOR_CAMBIO),
                fmt3(y.PRECIO_CON_GASTOS),
                notNone2(y.DOCUMENTACION_X_CONTENEDOR),
                replaceEntr2(y.LUGAR_EMBARQUE),
                toDateStr(y.FECHA_EMBARQUE),
                toDateStr(y.FECHA_PREV_LLEGADA),
                replaceEntr2(y.LUGAR_DESEMBARQUE),
                nn(y.D_PROVEEDOR_HOJA),
                nn(y.D_DESCRIPCION_EXPEDIENTE),
                `${nn(y.NUM_EXPEDIENTE)}-${nn(y.NUM_HOJA)}`,
                nn(y.BUQUE)
            ]);
        });

        if (idx < groupsWithRows.length - 1) {
            body.push([{ content: '', colSpan: HEAD.length, styles: { minCellHeight: 0 } }]);
            body.push([{
                content: '',
                colSpan: HEAD.length,
                styles: {
                    lineWidth: { top: 1 },
                    lineColor: [0, 0, 0],
                    minCellHeight: 0
                }
            }]);
        }
    });

    doc.autoTable({
        head: [HEAD],
        body,
        margin: { left: margin, right: margin, top: 48 },
        theme: 'plain',
        showHead: 'everyPage',
        styles: {
            fontSize: 6,
            cellPadding: { top: 1, right: 0.1, bottom: 1, left: 0.1 },
            minCellHeight: 10,
            overflow: 'ellipsize'
        },
        headStyles: {
            fillColor: [67,56,202],
            textColor: [255,255,255],
            fontStyle: 'bold',
            halign: 'center',
            cellPadding: { top: 1, right: 0.1, bottom: 1, left: 0.1 }
        },
        bodyStyles: { textColor: [0,0,0] },
        columnStyles: {
            0:{cellWidth:140, overflow: 'linebreak'},
            1:{cellWidth:22},
            2:{cellWidth:35},
            3:{cellWidth:44},
            4:{cellWidth:30, halign:'center'},
            5:{cellWidth:30, halign:'center'},
            6:{cellWidth:30, halign:'center'},
            7:{cellWidth:34, halign:'center'},
            8:{cellWidth:21, halign:'center'},
            9:{cellWidth:54},
            10:{cellWidth:54, halign:'center'},
            11:{cellWidth:54, halign:'center'},
            12:{cellWidth:54},
            13:{cellWidth:110, overflow: 'linebreak'},
            14:{cellWidth:54},
            15:{cellWidth:32, halign:'center'},
            16:{cellWidth:70}
        },
        didDrawPage: hookData => {
            drawHeader(hookData.pageNumber);
            drawFooter(hookData.pageNumber);
        }
    });

    const fileName = `llegadas_historico_${first || 'desde'}_${second || 'hasta'}.pdf`;
    doc.save(fileName);
}