import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TopicDetail: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  const [topic, setTopic] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/topics/${title}`);
        setTopic(response.data);
      } catch (err) {
        console.error('Error fetching topic details:', err);
      }
    };

    if (title) {
      fetchTopic();
    }
  }, [title]);

  return (
    <div className="topic-detail">
      {topic ? (
        <>
          <h1>{topic.title}</h1>
          <p>{topic.description}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TopicDetail;
