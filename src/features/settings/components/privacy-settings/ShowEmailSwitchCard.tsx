import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

interface ShowEmailSwitchCardProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ShowEmailSwitchCard({
  checked,
  onCheckedChange,
}: ShowEmailSwitchCardProps) {
  return (
    <FieldLabel htmlFor="switch-show-email">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Show Email</FieldTitle>
          <FieldDescription>Display email on profile.</FieldDescription>
        </FieldContent>
        <Switch
          id="switch-show-email"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </Field>
    </FieldLabel>
  );
}
