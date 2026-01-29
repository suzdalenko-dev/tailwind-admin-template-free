
let topTable = `<div class="table-round">

            <table class="styled-table-ca">
                <thead>
                    <tr>
                        <th class="topLeft">Familia</th>
                        <th>Codígo</th>
                        <th class="px-2"> Descripción </th>
                        <th>Stock Inicio Año</th>
                        <th class="topRight">Stock Act.</th>
                    </tr>
                </thead>
                <tbody>`;

let topCenterTable = `<tr> NO SE USA DESDE AQUI
                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-center"></td>
                    </tr>`;

let topBottomTable = `</tbody>
            </table>
        </div>`;


function restablecerButton(){
    return ''
    return `<div class="boton_restablecer"><button type="button" class="btn-reset" onclick="restablecerTablaCA()">↩️ Restablecer</button></div>`;
}



/*
{"id": 21, "items": ["40158"], "stock_actual": [{"CODIGO_ARTICULO": "40158", "DESCRIP_COMERCIAL": "FILETE PANGA 170/220 INTERF. 0% 1x5", "STOCK": 9975.0}], "stock_bloque_total": 9975.0}
*/
