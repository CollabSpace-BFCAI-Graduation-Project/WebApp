import { useState } from "react";
import { FormController } from "./form-controller";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface PasswordInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
}

export const PasswordInput = <T extends FieldValues>({
  form,
  name,
  label,
}: PasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordType = showPassword ? "text" : "password";
  return (
    <FormController
      name={name}
      label={label}
      placeholder="********"
      autoComplete="new-password"
      control={form.control}
      type={passwordType}
      icon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
      onIconClick={() => setShowPassword(!showPassword)}
    />
  );
};
