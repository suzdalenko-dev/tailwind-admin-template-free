function buildHistoricosTable(payload) {
  const d = payload?.data;
  if (!d) return "<div>No hay datos</div>";

  const months   = d.cabezera || [];
  const labels   = d.labels_15 || [];
  const metricas = d.metricas || [];

  // Helper: saca un array con los valores de un campo, en el orden de los tramos
  const colValues = (field) => metricas.map(m => m[field]);

  const rows = [
    { name: "Previsto",  key: "previsto",          cls: "" },
    { name: "Real",      key: "venta_real",        cls: "" },
    { name: "LY",        key: "venta_agno_pasado", cls: "" },
    { name: "Entrada",   key: "entrada",           cls: "" },
    { name: "Stock",     key: "stock",             cls: "" },

    // separador visual (como tu <tr><td><br></td></tr>)
    { separator: true },

    { name: "Entr. R",   key: "entra_real_tramo",  cls: "color_grey" },
    { name: "Stock R",   key: "stock_real_tramo",  cls: "color_grey" },
  ];

  // THEAD (2 filas)
  let theadTop = `<tr class="twcolor">
      <th rowspan="2">Histórico</th>
      ${months.map(m => `<th colspan="2">${m}</th>`).join("")}
    </tr>`;

  let theadBottom = `<tr class="twcolor">
      ${labels.map(l => `<th>${l}</th>`).join("")}
    </tr>`;

  // TBODY
  let tbody = "";

  for (const r of rows) {
    if (r.separator) {
      tbody += `<tr><td><br></td></tr>`;
      continue;
    }

    const values = colValues(r.key);
    tbody += `<tr>
        <td class="border px-2 py-1 text-center ${r.cls}">${r.name}</td>
        ${values.map(v => `
          <td class="border px-2 py-1 text-center ${r.cls}">${fENN0(v)}</td>
        `).join("")}
      </tr>`;
  }

  return `
    <div>
      <table class="mt-1">
        <thead>
          ${theadTop}
          ${theadBottom}
        </thead>
        <tbody>
          ${tbody}
        </tbody>
      </table>
    </div>
  `;
}
