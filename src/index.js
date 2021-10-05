import * as $ from 'jquery';
//import './components/footer/footer.scss';
//import './components/header/header.scss';
require.context('./components', true, /\.scss$/ )


$(document).on('click', () => console.log('click'));