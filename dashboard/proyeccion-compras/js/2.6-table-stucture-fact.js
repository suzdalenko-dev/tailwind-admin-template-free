function getFactTable(
    concepto_top,
    concepto_bottom,
    m,
    ){
        
    console.log(m[0], m[1], m[2])

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
                                <tr id="tr_previsto_${m[0].familia_id}_${m[0].article_code}">
                                    <td class="border px-2 py-1 text-center">Previsto</td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[0].id}" onkeydown="pressInputEdit(event, ${m[0].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[0].previsto_modificado)}"  type="number" value="${ SIN0(m[0].previsto)  }" ${disabledSegundaQuincena()}></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[1].id}" onkeydown="pressInputEdit(event, ${m[1].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[1].previsto_modificado)}"  type="number" value="${ SIN0(m[1].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[2].id}" onkeydown="pressInputEdit(event, ${m[2].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[2].previsto_modificado)}"  type="number" value="${ SIN0(m[2].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[3].id}" onkeydown="pressInputEdit(event, ${m[3].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[3].previsto_modificado)}"  type="number" value="${ SIN0(m[3].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[4].id}" onkeydown="pressInputEdit(event, ${m[4].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[4].previsto_modificado)}"  type="number" value="${ SIN0(m[4].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[5].id}" onkeydown="pressInputEdit(event, ${m[5].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[5].previsto_modificado)}"  type="number" value="${ SIN0(m[5].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[6].id}" onkeydown="pressInputEdit(event, ${m[6].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[6].previsto_modificado)}"  type="number" value="${ SIN0(m[6].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[7].id}" onkeydown="pressInputEdit(event, ${m[7].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[7].previsto_modificado)}"  type="number" value="${ SIN0(m[7].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[8].id}" onkeydown="pressInputEdit(event, ${m[8].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[8].previsto_modificado)}"  type="number" value="${ SIN0(m[8].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[9].id}" onkeydown="pressInputEdit(event, ${m[9].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[9].previsto_modificado)}"  type="number" value="${ SIN0(m[9].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[10].id}" onkeydown="pressInputEdit(event, ${m[10].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[10].previsto_modificado)}" type="number" value="${ SIN0(m[10].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[11].id}" onkeydown="pressInputEdit(event, ${m[11].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[11].previsto_modificado)}" type="number" value="${ SIN0(m[11].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[12].id}" onkeydown="pressInputEdit(event, ${m[12].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[12].previsto_modificado)}" type="number" value="${ SIN0(m[12].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[13].id}" onkeydown="pressInputEdit(event, ${m[13].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[13].previsto_modificado)}" type="number" value="${ SIN0(m[13].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[14].id}" onkeydown="pressInputEdit(event, ${m[14].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[14].previsto_modificado)}" type="number" value="${ SIN0(m[14].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[15].id}" onkeydown="pressInputEdit(event, ${m[15].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[15].previsto_modificado)}" type="number" value="${ SIN0(m[15].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[16].id}" onkeydown="pressInputEdit(event, ${m[16].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[16].previsto_modificado)}" type="number" value="${ SIN0(m[16].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[17].id}" onkeydown="pressInputEdit(event, ${m[17].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[17].previsto_modificado)}" type="number" value="${ SIN0(m[17].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[18].id}" onkeydown="pressInputEdit(event, ${m[18].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[18].previsto_modificado)}" type="number" value="${ SIN0(m[18].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[19].id}" onkeydown="pressInputEdit(event, ${m[19].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[19].previsto_modificado)}" type="number" value="${ SIN0(m[19].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[20].id}" onkeydown="pressInputEdit(event, ${m[20].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[20].previsto_modificado)}" type="number" value="${ SIN0(m[20].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[21].id}" onkeydown="pressInputEdit(event, ${m[21].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[21].previsto_modificado)}" type="number" value="${ SIN0(m[21].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[22].id}" onkeydown="pressInputEdit(event, ${m[22].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[22].previsto_modificado)}" type="number" value="${ SIN0(m[22].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[23].id}" onkeydown="pressInputEdit(event, ${m[23].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[23].previsto_modificado)}" type="number" value="${ SIN0(m[23].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[24].id}" onkeydown="pressInputEdit(event, ${m[24].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[24].previsto_modificado)}" type="number" value="${ SIN0(m[24].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[25].id}" onkeydown="pressInputEdit(event, ${m[25].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlueFun(m[25].previsto_modificado)}" type="number" value="${ SIN0(m[25].previsto) }"></td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center">Real</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[0].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[1].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[2].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[3].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[4].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[5].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[6].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[7].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[8].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[9].venta_real) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[10].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[11].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[12].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[13].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[14].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[15].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[16].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[17].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[18].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[19].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[20].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[21].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[22].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[23].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[24].venta_real ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[25].venta_real ) }</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center">LY</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[0].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[1].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[2].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[3].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[4].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[5].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[6].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[7].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[8].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[9].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[10].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[11].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[12].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[13].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[14].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[15].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[16].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[17].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[18].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[19].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[20].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[21].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[22].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[23].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[24].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[25].venta_agno_pasado ) }</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center">Entrada</td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[0].id}, 'entrada')"  class="input-ca ${colorYellow(m[0].color)} ${colorBlueFun(m[0].entrada_modificada)}" type="number" value="${ SIN0(m[0].entrada) }" ${disabledSegundaQuincena()}></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[1].id}, 'entrada')"  class="input-ca ${colorYellow(m[1].color)} ${colorBlueFun(m[1].entrada_modificada)}" type="number" value="${ SIN0(m[1].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[2].id}, 'entrada')"  class="input-ca ${colorYellow(m[2].color)} ${colorBlueFun(m[2].entrada_modificada)}" type="number" value="${ SIN0(m[2].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[3].id}, 'entrada')"  class="input-ca ${colorYellow(m[3].color)} ${colorBlueFun(m[3].entrada_modificada)}" type="number" value="${ SIN0(m[3].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[4].id}, 'entrada')"  class="input-ca ${colorYellow(m[4].color)} ${colorBlueFun(m[4].entrada_modificada)}" type="number" value="${ SIN0(m[4].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[5].id}, 'entrada')"  class="input-ca ${colorYellow(m[5].color)} ${colorBlueFun(m[5].entrada_modificada)}" type="number" value="${ SIN0(m[5].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[6].id}, 'entrada')"  class="input-ca ${colorYellow(m[6].color)} ${colorBlueFun(m[6].entrada_modificada)}" type="number" value="${ SIN0(m[6].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[7].id}, 'entrada')"  class="input-ca ${colorYellow(m[7].color)} ${colorBlueFun(m[7].entrada_modificada)}" type="number" value="${ SIN0(m[7].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[8].id}, 'entrada')"  class="input-ca ${colorYellow(m[8].color)} ${colorBlueFun(m[8].entrada_modificada)}" type="number" value="${ SIN0(m[8].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[9].id}, 'entrada')"  class="input-ca ${colorYellow(m[9].color)} ${colorBlueFun(m[9].entrada_modificada)}" type="number" value="${ SIN0(m[9].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[10].id}, 'entrada')" class="input-ca ${colorYellow(m[10].color)} ${colorBlueFun(m[10].entrada_modificada)}" type="number" value="${ SIN0(m[10].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[11].id}, 'entrada')" class="input-ca ${colorYellow(m[11].color)} ${colorBlueFun(m[11].entrada_modificada)}" type="number" value="${ SIN0(m[11].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[12].id}, 'entrada')" class="input-ca ${colorYellow(m[12].color)} ${colorBlueFun(m[12].entrada_modificada)}" type="number" value="${ SIN0(m[12].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[13].id}, 'entrada')" class="input-ca ${colorYellow(m[12].color)} ${colorBlueFun(m[13].entrada_modificada)}" type="number" value="${ SIN0(m[13].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[14].id}, 'entrada')" class="input-ca ${colorYellow(m[13].color)} ${colorBlueFun(m[14].entrada_modificada)}" type="number" value="${ SIN0(m[14].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[15].id}, 'entrada')" class="input-ca ${colorYellow(m[14].color)} ${colorBlueFun(m[15].entrada_modificada)}" type="number" value="${ SIN0(m[15].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[16].id}, 'entrada')" class="input-ca ${colorYellow(m[15].color)} ${colorBlueFun(m[16].entrada_modificada)}" type="number" value="${ SIN0(m[16].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[17].id}, 'entrada')" class="input-ca ${colorYellow(m[16].color)} ${colorBlueFun(m[17].entrada_modificada)}" type="number" value="${ SIN0(m[17].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[18].id}, 'entrada')" class="input-ca ${colorYellow(m[17].color)} ${colorBlueFun(m[18].entrada_modificada)}" type="number" value="${ SIN0(m[18].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[19].id}, 'entrada')" class="input-ca ${colorYellow(m[18].color)} ${colorBlueFun(m[19].entrada_modificada)}" type="number" value="${ SIN0(m[19].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[20].id}, 'entrada')" class="input-ca ${colorYellow(m[20].color)} ${colorBlueFun(m[20].entrada_modificada)}" type="number" value="${ SIN0(m[20].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[21].id}, 'entrada')" class="input-ca ${colorYellow(m[21].color)} ${colorBlueFun(m[21].entrada_modificada)}" type="number" value="${ SIN0(m[21].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[22].id}, 'entrada')" class="input-ca ${colorYellow(m[22].color)} ${colorBlueFun(m[22].entrada_modificada)}" type="number" value="${ SIN0(m[22].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[23].id}, 'entrada')" class="input-ca ${colorYellow(m[23].color)} ${colorBlueFun(m[23].entrada_modificada)}" type="number" value="${ SIN0(m[23].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[24].id}, 'entrada')" class="input-ca ${colorYellow(m[24].color)} ${colorBlueFun(m[24].entrada_modificada)}" type="number" value="${ SIN0(m[24].entrada) }"></td>
                                    <td class="border px-2 py-1 text-center"><input onkeydown="pressInputEdit(event, ${m[25].id}, 'entrada')" class="input-ca ${colorYellow(m[25].color)} ${colorBlueFun(m[25].entrada_modificada)}" type="number" value="${ SIN0(m[25].entrada) }"></td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center">Stock</td>
                                    <td class="border px-2 py-1 text-center">${ fENN0(m[0].stock) }</td>
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
                                
                                <tr> 
                                    <td>
                                        <br>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center color_grey">Entr. R</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[0].entra_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[1].entra_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[2].entra_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[3].entra_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[4].entra_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[5].entra_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[6].entra_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[7].entra_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[8].entra_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[9].entra_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[10].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[11].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[12].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[13].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[14].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[15].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[16].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[17].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[18].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[19].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[20].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[21].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[22].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[23].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[24].entra_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[25].entra_real_tramo ) }</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center color_grey">Stock R</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[0].stock_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[1].stock_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[2].stock_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[3].stock_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[4].stock_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[5].stock_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[6].stock_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[7].stock_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[8].stock_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[9].stock_real_tramo) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[10].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[11].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[12].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[13].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[14].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[15].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[16].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[17].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[18].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[19].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[20].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[21].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[22].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[23].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[24].stock_real_tramo ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[25].stock_real_tramo ) }</td>
                                </tr>
                            </tbody>
                 
                    </table>
            </div><br><br><br><br><br><br><br><br><br><br>
            `;

    return tableFact0;
}

