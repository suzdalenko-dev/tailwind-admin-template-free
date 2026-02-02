function buildHistoricosTable(payload) {
  const d = payload?.data;
  if (!d) return `<div class="p-2 border">No hay datos</div>`;

  const metricas = Array.isArray(d.metricas) ? d.metricas : [];

  if (metricas.length === 0) {
    return `<div class="p-2 border">No existen datos históricos</div>`;
  }

  // ---- helpers ----
  const pad2 = (n) => String(n).padStart(2, "0");
  const monthNames = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  const parseYMD = (s) => {
    // "YYYY-MM-DD"
    const [y,m,d] = s.split("-").map(Number);
    return { y, m, d };
  };

  const monthKey = (ymd) => `${ymd.y}-${pad2(ymd.m)}`; // 2026-02
  const monthLabel = (ymd) => `${monthNames[ymd.m - 1]}-${String(ymd.y).slice(2)}`; // Feb-26

  const tramoLabel = (m) => {
    const a = parseYMD(m.fecha_desde);
    const b = parseYMD(m.fecha_hasta);
    return `${a.d}-${b.d}`;
  };

  // ---- 1) ordenar por fecha_desde ----
  const metricasSorted = [...metricas].sort((a,b) =>
    String(a.fecha_desde).localeCompare(String(b.fecha_desde))
  );

  // ---- 2) agrupar por mes (según fecha_desde) ----
  const byMonth = new Map(); // key -> { label, metricas: [] }

  for (const m of metricasSorted) {
    const ymd = parseYMD(m.fecha_desde);
    const k = monthKey(ymd);
    if (!byMonth.has(k)) {
      byMonth.set(k, { label: monthLabel(ymd), metricas: [] });
    }
    byMonth.get(k).metricas.push(m);
  }

  // ---- 3) months/labels REALES (atados a metricas) ----
  const monthBuckets = Array.from(byMonth.entries())
    .sort((a,b) => a[0].localeCompare(b[0]))
    .map(([k,v]) => v);

  const monthsReal = monthBuckets.map(x => x.label);

  // labelsReal es "plano": concatena labels por cada métrica del mes
  const labelsReal = monthBuckets.flatMap(x => x.metricas.map(tramoLabel));

  // aplanamos metricas en el mismo orden que labelsReal
  const metricasReal = monthBuckets.flatMap(x => x.metricas);

  // ---- 4) filas ----
  const rows = [
    { name: "Previsto",  key: "previsto",          cls: "" },
    { name: "Real",      key: "venta_real",        cls: "" },
    { name: "LY",        key: "venta_agno_pasado", cls: "" },
    { name: "Entrada",   key: "entrada",           cls: "" },
    { name: "Stock",     key: "stock",             cls: "" },
    { separator: true },
    { name: "Entr. R",   key: "entra_real_tramo",  cls: "color_grey" },
    { name: "Stock R",   key: "stock_real_tramo",  cls: "color_grey" },
  ];

  const safeCell = (v) => (v === null || v === undefined || v === "") ? "" : fENN0(v);

  // ---- 5) THEAD ----
  const theadTop = `
    <tr class="twcolor">
      <th rowspan="2">Histórico</th>
      ${monthBuckets.map(x => `<th colspan="${x.metricas.length}">${x.label}</th>`).join("")}
    </tr>`;

  const theadBottom = `
    <tr class="twcolor">
      ${labelsReal.map(l => `<th>${l}</th>`).join("")}
    </tr>`;

  // ---- 6) TBODY ----
  let tbody = "";

  for (const r of rows) {
    if (r.separator) {
      tbody += `<tr><td colspan="${1 + labelsReal.length}"><br></td></tr>`;
      continue;
    }

    tbody += `
      <tr>
        <td class="border px-2 py-1 text-center ${r.cls}">${r.name}</td>
        ${metricasReal.map(m => `
          <td class="border px-2 py-1 text-center ${r.cls}">${safeCell(m[r.key])}</td>
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
    </div>`;
}
