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

const steps = {
  1: <CreateSpaceStepOne />,
  2: <CreateSpaceStepTwo />,
  3: <CreateSpaceStepThree />,
};

export function CreateSpaceModal() {
  const { isOpen, setIsOpen, step } = useCreateSpaceFormStore();

  const form = useForm<CreateSpaceFormValues>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: "",
      description: "",
      vibe: null,
    },
  });

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
          {steps[step]}
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
