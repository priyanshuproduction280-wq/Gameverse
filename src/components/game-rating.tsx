import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type GameRatingProps = {
    rating: number;
    totalStars?: number;
    size?: number;
    className?: string;
    showText?: boolean;
}

export function GameRating({ rating, totalStars = 5, size = 16, className, showText = true }: GameRatingProps) {
    const fullStars = Math.floor(rating);
    const partialStar = rating % 1;
    const emptyStars = totalStars - fullStars - (partialStar > 0 ? 1 : 0);

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} size={size} className="text-amber-400 fill-amber-400" />
                ))}
                {partialStar > 0 && (
                    <div className="relative">
                        <Star size={size} className="text-amber-400" />
                        <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
                            <Star size={size} className="text-amber-400 fill-amber-400" />
                        </div>
                    </div>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} size={size} className="text-gray-600" />
                ))}
            </div>
            {showText && <span className="text-xs font-medium text-muted-foreground">{rating.toFixed(1)} / {totalStars}</span>}
        </div>
    )
}
