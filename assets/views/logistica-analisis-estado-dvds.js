
let excelAED = null;

function logisticaAnalisisEstadoDvdsInit(){
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page" onclick="createExcelAED()">📥 Excel </span>`;
    document.title = "Panel de Análisis de DVDs";


    getDVDs();
}



// solo de almacen 02

function getDVDs(){
    document.getElementById('tableAED').innerHTML = '<br> Cargando...';
    suzdalenkoGet(`logistica/get/0/0/analisis_estado_dvd/`,  r => {
        if(r && r.data && r.data.outs && r.data.outs.length > 0){ console.log(r.data.outs);
            excelAED = r.data.outs;
            let html = '';
            r.data.outs.forEach( d => { console.log(d);
        
                        html += `<tr>
                            <td class="border px-2 py-1 text-center">${formatDateToEuropean(d.FECHA)}</td>
                            <td class="border px-2 py-1 text-center">${d.CODIGO_DVD}</td>
                            <td class="border px-2 py-1 text-left">${d.DESCRIPCION}</td>
                            <td class="border px-2 py-1 text-center">${d.CODIGO_ARTICULO}</td>
                            <td class="border px-2 py-1 text-left">${d.DESCRIPCION_ARTICULO}</td>
                            <td class="border px-2 py-1 text-left">${d.NUMERO_LOTE_INT}</td>
                            <td class="border px-2 py-1 text-right">${d.CANTIDAD_ENTRADA}</td>
                            <td class="border px-2 py-1 text-right">${d.SALIDA}</td>
                            <td class="border px-2 py-1 text-right">${d.CANTIDAD_CON}</td>
                        </tr>`;
         
            });
            document.getElementById('tableAED').innerHTML = html;
        } else {
            document.getElementById('tableAED').innerHTML = '<br> No hay datos para mostrar.';
        }
    });
}



