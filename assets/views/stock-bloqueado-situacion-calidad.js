let listBloqueos = [];

function stockBloqueadoSituacionCalidadInit(){
    document.title = 'Informe de bloqueos';
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page" onclick="createExcelBl()">📥 Excel </span>`;
    getInforTable();
}

function getInforTable(){
    fetch(HTTP_HOST+'calidad/get/of/0/informe_bloqueo/').then(r => r.json()).then(r => {
        let dataX = r.data;
        if(dataX.length > 0){
            dataX.map(line => {
                let arrayComent = [];
                if(line && line.coments && line.coments.length > 0){
                    let comment = line.coments;
                    comment.map(x => {
                        if(!arrayComent.includes(x.OBSERVACIONES)){
                            arrayComent.push(x.OBSERVACIONES);
                        }
                    });
                    line.resultCom = arrayComent;
                }
            });
            listBloqueos = dataX;
            showInfoTable(dataX);

        } else {
            showM('Artículos no encontrados', 'warning');
        }
       
        

    }).catch(e => {
        showM('e20 '+e, 'error');
    })
}

function showInfoTable(datas){
    let html = '';
    datas.map(x => {
        html +=  `<tr>
            <td class="taleft border px-2 py-1 text-center">${x.ALMACEN} ${x.D_ALMACEN}</td>
            <td class="taleft border px-2 py-1 text-center">${x.TIPO_SITUACION}</td>
            <td class="taleft border px-2 py-1 text-center">${x.LOTE}</td>
            <td class="taleft border px-2 py-1 text-center">${x.NUMERO_LOTE_INT}</td> 
            <td class="taleft border px-2 py-1 text-center">${x.CODIGO_ARTICULO} ${x.DESCRIPCION_ARTICULO_MIRROR}</td>
            <td class="border px-2 py-1 text-right">${fEur0(x.CANTIDAD_CON)}</td>
            <td class="border px-2 py-1 text-right">${fEur0(x.CANTIDAD_EXP)}</td>
            <td class="taleft border px-2 py-1 text-center">${x.resultCom && x.resultCom[0] || ''}</td>
        </tr>`;
    });
    if(document.getElementById('blockTable')) document.getElementById('blockTable').innerHTML = html;
    setDefaulContentToLocalStorage();
}

function createExcelBl(){
      if (!listBloqueos || listBloqueos.length === 0) {
        showM('No hay datos para exportar', 'warning');
        return;
    }

    const rows = listBloqueos.map(x => {
        const comentarios = x.resultCom?.join('\n') || '';
        return {
            "Almacén": `${x.ALMACEN} ${x.D_ALMACEN}`,
            "Situación": `${x.TIPO_SITUACION}`,
            "Cód._Entrada": x.LOTE,
            "Lote": `${x.NUMERO_LOTE_INT}`,
            "Descripción": `${x.CODIGO_ARTICULO} ${x.DESCRIPCION_ARTICULO_MIRROR}`,
            "Palet": `${x.CANTIDAD_CON}`,
            "Kg": `${x.CANTIDAD_EXP}`,
            "Observaciones": comentarios
        };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bloqueos");

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const fileName = `informe_bloqueos_${yyyy}${mm}${dd}.xlsx`;

    XLSX.writeFile(wb, fileName);
}