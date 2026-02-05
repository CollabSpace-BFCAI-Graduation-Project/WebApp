"use client";

import { CategorySelect } from "./CategorySelect";
import { StatusSelect } from "./StatusSelect";
import { SortSelect } from "./SortSelect";
import { LayoutTabs } from "./LayoutTabs";
import { SearchInput } from "./SearchInput";
import { useState } from "react";
import { SpacesLayout } from "@/lib/types";
import { FilterTabs } from "./FilterTabs";

export const Filters = () => {
  const [layout, setLayout] = useState<SpacesLayout>("grid");
  return (
    <div className="border border-double p-2 rounded-lg flex flex-col lg:flex-row gap-4">
      <FilterTabs className="w-full sm:w-2/3 md:w-1/2 m-auto lg:m-0 lg:w-auto lg:mr-auto" />
      <div className="flex gap-4 flex-col lg:flex-row flex-wrap lg:w-auto lg:flex-nowrap w-full sm:w-2/3 md:w-1/2 m-auto lg:m-0">
        <CategorySelect />
        <StatusSelect />
        <SortSelect />
        <SearchInput />
      </div>
      <LayoutTabs
        layout={layout}
        setLayout={setLayout}
        className="w-full items-center lg:m-0 lg:w-auto"
      />
    </div>
  );
};
