import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";
import { Button } from "../ui/button";

interface FormControllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  autoComplete: HTMLInputAutoCompleteAttribute;
  type?: HTMLInputTypeAttribute;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

export const FormController = <T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  autoComplete,
  type = "text",
  icon,
  onIconClick,
}: FormControllerProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="gap-0.5">
          <FieldLabel htmlFor={field.name} className="text-sm ms-1">
            {label}
          </FieldLabel>
          <div className="flex gap-1 flex-col">
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder}
                type={type}
                autoComplete={autoComplete}
              />
              {icon && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onIconClick}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {icon}
                </Button>
              )}
            </div>
            <div className="min-h-4">
              {fieldState.invalid && fieldState.error && (
                <FieldError
                  className="text-xs ms-1"
                  errors={[fieldState.error]}
                />
              )}
            </div>
          </div>
        </Field>
      )}
    />
  );
};
