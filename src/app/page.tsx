'use client'
// src/App.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import io, { Socket } from 'socket.io-client';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [command, setCommand] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const outputRef = React.createRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);


  useEffect(() => {
    const socketIo = io('http://localhost:3001');
    setSocket(socketIo);

    socketIo.on('command output', (data: string) => {
      setOutput(prevOutput => prevOutput + '\n' + data);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);




  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Run button clicked');  // logging button click
    if (socket && command) {
      console.log('Sending command:', command);  // logging the command being sent
      socket.emit('execute command', command);
      setCommand('');
    }
  };

  return (
      <div className="App">
        <h2 className="text-center">Command Output</h2>
        <textarea
            ref={outputRef}
            readOnly
            value={output}
            className="border-2 border-gray-300 p-3 rounded-lg w-full mt-4"
        />


        <form onSubmit={handleCommandSubmit}>
          <h2 className="text-center mt-4">Command Input</h2>
          <input
              className="mt-4 peer h-full w-full rounded-[7px] border-4 border-blue-500 bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-500 focus:border-4 focus:border-pink-500 focus:outline-0 disabled"
              placeholder=" "
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
          />
          <button
              type="submit"
              className="mx-auto block border-2 border-blue-500 px-4 py-2 mt-4 rounded-lg bg-blue-500 text-white hover:bg-blue-700 hover:border-blue-700"
          >
            Run
          </button>


        </form>
      </div>
  );
}

export default App;