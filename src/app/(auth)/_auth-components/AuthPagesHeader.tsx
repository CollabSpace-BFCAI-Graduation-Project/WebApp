import { AnimatedLogo } from "@/app/(auth)/_auth-components/AuthPagesLogo";

export const AuthPagesHeader = () => {
  return (
    <div className="flex flex-col items-center">
      <AnimatedLogo />
      <h1 className="font-extrabold text-2xl">CollabSpace</h1>
    </div>
  );
};
