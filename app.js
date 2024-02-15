require('dotenv').config();

const axios = require('axios');

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); // Import the cors middleware

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Use the cors middleware
app.use(cors());

io.on('connection', client => {
  // console.log('a user connected');

  client.on('message', async (data) =>{  
    const response = await ChatGPT(data);
    client.emit('aimessage', response);

  })

  client.on('disconnect', () => { 
    // console.log("a user disconnected")
   });
});

const PORT = process.env.PORT || 3300;
server.listen(PORT, () => {
  console.log(`Web Socket Server running on http://localhost:${PORT}`);
});



async function ChatGPT(content){

  const options = {
    method: 'POST',
    url: 'https://open-ai21.p.rapidapi.com/chatgpt',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': process.env.AI_API_KEY,
      'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
    },
    data: {
      messages: [
        {
          role: 'user',
          content: content
        }
      ],
      web_access: false
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.result
  } catch (error) {
    return error;
  }
}
