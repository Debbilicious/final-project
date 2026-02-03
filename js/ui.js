export class UIManager {
    renderMovieGrid(movies, container, onClickCallback) {
        const cardsHTML = movies.map(movie => {
            const posterPath = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : 'https://via.placeholder.com/300x450?text=No+Poster';
            
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
            const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

            return `
                <div class="movie-card" onclick="window.app.showMoviePairing(${movie.id})">
                    <img src="${posterPath}" alt="${movie.title}">
                    <div class="movie-card-content">
                        <h3>${movie.title}</h3>
                        <p class="rating">⭐ ${rating}/10</p>
                        <p class="release-date">${releaseYear}</p>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = cardsHTML;
    }

    renderPairing(movie, meal, isSaved) {
        const posterPath = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster';

        const mealHTML = meal ? this.renderMealSection(meal) : `
            <div class="meal-section">
                <h2>🍴 Meal Pairing</h2>
                <p>No meal pairing available at this time.</p>
            </div>
        `;

        const genreTags = movie.genres?.map(g => 
            `<span class="genre-tag">${g.name}</span>`
        ).join('') || '';

        return `
            <div class="pairing-container">
                <div class="pairing-header">
                    <div class="movie-section">
                        <h2>🎬 ${movie.title}</h2>
                        <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
                        <div class="movie-info">
                            <div class="rating-badge">⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}/10</div>
                            <p><strong>Release:</strong> ${movie.release_date || 'N/A'}</p>
                            <p><strong>Runtime:</strong> ${movie.runtime ? movie.runtime + ' min' : 'N/A'}</p>
                            <div class="genre-tags">${genreTags}</div>
                            <p class="overview">${movie.overview || 'No description available.'}</p>
                            
                            ${movie.cast && movie.cast.length > 0 ? `
                                <h3 style="margin-top: 1.5rem; color: #6C63FF; font-size: 1.1rem;">Cast</h3>
                                <div class="cast-list">
                                    ${movie.cast.slice(0, 5).map(actor => `
                                        <div class="cast-member">
                                            <strong class="actor-name" onclick="window.app.showActorDetails(${actor.id})">${actor.name}</strong> 
                                            <span class="character">as ${actor.character || 'Unknown Role'}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    ${mealHTML}
                </div>

                <button id="savePairingBtn" class="save-pairing-btn ${isSaved ? 'saved' : ''}">
                    ${isSaved ? '✓ Saved to My Pairings' : '💾 Save This Pairing'}
                </button>
            </div>
        `;
    }

    renderMealSection(meal) {
        const ingredients = this.extractIngredients(meal);
        const ingredientsHTML = ingredients.map(ing => `
            <div class="ingredient-item">
                <strong>${ing.ingredient}</strong>: ${ing.measure}
            </div>
        `).join('');

        return `
            <div class="meal-section">
                <h2>🍴 ${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-image">
                <div class="meal-info">
                    <p><strong>Cuisine:</strong> ${meal.strArea}</p>
                    <p><strong>Category:</strong> ${meal.strCategory}</p>
                    
                    <h3>Ingredients</h3>
                    <div class="ingredients-list">
                        ${ingredientsHTML}
                    </div>

                    <h3>Instructions</h3>
                    <div class="instructions">
                        ${meal.strInstructions}
                    </div>

                    ${meal.strYoutube ? `
                        <p style="margin-top: 1rem;">
                            <a href="${meal.strYoutube}" target="_blank" style="color: #6C63FF;">
                                📺 Watch cooking video →
                            </a>
                        </p>
                    ` : ''}
                </div>
            </div>
        `;
    }

    extractIngredients(meal) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            
            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    ingredient: ingredient.trim(),
                    measure: measure ? measure.trim() : ''
                });
            }
        }
        return ingredients;
    }
}