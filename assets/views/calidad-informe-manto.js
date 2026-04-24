let dateFromCIM = getTodayMinusYears(5);
let dateToCIM   = getTodayMinusYears(0);

let allLinesCIM = [];
let filteredLinesCIM = [];
let selectedArticleCIM = '';

let chartTextureByArticleCIM = null;
let chartGlobalTextureCIM = null;
let chartTextureTrendCIM = null;
let cimPluginsRegistered = false;

const TEXTURE_LABELS_CIM = {
    1: '1 Muy mal',
    2: '2 Regular',
    3: '3 Característico',
    4: '4 Bueno',
    5: '5 Muy bien'
};

const TEXTURE_COLORS_CIM = {
    1: '#ff2d2d',
    2: '#ff8a1f',
    3: '#ffd54a',
    4: '#73d13d',
    5: '#00c853'
};

const TEXTURE_LABEL_COLORS_CIM = {
    1: '#ffffff',
    2: '#ffffff',
    3: '#111827',
    4: '#0f172a',
    5: '#ffffff'
};

function calidadInformeMantoInit(){
    document.title = 'Informe Manto Calidad';
    document.getElementById('slugTitle').innerHTML = '<span class="b-top-page" onclick="openItemManagementCIM()">Gestión de artículos</span>';

    ensureCIMChartPlugins();
    initDateCIM();
    getCIM();
}

function openItemManagementCIM(){
    window.open('/dashboard/#calidad-imanto-gestion-articulos', '_self');
}

function initDateCIM(){
    const inputFrom = document.getElementById('date_fromCIM');
    const inputTo   = document.getElementById('date_toCIM');

    if (inputFrom) inputFrom.value = dateFromCIM;
    if (inputTo)   inputTo.value   = dateToCIM;
}

function changeDateCIM(){
    const inputFrom = document.getElementById('date_fromCIM');
    const inputTo   = document.getElementById('date_toCIM');

    dateFromCIM = inputFrom ? inputFrom.value : dateFromCIM;
    dateToCIM   = inputTo ? inputTo.value : dateToCIM;

    getCIM();
}

function changeArticleCIM(){
    const select = document.getElementById('articleFilterCIM');
    selectedArticleCIM = select ? select.value : '';
    paintCIM();
}

function resetArticleCIM(){
    selectedArticleCIM = '';
    const select = document.getElementById('articleFilterCIM');
    if (select) select.value = '';
    paintCIM();
}

function getCIM(){
    const table = document.getElementById('tableCIM');
    if (!table) return;

    table.innerHTML = `
        <tr>
            <td colspan="14" class="border px-2 py-1 text-left">Cargando..</td>
        </tr>
    `;

    setHtmlCIM('kpiAvgTextureCIM', '-');
    setHtmlCIM('kpiTotalKgCIM', '-');
    setHtmlCIM('kpiTotalKgSubCIM', 'Cargando..');
    setHtmlCIM('kpiGoodPctCIM', '-');
    setHtmlCIM('kpiBadPctCIM', '-');
    setHtmlCIM('weightedInfoCIM', 'Cargando métricas ponderadas...');
    setHtmlCIM('legendGlobalTextureCIM', '');

    fetch(HTTP_HOST + `calidad/get/0/0/informe_manto/?date_from=${encodeURIComponent(dateFromCIM)}&date_to=${encodeURIComponent(dateToCIM)}`)
        .then(r => r.json())
        .then(r => {
            const lines = r?.data?.res_grouped || [];
            allLinesCIM = Array.isArray(lines) ? lines : [];

            buildArticleFilterOptionsCIM(allLinesCIM);
            paintCIM();
        })
        .catch(e => {
            console.error(e);
            table.innerHTML = `
                <tr>
                    <td colspan="14" class="border px-2 py-1 text-left">Error al cargar datos</td>
                </tr>
            `;
            showM('Error al cargar el informe manto', 'error');
        });
}

function paintCIM(){
    filteredLinesCIM = filterLinesByArticleCIM(allLinesCIM, selectedArticleCIM);

    paintKPIsCIM(filteredLinesCIM);
    paintChartsCIM(filteredLinesCIM);
    paintTableCIM(filteredLinesCIM);
}

function paintTableCIM(lines){
    const table = document.getElementById('tableCIM');
    if (!table) return;

    if (!Array.isArray(lines) || lines.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="14" class="border px-2 py-1 text-left">No se han encontrado datos</td>
            </tr>
        `;
        return;
    }

    let html = '';

    lines.forEach(l => {
        const lote = buildLoteLabelCIM(l);
        const obs = normalizeValueCIM(l.OBSERVACIONES);

        html += `
            <tr>
                <td class="border text-center">${escapeHtmlCIM(formatDateToEuropean(l.FECHA_ENTRADA))}</td>
                <td class="border text-left">${escapeHtmlCIM(`${normalizeValueCIM(l.CODIGO_ARTICULO)} ${normalizeValueCIM(l.DESCRIP_COMERCIAL)}`.trim())}</td>
                <td class="border text-center">${escapeHtmlCIM(lote)}</td>
                <td class="border text-center">${escapeHtmlCIM(normalizeValueCIM(l.NUMERO_PARTE))}</td>
                <td class="border text-right">${escapeHtmlCIM(normalizeValueCIM(l.A2B))}</td>
                <td class="border text-center">${escapeHtmlCIM(normalizeValueCIM(l.A2AG))}</td>
                <td class="border text-center">${escapeHtmlCIM(normalizeValueCIM(l.A2X))}</td>
                <td class="border text-center">${escapeHtmlCIM(normalizeValueCIM(l.A2Y))}</td>
                <td class="border text-center">${escapeHtmlCIM(normalizeValueCIM(l.A2Z))}</td>
                <td class="border text-center">${escapeHtmlCIM(normalizeValueCIM(l.A2AA))}</td>
                <td class="border text-center">${escapeHtmlCIM(normalizeValueCIM(l.A2AB))}</td>
                <td class="border text-center">${escapeHtmlCIM(normalizeValueCIM(l.A2AC))}</td>
                <td class="border text-center">${renderTextureCellCIM(l.A13D)}</td>
                <td class="border text-left hovered" title="${escapeHtmlCIM(obs)}">${escapeHtmlCIM(shortenTextCIM(obs, 26))}</td>
            </tr>
        `;
    });

    table.innerHTML = html;
}

function paintKPIsCIM(lines){
    const weightedLines = getWeightedTextureLinesCIM(lines);

    let kgTotal = 0;
    let weightedTextureTotal = 0;
    let kgGood = 0;
    let kgBad = 0;

    weightedLines.forEach(item => {
        kgTotal += item.kg;
        weightedTextureTotal += (item.kg * item.texture);

        if (item.texture >= 3) kgGood += item.kg;
        if (item.texture <= 2) kgBad += item.kg;
    });

    const weightedAvg = kgTotal > 0 ? (weightedTextureTotal / kgTotal) : 0;
    const pctGood = kgTotal > 0 ? ((kgGood / kgTotal) * 100) : 0;
    const pctBad = kgTotal > 0 ? ((kgBad / kgTotal) * 100) : 0;

    const avgEl = document.getElementById('kpiAvgTextureCIM');
    if (avgEl) {
        avgEl.innerHTML = fmtCIM(weightedAvg, 2);
        avgEl.style.color = getTextureColorByValueCIM(weightedAvg);
    }

    setHtmlCIM('kpiTotalKgCIM', fmtCIM(kgTotal, 2));
    setHtmlCIM('kpiTotalKgSubCIM', `${fmtCIM(weightedLines.length, 0)} líneas válidas de ${fmtCIM(lines.length, 0)}`);
    setHtmlCIM('kpiGoodPctCIM', `${fmtCIM(pctGood, 1)}%`);
    setHtmlCIM('kpiBadPctCIM', `${fmtCIM(pctBad, 1)}%`);

    if (kgTotal > 0) {
        setHtmlCIM(
            'weightedInfoCIM',
            `Se han usado ${fmtCIM(weightedLines.length, 0)} líneas con peso válido y textura válida de un total de ${fmtCIM(lines.length, 0)} líneas filtradas.`
        );
    } else {
        setHtmlCIM(
            'weightedInfoCIM',
            'No hay líneas con A2B numérico > 0 y A13D entre 1 y 5 para construir la parte ponderada.'
        );
    }

    setHtmlCIM(
        'cimMiniResume',
        `Filtro actual: ${selectedArticleCIM ? selectedArticleCIM : 'todos los artículos'} · ${fmtCIM(lines.length, 0)} líneas`
    );
}

function paintChartsCIM(lines){
    const byArticle = aggregateByArticleWeightedCIM(lines);
    const global    = aggregateGlobalWeightedCIM(lines);
    const monthly   = aggregateMonthlyWeightedCIM(lines, dateFromCIM, dateToCIM);

    renderTextureByArticleChartCIM(byArticle);
    renderGlobalTextureChartCIM(global);
    renderMonthlyTrendChartCIM(monthly);
}

function buildArticleFilterOptionsCIM(lines){
    const select = document.getElementById('articleFilterCIM');
    if (!select) return;

    const currentValue = selectedArticleCIM;
    const map = new Map();

    (Array.isArray(lines) ? lines : []).forEach(l => {
        const code = normalizeValueCIM(l.CODIGO_ARTICULO);
        const desc = normalizeValueCIM(l.DESCRIP_COMERCIAL);

        if (code && !map.has(code)) {
            map.set(code, { code, desc });
        }
    });

    const items = Array.from(map.values()).sort((a, b) => {
        const na = Number(a.code);
        const nb = Number(b.code);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
        return a.code.localeCompare(b.code);
    });

    let html = `<option value="">Todos los artículos</option>`;
    items.forEach(item => {
        html += `<option value="${escapeHtmlCIM(item.code)}">${escapeHtmlCIM((item.code + ' ' + item.desc).trim())}</option>`;
    });

    select.innerHTML = html;

    if (items.some(item => item.code === currentValue)) {
        select.value = currentValue;
        selectedArticleCIM = currentValue;
    } else {
        select.value = '';
        selectedArticleCIM = '';
    }
}

function filterLinesByArticleCIM(lines, articleCode){
    let res = Array.isArray(lines) ? [...lines] : [];

    if (articleCode) {
        res = res.filter(l => String(l.CODIGO_ARTICULO || '').trim() === String(articleCode).trim());
    }

    res.sort((a, b) => {
        const fa = String(a.FECHA_ENTRADA || '');
        const fb = String(b.FECHA_ENTRADA || '');
        const cmp = fb.localeCompare(fa);
        if (cmp !== 0) return cmp;

        return Number(b.NUMERO_PARTE || 0) - Number(a.NUMERO_PARTE || 0);
    });

    return res;
}

function renderTextureByArticleChartCIM(rows){
    const canvas = document.getElementById('chartTextureByArticleCIM');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartTextureByArticleCIM) {
        chartTextureByArticleCIM.destroy();
        chartTextureByArticleCIM = null;
    }

    const wrap = canvas.closest('.cim-chart-wrap-bar');
    if (wrap) wrap.style.height = Math.max(280, rows.length * 38 + 90) + 'px';

    const labels = rows.map(r => r.label);

    const datasets = [1,2,3,4,5].map(texture => ({
        label: TEXTURE_LABELS_CIM[texture],
        data: rows.map(r => r.totalKg > 0 ? Number(((r.totals[texture] / r.totalKg) * 100).toFixed(2)) : 0),
        rawKg: rows.map(r => r.totals[texture]),
        backgroundColor: TEXTURE_COLORS_CIM[texture],
        borderColor: '#ffffff',
        borderWidth: 1,
        cimLabelColor: TEXTURE_LABEL_COLORS_CIM[texture],
        borderRadius: 2
    }));

    chartTextureByArticleCIM = new Chart(canvas, {
        type: 'bar',
        data: { labels, datasets },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    stacked: true,
                    min: 0,
                    max: 100,
                    grid: { color: '#e5e7eb' },
                    ticks: {
                        callback: value => value + '%',
                        font: { size: 11 }
                    }
                },
                y: {
                    stacked: true,
                    grid: { display: false },
                    ticks: {
                        color: '#111827',
                        font: { size: 11 }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        padding: 16,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context){
                            const kg = context.dataset.rawKg[context.dataIndex] || 0;
                            const pct = context.parsed.x || 0;
                            return `${context.dataset.label}: ${fmtCIM(kg, 2)} kg (${fmtCIM(pct, 1)}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderGlobalTextureChartCIM(global){
    const canvas = document.getElementById('chartGlobalTextureCIM');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartGlobalTextureCIM) {
        chartGlobalTextureCIM.destroy();
        chartGlobalTextureCIM = null;
    }

    const data = [1,2,3,4,5].map(t => global.totals[t] || 0);

    chartGlobalTextureCIM = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: [1,2,3,4,5].map(t => TEXTURE_LABELS_CIM[t]),
            datasets: [{
                data,
                backgroundColor: [1,2,3,4,5].map(t => TEXTURE_COLORS_CIM[t]),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            cutout: '60%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context){
                            const total = global.totalKg || 0;
                            const value = context.parsed || 0;
                            const pct = total > 0 ? ((value / total) * 100) : 0;
                            return `${context.label}: ${fmtCIM(value, 2)} kg (${fmtCIM(pct, 1)}%)`;
                        }
                    }
                },
                cimDoughnutCenterText: {
                    text1: fmtCIM(global.totalKg, 2),
                    text2: 'kg'
                }
            }
        }
    });

    renderGlobalLegendCIM(global);
}

function renderGlobalLegendCIM(global){
    let html = '';

    [1,2,3,4,5].forEach(texture => {
        const kg = global.totals[texture] || 0;
        const pct = global.totalKg > 0 ? ((kg / global.totalKg) * 100) : 0;

        html += `
            <div class="cim-legend-row">
                <div class="cim-legend-left">
                    <span class="cim-legend-color" style="background:${TEXTURE_COLORS_CIM[texture]}"></span>
                    <span>${TEXTURE_LABELS_CIM[texture]}</span>
                </div>
                <div class="cim-legend-right">${fmtCIM(pct, 1)}% · ${fmtCIM(kg, 2)} kg</div>
            </div>
        `;
    });

    setHtmlCIM('legendGlobalTextureCIM', html);
}

function renderMonthlyTrendChartCIM(monthly){
    const canvas = document.getElementById('chartTextureTrendCIM');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartTextureTrendCIM) {
        chartTextureTrendCIM.destroy();
        chartTextureTrendCIM = null;
    }

    chartTextureTrendCIM = new Chart(canvas, {
        type: 'line',
        data: {
            labels: monthly.labels,
            datasets: [{
                label: 'Media ponderada',
                data: monthly.values,
                borderColor: '#4f46e5',
                backgroundColor: '#4f46e5',
                tension: 0.25,
                pointRadius: 3.5,
                pointHoverRadius: 4,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                y: {
                    min: 1,
                    max: 5,
                    grid: { color: '#e5e7eb' },
                    ticks: {
                        stepSize: 1,
                        font: { size: 11 }
                    }
                },
                x: {
                    grid: { display:false },
                    ticks: { font: { size: 11 } }
                }
            },
            plugins: {
                legend: { display:false },
                tooltip: {
                    callbacks: {
                        label: function(context){
                            if (context.parsed.y == null) return 'Sin datos';
                            return `Media ponderada: ${fmtCIM(context.parsed.y, 2)}`;
                        }
                    }
                }
            }
        }
    });
}

function aggregateByArticleWeightedCIM(lines){
    const valid = getWeightedTextureLinesCIM(lines);
    const map = {};

    valid.forEach(item => {
        const code = normalizeValueCIM(item.line.CODIGO_ARTICULO);
        const desc = normalizeValueCIM(item.line.DESCRIP_COMERCIAL);
        const key = code || 'SIN-CODIGO';

        if (!map[key]) {
            map[key] = {
                key,
                label: (code + ' ' + desc).trim(),
                totals: {1:0,2:0,3:0,4:0,5:0},
                totalKg: 0
            };
        }

        map[key].totals[item.texture] += item.kg;
        map[key].totalKg += item.kg;
    });

    return Object.values(map).sort((a, b) => b.totalKg - a.totalKg);
}

function aggregateGlobalWeightedCIM(lines){
    const valid = getWeightedTextureLinesCIM(lines);

    const res = {
        totals: {1:0,2:0,3:0,4:0,5:0},
        totalKg: 0
    };

    valid.forEach(item => {
        res.totals[item.texture] += item.kg;
        res.totalKg += item.kg;
    });

    return res;
}

function aggregateMonthlyWeightedCIM(lines, dateFrom, dateTo){
    const valid = getWeightedTextureLinesCIM(lines);
    const monthKeys = createMonthKeysBetweenCIM(dateFrom, dateTo);
    const map = {};

    monthKeys.forEach(key => {
        map[key] = { weighted:0, kg:0 };
    });

    valid.forEach(item => {
        const monthKey = String(item.line.FECHA_ENTRADA || '').slice(0, 7);

        if (!map[monthKey]) {
            map[monthKey] = { weighted:0, kg:0 };
        }

        map[monthKey].weighted += (item.kg * item.texture);
        map[monthKey].kg += item.kg;
    });

    const labels = [];
    const values = [];

    Object.keys(map).sort().forEach(key => {
        labels.push(formatMonthLabelCIM(key));
        values.push(map[key].kg > 0 ? Number((map[key].weighted / map[key].kg).toFixed(2)) : null);
    });

    return { labels, values };
}

function getWeightedTextureLinesCIM(lines){
    const res = [];

    (Array.isArray(lines) ? lines : []).forEach(line => {
        const texture = parseTextureNumberCIM(line.A13D);
        const kg = getWeightForChartsCIM(line);

        if (texture && kg) {
            res.push({ line, texture, kg });
        }
    });

    return res;
}

function getWeightForChartsCIM(line){
    const kg = parseEsNumberCIM(line.A2B);
    if (!Number.isFinite(kg) || kg <= 0) return null;
    return kg;
}

function parseTextureNumberCIM(value){
    const n = Number(normalizeValueCIM(value));
    return [1,2,3,4,5].includes(n) ? n : null;
}

function parseEsNumberCIM(value){
    const txt = normalizeValueCIM(value);
    if (txt === '') return null;

    const normalized = txt.replace(/\./g, '').replace(',', '.');
    const n = Number(normalized);

    return Number.isFinite(n) ? n : null;
}

function buildLoteLabelCIM(line){
    const loteInterno = String(line.LOTE_INTERNO || '').trim();
    const loteProveedor = String(line.LOTE_PROVEEDOR || '').trim();

    if (loteInterno && loteProveedor && loteInterno !== loteProveedor) {
        return `${loteInterno == 'None' ? '' : loteInterno} / ${loteProveedor == 'None' ? '' : loteProveedor}`;
    }

    if (loteInterno && loteInterno !== 'None') return loteInterno;
    if (loteProveedor && loteProveedor !== 'None') return loteProveedor;

    return '';
}

function normalizeValueCIM(value){
    if (value === null || value === undefined) return '';
    const txt = String(value).trim();
    if (txt === '' || txt === 'None' || txt === 'null') return '';
    return txt;
}

function shortenTextCIM(txt, maxLen){
    const value = String(txt || '');
    if (value.length <= maxLen) return value;
    return value.slice(0, maxLen) + '..';
}

function fmtCIM(value, decimals = 2){
    const n = Number(value || 0);
    return n.toLocaleString('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function renderTextureCellCIM(value){
    const n = parseTextureNumberCIM(value);
    if (!n) return '';
    return `<span class="cim-pill cim-tx${n}" title="${escapeHtmlCIM(TEXTURE_LABELS_CIM[n])}">${n}</span>`;
}

function formatMonthLabelCIM(monthKey){
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const parts = String(monthKey || '').split('-');
    if (parts.length !== 2) return monthKey;

    const year = parts[0].slice(2);
    const monthIndex = Number(parts[1]) - 1;
    const monthName = months[monthIndex] || parts[1];

    return `${monthName} '${year}`;
}

function createMonthKeysBetweenCIM(dateFrom, dateTo){
    const res = [];
    const from = new Date(`${dateFrom}T00:00:00`);
    const to   = new Date(`${dateTo}T00:00:00`);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return res;

    from.setDate(1);
    to.setDate(1);

    const current = new Date(from);

    while (current <= to) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, '0');
        res.push(`${y}-${m}`);
        current.setMonth(current.getMonth() + 1);
    }

    return res;
}

function getTextureColorByValueCIM(value){
    const v = Number(value || 0);

    if (v < 1.5) return '#ff2d2d';
    if (v < 2.5) return '#ff8a1f';
    if (v < 3.5) return '#d4a900';
    if (v < 4.5) return '#4fbf2f';
    return '#00c853';
}

function setHtmlCIM(id, value){
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
}

function escapeHtmlCIM(value){
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function ensureCIMChartPlugins(){
    if (cimPluginsRegistered || typeof Chart === 'undefined') return;

    Chart.defaults.font.family = 'ui-sans-serif, system-ui, Arial';
    Chart.defaults.color = '#4b5563';

    Chart.register({
        id: 'cimStackBarValueLabels',
        afterDatasetsDraw(chart) {
            if (!chart.canvas || chart.canvas.id !== 'chartTextureByArticleCIM') return;

            const { ctx } = chart;

            chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);

                meta.data.forEach((bar, index) => {
                    const value = Number(dataset.data[index] || 0);
                    if (!Number.isFinite(value) || value < 7) return;

                    const props = bar.getProps(['x', 'y', 'base'], true);
                    if (Math.abs(props.x - props.base) < 26) return;

                    ctx.save();
                    ctx.fillStyle = dataset.cimLabelColor || '#ffffff';
                    ctx.font = '600 11px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${Math.round(value)}%`, props.base + ((props.x - props.base) / 2), props.y);
                    ctx.restore();
                });
            });
        }
    });

    Chart.register({
        id: 'cimLineValueLabels',
        afterDatasetsDraw(chart) {
            if (!chart.canvas || chart.canvas.id !== 'chartTextureTrendCIM') return;
            if (!Array.isArray(chart.data.labels) || chart.data.labels.length > 18) return;

            const dataset = chart.data.datasets[0];
            const meta = chart.getDatasetMeta(0);
            const { ctx } = chart;

            meta.data.forEach((point, index) => {
                const value = dataset.data[index];
                if (value == null) return;

                const props = point.getProps(['x', 'y'], true);

                ctx.save();
                ctx.fillStyle = '#111827';
                ctx.font = '600 11px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(fmtCIM(value, 2), props.x, props.y - 7);
                ctx.restore();
            });
        }
    });

    Chart.register({
        id: 'cimDoughnutCenterText',
        afterDraw(chart) {
            if (!chart.canvas || chart.canvas.id !== 'chartGlobalTextureCIM') return;

            const pluginCfg = chart.options?.plugins?.cimDoughnutCenterText || {};
            if (!pluginCfg.text1 && !pluginCfg.text2) return;

            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);
            if (!meta || !meta.data || !meta.data[0]) return;

            const x = meta.data[0].x;
            const y = meta.data[0].y;

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#111827';
            ctx.font = '700 17px Arial';
            ctx.fillText(String(pluginCfg.text1 || ''), x, y - 7);

            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Arial';
            ctx.fillText(String(pluginCfg.text2 || ''), x, y + 14);

            ctx.restore();
        }
    });

    cimPluginsRegistered = true;
}