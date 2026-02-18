export type SpacesLayout = "grid" | "list";

export type FilterTab = "all" | "favorites" | "owned";

export type SpaceCategory = "creative" | "tech" | "meeting" | "education";
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
