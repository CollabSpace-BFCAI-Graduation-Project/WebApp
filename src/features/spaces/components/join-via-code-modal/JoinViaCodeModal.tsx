"use client";
import { TooltippedButton } from "@/components/shared/tooltippedButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkIcon } from "@/components/ui/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function JoinViaCodeModal() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltippedButton
          tooltip="Join via Code"
          variant="outline"
          hideTooltipBreakpoint="sm"
          onClick={() => setOpen(true)}
        >
          <LinkIcon className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline-block">Join via Code</span>
        </TooltippedButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="space-y-5">
          <div className="w-full flex items-center justify-center">
            <LinkIcon className="w-8 h-8 text-primary hover:text-primary/80 transition-all duration-300" />
          </div>
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-center">Join a Space</DialogTitle>
            <DialogDescription className="text-center">
              Enter an invite code or link below to join an existing space.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Invite Code
            </Label>
            <Input
              id="link"
              placeholder="collabspace.app/invite/AbCdEf"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="w-full group cursor-pointer"
            disabled={!code.trim()}
            onClick={() => {
              console.log(code);
              setOpen(false);
            }}
          >
            Find Space
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
