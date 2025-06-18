let oldVuewName = false;
let clickedMenu = 1;

function initRouter() {
    let pageRoute = parseHashRoute();   
    if (pageRoute.view) { loadView(pageRoute.view); }
    else { loadView('dashboard'); } // Cargar vista por defecto si no hay hash
}

function loadView(viewName) {
    /* hay permisos por vista y permiso por punto en el menu */
    if(!String(window.localStorage.getItem('permissions')).includes("*")){
        if(!String(window.localStorage.getItem('permissions')).includes(viewName) && viewName != 'dashboard'){
            alert('No hay permisos para ver esta vista', 'waring');
            window.location.href = '/dashboard';
        }
    }
    

    let viewContainer = document.getElementById('htmlContent');

    fetch(`/assets/views/${viewName}.html`)
        .then(res => res.text())
        .then(html => {
            if(viewName != 'detalle-articulo-costes' && viewContainer && clickedMenu != 0){
                let oldHtmlPageContent = getDefaultContenFromLocalStorage(viewName);                
                if(oldHtmlPageContent) viewContainer.innerHTML = oldHtmlPageContent;
                else viewContainer.innerHTML = html;
            } else {
                viewContainer.innerHTML = html;
            }
            if(oldVuewName == viewName){ clickedMenu++; } else { clickedMenu = 1; }
            if(clickedMenu > 3){ clickedMenu = 0;}
            oldVuewName = viewName;
  

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
            viewContainer.innerHTML = 'e1. Error '+ e;
        });
    
    let username = window.localStorage.getItem('username');
    let password = window.localStorage.getItem('password');
    fetch(HTTP_HOST+'froxa/login/?action=login&username='+username+'&password='+password).then(r => r.json()).then(r => {
        if(r && r.data && r.data.id > 0){
            window.localStorage.setItem('role', r.data.role);
            window.localStorage.setItem('permissions', r.data.permissions);
        } else {
            showM('Credenciales incorrectos', 'warning');
            setTimeout(() => { window.location.href = '/'; }, 3000);
            deleteContent();
        }
    }).catch(e => { 
        showM('e34 '+e, 'error');
        setTimeout(() => { window.location.href = '/'; }, 3000);
        deleteContent();
    });
}


function deleteContent(){
    setInterval(() => {
        document.getElementById('htmlContent').innerHTML = '';
    }, 1000);
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
                if(htmlOldContent) window.localStorage.setItem(currentView.view, JSON.stringify(htmlOldContent));   console.log('set DEFAULT CONTENT')
            }
        }   
    }

     function getDefaultContenFromLocalStorage(viewName){                       
        let oldHtmlPageContent = window.localStorage.getItem(viewName) || null;
        if(oldHtmlPageContent && JSON.parse(oldHtmlPageContent)) return JSON.parse(oldHtmlPageContent);              console.log('GET DEFAULT CONTENT')    
        return null;
    }