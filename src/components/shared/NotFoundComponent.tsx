import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function NotFoundComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-extrabold">404 - Page Not Found</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        Go back to home
      </Link>
    </div>
  );
}
