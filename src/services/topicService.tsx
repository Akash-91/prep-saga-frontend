// src/services/topicService.ts
const API_BASE_URL = '${process.env.REACT_APP_BACKEND_URL}/api/topics';

export const fetchTopicByTitle = async (title: string) => {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(title)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch topic');
  }
  return response.json();
};
