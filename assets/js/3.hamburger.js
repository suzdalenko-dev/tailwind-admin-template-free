function toggleSidebar(userClick) {
    let sidebar = document.getElementById('sidebar');
    let content = document.getElementById('content');

    if (userClick == 'userClick') {
        // Click manual del usuario
        let isOpen = !sidebar.classList.contains('-translate-x-full');
        sidebar.classList.toggle('-translate-x-full');
        content.classList.toggle('md:ml-64');
        window.localStorage.setItem('is_sidebar_open', !isOpen);
    } else {
        // Al cargar la página
        let isOpen = window.localStorage.getItem('is_sidebar_open') == 'true';
        let isActuallyOpen = !sidebar.classList.contains('-translate-x-full');
        
        if (isOpen != isActuallyOpen) {
            sidebar.classList.toggle('-translate-x-full');
            content.classList.toggle('md:ml-64');
        }
    }
}

toggleSidebar(null);