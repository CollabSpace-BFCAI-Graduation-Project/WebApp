import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

export function NotificationsSettings() {
  return (
    <Card className="w-full h-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-bold">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="border border-muted-foreground rounded-xl p-4">
          <FieldGroup className="w-full">
            <FieldLabel htmlFor="email-notifications">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Email notifications</FieldTitle>
                  <FieldDescription>Receive updates via email</FieldDescription>
                </FieldContent>
                <Switch id="email-notifications" defaultChecked />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="push-notifications">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Push notifications</FieldTitle>
                  <FieldDescription>
                    Browser push notifications.
                  </FieldDescription>
                </FieldContent>
                <Switch id="push-notifications" defaultChecked />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="space-invites">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Space invites</FieldTitle>
                  <FieldDescription>When someone invites you</FieldDescription>
                </FieldContent>
                <Switch id="space-invites" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="chat-mentions">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Chat mentions</FieldTitle>
                  <FieldDescription>When mentioned in chat</FieldDescription>
                </FieldContent>
                <Switch id="chat-mentions" />
              </Field>
            </FieldLabel>
          </FieldGroup>
        </div>
      </CardContent>
    </Card>
  );
}
