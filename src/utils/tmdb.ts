import axios from 'redaxios';

const tmdb = axios.create({
	baseURL: 'https://api.themoviedb.org/3',
	params: { api_key: import.meta.env.VITE_TMDB_API_KEY },
});

export { tmdb };
