
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChefHat, Loader2, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Meal,
  searchMeals,
  getRandomMeal,
  getCategories,
  getMealsByCategory,
} from "@/services/mealdb";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeModal } from "@/components/RecipeModal";

const Index = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    data: searchResults,
    isLoading: searchLoading,
  } = useQuery({
    queryKey: ["meals", search],
    queryFn: () => searchMeals(search),
    enabled: search.length > 0,
  });

  const {
    data: categoryMeals,
    isLoading: categoryLoading,
  } = useQuery({
    queryKey: ["category", selectedCategory],
    queryFn: () => getMealsByCategory(selectedCategory),
    enabled: selectedCategory.length > 0,
  });

  const {
    data: randomMeal,
    isLoading: randomLoading,
  } = useQuery({
    queryKey: ["random"],
    queryFn: getRandomMeal,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim().length < 2) {
      toast({
        title: "Search query too short",
        description: "Please enter at least 2 characters to search",
        variant: "destructive",
      });
      return;
    }
    setSelectedCategory("");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const isLoading = searchLoading || categoryLoading || randomLoading;
  const meals = search
    ? searchResults
    : selectedCategory
    ? categoryMeals
    : randomMeal
    ? [randomMeal]
    : [];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-b from-purple-50 to-white'}`}>
      <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary">
                  Masala Magic
                </h1>
                <p className="text-sm text-muted-foreground">
                  Discover authentic Indian flavors
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Search for recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!categoriesLoading && categories && (
          <div className="mb-8 flex gap-2 flex-wrap">
            <Button
              variant={!selectedCategory ? "secondary" : "outline"}
              onClick={() => setSelectedCategory("")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.idCategory}
                variant={
                  selectedCategory === category.strCategory
                    ? "secondary"
                    : "outline"
                }
                onClick={() => {
                  setSelectedCategory(category.strCategory);
                  setSearch("");
                }}
              >
                {category.strCategory}
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : meals && meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                meal={meal}
                onClick={setSelectedMeal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recipes found</p>
          </div>
        )}
      </main>

      <RecipeModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
};

export default Index;
