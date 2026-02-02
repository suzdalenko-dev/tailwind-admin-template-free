let total_content  = '';

function setTablesGlobal(){
    suzdalenkoGet(`compras/get/0/${FAMILIA_ID}/tabla_en_si/?codigo=${CODIGO_ART}`, r => {                // console.log(r.data.articulos)
    total_content = '';
    if(r && r.data && r.data.articulos && r.data.articulos.length > 0){
        r.data.articulos.map(l => {                                                                      // console.log(l)  // ${fEur000(a.STOCK)} ${fEur0(a.STOCK)} 
            let htmlCenterTable   = '';
            let lineasTopArticulo = JSON.parse(l.estado_actual);                                         //console.log(lineasTopArticulo)
            lineasTopArticulo.stock_actual.map(a => {                                                    // console.log(a)
                htmlCenterTable += `<tr>   
                        <td class="border px-2 py-1 text-center">${lineasTopArticulo.fam}</td>
                        <td class="border px-2 py-1 text-center">${a.CODIGO_ARTICULO}</td>
                        <td class="border px-2 py-1 text-left">${a.DESCRIP_COMERCIAL}</td>
                        <td class="border px-2 py-1 text-right">${fENN(a.STOCK)}</td>
                    </tr>`;
            });

            if(lineasTopArticulo.stock_actual.length > 1){
                htmlCenterTable += `<tr>   
                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-left"></td>
                        <td class="border px-2 py-1 text-right">${fENN(lineasTopArticulo.stock_bloque_total)}</td>
                    </tr>`;
            }

            
            // console.log(l)

            total_content += topTable+htmlCenterTable+topBottomTable+prepareAcumulado(l.id);
            total_content += restablecerButton(FAMILIA_ID, l.id);

            let concepto_top    = r.data.cabezera;
            let concepto_bottom = r.data.labels_15;
            let metricas        = l.metricas;


            total_content += getFactTable(
                concepto_top,
                concepto_bottom,
                metricas,
            );

            pushAcumuladosContent(FAMILIA_ID, l.id);
      });
    }
    

    document.getElementById('tables_content').innerHTML = total_content;
});
}

setTablesGlobal();