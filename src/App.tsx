import React from 'react';
import logo from './logo.svg';
import './App.css';
import ThreeCanvas from "./ThreeCanvas";

function App() {
  return (
    <div className="App">
      <ThreeCanvas width={800} height={800}></ThreeCanvas>
    </div>
  );
}

export default App;
