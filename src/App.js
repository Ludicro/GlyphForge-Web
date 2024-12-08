import React from 'react';
import GlyphGenerator from './components/GlyphGenerator';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>GlyphForge</h1>
        <p>Generate magical glyphs for your spells</p>
      </header>
      <main>
        <GlyphGenerator />
      </main>
      <footer>
        <p>Created with React and AWS Lambda</p>
      </footer>
    </div>
  );
}

export default App;
