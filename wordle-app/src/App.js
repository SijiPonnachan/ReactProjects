import React, { useState } from 'react';
import './App.css';
import WordleMpac from './components/WordleMpac';
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <div className="App">
      
      <h1>Wordle <WordleMpac/></h1>
      <ToastContainer />
    </div>
  );
}

export default App;
