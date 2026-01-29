export class TMDBAPI {
    constructor() {
        this.apiKey = 'ec9c1b48e2d39fa4c46753d1eb648245';
        this.baseURL = 'https://api.themoviedb.org/3';
    }

    async getTrendingMovies() {
        try {
            const response = await fetch(`${this.baseURL}/trending/movie/week?api_key=${this.apiKey}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error getting trending movies:', error);
            throw error;
        }
    }

    async searchMovies(query) {
        try {
            const response = await fetch(`${this.baseURL}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    }

    async getMovieDetails(movieId) {
        try {
            const response = await fetch(`${this.baseURL}/movie/${movieId}?api_key=${this.apiKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting movie details:', error);
            throw error;
        }
    }

    async getMoviesByGenre(genreId) {
        try {
            const response = await fetch(`${this.baseURL}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error getting movies by genre:', error);
            throw error;
        }
    }

    async getPopularMovies() {
        try {
            const response = await fetch(`${this.baseURL}/movie/popular?api_key=${this.apiKey}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error getting popular movies:', error);
            throw error;
        }
    }
}