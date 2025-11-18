function produccionAvisoRoturasStockInit(){
    document.title = 'Aviso Roturas Stock'
    document.getElementById('slugTitle').innerHTML = '';
    
    gePARS(0);
    alertEmailFunction('produccion-aviso-roturas-stock');
}

function changePARS(event){
    let lineState = event.target.checked ? 1 : 0;
    gePARS(lineState);
}

function gePARS(x){
    document.getElementById('tablePARS').innerHTML = 'Cargando..';

    fetch(HTTP_HOST+'produccion/get/0/0/get_safety_stock/?estado='+x).then(r => r.json()).then(r => {
        let htmlTable = '';
        let redColor  = '';
        let leyenda   = '';

        if(r && r.data && r.data.art_all){
            r.data.art_all.map(a => {
                if(a.stock_dispg + a.stock_final <= a.stock_segur){ redColor = 'style="background: #841313; color: white"';
                } else { redColor = ''; }

                leyenda = '';
                let curSituation = JSON.parse(a.situacion);
                if(curSituation && curSituation.length > 0){
                    curSituation.map(s => {
                        leyenda += s.SITUATION+': '+s.STOCK+ '  <br>';
                    });
                }
                
                

                htmlTable += `<tr ${redColor}>
                    <td class="border px-2 py-1 text-center"><b>${a.codigo}</b></td>
                    <td class="border px-2 py-1 text-left">  <b>${a.descripcion}</b></td> 
                    <td class="border px-2 py-1 text-center"><b>${a.stock_dispg}</b></td> 
                    <td class="border px-2 py-1 text-center"><b>${a.stock_final}</b></td> 
                    <td class="border px-2 py-1 text-center"><b>${a.stock_dispg + a.stock_final}</b></td> 
                    <td class="border px-2 py-1 text-center"><b>${a.stock_segur}</b></td>
                    <td class="border px-2 py-1 text-center"><b>${leyenda} </b></td>   
                </tr>`;

                // htmlTable += '<br>'
            });
            document.getElementById('tablePARS').innerHTML = htmlTable;
        } else {
            document.getElementById('tablePARS').innerHTML = 'No hay datos..';
        }

    }).catch(e => {
        showM(e, 'error');
    })
}

