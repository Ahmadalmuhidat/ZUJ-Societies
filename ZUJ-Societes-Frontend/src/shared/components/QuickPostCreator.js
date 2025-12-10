import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import AxiosClient from '../../config/axios';
import { toast } from 'react-toastify';

export default function QuickPostCreator({ onPostCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [selectedSociety, setSelectedSociety] = useState('');
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const textareaRef = useRef(null);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      fetchUserSocieties();

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const fetchUserSocieties = async () => {
    try {
      const response = await AxiosClient.get('/user/societies');
      if (response.status === 200) {
        const unique = Array.from(
          new Map(response.data.data.map(s => [s.ID, s])).values()
        );

        setSocieties(unique);

        if (response.data.data.length > 0) {
          setSelectedSociety(response.data.data[0].ID);
        }
      }
    } catch (error) {
      console.error('Failed to fetch societies:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedSociety) return;

    setLoading(true);
    try {
      const response = await AxiosClient.post('/posts', {
        content: content.trim(),
        image: image.trim() || '',
        society_id: selectedSociety,
      });

      if (response.status === 201) {
        toast.success('Post created successfully!');
        setContent('');
        setImage('');
        setIsOpen(false);
        if (onPostCreated) {
          onPostCreated();
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePreview = () => {
    if (image.trim()) {
      return (
        <div className="mt-3 relative">
          <img
            src={image}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={() => setImage('')}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      );
    }
    return null;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">Create a Post</h3>
          <p className="text-sm text-gray-600">Share something with your communities</p>
        </div>
      </div>

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>What's on your mind, {user?.Name}?</span>
          </div>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Society
            </label>
            <select
              value={selectedSociety}
              onChange={(e) => setSelectedSociety(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              {societies.map((society) => (
                <option key={society.ID} value={society.ID}>
                  {society.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's on your mind?
            </label>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts with the community..."
              className="w-full px-3 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {handleImagePreview()}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setContent('');
                setImage('');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-6 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
