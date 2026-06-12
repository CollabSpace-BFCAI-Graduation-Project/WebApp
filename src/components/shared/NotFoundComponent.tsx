"use client";

import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { fadeInUp } from "@/lib/animations";

export const NotFoundComponent = () => {
  return (
    <div className="flex w-full items-center justify-center overflow-hidden">
      <motion.div
        className="flex h-screen items-center border-x"
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
      >
        <div>
          <Separator />
          <Empty>
            <EmptyHeader>
              <EmptyTitle className="font-black font-mono text-8xl">
                404
              </EmptyTitle>
              <EmptyDescription className="text-nowrap">
                The page you&apos;re looking for might have been <br />
                moved or doesn&apos;t exist.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link href="/" className={buttonVariants({ className: "w-1/2 mx-auto" })}>
                <HomeIcon data-icon="inline-start" />
                Go Home
              </Link>
            </EmptyContent>
          </Empty>
          <Separator />
        </div>
      </motion.div>
    </div>
  );
};
