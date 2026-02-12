import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Dot, Users } from "lucide-react";

export const FindSpaceCard = () => {
  return (
    <div className="flex items-center justify-between border rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">test name</h3>
          <div className="flex flex-col gap-0.5 pl-0.5">
            <p className="text-muted-foreground text-sm">test description</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>2 members</span>
              </span>
              <Dot />
              <span className="flex items-center gap-1">By Mohamed</span>
            </div>
          </div>
        </div>
      </div>
      <Button className="group cursor-pointer">
        Request to Join
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
      </Button>
    </div>
  );
};
