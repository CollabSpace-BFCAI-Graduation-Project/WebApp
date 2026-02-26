import { useState } from "react";
import { FormController } from "./FormController";
import { FieldValues, Path, Control } from "react-hook-form";
import { EyeIcon } from "../ui/eye";
import { EyeOffIcon } from "../ui/eye-off";


interface PasswordInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  autoComplete: "current-password" | "new-password" | "off";
}

export const PasswordInput = <T extends FieldValues>({
  control,
  name,
  label,
  autoComplete,
}: PasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordType = showPassword ? "text" : "password";
  return (
    <FormController
      name={name}
      label={label}
      placeholder="********"
      autoComplete={autoComplete}
      control={control}
      type={passwordType}
      icon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
      onIconClick={() => setShowPassword(!showPassword)}
    />
  );
};
