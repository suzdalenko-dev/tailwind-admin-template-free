function initRouter() {
    let pageRoute = parseHashRoute();   
    if (pageRoute.view) { loadView(pageRoute.view); }
    else { loadView('dashboard'); } // Cargar vista por defecto si no hay hash
}

function loadView(viewName) {
    let viewContainer = document.getElementById('htmlContent');

    fetch(`/assets/views/${viewName}.html`)
        .then(res => res.text())
        .then(html => {
           
            let oldHtmlPageContent = getDefaultContenFromLocalStorage(viewName);
            if(oldHtmlPageContent) viewContainer.innerHTML = oldHtmlPageContent;
            else viewContainer.innerHTML = html;

            // viewContainer.innerHTML = html;
            
            if(String(html).includes('found') || String(html).includes('edited') || String(html).includes('deleted')){
                setTimeout(() => { window.location = '/dashboard'; }, 2200);
            }

            // Carga el JS asociado (una sola vez)
            let scriptPath = `/assets/views/${viewName}.js`;
            if (!document.querySelector(`script[src="${scriptPath}"]`)) {
                let script = document.createElement('script');
                script.src = scriptPath;
                script.onload = () => {
                    let initFunction = window[`${toCamelCase(viewName)}`];
                    if (initFunction) initFunction();
                    else {
                        console.error(`Init function not found for ${viewName} ${toCamelCase(viewName)}`);
                    }
                };
                document.head.appendChild(script);
            } else {
                let initFunction = window[`${toCamelCase(viewName)}`];
                if (initFunction) initFunction();
                else {
                    console.error(`Init function not found for ${viewName} ${toCamelCase(viewName)}`);
                }
            }
        }).catch( e => {
            viewContainer.innerHTML = '1. Error '+ e;
        })
}


function toCamelCase(str) { 
    console.log(str.replace(/-([a-z])/g, g => g[1].toUpperCase()) + 'Init');
    return str.replace(/-([a-z])/g, g => g[1].toUpperCase()) + 'Init';

}

function parseHashRoute() {
    let fullHash = window.location.hash; // "#crear-usuario?recogida_id=1&user=2"
    let [route, queryString] = fullHash.slice(1).split('?');
    let params = new URLSearchParams(queryString || '');
  
    return {
      view: route,
      params: Object.fromEntries(params.entries())
    };
}

initRouter();


  function setDefaulContentToLocalStorage(){
        let currentView = parseHashRoute();
        if(currentView && currentView.view){
            let htmlOldContent = document.getElementById('htmlContent');
            if(htmlOldContent){
                htmlOldContent = document.getElementById('htmlContent').getHTML();
                if(htmlOldContent) window.localStorage.setItem(currentView.view, JSON.stringify(htmlOldContent))
            }
        }   
    }

     function getDefaultContenFromLocalStorage(viewName){
        let oldHtmlPageContent = window.localStorage.getItem(viewName) || null;
        if(oldHtmlPageContent && JSON.parse(oldHtmlPageContent)) return JSON.parse(oldHtmlPageContent);
        return null;
    }