import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const server_url= process.env.REACT_APP_SERVER_URL

export const useBookmarks = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  const getHeaders = async () => {

    const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:current_user",
        },
      });
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const headers = await getHeaders();
      const response = await fetch(`${server_url}/api/bookmarks`, { headers });
      if (!response.ok) throw new Error('Failed to fetch bookmarks');

      const data = await response.json();
      console.log(response, data);
      setBookmarks(data);

      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const addBookmark = async (bookmarkData) => {
    setBookmarkLoading(true)
    try {
      const headers = await getHeaders();
      const response = await fetch(`${server_url}/api/bookmarks/with-tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookmarkData)
      });
      if (!response.ok) throw new Error('Failed to add bookmark');
      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    } finally{
        setBookmarkLoading(false)
    }
  };

  const searchBookmarks = async (searchParams) => {
    setLoading(true);
    try {
      const headers = await getHeaders();
      const queryParams = new URLSearchParams(searchParams);
      const response = await fetch(
        `${server_url}/api/bookmarks/advanced-search?${queryParams}`,
        { headers }
      );
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const shareBookmark = async (bookmarkId) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${server_url}/api/bookmarks/${bookmarkId}/share`, {
        method: 'POST',
        headers
      });
      if (!response.ok) throw new Error('Failed to share bookmark');
      const data = await response.json();
      return data.shareToken;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const getSharedBookmark = async (shareToken) => {
    try {
      const response = await fetch(`${server_url}/api/shared/${shareToken}`);
      if (!response.ok) throw new Error('Failed to get shared bookmark');
      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const getSuggestedTags = async (url) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${server_url}/api/bookmarks/suggest-tags?url=${encodeURIComponent(url)}`,
        {
          headers
        }
      );
      if (!response.ok) throw new Error('Failed to get tag suggestions');
      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    loading,
    error,
    fetchBookmarks,
    addBookmark,
    searchBookmarks,
    shareBookmark,
    getSharedBookmark,
    getSuggestedTags,
    bookmarks,
    bookmarkLoading
  };
};
