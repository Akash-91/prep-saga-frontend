// src/services/topicService.ts
const API_BASE_URL = 'http://localhost:8082/api/topics';

export const fetchTopicByTitle = async (title: string) => {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(title)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch topic');
  }
  return response.json();
};
