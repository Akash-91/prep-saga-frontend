// src/components/TopicTile.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TopicTileProps {
  title: string;
}

const TopicTile: React.FC<TopicTileProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/topics/${title}`);
  };

  return (
    <div
      className="p-4 border rounded-xl shadow-md hover:shadow-lg cursor-pointer bg-white"
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold text-center">{title}</h3>
    </div>
  );
};

export default TopicTile;
