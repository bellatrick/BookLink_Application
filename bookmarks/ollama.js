const axios = require('axios');
require('dotenv').config();

const ollamaUrl=process.env.OLLAMA_URL

async function handleGenerateEmbedding(text) {
  try {
    const response = await axios.post(`${ollamaUrl}/api/embeddings`, {
      model: "all-minilm",
      prompt: text
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.embedding) {
      return response.data.embedding;
    } else {
      throw new Error('No embedding returned from Ollama');
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Could not connect to Ollama at', ollamaUrl);
    } else {
      console.error('Error generating embedding:', error.message);
    }
    throw error;
  }
}

// Error handling wrapper for the embeddings function
export async function generateEmbedding(text) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid input: text must be a non-empty string');
    }

    const cleanText = text.trim();
    if (cleanText.length === 0) {
      throw new Error('Text is empty after cleaning');
    }

    // Generate embedding
    const embedding = await handleGenerateEmbedding(cleanText);
    return embedding;

  } catch (error) {
    console.error('Failed to generate embedding:', error);
    return null;
  }
}
