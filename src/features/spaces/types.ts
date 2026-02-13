export type SpacesLayout = "grid" | "list";

export type FilterTab = "all" | "favorites" | "owned";

export type Vibe = {
  name: "Art Gallery" | "Cyber Lab" | "Cozy Lounge" | "Classroom";
  category: "creative" | "tech" | "meeting" | "education";
  background: React.ReactNode;
};

export type SelectedVibe = Vibe["name"] | null;