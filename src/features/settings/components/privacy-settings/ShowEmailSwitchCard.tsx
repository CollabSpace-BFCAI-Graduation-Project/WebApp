import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export function ShowEmailSwitchCard() {
  return (
    <FieldLabel htmlFor="switch-show-email">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Show Email</FieldTitle>
          <FieldDescription>Display email on profile.</FieldDescription>
        </FieldContent>
        <Switch id="switch-show-email" />
      </Field>
    </FieldLabel>
  );
}
