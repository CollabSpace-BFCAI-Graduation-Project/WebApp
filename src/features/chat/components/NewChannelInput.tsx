import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface NewChannelInputProps {
  onCreateChannel: (name: string) => void;
  onCancel: () => void;
  className?: string;
}

export const NewChannelInput = ({
  onCreateChannel,
  onCancel,
  className,
}: NewChannelInputProps) => {
  const [value, setValue] = useState("");

  const newChannelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newChannelInputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onCreateChannel(value.trim());
    setValue("");
  };
  const handleReset = () => {
    onCancel();
    setValue("");
  };
  const handleNewChannelInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const input = e.currentTarget;

    if ("key" in e && e.key === "Enter" && input.value.trim().length) {
      handleSubmit();
      return;
    }

    setValue(input.value);
  };
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border-primary border",
        className,
      )}
    >
      <div className="flex gap-2 items-center">
        <span>#</span>
        <input
          ref={newChannelInputRef}
          value={value}
          onChange={handleNewChannelInputChange}
          onKeyDown={handleNewChannelInputChange}
          placeholder="channel-name"
          className="border-none outline-0 w-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <Check
          className="size-5 text-green-500 hover:text-green-400 rounded p-0.5 transition duration-300 cursor-pointer"
          onClick={handleSubmit}
        />
        <X
          className="size-5 text-destructive hover:text-destructive/60 rounded p-0.5 transition duration-300 cursor-pointer"
          onClick={handleReset}
        />
      </div>
    </div>
  );
};
