export class StorageManager {
    constructor() {
        this.pairingsKey = 'flickbite_pairings';
    }

    getPairings() {
        try {
            const pairings = localStorage.getItem(this.pairingsKey);
            return pairings ? JSON.parse(pairings) : [];
        } catch (error) {
            console.error('Error getting pairings:', error);
            return [];
        }
    }

    savePairings(pairings) {
        try {
            localStorage.setItem(this.pairingsKey, JSON.stringify(pairings));
        } catch (error) {
            console.error('Error saving pairings:', error);
        }
    }

    togglePairing(pairing) {
        const pairings = this.getPairings();
        const index = pairings.findIndex(p => 
            p.movie.id === pairing.movie.id && p.meal.idMeal === pairing.meal.idMeal
        );

        if (index > -1) {
            // Remove pairing
            pairings.splice(index, 1);
            this.savePairings(pairings);
            return false;
        } else {
            // Add pairing
            pairings.push(pairing);
            this.savePairings(pairings);
            return true;
        }
    }

    isPairingSaved(movieId, mealId) {
        const pairings = this.getPairings();
        return pairings.some(p => p.movie.id === movieId && p.meal.idMeal === mealId);
    }

    clearPairings() {
        localStorage.removeItem(this.pairingsKey);
    }
}