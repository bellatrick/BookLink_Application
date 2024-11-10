import React, { useEffect, useState } from 'react';import { Share2, Trash2, FolderPlus } from 'lucide-react';
import { useCollections } from '../hooks/useCollections';
import { Link } from 'react-router-dom';

const BookmarkCard = ({ bookmark, onShare, onDelete }) => {
  const [showCollections, setShowCollections] = useState(false);
  const { collections, addBookmarkToCollection, fetchCollections, loading } =
    useCollections();
  const [shareUrl, setShareUrl] = useState('');

  const handleShare = async () => {
    const token = await onShare(bookmark.id);
    setShareUrl(`${window.location.origin}/shared/${token}`);
  };
  const handleFetchCollections = async () => {
    await fetchCollections();
  };
  console.log(collections);
  useEffect(() => {
    showCollections && handleFetchCollections();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCollections]);
  return (
    <div className='p-4 w-[300px] md:w-auto bg-gray-800 text-white rounded-lg gradient-border relative'>
      <div className='flex justify-between items-start'>
        <div className='max-w-[20ch] py-6'>
          <h3 className='font-medium truncate'>{bookmark.title}</h3>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => setShowCollections(!showCollections)}
            className='p-1 hover:scale-[1.2] rounded'
          >
            <FolderPlus size={16} />
          </button>
          <button
            onClick={handleShare}
            className='p-1 hover:scale-[1.2] rounded'
          >
            <Share2 size={16} />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(bookmark.id)}
              className='p-1 hover:scale-50 rounded'
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <a
        href={bookmark.url}
        target='_blank'
        rel='noopener noreferrer'
        className='text-sm text-white hover:underline'
      >
        Visit
      </a>

      <div className='max-w-sm'>
        <p className='mt-2 text-sm text-gray-100 truncate'>
          {bookmark.description}
        </p>
      </div>

      <div className='mt-2 flex flex-wrap text-gray-800 gap-1'>
        {bookmark.tags.length > 0
          ? bookmark?.tags.map((tag) => (
              <span key={tag} className='px-2 py-1 text-xs bg-gray-100 rounded'>
                {tag}
              </span>
            ))
          : ''}
      </div>

      {shareUrl && (
        <div className='mt-2 p-2 text-white rounded'>
          <p className='text-sm'>Share URL:</p>
          <input
            type='text'
            value={shareUrl}
            readOnly
            className='w-full text-gray-800 text-sm p-1 border rounded'
            onClick={(e) => e.target.select()}
          />
        </div>
      )}

      {showCollections && (
        <div className='mt-2 p-2 rounded text-white'>
          <p className='text-sm font-medium mb-2'>Add to collection:</p>
          <div className='space-y-1'>
            {loading ? (
              <div>Loading...</div>
            ) : collections.length < 1 ? (
              <div>
                <p>No collection found</p>
                <Link to='/collections' className='text-xs'>
                  Create a new collection to add to
                </Link>
              </div>
            ) : (
              collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => {
                    addBookmarkToCollection(bookmark.id, collection.collection_id);
                    setShowCollections(false);
                  }}
                  className='w-full text-left p-1 text-sm hover:bg-gray-700 rounded'
                >
                  {collection.collection_name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkCard;
