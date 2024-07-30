import axios from 'axios';
import { Message } from './types';

const API_URL = import.meta.env.VITE_API_URL;

interface SendMessagePayload {
  conversation_id: string;
  question: string;
}

interface SendMessageResponse {
  conversation_id: string;
  answer: string;
  tabla: any;
}

export const fetchMessages = async (): Promise<Message[]> => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const sendMessage = async (payload: SendMessagePayload): Promise<SendMessageResponse> => {
  const response = await axios.post(`${API_URL}`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
