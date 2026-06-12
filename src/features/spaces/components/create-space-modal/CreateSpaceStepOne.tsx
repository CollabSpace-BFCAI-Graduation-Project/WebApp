import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateSpaceFormStore } from "@/store/create-space-form";
import { Controller, useFormContext } from "react-hook-form";
import { CreateSpaceFormValues } from "../../schemas";
import { CreateSpaceIllustration } from "./CreateSpaceIllustration";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

export const CreateSpaceStepOne = () => {
  const nextStep = useCreateSpaceFormStore((state) => state.nextStep);
  const form = useFormContext<CreateSpaceFormValues>();
  return (
    <>
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <DialogHeader>
          <Badge className="mb-4">Step 1/3</Badge>
          <div className="flex flex-col gap-2">
            <DialogTitle>{"Let's build your dream space!"}</DialogTitle>
            <DialogDescription>
              Give it a cool name to get started.
            </DialogDescription>
          </div>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(nextStep)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="space-name">Space Name</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="space-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Design System"
                      autoComplete="off"
                      maxLength={50}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText className="tabular-nums text-xs text-muted-foreground">
                        {field.value.length}/50
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="space-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="space-description"
                      placeholder="What happens in this space?"
                      className="min-h-24 max-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                      maxLength={200}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-xs text-muted-foreground">
                        {field.value.length}/200
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="privacy"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Visibility</FieldLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    <FieldLabel htmlFor="space-private">
                      <Field orientation="horizontal" className="rounded-md border p-3">
                        <RadioGroupItem value="Private" id="space-private" />
                        <div className="flex flex-col gap-1">
                          <FieldTitle>Private</FieldTitle>
                          <FieldDescription>
                            Only invited members can join.
                          </FieldDescription>
                        </div>
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="space-public">
                      <Field orientation="horizontal" className="rounded-md border p-3">
                        <RadioGroupItem value="Public" id="space-public" />
                        <div className="flex flex-col gap-1">
                          <FieldTitle>Public</FieldTitle>
                          <FieldDescription>
                            Visible to members with access to public discovery.
                          </FieldDescription>
                        </div>
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                </Field>
              )}
            />
          </FieldGroup>
          <Field orientation="responsive" className="mt-4">
            <Button type="submit">Next Step</Button>
          </Field>
        </form>
      </div>
      <div className="hidden md:block mt-8 ml-4 relative w-1/2 rounded-lg overflow-hidden bg-linear-to-br from-card/30 to-muted/20 border border-border/50 shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <CreateSpaceIllustration className="w-full h-full object-contain" />
        </div>
      </div>
    </>
  );
};
