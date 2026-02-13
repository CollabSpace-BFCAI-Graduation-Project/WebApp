"use client";
import { UserPlus, UserRoundCheck } from "lucide-react";
import { useState } from "react";

interface InviteFriendButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  friendEmail: string;
  setFriendEmail: (email: string) => void;
}

const InviteFriendButton = ({
  friendEmail,
  setFriendEmail,
  ...props
}: InviteFriendButtonProps) => {
  const [isInvited, setIsInvited] = useState(false);

  const handleInvite = () => {
    try {
      console.log(friendEmail);
      setIsInvited(true);
      setFriendEmail("");
      setTimeout(() => setIsInvited(false), 2000);
    } catch (err) {
      console.error("Failed to invite friend: ", err);
    }
  };

  return (
    <button
      onClick={handleInvite}
      className="text-muted-foreground cursor-pointer"
      {...props}
    >
      {isInvited ? (
        <UserRoundCheck className="w-5! h-5! text-green-500" />
      ) : (
        <UserPlus className="w-5! h-5!" />
      )}
    </button>
  );
};

export default InviteFriendButton;
