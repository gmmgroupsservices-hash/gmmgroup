import type { Property } from "./types";

const getStableNumber = (id: string, seed: number, min: number, range: number) => {
  const total = Array.from(id).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + seed), seed);
  return min + (total % range);
};

export const getPropertyMetrics = (property: Property) => ({
  views: property.viewCount ?? getStableNumber(property.id, 17, 95, 620),
  likes: property.likeCount ?? getStableNumber(property.id, 7, 0, 48)
});
