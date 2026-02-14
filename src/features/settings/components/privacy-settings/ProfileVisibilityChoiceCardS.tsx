import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ProfileVisibilityChoiceCardS() {
  return (
    <RadioGroup defaultValue="public">
      <FieldLabel htmlFor="public">
        <Field orientation="horizontal">
          <RadioGroupItem value="public" id="public" />
          <FieldContent>
            <FieldTitle>Public</FieldTitle>
            <FieldDescription>Anyone can view.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="members">
        <Field orientation="horizontal">
          <RadioGroupItem value="members" id="members" />
          <FieldContent>
            <FieldTitle>Members Only</FieldTitle>
            <FieldDescription>Shared spaces only.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="private">
        <Field orientation="horizontal">
          <RadioGroupItem value="private" id="private" />
          <FieldContent>
            <FieldTitle>Private</FieldTitle>
            <FieldDescription>Only you.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </RadioGroup>
  );
}
