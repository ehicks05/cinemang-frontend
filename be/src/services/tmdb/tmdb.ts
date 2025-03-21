import axios from 'axios';
import { configureHttp } from '~/utils/configure-http.js';

configureHttp();

const BASE_URL = 'https://api.themoviedb.org/3';
const PARAMS = { api_key: process.env.TMDB_API_KEY };
const tmdb = axios.create({ baseURL: BASE_URL, params: PARAMS });

export default tmdb;
