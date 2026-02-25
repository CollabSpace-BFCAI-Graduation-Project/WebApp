import { BreadcrumbItem, useBreadcrumb } from "@/context/Breadcrumb";
import { useEffect } from "react";

export const useSetBreadcrumb = (items: BreadcrumbItem[]) => {
  const { setItems } = useBreadcrumb();

  useEffect(() => {
    setItems(items);
  }, [items, setItems]);
};
