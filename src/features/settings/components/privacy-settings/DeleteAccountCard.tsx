import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteIcon } from "@/components/ui/delete";

export function DeleteAccountCard() {
  return (
    <Card className="w-full gap-4 bg-destructive/15 border-destructive/50">
      <CardHeader className="text-destructive gap-4">
        <CardTitle className="flex items-center gap-2">
          <DeleteIcon size={18} /> Danger Zone
        </CardTitle>
        <CardDescription className="text-destructive">
          Deleting your account is permanent.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          variant="destructive"
          className="w-1/3 cursor-pointer font-semibold bg-destructive! hover:bg-destructive/80!"
        >
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
}
