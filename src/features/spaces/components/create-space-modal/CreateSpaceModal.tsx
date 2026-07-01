"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TooltippedButton } from "@/components/shared/tooltippedButton";
import { CreateSpaceStepOne } from "./CreateSpaceStepOne";
import { CreateSpaceStepTwo } from "./CreateSpaceStepTwo";
import { CreateSpaceStepThree } from "./CreateSpaceStepThree";
import { useCreateSpaceFormStore } from "@/store/create-space-form";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSpaceSchema, CreateSpaceFormValues } from "../../schemas";
import { cn } from "@/lib/utils";

const steps = {
  1: <CreateSpaceStepOne />,
  2: <CreateSpaceStepTwo />,
  3: <CreateSpaceStepThree />,
};

export function CreateSpaceModal() {
  const { isOpen, setIsOpen, step, reset } = useCreateSpaceFormStore();

  const form = useForm<CreateSpaceFormValues>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: "",
      description: "",
      privacy: "Private",
      vibe: null,
      thumbnail: null,
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsOpen(true);
      return;
    }

    reset();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <TooltippedButton
        tooltip="Create Space"
        variant="outline"
        hideTooltipBreakpoint="sm"
        onClick={() => handleOpenChange(true)}
      >
        <Plus className="w-4 h-4 mr-1 group-hover:rotate-180 transition-all duration-300" />
        <span className="hidden sm:inline-block">Create Space</span>
      </TooltippedButton>
      <FormProvider {...form}>
        <DialogContent
          className={cn(
            "max-h-[calc(100dvh-2rem)] overflow-hidden md:max-w-3xl",
            step === 1 ? "flex " : "",
            step === 2 ? "md:max-w-4xl" : "",
            step === 3 ? "md:max-w-2xl" : "",
          )}
        >
          {steps[step]}
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
