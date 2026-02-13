import { Button } from "@/components/ui/button";
import { useCreateSpaceFormStore } from "@/store/create-space-form.store";
import { Vibe } from "../../types";
import { useFormContext } from "react-hook-form";
import { CreateSpaceFormValues } from "../../schemas";

interface VibeCardProps {
  vibe: Vibe;
}
export const VibeCard = ({ vibe }: VibeCardProps) => {
  const nextStep = useCreateSpaceFormStore((state) => state.nextStep);
  const form = useFormContext<CreateSpaceFormValues>();

  return (
    <Button
      className="flex flex-col gap-2 border border-foreground p-4 mt-4 h-auto hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-300"
      variant="ghost"
      onClick={() => {
        form.setValue("vibe", vibe.name, { shouldValidate: true });
        nextStep();
      }}
    >
      {vibe.background}
      <div className="flex flex-col gap-1 self-start items-start">
        <h3 className="text-sm font-semibold">{vibe.name}</h3>
        <p className="text-xs text-muted-foreground pl-0.5">
          {vibe.category.toUpperCase()}
        </p>
      </div>
    </Button>
  );
};
