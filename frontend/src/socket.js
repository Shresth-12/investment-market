// src/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://investment-market-backend.onrender.com'; // Adjust to your server URL

export const socket = io(SOCKET_URL);
