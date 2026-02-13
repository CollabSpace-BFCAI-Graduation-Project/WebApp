"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyToClipboardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
}

const CopyToClipboardButton = ({
  textToCopy,
  ...props
}: CopyToClipboardButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        console.error("Clipboard API not supported, using fallback.");
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button onClick={handleCopy} className="text-muted-foreground cursor-pointer" {...props}>
      {isCopied ? <Check className="w-4! h-4! text-green-500" /> : <Copy className="w-4! h-4!" />}
    </button>
  );
};

export default CopyToClipboardButton;
