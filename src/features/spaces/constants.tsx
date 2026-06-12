import { CodeXml, Coffee, GraduationCap, Palette } from "lucide-react";
import { Vibe } from "./types";

export const vibes: Vibe[] = [
  {
    name: "Art Gallery",
    category: "creative",
    background: (
      <div className="w-full h-20 bg-[linear-gradient(135deg,rgb(246,211,101)_0%,rgb(253,160,133)_100%)] rounded-lg flex items-center justify-center">
        <Palette className="w-6! h-6! text-white" />
      </div>
    ),
  },
  {
    name: "Cyber Lab",
    category: "tech",
    background: (
      <div className="w-full h-20 bg-[linear-gradient(135deg,rgb(132,250,176)_0%,rgb(143,211,244)_100%)] rounded-lg flex items-center justify-center">
        <CodeXml className="w-6! h-6! text-white" />
      </div>
    ),
  },
  {
    name: "Cozy Lounge",
    category: "meeting",
    background: (
      <div className="w-full h-20 bg-[linear-gradient(135deg,rgb(255,154,156)_0%,rgb(254,207,239)_100%)] rounded-lg flex items-center justify-center">
        <Coffee className="w-6! h-6! text-white" />
      </div>
    ),
  },
  {
    name: "Classroom",
    category: "education",
    background: (
      <div className="w-full h-20 bg-[linear-gradient(135deg,rgb(161,196,253)_0%,rgb(194,233,251)_100%)] rounded-lg flex items-center justify-center">
        <GraduationCap className="w-6! h-6! text-white" />
      </div>
    ),
  },
];