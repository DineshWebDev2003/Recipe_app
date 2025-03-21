
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  ingredients: Array<{ ingredient: string; measure: string }>;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

const formatMeal = (meal: any): Meal => {
  const ingredients: Array<{ ingredient: string; measure: string }> = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }
  
  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strCategory: meal.strCategory,
    strArea: meal.strArea,
    strInstructions: meal.strInstructions,
    strMealThumb: meal.strMealThumb,
    strTags: meal.strTags,
    strYoutube: meal.strYoutube,
    ingredients,
  };
};

export const searchMeals = async (query: string): Promise<Meal[]> => {
  const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
  const data = await response.json();
  return data.meals ? data.meals.map(formatMeal) : [];
};

export const getRandomMeal = async (): Promise<Meal> => {
  const response = await fetch(`${BASE_URL}/random.php`);
  const data = await response.json();
  return formatMeal(data.meals[0]);
};

export const getMealById = async (id: string): Promise<Meal> => {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await response.json();
  return formatMeal(data.meals[0]);
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/categories.php`);
  const data = await response.json();
  return data.categories;
};

export const getMealsByCategory = async (category: string): Promise<Meal[]> => {
  const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  const data = await response.json();
  
  // Since the category endpoint doesn't return full meal details,
  // we need to fetch each meal individually
  const meals = await Promise.all(
    data.meals.map((meal: any) => getMealById(meal.idMeal))
  );
  
  return meals;
};
