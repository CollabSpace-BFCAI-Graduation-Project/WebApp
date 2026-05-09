// filters
export type SpacesLayout = "grid" | "list";
export type FilterTab = "all" | "favorites" | "owned";

export type SpaceCategory = "creative" | "tech" | "meeting" | "education";

export type CategoryFilter = "all-categories" | SpaceCategory;
export type StatusFilter = "any-status" | "online" | "offline";
export type SortFilter =
  | "newest-first"
  | "oldest-first"
  | "name-asc"
  | "name-desc"
  | "by-category";

// vibes
export type SpaceVibe =
  | "Art Gallery"
  | "Cyber Lab"
  | "Cozy Lounge"
  | "Classroom";

export type Vibe = {
  name: SpaceVibe;
  category: SpaceCategory;
  background: React.ReactNode;
};
