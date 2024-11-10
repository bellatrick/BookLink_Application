import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const server_url = process.env.REACT_APP_SERVER_URL 

export const useCollections = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [collectionLoading, setCollectionLoading] = useState(false)
  const [error, setError] = useState(null);
  const [collections, setCollections] = useState([]);

  const getHeaders = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: 'read:current_user'
      }
    });
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const headers = await getHeaders();
      const response = await fetch(`${server_url}/api/collections`, {
        headers
      });
      if (!response.ok) throw new Error('Failed to fetch collections');
      const data = await response.json();
      setCollections(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (collectionData) => {
    setCollectionLoading(true)
    try {
      const headers = await getHeaders();
      const response = await fetch(`${server_url}/api/collections`, {
        method: 'POST',
        headers,
        body: JSON.stringify(collectionData)
      });
      if (!response.ok) throw new Error('Failed to create collection');
      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    }finally {
      setCollectionLoading(false);
    }
  };

  const addBookmarkToCollection = async (bookmarkId, collectionId) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${server_url}/api/collections/${collectionId}/bookmarks/${bookmarkId}`,
        {
          method: 'POST',
          headers
        }
      );
      if (!response.ok) throw new Error('Failed to add bookmark to collection');
      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    loading,
    error,
    fetchCollections,
    createCollection,
    addBookmarkToCollection,
    collections,
    collectionLoading
  };
};
