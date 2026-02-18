import { Check, X } from "lucide-react";
import { useEffect, useRef, ChangeEvent } from "react";

interface NewChannelInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hidden: boolean;
  reset: () => void;
  AddToChannels: (channel: string) => void;
}

export const NewChannelInput = ({
  value,
  onChange,
  hidden,
  reset,
  AddToChannels,
}: NewChannelInputProps) => {
  const newChannelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hidden) {
      newChannelInputRef.current?.focus();
    }
  }, [hidden]);
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border-primary border">
      <div className="flex gap-2 items-center">
        <span className="">#</span>
        <input
          ref={newChannelInputRef}
          value={value}
          onChange={onChange}
          placeholder="channel-name"
          className="border-none outline-0 placeholder:text-secondary!  selection:bg-secondary"
        />
      </div>
      <div className="flex items-center gap-2">
        <Check
          className="size-5 text-green-500 hover:text-green-400 rounded p-0.5 transition duration-300 cursor-pointer"
          onClick={() => {
            if (value.trim().length) {
              AddToChannels(value);
              reset();
            }
          }}
        />
        <X
          className="size-5 text-destructive hover:text-destructive/60 rounded p-0.5 transition duration-300 cursor-pointer"
          onClick={() => {
            reset();
          }}
        />
      </div>
    </div>
  );
};
