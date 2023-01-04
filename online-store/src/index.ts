import './sass/main.scss';
import App from './components/App';

const app = new App();
app.init();
window.addEventListener('error', function(e) {
    console.log(e);
}, true);
