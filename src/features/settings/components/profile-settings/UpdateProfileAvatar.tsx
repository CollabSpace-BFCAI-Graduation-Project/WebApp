import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

const UpdateProfileAvatar = () => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-14 h-14 self-start cursor-pointer group">
        <button
          className="absolute inset-0 bg-black/50
             opacity-0 group-hover:opacity-100
             transition-all duration-200 cursor-pointer flex items-center justify-center"
          onClick={() => avatarInputRef.current?.click()}
        >
          <Camera className="w-5 h-5 text-white" />
        </button>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Field className="flex flex-row gap-2">
        <Input type="file" hidden ref={avatarInputRef} />
        <div className="flex flex-col gap-2 items-start">
          <Button
            variant="outline"
            className="w-fit cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            Change Avatar
          </Button>
          <FieldDescription className="text-nowrap text-xs text-muted-foreground">
            JPG, PNG, WebP, GIF. Max 2MB
          </FieldDescription>
        </div>
      </Field>
    </div>
  );
};

export default UpdateProfileAvatar;
