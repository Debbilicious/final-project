export class MealAPI {
    constructor() {
        this.baseURL = 'https://www.themealdb.com/api/json/v1/1';
    }

    async searchMeals(query) {
        try {
            const response = await fetch(`${this.baseURL}/search.php?s=${query}`);
            const data = await response.json();
            return data.meals;
        } catch (error) {
            console.error('Error searching meals:', error);
            throw error;
        }
    }

    async getMealById(id) {
        try {
            const response = await fetch(`${this.baseURL}/lookup.php?i=${id}`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error('Error getting meal by ID:', error);
            throw error;
        }
    }

    async getRandomMeal() {
        try {
            const response = await fetch(`${this.baseURL}/random.php`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error('Error getting random meal:', error);
            throw error;
        }
    }

    async filterByArea(area) {
        try {
            const response = await fetch(`${this.baseURL}/filter.php?a=${area}`);
            const data = await response.json();
            return data.meals;
        } catch (error) {
            console.error('Error filtering by area:', error);
            throw error;
        }
    }

    async filterByCategory(category) {
        try {
            const response = await fetch(`${this.baseURL}/filter.php?c=${category}`);
            const data = await response.json();
            return data.meals;
        } catch (error) {
            console.error('Error filtering by category:', error);
            throw error;
        }
    }
}