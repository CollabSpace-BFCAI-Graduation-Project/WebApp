"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteIcon } from "@/components/ui/delete";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { deleteCurrentAccount } from "../../services";

export function DeleteAccountCard() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [password, setPassword] = useState("");
  const deleteMutation = useMutation({
    mutationFn: () => deleteCurrentAccount(password),
    onSuccess: () => {
      toast.success("Account deleted.");
      logout();
      router.replace("/login");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete account.",
      );
    },
  });

  return (
    <Card className="w-full gap-4 border-destructive/50 bg-destructive/15">
      <CardHeader className="gap-4 text-destructive">
        <CardTitle className="flex items-center gap-2">
          <DeleteIcon size={18} /> Danger Zone
        </CardTitle>
        <CardDescription className="text-destructive">
          Deleting your account is permanent.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="destructive"
                className="w-full cursor-pointer font-semibold sm:w-1/3"
              />
            }
          >
            Delete Account
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account?</AlertDialogTitle>
              <AlertDialogDescription>
                Enter your password to permanently delete your account.
                <span className="mt-2 block font-medium text-destructive">
                  You must transfer or delete any spaces you own before deleting your account.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setPassword("");
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={!password || deleteMutation.isPending}
                onClick={(event) => {
                  event.preventDefault();
                  deleteMutation.mutate();
                }}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
