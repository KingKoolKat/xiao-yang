import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search hanzi, pinyin, or English"
}: SearchInputProps) {
  return (
    <label className="block border-4 border-garden-cocoa bg-garden-mist p-2 shadow-[4px_4px_0_#4A342A]">
      <span className="mb-2 block font-mono text-[10px] font-black uppercase text-garden-moss">
        Search
      </span>
      <span className="relative block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-garden-cocoa"
          aria-hidden="true"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full border-2 border-garden-cocoa bg-garden-ivory py-3 pl-11 pr-3 font-mono text-sm font-black text-garden-cocoa outline-none placeholder:text-garden-taupe focus:bg-garden-leaf"
        />
      </span>
    </label>
  );
}
