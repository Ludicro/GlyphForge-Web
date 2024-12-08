import React, { useState, useEffect } from 'react';
import GlyphForm from './components/GlyphForm';
import GlyphDisplay from './components/GlyphDisplay';
import SpellMatch from './components/SpellMatch';

export default function App() {
  const [attributes, setAttributes] = useState(null);
  const [glyph, setGlyph] = useState(null);
  const [matchingSpell, setMatchingSpell] = useState(null);

  useEffect(() => {
    fetch('/api/attributes')
      .then(res => res.json())
      .then(data => setAttributes(data));
  }, []);

  const generateGlyph = async (spellData) => {
    const response = await fetch('/api/generate-glyph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spellData)
    });
    const data = await response.json();
    setGlyph(data.image);
  };

  return (
    <div className="app">
      <h1>GlyphForge</h1>
      {attributes && (
        <GlyphForm 
          attributes={attributes} 
          onGenerate={generateGlyph}
        />
      )}
      {glyph && <GlyphDisplay image={glyph} />}
      {matchingSpell && <SpellMatch spell={matchingSpell} />}
    </div>
  );
}
