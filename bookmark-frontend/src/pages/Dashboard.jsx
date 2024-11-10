import React, { useState, useEffect } from 'react';
import BookmarkForm from '../components/BookmarkForm';
import BookmarkList from '../components/BookmarkList';
import { useBookmarks } from '../hooks/useBookmarks';

import { useAuth0 } from '@auth0/auth0-react';
import Spinner from '../components/Spinner';

const Dashboard = () => {
  const { bookmarks, loading, error, fetchBookmarks } = useBookmarks();
  const [showForm, setShowForm] = useState(false);
  const {  isAuthenticated } = useAuth0();


  useEffect(() => {
    isAuthenticated && fetchBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (loading ) return <Spinner/>;
  if (error) return <div>Error: {error.message}</div>;

    return (
      <div className='space-y-6 text-white'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl text-white font-bold'>My Bookmarks</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className='px-4 py-2 moving-gradient-btn'
          >
            {showForm ? 'Close' : 'Add Bookmark'}
          </button>
        </div>

        {showForm && (
          <div className=''>
            <BookmarkForm
              onSuccess={() => {
                setShowForm(false);
                fetchBookmarks();
              }}
            />
          </div>
        )}

        <BookmarkList bookmarks={bookmarks.reverse()} />
      </div>
    );

};

export default Dashboard;
