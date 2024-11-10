import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import BookmarkList from '../components/BookmarkList';
import { useBookmarks } from '../hooks/useBookmarks';
import Spinner from '../components/Spinner';

const Search = () => {
  const { searchBookmarks, loading, error } = useBookmarks();
  const [results, setResults] = useState([]);

  const handleSearch = async (searchParams) => {
    const searchResults = await searchBookmarks(searchParams);
    setResults(searchResults);
  };

  return (
    <div className="space-y-6 text-gray-500">
      <h1 className="text-2xl  font-bold">Search Bookmarks</h1>
      <SearchBar onSearch={handleSearch} />

      {loading && <Spinner/>}
      {error && <div>Error: {error.message}</div>}

      {results.length > 0 ? (
        <BookmarkList bookmarks={results} />
      ) : (
        <div className="text-center text-gray-600 py-8">
          No bookmarks found matching your search criteria
        </div>
      )}
    </div>
  );
};

export default Search;
