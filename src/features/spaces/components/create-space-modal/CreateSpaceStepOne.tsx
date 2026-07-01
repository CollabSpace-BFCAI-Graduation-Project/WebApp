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
  FieldContent,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateSpaceFormStore } from "@/store/create-space-form";
import { Controller, useFormContext } from "react-hook-form";
import { CreateSpaceFormValues } from "../../schemas";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export const CreateSpaceStepOne = () => {
  const nextStep = useCreateSpaceFormStore((state) => state.nextStep);
  const form = useFormContext<CreateSpaceFormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void,
  ) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 4 * 1024 * 1024) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const handleRemove = (onChange: (file: File | null) => void) => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
                        <FieldContent>
                          <FieldTitle>Private</FieldTitle>
                          <FieldDescription>
                            Only invited members can join.
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="space-public">
                      <Field orientation="horizontal" className="rounded-md border p-3">
                        <RadioGroupItem value="Public" id="space-public" />
                        <FieldContent>
                          <FieldTitle>Public</FieldTitle>
                          <FieldDescription>
                            Visible to members with access to public discovery.
                          </FieldDescription>
                        </FieldContent>
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
      <div className="hidden md:flex flex-col mt-8 ml-4 w-1/2 gap-4 flex-1">
        {/* Thumbnail upload */}
        <Controller
          name="thumbnail"
          control={form.control}
          render={({ field: { onChange } }) => (
            <Field className="flex-1 flex flex-col">
              <FieldLabel>Thumbnail <span className="font-normal text-muted-foreground">(optional)</span></FieldLabel>
              <input
                ref={fileInputRef}
                type="file"
                id="space-thumbnail"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleFileChange(e, onChange)}
              />
              {preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-border flex-1 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(onChange)}
                    >
                      <X className="size-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex-1 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                >
                  <ImagePlus className="size-5" />
                  <span className="text-xs font-medium">Click to upload thumbnail</span>
                  <span className="text-[10px]">PNG, JPG, WEBP up to 4 MB</span>
                </button>
              )}
            </Field>
          )}
        />

      </div>
    </>
  );
};
