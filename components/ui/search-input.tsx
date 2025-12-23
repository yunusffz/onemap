import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  containerClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
          style={{ color: '#808080' }}
        />
        <input
          type="text"
          className={cn(
            "flex h-10 w-full rounded-none border-0 border-b px-3 pl-10 py-2 text-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "focus-visible:outline-none focus-visible:border-b-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder-[#B2B2B2]",
            className
          )}
          style={{
            backgroundColor: '#F7F7F7',
            borderBottomColor: '#A3A3A3',
            borderBottomWidth: '1px',
          }}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
