import { TMDBAPI } from './tmdbAPI.js';
import { MealAPI } from './mealAPI.js';
import { StorageManager } from './storage.js';
import { UIManager } from './ui.js';

class FlickBite {
    constructor() {
        this.tmdbAPI = new TMDBAPI();
        this.mealAPI = new MealAPI();
        this.storage = new StorageManager();
        this.ui = new UIManager();
        
        this.currentMovie = null;
        this.currentMeal = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGenres();
        
        // Check which grid exists on the page
        if (document.getElementById('movieGrid')) {
            // Original single grid version
            this.loadTrendingMovies();
        } else {
            // Multiple sections version
            this.loadAllSections();
        }
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('homeBtn').addEventListener('click', () => this.showView('home'));
        document.getElementById('favoritesBtn').addEventListener('click', () => this.showView('favorites'));
        document.getElementById('backBtn').addEventListener('click', () => this.showView('home'));

        // Search
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Surprise Me
        document.getElementById('surpriseBtn').addEventListener('click', () => this.handleSurprise());
    }

    showView(viewName) {
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

        if (viewName === 'home') {
            document.getElementById('homeView').classList.add('active');
            document.getElementById('homeBtn').classList.add('active');
        } else if (viewName === 'pairing') {
            document.getElementById('pairingView').classList.add('active');
        } else if (viewName === 'favorites') {
            document.getElementById('favoritesView').classList.add('active');
            document.getElementById('favoritesBtn').classList.add('active');
            this.loadFavorites();
        }
    }

    async loadGenres() {
        const grid = document.getElementById('genreGrid');
        const genres = [
            { id: 28, name: 'Action' },
            { id: 35, name: 'Comedy' },
            { id: 18, name: 'Drama' },
            { id: 10749, name: 'Romance' },
            { id: 27, name: 'Horror' },
            { id: 878, name: 'Sci-Fi' }
        ];

        const genreCards = genres.map(genre => `
            <div class="genre-card" onclick="window.app.filterByGenre(${genre.id}, '${genre.name}')">
                <h3>${genre.name}</h3>
            </div>
        `).join('');

        grid.innerHTML = genreCards;
    }

    // Load all sections (for multiple grids version)
    async loadAllSections() {
        this.loadTrendingSection();
        this.loadPopularSection();
        this.loadTopRatedSection();
        this.loadActionSection();
        this.loadComedySection();
    }

    // Trending Section
    async loadTrendingSection() {
        const grid = document.getElementById('trendingGrid');
        if (!grid) return;
        
        grid.innerHTML = '<div class="loading">Loading trending movies...</div>';

        try {
            const movies = await this.tmdbAPI.getTrendingMovies();
            if (movies && movies.length > 0) {
                this.ui.renderMovieGrid(movies.slice(0, 40), grid, (movie) => this.showMoviePairing(movie.id));
            } else {
                grid.innerHTML = '<div class="empty-state"><h2>No movies found</h2></div>';
            }
        } catch (error) {
            console.error('Error loading trending movies:', error);
            grid.innerHTML = '<div class="empty-state"><h2>Error loading movies</h2></div>';
        }
    }

    // Popular Section
    async loadPopularSection() {
        const grid = document.getElementById('popularGrid');
        if (!grid) return;
        
        grid.innerHTML = '<div class="loading">Loading popular movies...</div>';

        try {
            const movies = await this.tmdbAPI.getPopularMovies();
            if (movies && movies.length > 0) {
                this.ui.renderMovieGrid(movies.slice(0, 40), grid, (movie) => this.showMoviePairing(movie.id));
            } else {
                grid.innerHTML = '<div class="empty-state"><h2>No movies found</h2></div>';
            }
        } catch (error) {
            console.error('Error loading popular movies:', error);
            grid.innerHTML = '<div class="empty-state"><h2>Error loading movies</h2></div>';
        }
    }

    // Top Rated Section
    async loadTopRatedSection() {
        const grid = document.getElementById('topRatedGrid');
        if (!grid) return;
        
        grid.innerHTML = '<div class="loading">Loading top rated movies...</div>';

        try {
            const movies = await this.tmdbAPI.getTopRatedMovies();
            if (movies && movies.length > 0) {
                this.ui.renderMovieGrid(movies.slice(0, 40), grid, (movie) => this.showMoviePairing(movie.id));
            } else {
                grid.innerHTML = '<div class="empty-state"><h2>No movies found</h2></div>';
            }
        } catch (error) {
            console.error('Error loading top rated movies:', error);
            grid.innerHTML = '<div class="empty-state"><h2>Error loading movies</h2></div>';
        }
    }

    // Action Section
    async loadActionSection() {
        const grid = document.getElementById('actionGrid');
        if (!grid) return;
        
        grid.innerHTML = '<div class="loading">Loading action movies...</div>';

        try {
            const movies = await this.tmdbAPI.getMoviesByGenre(28);
            if (movies && movies.length > 0) {
                this.ui.renderMovieGrid(movies.slice(0, 40), grid, (movie) => this.showMoviePairing(movie.id));
            } else {
                grid.innerHTML = '<div class="empty-state"><h2>No movies found</h2></div>';
            }
        } catch (error) {
            console.error('Error loading action movies:', error);
            grid.innerHTML = '<div class="empty-state"><h2>Error loading movies</h2></div>';
        }
    }

    // Comedy Section
    async loadComedySection() {
        const grid = document.getElementById('comedyGrid');
        if (!grid) return;
        
        grid.innerHTML = '<div class="loading">Loading comedy movies...</div>';

        try {
            const movies = await this.tmdbAPI.getMoviesByGenre(35);
            if (movies && movies.length > 0) {
                this.ui.renderMovieGrid(movies.slice(0, 40), grid, (movie) => this.showMoviePairing(movie.id));
            } else {
                grid.innerHTML = '<div class="empty-state"><h2>No movies found</h2></div>';
            }
        } catch (error) {
            console.error('Error loading comedy movies:', error);
            grid.innerHTML = '<div class="empty-state"><h2>Error loading movies</h2></div>';
        }
    }

    // Original single grid version (for backward compatibility)
    async loadTrendingMovies() {
        const grid = document.getElementById('movieGrid');
        if (!grid) return;
        
        grid.innerHTML = '<div class="loading">Loading trending movies...</div>';

        try {
            const movies = await this.tmdbAPI.getTrendingMovies();
            if (movies && movies.length > 0) {
                this.ui.renderMovieGrid(movies.slice(0, 40), grid, (movie) => this.showMoviePairing(movie.id));
            } else {
                grid.innerHTML = '<div class="empty-state"><h2>No movies found</h2></div>';
            }
        } catch (error) {
            console.error('Error loading movies:', error);
            grid.innerHTML = '<div class="empty-state"><h2>Error loading movies</h2><p>Please check your TMDB API key</p></div>';
        }
    }

    async filterByGenre(genreId, genreName) {
        // Use first available grid
        const grid = document.getElementById('movieGrid') || document.getElementById('trendingGrid');
        if (!grid) return;
        
        grid.innerHTML = `<div class="loading">Loading ${genreName} movies...</div>`;

        try {
            const movies = await this.tmdbAPI.getMoviesByGenre(genreId);
            if (movies && movies.length > 0) {
                this.ui.renderMovieGrid(movies, grid, (movie) => this.showMoviePairing(movie.id));
            } else {
                grid.innerHTML = '<div class="empty-state"><h2>No movies found</h2></div>';
            }
        } catch (error) {
            console.error('Error filtering movies:', error);
            grid.innerHTML = '<div class="empty-state"><h2>Error loading movies</h2></div>';
        }
    }

    async handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.trim();
        if (!searchTerm) return;

        // Use first available grid
        const grid = document.getElementById('movieGrid') || document.getElementById('trendingGrid');
        if (!grid) return;
        
        grid.innerHTML = '<div class="loading">Searching movies...</div>';

        try {
            const movies = await this.tmdbAPI.searchMovies(searchTerm);
            if (movies && movies.length > 0) {
                this.ui.renderMovieGrid(movies, grid, (movie) => this.showMoviePairing(movie.id));
            } else {
                grid.innerHTML = '<div class="empty-state"><h2>No movies found</h2><p>Try a different search</p></div>';
            }
        } catch (error) {
            console.error('Error searching movies:', error);
            grid.innerHTML = '<div class="empty-state"><h2>Error searching movies</h2></div>';
        }
    }

    async handleSurprise() {
        const pairingDiv = document.getElementById('pairingDetail');
        pairingDiv.innerHTML = '<div class="loading">Finding a surprise pairing...</div>';
        this.showView('pairing');

        try {
            const movies = await this.tmdbAPI.getTrendingMovies();
            if (movies && movies.length > 0) {
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                await this.showMoviePairing(randomMovie.id);
            }
        } catch (error) {
            console.error('Error getting surprise:', error);
            pairingDiv.innerHTML = '<div class="empty-state"><h2>Error loading surprise</h2></div>';
        }
    }

    async showMoviePairing(movieId) {
        const pairingDiv = document.getElementById('pairingDetail');
        pairingDiv.innerHTML = '<div class="loading">Creating your perfect pairing...</div>';
        this.showView('pairing');

        try {
            // Get movie details and cast
            const movie = await this.tmdbAPI.getMovieDetails(movieId);
            const cast = await this.tmdbAPI.getMovieCredits(movieId);
            this.currentMovie = movie;
            this.currentMovie.cast = cast;

            // Match cuisine to movie
            const cuisine = this.matchCuisineToMovie(movie);
            
            // Get meal
            const meals = await this.mealAPI.filterByArea(cuisine);
            const meal = meals && meals.length > 0 ? meals[0] : null;
            
            if (meal) {
                const fullMeal = await this.mealAPI.getMealById(meal.idMeal);
                this.currentMeal = fullMeal;
            }

            // Display pairing
            const isSaved = this.storage.isPairingSaved(movie.id, meal?.idMeal);
            pairingDiv.innerHTML = this.ui.renderPairing(movie, this.currentMeal, isSaved);

            // Add save button listener
            const saveBtn = document.getElementById('savePairingBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.toggleSavePairing());
            }

        } catch (error) {
            console.error('Error creating pairing:', error);
            pairingDiv.innerHTML = '<div class="empty-state"><h2>Error creating pairing</h2></div>';
        }
    }

    // Show actor details popup
    async showActorDetails(actorId) {
        try {
            const actor = await this.tmdbAPI.getActorDetails(actorId);
            if (!actor) return;

            const photoUrl = actor.profile_path 
                ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                : 'https://via.placeholder.com/300x450?text=No+Photo';

            const birthday = actor.birthday ? new Date(actor.birthday).toLocaleDateString() : 'Unknown';
            const birthplace = actor.place_of_birth || 'Unknown';
            const bio = actor.biography || 'No biography available.';

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'actor-modal';
            modal.innerHTML = `
                <div class="actor-modal-content">
                    <button class="actor-modal-close" onclick="this.closest('.actor-modal').remove()">✕</button>
                    <div class="actor-modal-body">
                        <img src="${photoUrl}" alt="${actor.name}" class="actor-photo">
                        <div class="actor-info">
                            <h2>${actor.name}</h2>
                            <p><strong>Birthday:</strong> ${birthday}</p>
                            <p><strong>Birthplace:</strong> ${birthplace}</p>
                            <p><strong>Known for:</strong> ${actor.known_for_department || 'Acting'}</p>
                            <div class="actor-bio">
                                <h3>Biography</h3>
                                <p>${bio.substring(0, 500)}${bio.length > 500 ? '...' : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });

        } catch (error) {
            console.error('Error showing actor details:', error);
        }
    }

    matchCuisineToMovie(movie) {
        const cuisineMap = {
            'US': 'American',
            'GB': 'British',
            'IT': 'Italian',
            'FR': 'French',
            'JP': 'Japanese',
            'CN': 'Chinese',
            'KR': 'Korean',
            'MX': 'Mexican',
            'IN': 'Indian',
            'TH': 'Thai',
            'ES': 'Spanish',
            'GR': 'Greek',
            'TR': 'Turkish',
            'IE': 'Irish',
            'CA': 'Canadian',
            'PL': 'Polish',
            'JM': 'Jamaican',
            'VN': 'Vietnamese',
            'MY': 'Malaysian',
            'PH': 'Filipino',
            'PT': 'Portuguese',
            'HR': 'Croatian',
            'RU': 'Russian',
            'UA': 'Ukrainian'
        };

        if (movie.production_countries && movie.production_countries.length > 0) {
            const country = movie.production_countries[0].iso_3166_1;
            if (cuisineMap[country]) {
                console.log(`Matched ${movie.title} to ${cuisineMap[country]} based on country: ${country}`);
                return cuisineMap[country];
            }
        }

        const genres = movie.genres?.map(g => g.name) || [];
        
        if (genres.includes('Action')) return 'American';
        if (genres.includes('Romance')) return 'French';
        if (genres.includes('Comedy')) return 'Italian';
        if (genres.includes('Horror')) return 'Mexican';
        if (genres.includes('Animation')) return 'Japanese';
        if (genres.includes('Thriller')) return 'British';
        if (genres.includes('Drama')) return 'French';
        if (genres.includes('Adventure')) return 'American';
        if (genres.includes('Fantasy')) return 'British';
        if (genres.includes('Science Fiction')) return 'American';
        if (genres.includes('Mystery')) return 'British';
        if (genres.includes('Crime')) return 'Italian';
        if (genres.includes('Western')) return 'American';
        if (genres.includes('War')) return 'British';
        if (genres.includes('Musical')) return 'American';
        if (genres.includes('Family')) return 'Italian';
        
        console.log(`No specific match for ${movie.title}, defaulting to Italian`);
        return 'Italian';
    }

    toggleSavePairing() {
        if (!this.currentMovie || !this.currentMeal) return;

        const pairing = {
            movie: this.currentMovie,
            meal: this.currentMeal
        };

        const isSaved = this.storage.togglePairing(pairing);
        const saveBtn = document.getElementById('savePairingBtn');

        if (isSaved) {
            saveBtn.textContent = '✓ Saved to My Pairings';
            saveBtn.classList.add('saved');
        } else {
            saveBtn.textContent = '💾 Save This Pairing';
            saveBtn.classList.remove('saved');
        }
    }

    loadFavorites() {
        const grid = document.getElementById('pairingsGrid');
        const pairings = this.storage.getPairings();

        if (pairings.length === 0) {
            grid.innerHTML = '<div class="empty-state"><h2>No saved pairings yet</h2><p>Start exploring and save your favorites!</p></div>';
            return;
        }

        const pairingsHTML = pairings.map(pairing => `
            <div class="pairing-card" onclick="window.app.showMoviePairing(${pairing.movie.id})">
                <h3>🎬 ${pairing.movie.title}</h3>
                <div class="pairing-images">
                    <img src="https://image.tmdb.org/t/p/w300${pairing.movie.poster_path}" alt="${pairing.movie.title}">
                    <img src="${pairing.meal.strMealThumb}" alt="${pairing.meal.strMeal}">
                </div>
                <p>🍴 ${pairing.meal.strMeal}</p>
            </div>
        `).join('');

        grid.innerHTML = pairingsHTML;
    }
}

// Initialize app
window.app = new FlickBite();