import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './UserDashboard.css';

interface Topic {
  id: number;
  title: string;
  summary: string;
  content: string;
}

const Dashboard: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const { token } = useAuth();

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8082/api',
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const localToken = localStorage.getItem('token');
      if (localToken) {
        config.headers['Authorization'] = `${localToken}`;
      }
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

  const handleTileClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleCloseModal = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="user-dashboard-container">
      <h2 className="dashboard-title">Topics To Learn</h2>

      <div className="tile-grid">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="tile-card"
            onClick={() => handleTileClick(topic)}
          >
            <div className="tile-content">
              <h3 className="tile-title">{topic.title}</h3>
              <p className="tile-summary">
                {topic.summary ? topic.summary.substring(0, 100) + '...' : 'No summary available.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTopic && (
        <div className="modal-overlay" onClick={() => setSelectedTopic(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedTopic(null)}>×</button>
            <h2>{selectedTopic.title}</h2>
            <h4>{selectedTopic.summary}</h4>

            {/* THIS is the important change */}
            <div
              className="topic-content"
              dangerouslySetInnerHTML={{ __html: selectedTopic.content }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
