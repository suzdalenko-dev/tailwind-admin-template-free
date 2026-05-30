function getFactTable(
    concepto_top,
    concepto_bottom,
    m,
    ){
        
    // console.log(m[0], m[1], m[2])

    
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
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[0].id}" onkeydown="pressInputEdit(event, ${m[0].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[0].previsto_modificado)}"  type="number" value="${ SIN0(m[0].previsto)  }" ${disabledSegundaQuincena()}></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[1].id}" onkeydown="pressInputEdit(event, ${m[1].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[1].previsto_modificado)}"  type="number" value="${ SIN0(m[1].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[2].id}" onkeydown="pressInputEdit(event, ${m[2].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[2].previsto_modificado)}"  type="number" value="${ SIN0(m[2].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[3].id}" onkeydown="pressInputEdit(event, ${m[3].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[3].previsto_modificado)}"  type="number" value="${ SIN0(m[3].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[4].id}" onkeydown="pressInputEdit(event, ${m[4].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[4].previsto_modificado)}"  type="number" value="${ SIN0(m[4].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[5].id}" onkeydown="pressInputEdit(event, ${m[5].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[5].previsto_modificado)}"  type="number" value="${ SIN0(m[5].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[6].id}" onkeydown="pressInputEdit(event, ${m[6].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[6].previsto_modificado)}"  type="number" value="${ SIN0(m[6].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[7].id}" onkeydown="pressInputEdit(event, ${m[7].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[7].previsto_modificado)}"  type="number" value="${ SIN0(m[7].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[8].id}" onkeydown="pressInputEdit(event, ${m[8].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[8].previsto_modificado)}"  type="number" value="${ SIN0(m[8].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[9].id}" onkeydown="pressInputEdit(event, ${m[9].id},  'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[9].previsto_modificado)}"  type="number" value="${ SIN0(m[9].previsto)  }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[10].id}" onkeydown="pressInputEdit(event, ${m[10].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[10].previsto_modificado)}" type="number" value="${ SIN0(m[10].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[11].id}" onkeydown="pressInputEdit(event, ${m[11].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[11].previsto_modificado)}" type="number" value="${ SIN0(m[11].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[12].id}" onkeydown="pressInputEdit(event, ${m[12].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[12].previsto_modificado)}" type="number" value="${ SIN0(m[12].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[13].id}" onkeydown="pressInputEdit(event, ${m[13].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[13].previsto_modificado)}" type="number" value="${ SIN0(m[13].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[14].id}" onkeydown="pressInputEdit(event, ${m[14].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[14].previsto_modificado)}" type="number" value="${ SIN0(m[14].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[15].id}" onkeydown="pressInputEdit(event, ${m[15].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[15].previsto_modificado)}" type="number" value="${ SIN0(m[15].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[16].id}" onkeydown="pressInputEdit(event, ${m[16].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[16].previsto_modificado)}" type="number" value="${ SIN0(m[16].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[17].id}" onkeydown="pressInputEdit(event, ${m[17].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[17].previsto_modificado)}" type="number" value="${ SIN0(m[17].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[18].id}" onkeydown="pressInputEdit(event, ${m[18].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[18].previsto_modificado)}" type="number" value="${ SIN0(m[18].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[19].id}" onkeydown="pressInputEdit(event, ${m[19].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[19].previsto_modificado)}" type="number" value="${ SIN0(m[19].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[20].id}" onkeydown="pressInputEdit(event, ${m[20].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[20].previsto_modificado)}" type="number" value="${ SIN0(m[20].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[21].id}" onkeydown="pressInputEdit(event, ${m[21].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[21].previsto_modificado)}" type="number" value="${ SIN0(m[21].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[22].id}" onkeydown="pressInputEdit(event, ${m[22].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[22].previsto_modificado)}" type="number" value="${ SIN0(m[22].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[23].id}" onkeydown="pressInputEdit(event, ${m[23].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[23].previsto_modificado)}" type="number" value="${ SIN0(m[23].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[24].id}" onkeydown="pressInputEdit(event, ${m[24].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[24].previsto_modificado)}" type="number" value="${ SIN0(m[24].previsto) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[25].id}" onkeydown="pressInputEdit(event, ${m[25].id}, 'previsto',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[25].previsto_modificado)}" type="number" value="${ SIN0(m[25].previsto) }"></td>
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
                                <tr id="tr_entrada_${m[0].familia_id}_${m[0].article_code}">
                                    <td class="border px-2 py-1 text-center">Entrada M</td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[0].id}"  oncontextmenu="entradaManualClickDerecho(event, ${m[0].id})" onkeydown="pressInputEdit(event, ${m[0].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )"  class="input-ca ${colorBlackBlueRedFun(m[0].color)}" type="number" value="${ SIN0(m[0].entrada_manual) }" ${disabledSegundaQuincena()}></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[1].id}"  oncontextmenu="entradaManualClickDerecho(event, ${m[1].id})" onkeydown="pressInputEdit(event, ${m[1].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )"  class="input-ca ${colorBlackBlueRedFun(m[1].color)}" type="number" value="${ SIN0(m[1].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[2].id}"  oncontextmenu="entradaManualClickDerecho(event, ${m[2].id})" onkeydown="pressInputEdit(event, ${m[2].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )"  class="input-ca ${colorBlackBlueRedFun(m[2].color)}" type="number" value="${ SIN0(m[2].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[3].id}"  oncontextmenu="entradaManualClickDerecho(event, ${m[3].id})" onkeydown="pressInputEdit(event, ${m[3].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )"  class="input-ca ${colorBlackBlueRedFun(m[3].color)}" type="number" value="${ SIN0(m[3].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[4].id}"  oncontextmenu="entradaManualClickDerecho(event, ${m[4].id})" onkeydown="pressInputEdit(event, ${m[4].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )"  class="input-ca ${colorBlackBlueRedFun(m[4].color)}" type="number" value="${ SIN0(m[4].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[5].id}"  oncontextmenu="entradaManualClickDerecho(event, ${m[5].id})" onkeydown="pressInputEdit(event, ${m[5].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )"  class="input-ca ${colorBlackBlueRedFun(m[5].color)}" type="number" value="${ SIN0(m[5].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[6].id}"  oncontextmenu="entradaManualClickDerecho(event, ${m[6].id})" onkeydown="pressInputEdit(event, ${m[6].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )"  class="input-ca ${colorBlackBlueRedFun(m[6].color)}" type="number" value="${ SIN0(m[6].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[7].id}"  oncontextmenu="entradaManualClickDerecho(event, ${m[7].id})" onkeydown="pressInputEdit(event, ${m[7].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )"  class="input-ca ${colorBlackBlueRedFun(m[7].color)}" type="number" value="${ SIN0(m[7].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[8].id}"  oncontextmenu="entradaManualClickDerecho(event, ${m[8].id})" onkeydown="pressInputEdit(event, ${m[8].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )"  class="input-ca ${colorBlackBlueRedFun(m[8].color)}" type="number" value="${ SIN0(m[8].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[9].id}"  oncontextmenu="entradaManualClickDerecho(event, ${m[9].id})" onkeydown="pressInputEdit(event, ${m[9].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )"  class="input-ca ${colorBlackBlueRedFun(m[9].color)}" type="number" value="${ SIN0(m[9].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[10].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[10].id})" onkeydown="pressInputEdit(event, ${m[10].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[10].color)} " type="number" value="${ SIN0(m[10].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[11].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[11].id})" onkeydown="pressInputEdit(event, ${m[11].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[11].color)} " type="number" value="${ SIN0(m[11].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[12].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[12].id})" onkeydown="pressInputEdit(event, ${m[12].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[12].color)} " type="number" value="${ SIN0(m[12].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[13].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[13].id})" onkeydown="pressInputEdit(event, ${m[13].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[13].color)} " type="number" value="${ SIN0(m[13].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[14].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[14].id})" onkeydown="pressInputEdit(event, ${m[14].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[14].color)} " type="number" value="${ SIN0(m[14].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[15].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[15].id})" onkeydown="pressInputEdit(event, ${m[15].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[15].color)} " type="number" value="${ SIN0(m[15].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[16].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[16].id})" onkeydown="pressInputEdit(event, ${m[16].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[16].color)} " type="number" value="${ SIN0(m[16].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[17].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[17].id})" onkeydown="pressInputEdit(event, ${m[17].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[17].color)} " type="number" value="${ SIN0(m[17].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[18].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[18].id})" onkeydown="pressInputEdit(event, ${m[18].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[18].color)} " type="number" value="${ SIN0(m[18].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[19].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[19].id})" onkeydown="pressInputEdit(event, ${m[19].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[19].color)} " type="number" value="${ SIN0(m[19].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[20].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[20].id})" onkeydown="pressInputEdit(event, ${m[20].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[20].color)} " type="number" value="${ SIN0(m[20].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[21].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[21].id})" onkeydown="pressInputEdit(event, ${m[21].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[21].color)} " type="number" value="${ SIN0(m[21].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[22].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[22].id})" onkeydown="pressInputEdit(event, ${m[22].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[22].color)} " type="number" value="${ SIN0(m[22].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[23].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[23].id})" onkeydown="pressInputEdit(event, ${m[23].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[23].color)} " type="number" value="${ SIN0(m[23].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[24].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[24].id})" onkeydown="pressInputEdit(event, ${m[24].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[24].color)} " type="number" value="${ SIN0(m[24].entrada_manual) }"></td>
                                    <td class="border px-2 py-1 text-center"><input data-lineaid="${m[25].id}" oncontextmenu="entradaManualClickDerecho(event, ${m[25].id})" onkeydown="pressInputEdit(event, ${m[25].id}, 'entrada',  ${m[0].familia_id}, ${m[0].article_code} )" class="input-ca ${colorBlackBlueRedFun(m[25].color)} " type="number" value="${ SIN0(m[25].entrada_manual) }"></td>
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
                                    <td class="border px-2 py-1 text-center color_grey">LY</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[0].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[1].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[2].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[3].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[4].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[5].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[6].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[7].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[8].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[9].venta_agno_pasado) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[10].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[11].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[12].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[13].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[14].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[15].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[16].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[17].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[18].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[19].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[20].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[21].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[22].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[23].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[24].venta_agno_pasado ) }</td>
                                    <td class="border px-2 py-1 text-center color_grey">${ fENN0(m[25].venta_agno_pasado ) }</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1 text-center color_grey">Entrada P</td>
                                    <td title="${m[0].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[0].entrada_pendiente) }</td>
                                    <td title="${m[1].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[1].entrada_pendiente) }</td>
                                    <td title="${m[2].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[2].entrada_pendiente) }</td>
                                    <td title="${m[3].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[3].entrada_pendiente) }</td>
                                    <td title="${m[4].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[4].entrada_pendiente) }</td>
                                    <td title="${m[5].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[5].entrada_pendiente) }</td>
                                    <td title="${m[6].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[6].entrada_pendiente) }</td>
                                    <td title="${m[7].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[7].entrada_pendiente) }</td>
                                    <td title="${m[8].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[8].entrada_pendiente) }</td>
                                    <td title="${m[9].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[9].entrada_pendiente) }</td>
                                    <td title="${m[10].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[10].entrada_pendiente ) }</td>
                                    <td title="${m[11].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[11].entrada_pendiente ) }</td>
                                    <td title="${m[12].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[12].entrada_pendiente ) }</td>
                                    <td title="${m[13].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[13].entrada_pendiente ) }</td>
                                    <td title="${m[14].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[14].entrada_pendiente ) }</td>
                                    <td title="${m[15].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[15].entrada_pendiente ) }</td>
                                    <td title="${m[16].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[16].entrada_pendiente ) }</td>
                                    <td title="${m[17].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[17].entrada_pendiente ) }</td>
                                    <td title="${m[18].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[18].entrada_pendiente ) }</td>
                                    <td title="${m[19].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[19].entrada_pendiente ) }</td>
                                    <td title="${m[20].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[20].entrada_pendiente ) }</td>
                                    <td title="${m[21].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[21].entrada_pendiente ) }</td>
                                    <td title="${m[22].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[22].entrada_pendiente ) }</td>
                                    <td title="${m[23].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[23].entrada_pendiente ) }</td>
                                    <td title="${m[24].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[24].entrada_pendiente ) }</td>
                                    <td title="${m[25].leenda}" class="border px-2 py-1 text-center ">${ fENN0(m[25].entrada_pendiente ) }</td>
                                </tr>
                                
                            </tbody>
                 
                    </table>
            </div>
            <div id="historico_table_${m[0].familia_id}_${m[0].article_id}"></div>
            
            `;

    return tableFact0;
}

