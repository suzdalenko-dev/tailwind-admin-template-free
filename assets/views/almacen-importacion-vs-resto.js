function almacenImportacionVsRestoInit(){
    document.getElementById('slugTitle').innerHTML = ``;
    document.title = "Comparación";

    getDataAIVR()
}


function getDataAIVR(){
  let currentYear = new Date().getFullYear()
  fetch(HTTP_HOST+`logistica/recalculate/0/0/comparacion_almacen_98/?year=${currentYear}`)
    .then(r => r.json())
    .then(r => {
      let html = '';
      if (r && Array.isArray(r.data)) {
        r.data.forEach(i => {
          const exped    = i?.exped || {};
          const stockArr = Array.isArray(i?.stock)  ? i.stock  : [];
          const textArr  = Array.isArray(i?.textos) ? i.textos : [];

          // nº de filas a pintar para este expediente
          const rows = Math.max(stockArr.length, textArr.length, 1);

          for (let k = 0; k < rows; k++) {
            const s = stockArr[k] || {}; // puede estar vacío
            const t = textArr[k]  || {};

            // helpers para componer texto y evitar "undefined"
            const j = (...v) => v.filter(Boolean).join(' ');
            const td = (v, extra='text-left') => `<td class="border px-2 py-1 ${extra}">${v ?? ''}</td>`;

            html += `<tr>
              ${td(formatLongDate(exped.FECHA_SUPERVISION), 'text-center')}
              ${td(exped.NUMERO_DOC_EXT,   'text-center')}
              ${td(exped.NUMERO_DOC_INTERNO)}
              ${td(j(exped.CODIGO_PROVEEDOR, exped.D_CODIGO_PROVEEDOR))}
              ${td(j(s.NUMERO_DOC_INTERNO, s.CODIGO_ALMACEN, s.D_ALMACEN))}
              ${td(j(s.CODIGO_PROVEEDOR, s.D_CODIGO_PROVEEDOR))}
              ${td(j(t.NUMERO_DOC_INTERNO, t.CODIGO_ALMACEN, t.D_ALMACEN))}
              ${td(j(t.CODIGO_PROVEEDOR, t.D_CODIGO_PROVEEDOR))}
            </tr>`;
          }
        });
      }
      document.getElementById('tableIVR').innerHTML = html;
      document.getElementById('divIVR').innerHTML   = '';
    })
    .catch(e => showM(e, 'error'));
}
