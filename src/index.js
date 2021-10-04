import Post from './post';
import * as $ from 'jquery';
import json from './assets/json.json';
import './styles/styles.css';

const post = new Post('WebPack post title!');

console.log(post.toString());

console.log('JSON: ', json);

$(document).on('click', () => console.log('click'));