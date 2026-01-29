function getFactTable(
    concepto_top,
    concepto_bottom,
    m,
    ){
        
    console.log(m[0])

    let tableFact0 = `<div>
                        <table class="mt-1">
                            <thead>
                                <tr class="twcolor">
                                    <th rowspan="2">Concepto</th>
                                    <th colspan="2">${concepto_top[0]}</th>
                                    <th colspan="2">${concepto_top[1]}</th>
                                    <th colspan="2">${concepto_top[2]}</th>
                                    <th colspan="2">${concepto_top[3]}</th>
                                    <th colspan="2">${concepto_top[4]}</th>
                                    <th colspan="2">${concepto_top[5]}</th>
                                    <th colspan="2">${concepto_top[6]}</th>
                                    <th colspan="2">${concepto_top[7]}</th>
                                    <th colspan="2">${concepto_top[8]}</th>
                                    <th colspan="2">${concepto_top[9]}</th>
                                    <th colspan="2">${concepto_top[10]}</th>
                                    <th colspan="2">${concepto_top[11]}</th>
                                    <th colspan="2">${concepto_top[12]}</th>
                                </tr>
                                <tr class="twcolor">
                                    <th>${concepto_bottom[0]}</th>
                                    <th>${concepto_bottom[1]}</th>
                                    <th>${concepto_bottom[2]}</th>
                                    <th>${concepto_bottom[3]}</th>
                                    <th>${concepto_bottom[4]}</th>
                                    <th>${concepto_bottom[5]}</th>
                                    <th>${concepto_bottom[6]}</th>
                                    <th>${concepto_bottom[7]}</th>
                                    <th>${concepto_bottom[8]}</th>
                                    <th>${concepto_bottom[9]}</th>
                                    <th>${concepto_bottom[10]}</th>
                                    <th>${concepto_bottom[11]}</th>
                                    <th>${concepto_bottom[12]}</th>
                                    <th>${concepto_bottom[13]}</th>
                                    <th>${concepto_bottom[14]}</th>
                                    <th>${concepto_bottom[15]}</th>
                                    <th>${concepto_bottom[16]}</th>
                                    <th>${concepto_bottom[17]}</th>
                                    <th>${concepto_bottom[18]}</th>
                                    <th>${concepto_bottom[19]}</th>
                                    <th>${concepto_bottom[20]}</th>
                                    <th>${concepto_bottom[21]}</th>
                                    <th>${concepto_bottom[22]}</th>
                                    <th>${concepto_bottom[23]}</th>
                                    <th>${concepto_bottom[24]}</th>
                                    <th>${concepto_bottom[25]}</th>
                                </tr>
                             </thead>
                            <tbody>
                                <tr>
                                    <td class="border px-2 py-1 text-center">Previsto</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[0].prevision) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[1].prevision) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[2].prevision) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[3].prevision) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[4].prevision) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[5].prevision) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[6].prevision) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[7].prevision) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[8].prevision) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[9].prevision) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[10].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[11].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[12].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[13].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[14].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[15].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[16].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[17].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[18].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[19].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[20].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[21].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[22].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[23].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[24].prevision ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[25].prevision ) }</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center">Real</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[0].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[1].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[2].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[3].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[4].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[5].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[6].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[7].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[8].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[9].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[10].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[11].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[12].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[13].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[14].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[15].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[16].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[17].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[18].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[19].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[20].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[21].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[22].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[23].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[24].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[25].venta_real ) }</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center">Entrada</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[0].entrada) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[1].entrada) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[2].entrada) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[3].entrada) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[4].entrada) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[5].entrada) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[6].entrada) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[7].entrada) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[8].entrada) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[9].entrada) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[10].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[11].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[12].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[13].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[14].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[15].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[16].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[17].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[18].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[19].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[20].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[21].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[22].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[23].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[24].entrada ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[25].entrada ) }</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center">Stock</td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>

                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>

                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                </tr>
                            </tbody>
                 
            </table>
            </div><br><br>
            `;

    return tableFact0;
}


/*

 <tr>
                                    <td class="border px-2 py-1 text-center">Real</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[0].previsto_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[1].previsto_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[2].previsto_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[3].previsto_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[4].previsto_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[5].previsto_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[6].previsto_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[7].previsto_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[8].previsto_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[9].previsto_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[10].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[11].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[12].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[13].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[14].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[15].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[16].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[17].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[18].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[19].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[20].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[21].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[22].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[23].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[24].previsto_fijo ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[25].previsto_fijo ) }</td>
                                    </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center">Entrada</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[0].color))}">${ fENN(m[0].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[1].color))}">${ fENN(m[1].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[2].color))}">${ fENN(m[2].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[3].color))}">${ fENN(m[3].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[4].color))}">${ fENN(m[4].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[5].color))}">${ fENN(m[5].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[6].color))}">${ fENN(m[6].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[7].color))}">${ fENN(m[7].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[8].color))}">${ fENN(m[8].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[9].color))}">${ fENN(m[9].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[10].color))}">${ fENN(m[10].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[11].color))}">${ fENN(m[11].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[12].color))}">${ fENN(m[12].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[13].color))}">${ fENN(m[13].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[14].color))}">${ fENN(m[14].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[15].color))}">${ fENN(m[15].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[16].color))}">${ fENN(m[16].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[17].color))}">${ fENN(m[17].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[18].color))}">${ fENN(m[18].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[19].color))}">${ fENN(m[19].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[20].color))}">${ fENN(m[20].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[21].color))}">${ fENN(m[21].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[22].color))}">${ fENN(m[22].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[23].color))}">${ fENN(m[23].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[24].color))}">${ fENN(m[24].entrada_fijo) }</td>
                                    <td class="border px-2 py-1 text-center ${(putYellow_kat(m[25].color))}">${ fENN(m[25].entrada_fijo) }</td>
                                </tr>
                                <tr>
                                  <td class="border px-2 py-1 text-center">Stock</td>
                                   <td class="border px-2 py-1 text-center"> ${ fENN(m[0].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[1].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[2].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[3].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[4].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[5].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[6].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[7].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[8].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[9].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[10].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[11].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[12].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[13].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[14].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[15].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[16].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[17].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[18].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[19].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[20].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[21].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[22].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[23].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[24].stock_fijo) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[25].stock_fijo) }</td>
                                </tr>

                                <td class="border px-2 py-1 text-center">Prev</td>
                                   <td class="border px-2 py-1 text-center"> <input onkeydown="pressInputEdit(event, ${m[0].id}, 'gasto')" class="input-ca" type="number" value="${ m[0].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[1].id}, 'gasto')" class="input-ca" type="number" value="${ m[1].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[2].id}, 'gasto')" class="input-ca" type="number" value="${ m[2].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[3].id}, 'gasto')" class="input-ca" type="number" value="${ m[3].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[4].id}, 'gasto')" class="input-ca" type="number" value="${ m[4].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[5].id}, 'gasto')" class="input-ca" type="number" value="${ m[5].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[6].id}, 'gasto')" class="input-ca" type="number" value="${ m[6].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[7].id}, 'gasto')" class="input-ca" type="number" value="${ m[7].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[8].id}, 'gasto')" class="input-ca" type="number" value="${ m[8].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[9].id}, 'gasto')" class="input-ca" type="number" value="${ m[9].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[10].id}, 'gasto')" class="input-ca" type="number" value="${ m[10].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[11].id}, 'gasto')" class="input-ca" type="number" value="${ m[11].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[12].id}, 'gasto')" class="input-ca" type="number" value="${ m[12].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[13].id}, 'gasto')" class="input-ca" type="number" value="${ m[13].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[14].id}, 'gasto')" class="input-ca" type="number" value="${ m[14].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[15].id}, 'gasto')" class="input-ca" type="number" value="${ m[15].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[16].id}, 'gasto')" class="input-ca" type="number" value="${ m[16].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[17].id}, 'gasto')" class="input-ca" type="number" value="${ m[17].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[18].id}, 'gasto')" class="input-ca" type="number" value="${ m[18].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[19].id}, 'gasto')" class="input-ca" type="number" value="${ m[19].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[20].id}, 'gasto')" class="input-ca" type="number" value="${ m[20].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[21].id}, 'gasto')" class="input-ca" type="number" value="${ m[21].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[22].id}, 'gasto')" class="input-ca" type="number" value="${ m[22].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[23].id}, 'gasto')" class="input-ca" type="number" value="${ m[23].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[24].id}, 'gasto')" class="input-ca" type="number" value="${ m[24].previsto_mod }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[25].id}, 'gasto')" class="input-ca" type="number" value="${ m[25].previsto_mod }"></td>
                                </tr>

                                <td class="border px-2 py-1 text-center">Entrada</td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[0].color))}"><input onkeydown="pressInputEdit(event, ${m[0].id}, 'entrada')" class="input-ca" type="number" value="${ m[0].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[1].color))}"><input onkeydown="pressInputEdit(event, ${m[1].id}, 'entrada')" class="input-ca" type="number" value="${ m[1].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[2].color))}"><input onkeydown="pressInputEdit(event, ${m[2].id}, 'entrada')" class="input-ca" type="number" value="${ m[2].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[3].color))}"><input onkeydown="pressInputEdit(event, ${m[3].id}, 'entrada')" class="input-ca" type="number" value="${ m[3].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[4].color))}"><input onkeydown="pressInputEdit(event, ${m[4].id}, 'entrada')" class="input-ca" type="number" value="${ m[4].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[5].color))}"><input onkeydown="pressInputEdit(event, ${m[5].id}, 'entrada')" class="input-ca" type="number" value="${ m[5].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[6].color))}"><input onkeydown="pressInputEdit(event, ${m[6].id}, 'entrada')" class="input-ca" type="number" value="${ m[6].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[7].color))}"><input onkeydown="pressInputEdit(event, ${m[7].id}, 'entrada')" class="input-ca" type="number" value="${ m[7].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[8].color))}"><input onkeydown="pressInputEdit(event, ${m[8].id}, 'entrada')" class="input-ca" type="number" value="${ m[8].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[9].color))}"><input onkeydown="pressInputEdit(event, ${m[9].id}, 'entrada')" class="input-ca" type="number" value="${ m[9].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[10].color))}"><input onkeydown="pressInputEdit(event, ${m[10].id}, 'entrada')" class="input-ca" type="number" value="${ m[10].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[11].color))}"><input onkeydown="pressInputEdit(event, ${m[11].id}, 'entrada')" class="input-ca" type="number" value="${ m[11].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[12].color))}"><input onkeydown="pressInputEdit(event, ${m[12].id}, 'entrada')" class="input-ca" type="number" value="${ m[12].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[13].color))}"><input onkeydown="pressInputEdit(event, ${m[13].id}, 'entrada')" class="input-ca" type="number" value="${ m[13].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[14].color))}"><input onkeydown="pressInputEdit(event, ${m[14].id}, 'entrada')" class="input-ca" type="number" value="${ m[14].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[15].color))}"><input onkeydown="pressInputEdit(event, ${m[15].id}, 'entrada')" class="input-ca" type="number" value="${ m[15].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[16].color))}"><input onkeydown="pressInputEdit(event, ${m[16].id}, 'entrada')" class="input-ca" type="number" value="${ m[16].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[17].color))}"><input onkeydown="pressInputEdit(event, ${m[17].id}, 'entrada')" class="input-ca" type="number" value="${ m[17].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[18].color))}"><input onkeydown="pressInputEdit(event, ${m[18].id}, 'entrada')" class="input-ca" type="number" value="${ m[18].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[19].color))}"><input onkeydown="pressInputEdit(event, ${m[19].id}, 'entrada')" class="input-ca" type="number" value="${ m[19].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[20].color))}"><input onkeydown="pressInputEdit(event, ${m[20].id}, 'entrada')" class="input-ca" type="number" value="${ m[20].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[21].color))}"><input onkeydown="pressInputEdit(event, ${m[21].id}, 'entrada')" class="input-ca" type="number" value="${ m[21].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[22].color))}"><input onkeydown="pressInputEdit(event, ${m[22].id}, 'entrada')" class="input-ca" type="number" value="${ m[22].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[23].color))}"><input onkeydown="pressInputEdit(event, ${m[23].id}, 'entrada')" class="input-ca" type="number" value="${ m[23].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[24].color))}"><input onkeydown="pressInputEdit(event, ${m[24].id}, 'entrada')" class="input-ca" type="number" value="${ m[24].entrada_mod }"></td>
                                    <td class="border px-2 py-1 text-center  ${(putYellow_kat(m[25].color))}"><input onkeydown="pressInputEdit(event, ${m[25].id}, 'entrada')" class="input-ca" type="number" value="${ m[25].entrada_mod }"></td>
                                </tr>

                                <td class="border px-2 py-1 text-center">Stock</td>
                                   <td class="border px-2 py-1 text-center"> ${ fENN( m[0].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[1].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[2].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[3].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[4].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[5].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[6].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[7].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[8].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[9].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[10].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[11].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[12].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[13].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[14].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[15].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[16].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[17].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[18].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[19].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[20].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[21].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[22].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[23].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[24].stock_mod) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN( m[25].stock_mod)}</td>
                                </tr>


*/