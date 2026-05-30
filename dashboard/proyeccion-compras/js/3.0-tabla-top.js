let total_content = '';

function setTablesGlobal() {
    total_content = '';

    suzdalenkoGet(`compras/get/0/${FAMILIA_ID}/tabla_en_si/?codigo=${CODIGO_ART}`, r => {

        const articulos = r && r.data && r.data.articulos ? r.data.articulos : [];

        if (articulos.length > 0) {

            articulos.forEach(l => {

                let htmlCenterTable = '';
                let lineasTopArticulo = JSON.parse(l.estado_actual);

                lineasTopArticulo.stock_actual.forEach(a => {
                    htmlCenterTable += `<tr>   
                        <td class="border px-2 py-1 text-center">${lineasTopArticulo.fam}</td>
                        <td class="border px-2 py-1 text-center">${a.CODIGO_ARTICULO}</td>
                        <td class="border px-2 py-1 text-left">${a.DESCRIP_COMERCIAL}</td>
                        <td class="border px-2 py-1 text-right">${fENN(a.STOCK)}</td>
                    </tr>`;
                });

                if (lineasTopArticulo.stock_actual.length > 1) {
                    htmlCenterTable += `<tr>   
                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-left"></td>
                        <td class="border px-2 py-1 text-right">${fENN(lineasTopArticulo.stock_bloque_total)}</td>
                    </tr>`;
                }

                let concepto_top = r.data.cabezera;
                let concepto_bottom = r.data.labels_15;
                let metricas = l.metricas;

                total_content += `
                    <div class="s_wrapper">

                        <div class="article_top_line">

                            <div class="article_top_table">
                                ${topTable}${htmlCenterTable}${topBottomTable}
                            </div>

                            <div class="article_acumulado">
                                ${prepareAcumulado(l.id)}
                            </div>

                            <div class="article_buttons">
                                ${restablecerButton(FAMILIA_ID, l.id)}
                            </div>

                        </div>

                        <div class="article_big_table">
                            ${getFactTable(concepto_top, concepto_bottom, metricas)}
                        </div>

                    </div>
                `;
            });
        }

        document.getElementById('tables_content').innerHTML = total_content;

        articulos.forEach(l => {
            pushAcumuladosContent(FAMILIA_ID, l.id);
        });
    });
}

setTablesGlobal();