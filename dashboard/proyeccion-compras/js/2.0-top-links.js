function pintarMenuGlobal(){
    suzdalenkoGet('compras/put/0/0/get_familias_menu/', (r) => {
        let html = '<a class="top_link" href="/dashboard/#compras-llegadas-contenedores">◀️</a>';
        let class_blue = '';
        r.data.familias.map(fam => {    
            if(fam.id == FAMILIA_ID){ 
                class_blue = 'class_blue';
                document.title = fam.descripcion;
        }
        html += `<a class="top_link ${class_blue}" href="/dashboard/proyeccion-compras/?familia_id=${fam.id}">${fam.descripcion}</a>`;
        class_blue = '';
    });
        document.getElementById('nav_fam').innerHTML =  html;
    });
}

pintarMenuGlobal();

// pescados  [41178 40284 40151 40368]


/*


<td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[26].fecha}', ${l.id})" value="${venta_prevista[26].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[27].fecha}', ${l.id})" value="${venta_prevista[27].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[28].fecha}', ${l.id})" value="${venta_prevista[28].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[29].fecha}', ${l.id})" value="${venta_prevista[29].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[30].fecha}', ${l.id})" value="${venta_prevista[30].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[31].fecha}', ${l.id})" value="${venta_prevista[31].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[32].fecha}', ${l.id})" value="${venta_prevista[32].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[33].fecha}', ${l.id})" value="${venta_prevista[33].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[34].fecha}', ${l.id})" value="${venta_prevista[34].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[35].fecha}', ${l.id})" value="${venta_prevista[35].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[36].fecha}', ${l.id})" value="${venta_prevista[36].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[37].fecha}', ${l.id})" value="${venta_prevista[37].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[38].fecha}', ${l.id})" value="${venta_prevista[38].val_venta}"></td>
                                    <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" onkeydown="pressGastoPrevisto(event, '${venta_prevista[39].fecha}', ${l.id})" value="${venta_prevista[39].val_venta}"></td>

                                    */