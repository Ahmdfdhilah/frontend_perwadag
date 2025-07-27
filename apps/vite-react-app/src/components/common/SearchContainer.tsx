import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchContainerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
}

const SearchContainer: React.FC<SearchContainerProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = "Cari...",
  className,
  debounceDelay = 400
}) => {
  const [internalValue, setInternalValue] = useState(searchQuery);
  const debouncedValue = useDebounce(internalValue, debounceDelay);

  // Sync internal value with external searchQuery when it changes externally
  useEffect(() => {
    setInternalValue(searchQuery);
  }, [searchQuery]);

  // Call onSearchChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== searchQuery) {
      onSearchChange(debouncedValue);
    }
  }, [debouncedValue, onSearchChange, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={internalValue}
        onChange={handleInputChange}
        className="pl-9"
      />
    </div>
  );
};

export default SearchContainer;