
import { Meal } from "@/services/mealdb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface RecipeCardProps {
  meal: Meal;
  onClick: (meal: Meal) => void;
}

export const RecipeCard = ({ meal, onClick }: RecipeCardProps) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer animate-fade-up"
      onClick={() => onClick(meal)}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
            {meal.strCategory}
          </Badge>
        </div>
      </div>
      <CardHeader className="py-3">
        <h3 className="font-semibold text-lg line-clamp-1">{meal.strMeal}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>30 min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>4 servings</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
