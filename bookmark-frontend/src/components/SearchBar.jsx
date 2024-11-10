import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = { query };
    if (dateFrom) {
      searchParams.dateFrom = dateFrom;
    }
    if (dateTo) {
      searchParams.dateTo = dateTo;
    }
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSearch} className='space-y-4'>
      <div className='flex flex-wrap gap-4'>
        <div className='flex-1'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search bookmarks...'
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='flex gap-4'>
        <input
          type='date'
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className='p-2 border rounded'
        />
        <input
          type='date'
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className='p-2 border rounded'
        />
      </div>
        <button type='submit' className='px-4 py-2 moving-gradient-btn'>
          <Search size={20} />
        </button>
      </div>


    </form>
  );
};

export default SearchBar;
