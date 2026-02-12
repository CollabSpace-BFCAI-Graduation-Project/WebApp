"use client";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TooltippedButton } from "@/components/shared/tooltippedButton";
import { CreateSpaceStepOne } from "./CreateSpaceStepOne";
import { CreateSpaceStepTwo } from "./CreateSpaceStepTwo";
import { useState } from "react";

export function CreateSpaceModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [spaceName, setSpaceName] = useState("");
  const [description, setDescription] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltippedButton
          tooltip="Create Space"
          variant="outline"
          hideTooltipBreakpoint="sm"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1 group-hover:rotate-180 transition-all duration-300" />
          <span className="hidden sm:inline-block">Create Space</span>
        </TooltippedButton>
      </DialogTrigger>
      {step === 1 && (
        <CreateSpaceStepOne
          setStep={setStep}
          spaceName={spaceName}
          setSpaceName={setSpaceName}
          description={description}
          setDescription={setDescription}
        />
      )}
      {step === 2 && (
        <CreateSpaceStepTwo
          setStep={setStep}
          spaceName={spaceName}
          setSpaceName={setSpaceName}
          description={description}
          setDescription={setDescription}
        />
      )}
      {/* {step === 3 && <CreateSpaceStepThree setStep={setStep} />} */}
    </Dialog>
  );
}
