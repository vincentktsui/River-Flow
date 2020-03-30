import Main from './main';
function init() {
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('root');
    new Main(container);

  })
}

init();