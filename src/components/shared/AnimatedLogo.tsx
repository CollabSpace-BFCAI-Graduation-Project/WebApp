import { cn } from "@/lib/utils";
import { SparklesIcon } from "../ui/sparkles";

export const AnimatedLogo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        `inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-3 transition-transform duration-300 hover:rotate-12`,
        className,
      )}
    >
      <SparklesIcon />
    </div>
  );
};
