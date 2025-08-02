import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AdminDashboard.css';
import { v4 as uuidv4 } from 'uuid';

interface Topic {
  id: number;
  title: string;
  summary: string;
  content: string;
}

const AdminDashboard: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const { token } = useAuth();

  const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `${token}`;
      }
      config.headers['x-correlation-id'] = uuidv4(); // for tracing
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get('/topics');
        setTopics(response.data);
      } catch (err) {
        console.error('Error fetching topics:', err);
      }
    };

    if (token) fetchTopics();
  }, [token]);

  const handleAddTopic = async () => {
    try {
      const newTopic = { title: newTitle, summary: newSummary, content: newContent };
      const response = await axiosInstance.post('/topics', newTopic);
      setTopics([...topics, response.data]);
      setNewTitle('');
      setNewSummary('');
      setNewContent('');
    } catch (err) {
      console.error('Error adding topic:', err);
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setEditedContent(topic.content);
    setIsEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedTopic) return;

    try {
      const updatedTopic = {
        ...selectedTopic,
        content: editedContent,
      };

      await axiosInstance.put(`/topics/${selectedTopic.id}`, updatedTopic);

      setTopics(
        topics.map((topic) =>
          topic.id === selectedTopic.id ? { ...topic, content: editedContent } : topic
        )
      );

      setIsEditMode(false);
      setSelectedTopic(null);
    } catch (err) {
      console.error('Error saving edited topic:', err);
    }
  };

  const handleDeleteTopic = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await axiosInstance.delete(`/topics/${id}`);
        setTopics(topics.filter((topic) => topic.id !== id));
      } catch (err) {
        console.error('Error deleting topic:', err);
      }
    }
  };

  const handleViewTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsEditMode(false);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Display Topics */}
      <h2 className="section-title">Existing Topics</h2>

      <div className="tile-grid">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="tile-card"
            onClick={() => handleViewTopic(topic)}
          >
            <div className="tile-content">
              <h3 className="tile-title">{topic.title}</h3>
              <div className="tile-summary" dangerouslySetInnerHTML={{ __html: topic.summary }} />
            </div>

            <div className="tile-actions">
              <button
                className="action-button edit"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditTopic(topic);
                }}
              >
                Edit
              </button>
              <button
                className="action-button delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTopic(topic.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Topic Section */}
      <div className="add-topic-section">
        <h3>Add New Topic</h3>

        <input
          type="text"
          placeholder="Topic Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <h4>Short Summary</h4>
        <ReactQuill
          theme="snow"
          value={newSummary}
          onChange={setNewSummary}
          placeholder="Write short summary here..."
          className="quill-editor"
        />

        <h4>Full Content</h4>
        <ReactQuill
          theme="snow"
          value={newContent}
          onChange={setNewContent}
          placeholder="Write full content here..."
          className="quill-editor"
        />

        <button onClick={handleAddTopic} className="add-topic-button">Add Topic</button>
      </div>

      {/* Modal Popup */}
      {selectedTopic && (
        <div className="modal-overlay" onClick={() => setSelectedTopic(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedTopic(null)}>
              &times;
            </button>

            <h2>{isEditMode ? "Edit Topic" : selectedTopic.title}</h2>

            {isEditMode ? (
              <>
                <ReactQuill
                  value={editedContent}
                  onChange={setEditedContent}
                  style={{ height: '300px', marginBottom: '20px' }}
                />
                <button onClick={handleSaveEdit} className="save-button">Save</button>
              </>
            ) : (
              <>
                <div dangerouslySetInnerHTML={{ __html: selectedTopic.summary }} />
                <hr />
                <div dangerouslySetInnerHTML={{ __html: selectedTopic.content }} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
