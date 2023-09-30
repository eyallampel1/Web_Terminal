'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import io, { Socket } from 'socket.io-client';
import './App.css'; // Import your CSS file for styling

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
        <h2 className="app-title">Command Output</h2>
        <textarea
            ref={outputRef}
            readOnly
            value={output}
            className="output-textarea"
        />

        <form onSubmit={handleCommandSubmit}>
          <h2 className="app-title">Command Input</h2>
          <input
              className="input-field"
              placeholder="Enter a command..."
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
          />
          <button
              type="submit"
              className="run-button"
          >
            Run
          </button>
        </form>
      </div>
  );
}

export default App;