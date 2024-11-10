import React, { useState } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';

const BookmarkForm = ({ onSuccess }) => {
  const [url, setUrl] = useState('');
  const { addBookmark, fetchBookmarks, bookmarkLoading } =
    useBookmarks();

  const handleUrlChange = async (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addBookmark({
      url
    });
    await fetchBookmarks();
    setUrl('');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className='w-1/2 bg-white mx-auto space-y-4 p-4 rounded-lg shadow'>
      <div>
        <input
          type='url'
          value={url}
          onChange={handleUrlChange}
          placeholder='Enter URL'
          className='w-full text-gray-800 p-2 border rounded'
          required
        />
      </div>


      <button
        type='submit'
        className='w-full flex gap-2 justify-center items-center p-2 moving-gradient-btn'
      >
        <p className='text-center'>Add Bookmark</p>{' '}
        {bookmarkLoading && (
          <p className='text-lg font-bold animate-pulse'>...</p>
        )}
      </button>
    </form>
  );
};

export default BookmarkForm;
