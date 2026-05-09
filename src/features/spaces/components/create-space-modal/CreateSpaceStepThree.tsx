import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { ArrowRight } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import CopyToClipboardButton from "@/components/shared/CopyToClipboardButton";
import InviteFriendButton from "@/components/shared/InviteFriendButton";
import { useState } from "react";
import { useCreateSpaceFormStore } from "@/store/create-space-form";
import { useFormContext } from "react-hook-form";
import { CreateSpaceFormValues } from "../../schemas";

export const CreateSpaceStepThree = () => {
  const [friendEmail, setFriendEmail] = useState("");
  const spaceUrl = "https://exhhhhhhhhhhhhhhhhhample.com";
  const reset = useCreateSpaceFormStore((state) => state.reset);
  const form = useFormContext<CreateSpaceFormValues>();
  return (
    <div className="mx-10 flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-center">Space Created! 🎉</DialogTitle>
        <DialogDescription className="text-center">
          Your space is ready. Share the link or invite teammates!
        </DialogDescription>
      </DialogHeader>
      <FieldGroup className="flex flex-col gap-4">
        <Field className="mx-auto w-4/5">
          <InputGroup>
            <InputGroupInput
              defaultValue={spaceUrl}
              disabled
              className="text-center"
            />
            <InputGroupAddon align="inline-end">
              <CopyToClipboardButton textToCopy={spaceUrl} />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field className="mx-auto w-4/5">
          <InputGroup>
            <InputGroupInput
              placeholder="teammate@example.com"
              className="text-center"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <InviteFriendButton
                friendEmail={friendEmail}
                setFriendEmail={setFriendEmail}
              />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
      <DialogFooter className="flex flex-row gap-4 justify-center!">
        <Button
          variant="outline"
          onClick={() => {
            console.log("Submit values:", form.getValues());
            reset();
            form.reset();
          }}
        >
          Skip for now
        </Button>
        <Button
          onClick={() => {
            console.log("Submit values:", form.getValues());
            reset();
            form.reset();
          }}
        >
          Go to spaces <ArrowRight />{" "}
        </Button>
      </DialogFooter>
    </div>
  );
};
