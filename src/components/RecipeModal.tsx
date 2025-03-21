
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Meal } from "@/services/mealdb";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Youtube } from "lucide-react";

interface RecipeModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal = ({ meal, isOpen, onClose }: RecipeModalProps) => {
  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{meal.strMeal}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{meal.strCategory}</Badge>
            <Badge variant="outline">{meal.strArea}</Badge>
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Youtube className="w-4 h-4" />
                <span>Watch Tutorial</span>
              </a>
            )}
          </div>
        </DialogHeader>
        <div className="relative aspect-video mt-4">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
        <ScrollArea className="flex-1 mt-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <ul className="grid grid-cols-2 gap-2">
                {meal.ingredients.map(({ ingredient, measure }, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <span>{ingredient}</span>
                    <span className="text-muted-foreground">{measure}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              <p className="whitespace-pre-line text-muted-foreground">
                {meal.strInstructions}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
