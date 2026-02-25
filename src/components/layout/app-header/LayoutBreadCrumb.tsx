"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useBreadcrumb } from "@/context/Breadcrumb";
import Link from "next/link";
import { Fragment } from "react";

export const LayoutBreadCrumb = () => {
  const { items } = useBreadcrumb();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const key = item.href ?? item.label;
          const isLast = index === items.length - 1;

          return (
            <Fragment key={key}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild className="flex items-center gap-1.5">
                    <Link href={item.href}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
