"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components: userComponents,
  ...props
}: CalendarProps) {
  const defaultClassNames = {
    months: "relative flex flex-col sm:flex-row gap-4",
    month: "w-full",
    month_caption: "relative mx-12 mb-3 flex h-12 items-center justify-center z-20",
    caption_label: "text-base font-serif font-bold text-neutral-900",
    nav: "absolute top-0 flex w-full justify-between z-10",
    button_previous:
      "inline-flex items-center justify-center size-12 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors",
    button_next:
      "inline-flex items-center justify-center size-12 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors",
    weekday: "size-12 p-0 text-xs font-sans font-semibold text-neutral-400 uppercase",
    day_button:
      "relative flex size-12 items-center justify-center whitespace-nowrap rounded-full p-0 text-neutral-700 font-sans text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none hover:bg-neutral-100 hover:text-neutral-900 group-data-[selected]:bg-neutral-900 group-data-[selected]:text-white group-data-[selected]:hover:bg-neutral-800 group-data-[disabled]:pointer-events-none group-data-[disabled]:cursor-default group-data-[disabled]:text-neutral-300 group-data-[disabled]:line-through group-data-[outside]:text-neutral-300 group-data-[outside]:group-data-[selected]:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-400",
    day: "group size-12 px-0 text-sm",
    range_start: "range-start",
    range_end: "range-end",
    range_middle: "range-middle",
    today:
      "*:after:pointer-events-none *:after:absolute *:after:bottom-1.5 *:after:start-1/2 *:after:z-10 *:after:size-1 *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-neutral-900 [&[data-selected]:not(.range-middle)>*]:after:bg-white [&[data-disabled]>*]:after:bg-neutral-300 *:after:transition-colors",
    outside: "text-neutral-300",
    hidden: "invisible",
    week_number: "size-10 p-0 text-xs font-medium text-neutral-400",
  };

  const mergedClassNames: typeof defaultClassNames = Object.keys(defaultClassNames).reduce(
    (acc, key) => ({
      ...acc,
      [key]: classNames?.[key as keyof typeof classNames]
        ? cn(
            defaultClassNames[key as keyof typeof defaultClassNames],
            classNames[key as keyof typeof classNames],
          )
        : defaultClassNames[key as keyof typeof defaultClassNames],
    }),
    {} as typeof defaultClassNames,
  );

  const defaultComponents = {
    Chevron: (props: any) => {
      if (props.orientation === "left") {
        return <ChevronLeft size={18} strokeWidth={2} {...props} aria-hidden="true" />;
      }
      return <ChevronRight size={18} strokeWidth={2} {...props} aria-hidden="true" />;
    },
  };

  const mergedComponents = {
    ...defaultComponents,
    ...userComponents,
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-fit", className)}
      classNames={mergedClassNames}
      components={mergedComponents}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
