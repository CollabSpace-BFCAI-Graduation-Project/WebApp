"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TooltippedButton } from "@/components/shared/tooltippedButton";
import { CreateSpaceStepOne } from "./CreateSpaceStepOne";
import { CreateSpaceStepTwo } from "./CreateSpaceStepTwo";
import { CreateSpaceStepThree } from "./CreateSpaceStepThree";
import { useCreateSpaceFormStore } from "@/store/create-space-form.store";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSpaceSchema, CreateSpaceFormValues } from "../../schemas";
import { cn } from "@/lib/utils";

export function CreateSpaceModal() {
  const {
    setIsOpen,
    step,
    isOpen,
    spaceName,
    description,
    selectedVibe,
    setSpaceName,
    setDescription,
    setSelectedVibe,
  } = useCreateSpaceFormStore();

  const form = useForm<CreateSpaceFormValues>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: spaceName,
      description: description,
      vibe: selectedVibe,
    },
  });
  const values = form.watch();
  setSpaceName(values.name);
  setDescription(values.description);
  setSelectedVibe(values.vibe);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TooltippedButton
          tooltip="Create Space"
          variant="outline"
          hideTooltipBreakpoint="sm"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1 group-hover:rotate-180 transition-all duration-300" />
          <span className="hidden sm:inline-block">Create Space</span>
        </TooltippedButton>
      </DialogTrigger>
      <FormProvider {...form}>
        <DialogContent
          className={cn(
            "md:max-w-3xl",
            step === 1 ? "flex " : "",
            step === 3 ? "md:max-w-2xl" : "",
          )}
        >
          {step === 1 && <CreateSpaceStepOne />}
          {step === 2 && <CreateSpaceStepTwo />}
          {step === 3 && <CreateSpaceStepThree />}
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
