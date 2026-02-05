import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VariantProps } from "class-variance-authority";
import React, { HTMLAttributes } from "react";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

interface TooltippedButtonProps extends HTMLAttributes<HTMLElement> {
  tooltip: string;
  variant?: ButtonVariant;
  hideTooltipBreakpoint?: "sm" | "md" | "lg" | "xl" | "none";
  children: React.ReactNode;
  noButton?: boolean;
}

export function TooltippedButton({
  tooltip,
  variant = "default",
  hideTooltipBreakpoint = "none",
  noButton = false,
  children,
  ...props
}: TooltippedButtonProps) {
  const breakpointClass = {
    sm: "sm:hidden",
    md: "md:hidden",
    lg: "lg:hidden",
    xl: "xl:hidden",
    none: "",
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {noButton ? (
          <div className="group flex items-center justify-center" {...props}>
            {children}
          </div>
        ) : (
          <Button variant={variant} className="group" {...props}>
            {children}
          </Button>
        )}
      </TooltipTrigger>

      <TooltipContent className={breakpointClass[hideTooltipBreakpoint]}>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
