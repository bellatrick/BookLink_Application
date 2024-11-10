import React, { useEffect, useState } from 'react';
import { useCollections } from '../hooks/useCollections';
import BookmarkList from '../components/BookmarkList';
import { useAuth0 } from '@auth0/auth0-react';
import Spinner from '../components/Spinner';

const Collections = () => {
  const {
    collections,
    createCollection,
    loading,
    error,
    fetchCollections,
    collectionLoading
  } = useCollections();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const { isAuthenticated, isLoading } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCollection({ name, description });
    setShowForm(false);
    fetchCollections();
    setName('');
    setDescription('');
  };
  console.log(selectedCollection?.bookmarks);
  useEffect(() => {
    isAuthenticated && fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (loading || isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='space-y-6 flex-1 '>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl text-white font-bold'>Collections</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='px-4 py-2 moving-gradient-btn'
        >
          {showForm ? 'Close' : 'New Collection'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className='p-4 w-1/2 mx-auto bg-white rounded-lg shadow space-y-4'
        >
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Collection name'
            className='w-full p-2 border rounded'
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description'
            className='w-full p-2 border rounded'
          />
          <button
            type='submit'
            className='w-full p-2 justify-center items-center flex gap-2 moving-gradient-btn'
          >
            <p className='text-center'>Create Collection</p>{' '}
            {collectionLoading && (
              <p className='text-lg font-bold animate-pulse'>
                ...
              </p>
            )}
          </button>
        </form>
      )}

      <div className='grid text-white gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {collections.map((collection) => (
          <div
            key={collection.id}
            className='p-4 gradient-border bg-gray-800 rounded-lg shadow cursor-pointer'
            onClick={() => setSelectedCollection(collection)}
          >
            <h3 className='font-medium'>{collection.collection_name}</h3>
            <p className='text-sm text-gray-100'>
              {collection.collection_description}
            </p>
          </div>
        ))}
      </div>

      {selectedCollection && selectedCollection.bookmarks.length > 0 ? (
        <div className='mt-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold'>{selectedCollection.name}</h2>
            <button
              onClick={() => setSelectedCollection(null)}
              className='text-sm text-gray-600 hover:text-gray-800'
            >
              Close
            </button>
          </div>
          <BookmarkList
            bookmarks={
              selectedCollection?.bookmarks ? selectedCollection.bookmarks : []
            }
          />
        </div>
      ) : (
        <div className='text-white'>No Bookmarks </div>
      )}
    </div>
  );
};

export default Collections;
