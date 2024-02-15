import React, { useEffect, useState, useRef } from 'react'
import AImessage from "./AImessage"
import Usermessage from "./Usermessage"
import io from 'socket.io-client';


const ChatBox = (props) => {

  const [chats, setChats] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const chatContainerRef = useRef();
  const [soc, setSoc] = useState(null);

  const handleUserMessage = () => {

    if (userMessage) {
      soc.emit('message', userMessage);
      setChats(prevChats => [...prevChats,
      { user: userMessage, aiResponse: null }
      ]);

      setUserMessage('');
    }
  }

  useEffect(() => {
    const websocket_url = process.env.REACT_APP_WS_URL;

    const socket = io(websocket_url, {
      transports: ['websocket'],
    });

    // Connection opened
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    // Listen for messages
    socket.on('aimessage', (data) => {
      console.log(data);

      setChats(prevChats => {
        const updatedChats = [...prevChats];
        updatedChats[updatedChats.length - 1].aiResponse = data;
        return updatedChats;
      });


    });

    // Connection closed
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    setSoc(socket);

    // Clean up the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };


  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };




  return (
    <div class="max-w-md mx-auto p-4">
      <div class="bg-white rounded-lg shadow-md p-4 chatBox">
        <div class="flex items-center mb-4">
          <div class="ml-3">
            <p class="text-xl font-medium">Chat-GPT 4</p>
            <p class="text-gray-500">Online</p>
          </div>
        </div>

        <div ref={chatContainerRef} class="h32rem overflow-y-auto">
          <div class="space-y-4 pb-3">

            <AImessage message="Hi I am your AI Assistant :D" />

            {chats.map((chat, index) => (
              <>
                <Usermessage message={chat.user} />
                <AImessage message={chat.aiResponse} />

              </>
            ))}

          </div>

        </div>

      </div>
      <div class="mt-4 flex items-center chatBox">

        <textarea
          type="text"
          placeholder="Message ChatGPT..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          class="w-full p-2 border rounded-md resize-y focus:outline-none focus:border-blue-500 inputBox"
          autoFocus
        ></textarea>

        <button onClick={handleUserMessage} class="bg-blue-500 text-white px-4 py-2 rounded-full ml-3 hover:bg-blue-600">Send</button>
      </div>
    </div>

  )
}

export default ChatBox