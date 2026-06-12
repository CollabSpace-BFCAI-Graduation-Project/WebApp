import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProfileVisibilityChoiceCardSProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProfileVisibilityChoiceCardS({
  value,
  onChange,
}: ProfileVisibilityChoiceCardSProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <FieldLabel htmlFor="public">
        <Field orientation="horizontal">
          <RadioGroupItem value="public" id="public" />
          <FieldContent>
            <FieldTitle>Public</FieldTitle>
            <FieldDescription>Anyone can view.</FieldDescription>
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
