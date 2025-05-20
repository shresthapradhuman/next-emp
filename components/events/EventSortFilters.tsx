"use client";
import React from "react";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
const EventsSortFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortValue, setSortValue] = React.useState(searchParams.get("sort") || "");
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) {
      params.set("sort", sortValue);
    } else {
      params.delete("sort");
    }
    router.push(`/events?${params.toString()}`);
  }, [sortValue, router, searchParams]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <FilterIcon className="h-4 w-4" />
          <span className="sr-only">Sort events</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortValue} onValueChange={setSortValue}>
          <DropdownMenuRadioItem value="date-asc">Date (Upcoming)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date-desc">Date (Past)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-asc">Price (Low to High)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-desc">Price (High to Low)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventsSortFilters;