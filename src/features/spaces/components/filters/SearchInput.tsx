import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useSearch } from "../../hooks/useSearch";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export const SearchInput = ({
  wrapperClassName,
  className,
  placeholder,
  ...props
}: SearchInputProps) => {
  const [search, setSearch] = useSearch();
  return (
    <div className={cn("relative", wrapperClassName)}>
      <Search className="absolute left-2 top-1.5 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        className={cn("pl-8", className)}
        placeholder={placeholder ?? "Search spaces..."}
        aria-label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        {...props}
      />
    </div>
  );
};
