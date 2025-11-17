import * as React from "react"
import { cn } from "@/lib/utils"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "min-w-0 shrink-0 grow-0 basis-full md:basis-[calc(100%-4rem)] lg:basis-[calc(100%-6rem)] h-full",
      className
    )}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

export { CarouselItem }

