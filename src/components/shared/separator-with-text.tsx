export const SeparatorWithText = ({ children }: { children: string }) => {
  return (
    <div className="flex items-center gap-2 my-4 w-full">
      <div className="w-full h-px bg-muted-foreground/20" />
      <span className="text-sm whitespace-nowrap text-muted-foreground">
        {children}
      </span>
      <div className="w-full h-px bg-muted-foreground/20" />
    </div>
  );
};
