const botaoHamburguer = document.getElementById('hamburguer');
const sidebar = document.getElementById('sidebar');
const close_sidebar = document.getElementById('button_close_sidebar')

botaoHamburguer.addEventListener('click', () => {
    sidebar.classList.add('show_sidebar');
}); 

close_sidebar.addEventListener('click', () => {
    sidebar.classList.remove('show_sidebar');
}); 
