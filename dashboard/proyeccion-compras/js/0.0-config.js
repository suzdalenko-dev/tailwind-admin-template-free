const params = new URLSearchParams(window.location.search);
const FAMILIA_ID = params.get("familia_id");
const CODIGO_ART = params.get("codigo") || '';


function putYellow_kat(x){  
    if (x == 1) return 'yellow_kat';
    else {
        return '';
    }
}

function pressInputEdit(event, id, tipo, familia_id, article_code){
    if(event.key == 'Enter'){
        const trId = `tr_${tipo}_${familia_id}_${article_code}`; console.log(trId)
        const tr = document.getElementById(trId);

        console.log(tr)
        const inputs = tr.querySelectorAll('input[data-lineaid]');
        const cambios = [];

        inputs.forEach(inp => {
            const id = Number(inp.dataset.lineaid);
            const valRaw = inp.value;
            if (valRaw === '' || valRaw === null || valRaw === undefined) return;
            cambios.push({
                id,
                tipo,                 // 'previsto' o 'entrada'
                val: Number(valRaw)
            });
        });

        if(!cambios.length){
            showM('No hay cambios');
            return;
        }

        fetch(HTTP_HOST + 'compras/put/0/0/editar_tabla_jj_bulk/', {method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify({ cambios }),}).then(res => res.json()).then(r => {
                pintarMenuGlobal();
                setTablesGlobal();
                showM('Guardado');
            }).catch(err => {
                showM(err, 'error');
            });
    }
    return 

    if(event.key == 'Enter'){
        let val = event.target.value;
        let data = {tipo, id, val}
        suzdalenkoPost('compras/put/0/0/editar_tabla_jj/', data, r => {
            pintarMenuGlobal();
            setTablesGlobal();
            showM('Modificado');
        });
    }
}


function labelDesdeUnoHastaHoy(fecha = new Date()) {
  const d = (fecha instanceof Date) ? fecha : new Date(fecha);
  const dia = d.getDate();
  if (dia <= 1) return "1";
  return `1-${dia - 1}`;
}

function labelDesdeHoyHastaFinMes(fecha = new Date()) {
  const d = (fecha instanceof Date) ? fecha : new Date(fecha);
  const dia = d.getDate();
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-11
  // último día del mes: día 0 del mes siguiente
  const lastDay = new Date(year, month + 1, 0).getDate();
  return `${dia}-${lastDay}`;
}


function restablecerTablaCA(familia_id, id){
    let data = {familia_id, id, 'tipo': 'restablecer'}
    suzdalenkoPost('compras/put/0/0/editar_tabla_jj/',  data, r => {
        pintarMenuGlobal();
        setTablesGlobal();
        showM('Restablecer');
    });
}

function colorBlueFun(x){
    if (x == 1) return 'blue_col';
    else return '';
}

function colorYellow(x){
    if(x == 2)return 'yellow_kat';
    else return '';
}


async function pushAcumuladosContent(familia_id, article_id){
    suzdalenkoGet(`compras/get/0/0/get_acumulados/?familia_id=${familia_id}&article_id=${article_id}`, r => {
        if(r && r.data && r.data.acumulado_agno_pasado){
            let data = r.data;
            // console.log(data)
            let html = ` <div class="table-round" id="data_acumulados">
                             <table class="styled-table-ca">
                                <thead>
                                    <tr>
                                        <th class="topLeft"></th>
                                        <th>Acumulado Año</th>
                                        <th class="topRight">Promedio Mes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="border px-2 py-1 text-left">Venta Real </td>
                                        <td class="border px-2 py-1 text-right">${fENN(data.acumulado_real_venta)}</td>
                                        <td class="border px-2 py-1 text-right">${fENN(data.promedio_venta)}</td>
                                    </tr>
                                     <tr>
                                        <td class="border px-2 py-1 text-left">Venta LY </td>
                                        <td class="border px-2 py-1 text-right">${fENN(data.acumulado_agno_pasado)}</td>
                                        <td class="border px-2 py-1 text-right">${fENN(data.promedio_agno_pasado)}</td>
                                    </tr>
                                    <tr> 
                                        <td class="border px-2 py-1 text-left">Porcentaje </td>
                                        <td class="border px-2 py-1 text-right">${  replacePunto(data.variacion_porcentaje)  }</td>
                                        <td class="border px-2 py-1 text-center"> </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>`;
            document.getElementById(`data_acumulados_${article_id}`).innerHTML = html;
        }
    });
}



function disabledSegundaQuincena(fechaStr = null) {
    const d = fechaStr ? new Date(fechaStr + 'T00:00:00') : new Date();
    const dia = d.getDate();
    return (dia >= 16) ? 'disabled' : '';
}