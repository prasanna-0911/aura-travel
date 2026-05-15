const axios = require('axios');

const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:8501';

class RagService {
  constructor() {
    this.client = axios.create({
      baseURL: RAG_API_URL,
      timeout: 60000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async generateItinerary(query, options = {}) {
    const { city, days = 3, budget = 'medium', travelers = 2 } = options;

    try {
      const response = await this.client.post('/generate', {
        query,
        city: city || query.match(/in ([A-Za-z]+)/)?.[1] || 'Unknown',
        days,
        budget,
        travelers
      });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('RAG service unavailable. Please ensure the RAG server is running.');
      }
      if (error.response) {
        throw new Error(error.response.data?.message || 'RAG generation failed');
      }
      throw new Error(error.message || 'Failed to generate itinerary from RAG');
    }
  }

  async checkHealth() {
    try {
      const response = await this.client.get('/health', { timeout: 5000 });
      return response.data;
    } catch {
      return { status: 'unavailable' };
    }
  }
}

module.exports = new RagService();