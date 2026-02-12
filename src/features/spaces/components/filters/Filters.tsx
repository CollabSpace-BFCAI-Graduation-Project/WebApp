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
    <div className="border border-double p-2 rounded-xl flex flex-col xl:flex-row gap-4">
      <FilterTabs className="w-full sm:w-2/3 m-auto xl:m-0 xl:w-auto xl:mr-auto" />
      <div className="flex gap-4 flex-col xl:flex-row flex-wrap xl:w-auto xl:flex-nowrap w-full sm:w-2/3 m-auto xl:m-0">
        <CategorySelect />
        <StatusSelect />
        <SortSelect />
        <SearchInput wrapperClassName="w-full lg:min-w-[200px]" />
      </div>
      <LayoutTabs
        layout={layout}
        setLayout={setLayout}
        className="w-full items-center xl:m-0 xl:w-auto"
      />
    </div>
  );
};
