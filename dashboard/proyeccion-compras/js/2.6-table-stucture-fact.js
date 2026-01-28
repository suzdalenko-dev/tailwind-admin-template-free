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
                                    <th>${labelDesdeUnoHastaHoy()}</th>
                                    <th>${labelDesdeHoyHastaFinMes()}</th>
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
                                    <td class="border px-2 py-1 text-center">Prev</td>
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

                                <td class="border px-2 py-1 text-center">Prev M</td>
                                   <td class="border px-2 py-1 text-center"> ${ fENN( m[0].previsto_mod) }</td>
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

                                <td class="border px-2 py-1 text-center">Entrada M</td>
                                   <td class="border px-2 py-1 text-center"> ${ fENN(m[0].entrada_mod) }</td>
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

                                <td class="border px-2 py-1 text-center">Stock M</td>
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
                            </tbody>
                 
            </table>
            </div><br><br>
            `;

    return tableFact0;
}


/*


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
                                    <th>${concepto_bottom[12]} </th>
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
                                    <th>${concepto_bottom[26]}</th>
                                    <th>${concepto_bottom[27]}</th>
                                    <th>${concepto_bottom[28]}</th>
                                    <th>${concepto_bottom[29]}</th>
                                    <th>${concepto_bottom[30]}</th>
                                    <th>${concepto_bottom[31]}</th>
                                    <th>${concepto_bottom[32]}</th>
                                    <th>${concepto_bottom[33]}</th>
                                    <th>${concepto_bottom[34]}</th>
                                    <th>${concepto_bottom[35]}</th>
                                    <th>${concepto_bottom[36]}</th>
                                    <th>${concepto_bottom[37]}</th>
                                    <th>${concepto_bottom[38]}</th>
                                    <th>${concepto_bottom[39]}</th>
                                    <th>${concepto_bottom[40]}</th>
                                    <th>${concepto_bottom[41]}</th>
                                    <th>${concepto_bottom[42]}</th>
                                    <th>${concepto_bottom[43]}</th>
                                    <th>${concepto_bottom[44]}</th>
                                    <th>${concepto_bottom[45]}</th>
                                    <th>${concepto_bottom[46]}</th>
                                    <th>${concepto_bottom[47]}</th>
                                    <th>${concepto_bottom[48]}</th>
                                    <th>${concepto_bottom[49]}</th>
                                </tr>


                </thead>

              <tbody>
                    <tr>
                        <td class="border px-2 py-1 text-center">Previsto</td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[0]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[1]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[2]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[3]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[4]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[5]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[6]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[7]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[8]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[9]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[10]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[11]}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[12]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[13]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[14]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[15]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[16]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[17]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[18]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[19]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[20]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[21]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[22]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[23]}"></td>
                       <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${venta_prevista[24]}"></td>
                    </tr>

                    <tr>
                        <td class="border px-2 py-1 text-center">Real</td>
                        <td class="border px-2 py-1 text-center">${real[0]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[1]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[2]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[3]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[4]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[5]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[6]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[7]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[8]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[9]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[10]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[11]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${real[12]}</td>
                    </tr>

                    <tr>
                        <td class="border px-2 py-1 text-center">LY</td>
                        <td class="border px-2 py-1 text-center">${ly[0]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[1]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[2]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[3]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[4]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[5]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[6]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[7]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[8]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[9]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[10]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[11]}</td>
                        <td class="border px-2 py-1 text-center" colspan="2">${ly[12]}</td>
                    </tr>

                    <tr>
                        <td class="border px-2 py-1 text-center">Ent. M</td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[0].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[1].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[2].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[3].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[4].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[5].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[6].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[7].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[8].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[9].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[10].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[11].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[12].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[13].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[14].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[15].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[16].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[17].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[18].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[19].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[20].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[21].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[22].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[23].value}"></td>
                        <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${entrada[24].value}"></td>
                    </tr>

                    <tr>
                        <td class="border px-2 py-1 text-center">Ent. R</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[0].color)}">${entrada[0].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[1].color)}">${entrada[1].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[2].color)}">${entrada[2].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[3].color)}">${entrada[3].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[4].color)}">${entrada[4].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[5].color)}">${entrada[5].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[6].color)}">${entrada[6].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[7].color)}">${entrada[7].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[8].color)}">${entrada[8].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[9].color)}">${entrada[9].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[10].color)}">${entrada[10].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[11].color)}">${entrada[11].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[12].color)}">${entrada[12].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[13].color)}">${entrada[13].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[14].color)}">${entrada[14].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[15].color)}">${entrada[15].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[16].color)}">${entrada[16].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[17].color)}">${entrada[17].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[18].color)}">${entrada[18].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[19].color)}">${entrada[19].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[20].color)}">${entrada[20].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[21].color)}">${entrada[21].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[22].color)}">${entrada[22].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[23].color)}">${entrada[23].value}</td>
                        <td class="border px-2 py-1 text-center ${putYellow_kat(entrada[24].color)}">${entrada[24].value}</td>
                    </tr>

                    <tr>
                        <td class="border px-2 py-1 text-center">Stock</td>
                        <td class="border px-2 py-1 text-center">${stock[0]}</td>
                        <td class="border px-2 py-1 text-center">${stock[1]}</td>
                        <td class="border px-2 py-1 text-center">${stock[2]}</td>
                        <td class="border px-2 py-1 text-center">${stock[3]}</td>
                        <td class="border px-2 py-1 text-center">${stock[4]}</td>
                        <td class="border px-2 py-1 text-center">${stock[5]}</td>
                        <td class="border px-2 py-1 text-center">${stock[6]}</td>
                        <td class="border px-2 py-1 text-center">${stock[7]}</td>
                        <td class="border px-2 py-1 text-center">${stock[8]}</td>
                        <td class="border px-2 py-1 text-center">${stock[9]}</td>
                        <td class="border px-2 py-1 text-center">${stock[10]}</td>
                        <td class="border px-2 py-1 text-center">${stock[11]}</td>
                        <td class="border px-2 py-1 text-center">${stock[12]}</td>
                        <td class="border px-2 py-1 text-center">${stock[13]}</td>
                        <td class="border px-2 py-1 text-center">${stock[14]}</td>
                        <td class="border px-2 py-1 text-center">${stock[15]}</td>
                        <td class="border px-2 py-1 text-center">${stock[16]}</td>
                        <td class="border px-2 py-1 text-center">${stock[17]}</td>
                        <td class="border px-2 py-1 text-center">${stock[18]}</td>
                        <td class="border px-2 py-1 text-center">${stock[19]}</td>
                        <td class="border px-2 py-1 text-center">${stock[20]}</td>
                        <td class="border px-2 py-1 text-center">${stock[21]}</td>
                        <td class="border px-2 py-1 text-center">${stock[22]}</td>
                        <td class="border px-2 py-1 text-center">${stock[23]}</td>
                        <td class="border px-2 py-1 text-center">${stock[24]}</td>
                    </tr>
                </tbody>
                */