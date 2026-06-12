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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateSpaceFormStore } from "@/store/create-space-form";
import { useFormContext } from "react-hook-form";
import { CreateSpaceFormValues } from "../../schemas";

export const CreateSpaceStepThree = () => {
  const [friendEmail, setFriendEmail] = useState("");
  const reset = useCreateSpaceFormStore((state) => state.reset);
  const createdSpace = useCreateSpaceFormStore((state) => state.createdSpace);
  const createdInvite = useCreateSpaceFormStore((state) => state.createdInvite);
  const form = useFormContext<CreateSpaceFormValues>();
  const router = useRouter();
  const inviteCode = createdInvite?.code ?? "";

  const inviteLink =
    createdSpace && inviteCode
      ? typeof window !== "undefined"
        ? `${window.location.origin}/spaces/${createdSpace.id}?invite=${inviteCode}`
        : `/spaces/${createdSpace.id}?invite=${inviteCode}`
      : "";

  return (
    <div className="mx-10 flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-center">Space Created!</DialogTitle>
        <DialogDescription className="text-center">
          Your {createdSpace?.spacePrivacy.toLowerCase() ?? "private"} space is
          ready. Share the invite code or invite teammates directly.
        </DialogDescription>
      </DialogHeader>
      <FieldGroup className="flex flex-col gap-4">
        <Field className="mx-auto w-4/5">
          <InputGroup>
            <InputGroupInput
              value={inviteCode}
              disabled
              className="text-center"
            />
            <InputGroupAddon align="inline-end">
              <CopyToClipboardButton textToCopy={inviteLink || inviteCode} />
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
                spaceId={createdSpace?.id}
              />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
      <DialogFooter className="flex flex-row gap-4 justify-center!">
        <Button
          variant="outline"
          onClick={() => {
            reset();
            form.reset();
          }}
        >
          Skip for now
        </Button>
        <Button
          onClick={() => {
            reset();
            form.reset();
            router.push("/");
          }}
        >
          Go to spaces <ArrowRight />{" "}
        </Button>
      </DialogFooter>
    </div>
  );
};
