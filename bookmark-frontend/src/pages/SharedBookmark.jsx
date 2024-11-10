import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBookmarks } from '../hooks/useBookmarks';
import Spinner from '../components/Spinner';

const SharedBookmark = () => {
  const { shareToken } = useParams();
  const { getSharedBookmark } = useBookmarks();
  const [bookmark, setBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedBookmark = async () => {
      try {
        const data = await getSharedBookmark(shareToken);
        setBookmark(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedBookmark();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareToken]);

  if (loading) return <Spinner/>;
  if (error) return <div>Error: {error}</div>;
  if (!bookmark) return <div>Bookmark not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{bookmark.title}</h1>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {bookmark.url}
        </a>
        <p className="mt-4 text-gray-600">{bookmark.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {bookmark.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-sm bg-gray-100 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharedBookmark;