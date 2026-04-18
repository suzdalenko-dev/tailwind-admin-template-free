let froxaStaticSalies = [{key: 2017, value: 31.9}, {key: 2018, value: 28.5}, {key: 2019, value: 30.5}, {key: 2020, value: 22.3}, {key: 2021, value: 32.2}, {key: 2022, value: 43.4}, {key: 2023, value: 47.0}, {key: 2024, value: 45.0}]
let YearSaved = parseInt(window.localStorage.getItem('year_saved')) || new Date().getFullYear() - 22;
if(YearSaved > 2099) YearSaved = 2099;
if(YearSaved < 1900) YearSaved = 1900;
let chartLine2 = null;
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