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
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[0].id}, 'previsto')" class="input-ca" type="number" value="${ m[0].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[1].id}, 'previsto')" class="input-ca" type="number" value="${ m[1].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[2].id}, 'previsto')" class="input-ca" type="number" value="${ m[2].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[3].id}, 'previsto')" class="input-ca" type="number" value="${ m[3].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[4].id}, 'previsto')" class="input-ca" type="number" value="${ m[4].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[5].id}, 'previsto')" class="input-ca" type="number" value="${ m[5].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[6].id}, 'previsto')" class="input-ca" type="number" value="${ m[6].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[7].id}, 'previsto')" class="input-ca" type="number" value="${ m[7].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[8].id}, 'previsto')" class="input-ca" type="number" value="${ m[8].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[9].id}, 'previsto')" class="input-ca" type="number" value="${ m[9].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[10].id}, 'previsto')" class="input-ca" type="number" value="${ m[10].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[11].id}, 'previsto')" class="input-ca" type="number" value="${ m[11].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[12].id}, 'previsto')" class="input-ca" type="number" value="${ m[12].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[13].id}, 'previsto')" class="input-ca" type="number" value="${ m[13].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[14].id}, 'previsto')" class="input-ca" type="number" value="${ m[14].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[15].id}, 'previsto')" class="input-ca" type="number" value="${ m[15].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[16].id}, 'previsto')" class="input-ca" type="number" value="${ m[16].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[17].id}, 'previsto')" class="input-ca" type="number" value="${ m[17].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[18].id}, 'previsto')" class="input-ca" type="number" value="${ m[18].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[19].id}, 'previsto')" class="input-ca" type="number" value="${ m[19].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[20].id}, 'previsto')" class="input-ca" type="number" value="${ m[20].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[21].id}, 'previsto')" class="input-ca" type="number" value="${ m[21].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[22].id}, 'previsto')" class="input-ca" type="number" value="${ m[22].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[23].id}, 'previsto')" class="input-ca" type="number" value="${ m[23].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[24].id}, 'previsto')" class="input-ca" type="number" value="${ m[24].previsto }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[25].id}, 'previsto')" class="input-ca" type="number" value="${ m[25].previsto }"></td>
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
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[0].id}, 'entrada')" class="input-ca" type="number" value="${ m[0].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[1].id}, 'entrada')" class="input-ca" type="number" value="${ m[1].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[2].id}, 'entrada')" class="input-ca" type="number" value="${ m[2].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[3].id}, 'entrada')" class="input-ca" type="number" value="${ m[3].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[4].id}, 'entrada')" class="input-ca" type="number" value="${ m[4].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[5].id}, 'entrada')" class="input-ca" type="number" value="${ m[5].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[6].id}, 'entrada')" class="input-ca" type="number" value="${ m[6].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[7].id}, 'entrada')" class="input-ca" type="number" value="${ m[7].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[8].id}, 'entrada')" class="input-ca" type="number" value="${ m[8].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[9].id}, 'entrada')" class="input-ca" type="number" value="${ m[9].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[10].id}, 'entrada')" class="input-ca" type="number" value="${ m[10].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[11].id}, 'entrada')" class="input-ca" type="number" value="${ m[11].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[12].id}, 'entrada')" class="input-ca" type="number" value="${ m[12].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[13].id}, 'entrada')" class="input-ca" type="number" value="${ m[13].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[14].id}, 'entrada')" class="input-ca" type="number" value="${ m[14].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[15].id}, 'entrada')" class="input-ca" type="number" value="${ m[15].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[16].id}, 'entrada')" class="input-ca" type="number" value="${ m[16].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[17].id}, 'entrada')" class="input-ca" type="number" value="${ m[17].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[18].id}, 'entrada')" class="input-ca" type="number" value="${ m[18].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[19].id}, 'entrada')" class="input-ca" type="number" value="${ m[19].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[20].id}, 'entrada')" class="input-ca" type="number" value="${ m[20].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[21].id}, 'entrada')" class="input-ca" type="number" value="${ m[21].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[22].id}, 'entrada')" class="input-ca" type="number" value="${ m[22].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[23].id}, 'entrada')" class="input-ca" type="number" value="${ m[23].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[24].id}, 'entrada')" class="input-ca" type="number" value="${ m[24].entrada }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[25].id}, 'entrada')" class="input-ca" type="number" value="${ m[25].entrada }"></td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center">Stock</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[0].stock) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[1].stock) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[2].stock) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[3].stock) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[4].stock) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[5].stock) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[6].stock) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[7].stock) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[8].stock) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[9].stock) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[10].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[11].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[12].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[13].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[14].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[15].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[16].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[17].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[18].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[19].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[20].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[21].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[22].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[23].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[24].stock ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN(m[25].stock ) }</td>
                                </tr>
                            </tbody>
                 
                    </table>
            </div><br><br>
            `;

    return tableFact0;
}

