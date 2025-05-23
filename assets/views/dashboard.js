let froxaStaticSalies = [
    {key: 2017, value: 31.9}, {key: 2018, value: 28.5}, {key: 2019, value: 30.5}, {key: 2020, value: 22.3}, {key: 2021, value: 32.2}, {key: 2022, value: 43.4}, {key: 2023, value: 47.0}, {key: 2024, value: 45.0}
]
let YearSaved = parseInt(window.localStorage.getItem('year_saved')) || new Date().getFullYear() - 22;
if(YearSaved > 2099) YearSaved = 2099;
if(YearSaved < 1900) YearSaved = 1900;
let chartLine2 = null; // 🚀 Variable global para guardar el gráfico
let chartLine3 = null;

function MinusYear(){
    YearSaved = YearSaved - 1;
    window.localStorage.setItem('year_saved', YearSaved);
    dashboardInit();
}
function PlusYear(){
    YearSaved = YearSaved + 1;
    window.localStorage.setItem('year_saved', YearSaved);
    dashboardInit();
}

async function FetchDataFromGPDGraf(){
    return fetch('/storage/world-bank.api/pib.json').then(r => r.json()).then(r => {
        return r;
    }).catch(e => {
        alert(e);
    });
}

async function dashboardInit(){
    document.getElementById('yearSpan').innerHTML = YearSaved;
    let GPD = await FetchDataFromGPDGraf();
    let Years      = []
    let DataChart  = []
    let OnlySpain  = []
    let Colors = [ 'blue', 'green', 'orange', 'red', 'cyan', 'pink',  'purple',        'lime',        'magenta',     'teal',        'indigo',      'violet',      'gold',        'silver',      'brown',       'coral',       'turquoise',   'crimson',     'navy',        'chartreuse',  'deeppink'     ];
    let i = 0;
    GPD.map(country => {
        let countryData = country.data.reverse();
        let valueChart  = []

        countryData.map(itemObj => {
            let currentYear = itemObj.date;
            if(currentYear >= YearSaved) {
                let coinValue = itemObj.value;
                if(coinValue) coinValue = coinValue / 1000000000000;
                else coinValue = null;
                valueChart.push(coinValue)
                if(!Years.includes(currentYear)) Years.push(currentYear)
            }
            
        });
        let chartItem = {
            label: country.name,
            data: valueChart,
            fill: false,
            borderColor: Colors[i],
            backgroundColor: Colors[i],
            tension: 0.4  
        }
        DataChart.push(chartItem);

        if(country.name == 'ES'){ OnlySpain.push(chartItem); }

        i++;
    });

    let lineFroxaStatistic = [];
    let flag = false
    Years.map(itemYear => {
        froxaStaticSalies.map(statistic => {
            if(itemYear == statistic.key) {
                lineFroxaStatistic.push(statistic.value / 40);
                flag = true;
            }
        });
        if(flag == false){
            lineFroxaStatistic.push(null);
        }
    });

    let froxaChartItem = {
        label: "Froxá",
        data: lineFroxaStatistic,
        fill: false,
        borderColor: 'blue',
        backgroundColor: 'blue',
        tension: 0.4  
    }

    OnlySpain.push(froxaChartItem);

    // 🔥 Destruir el gráfico anterior si existe
    if (chartLine2 !== null) { chartLine2.destroy(); }
    if (chartLine3 !== null) { chartLine3.destroy(); }      console.log(DataChart[0])
    
    chartLine2 = new Chart(document.getElementById('lineChart2'), {
        type: 'line',
        data: {
            labels: Years,
            datasets: DataChart
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    chartLine3 = new Chart(document.getElementById('chartLine3'), {
        type: 'line',
        data: {
            labels: Years,
            datasets: OnlySpain
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });  
}










// // unused
// new Chart(document.getElementById('barChart'), {
//     type: 'bar',
//     data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
//         datasets: [{
//             label: 'Sales',
//             data: [150, 340, 230, 280, 180],
//             backgroundColor: '#6366f1'
//         }]
//     },
//     options: { responsive: true }
// });
// 
// new Chart(document.getElementById('lineChart'), {
//     type: 'line',
//     data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
//         datasets: [{
//             label: 'Revenue',
//             data: [120, 200, 180, 240, 210],
//             fill: true,
//             backgroundColor: 'rgba(99,102,241,0.1)',
//             borderColor: '#6366f1'
//         }]
//     },
//     options: { responsive: true }
// });