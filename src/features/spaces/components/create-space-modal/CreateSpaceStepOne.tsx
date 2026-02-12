import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setStep: Dispatch<SetStateAction<number>>;
  spaceName: string;
  setSpaceName: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
}

export const CreateSpaceStepOne = ({
  setStep,
  spaceName,
  setSpaceName,
  description,
  setDescription,
}: Props) => {
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <Badge className="mb-4">Step 1/3</Badge>
        <div className="flex flex-col gap-2">
          <DialogTitle>{"Let's build your dream space! 🚀"}</DialogTitle>
          <DialogDescription>
            Give it a cool name to get started.
          </DialogDescription>
        </div>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <Label htmlFor="spaceName">Space Name</Label>
          <Input
            id="spaceName"
            name="spaceName"
            placeholder="Space Name"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            className="resize-none h-[100px]"
            maxLength={200}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button className="w-full" onClick={() => setStep((prev) => prev + 1)}>
          Next Step
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
