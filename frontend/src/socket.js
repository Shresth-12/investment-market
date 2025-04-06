// src/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Adjust to your server URL

export const socket = io(SOCKET_URL);
