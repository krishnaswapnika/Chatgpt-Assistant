import './App.css';
// import { useEffect } from 'react';
import ChatBox from './components/ChatBox';

function App() {

  return (
    <div className="App">
      <div className="bg-blue-800 flex items-center justify-center h-screen">
      {/* <h1 className="text-3xl font-bold underline">
      Chat GPT-4
      </h1> */}
      <div className='block'>

      <ChatBox/>

      
      </div>
    </div>


    </div>
  );
}

export default App;
