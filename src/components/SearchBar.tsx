'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center gap-2 my-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a Pokémon..."
        className="px-4 py-2 border rounded-full w-full max-w-md text-black bg-white shadow-sm focus:ring-red-500 focus:border-red-500"
      />
      <button
        type="submit"
        className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-colors shadow-sm"
      >
        Search
      </button>
    </form>
  );
};