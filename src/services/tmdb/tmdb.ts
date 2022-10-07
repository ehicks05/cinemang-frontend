import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const PARAMS = { api_key: process.env.TMDB_API_KEY };
const tmdb = axios.create({ baseURL: BASE_URL, params: PARAMS });

export default tmdb;
