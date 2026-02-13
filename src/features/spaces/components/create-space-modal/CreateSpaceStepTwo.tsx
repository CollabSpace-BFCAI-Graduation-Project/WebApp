import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { VibeCard } from "./VibeCard";
import { useCreateSpaceFormStore } from "@/store/create-space-form.store";
import { vibes } from "../../constants";


export const CreateSpaceStepTwo = () => {
  const prevStep = useCreateSpaceFormStore((state) => state.prevStep);
  return (
    <>
      <DialogHeader className="flex flex-row">
        <Button variant="ghost" onClick={prevStep}>
          <ArrowLeft />
        </Button>
        <div className="flex flex-col gap-4">
          <Badge>Step 2/3</Badge>
          <div className="flex flex-col gap-1">
            <DialogTitle>Choose a Vibe</DialogTitle>
            <DialogDescription className="text-sm">
              Get started with a vibe or create your own.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="-me-4 max-h-[50vh] overflow-y-auto px-4 grid grid-cols-2 gap-4">
        {vibes.map((vibe) => (
          <VibeCard key={vibe.name} vibe={vibe} />
        ))}
      </div>
    </>
  );
};
