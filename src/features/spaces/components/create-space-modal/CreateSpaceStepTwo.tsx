import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { VibeCard } from "./VibeCard";
import { useCreateSpaceFormStore } from "@/store/create-space-form";
import { vibes } from "../../constants";

export const CreateSpaceStepTwo = () => {
  const prevStep = useCreateSpaceFormStore((state) => state.prevStep);
  return (
    <>
      <DialogHeader className="flex-row items-start gap-3 pr-8 text-left">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-1 shrink-0"
          onClick={prevStep}
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="min-w-0 flex flex-col gap-4">
          <Badge className="w-fit">Step 2/3</Badge>
          <div className="flex flex-col gap-1">
            <DialogTitle>Choose a Vibe</DialogTitle>
            <DialogDescription className="text-sm">
              Get started with a vibe or create your own.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="grid max-h-[min(58vh,32rem)] min-h-0 grid-cols-1 gap-4 overflow-y-auto overscroll-contain pr-3 sm:grid-cols-2">
        {vibes.map((vibe) => (
          <VibeCard key={vibe.name} vibe={vibe} />
        ))}
      </div>
    </>
  );
};
