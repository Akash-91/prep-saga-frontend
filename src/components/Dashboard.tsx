import React from 'react';
import './Dashboard.css';

const topics = [
  { title: 'DSA', description: 'Data Structures & Algorithms' },
  { title: 'System Design', description: 'Scalable Architecture Design' },
  { title: 'Java', description: 'OOP, Streams, Multithreading' },
  { title: 'Spring Boot', description: 'REST APIs, Microservices' },
  { title: 'React', description: 'Components, Hooks, Routing' },
  { title: 'SQL', description: 'Joins, Normalization, Queries' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Choose a Topic to Get Started</h2>
      <div className="tile-grid">
        {topics.map((topic, index) => (
          <div key={index} className="tile-card">
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
