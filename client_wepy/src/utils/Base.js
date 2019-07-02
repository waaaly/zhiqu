import wepy from 'wepy';
import http from '../utils/Http';

export default class base{
    static get = http.get.bind(http);
    static post = http.post.bind(http);
}