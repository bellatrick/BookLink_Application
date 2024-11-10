import React from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import BookmarkCard from './BookmarkCard';

const BookmarkList = ({ bookmarks }) => {
  const { shareBookmark } = useBookmarks();

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map(bookmark => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onShare={shareBookmark}
        />
      ))}
    </div>
  );
};

export default BookmarkList;