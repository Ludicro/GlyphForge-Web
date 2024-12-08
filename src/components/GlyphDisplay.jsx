import React from 'react';

export default function GlyphDisplay({ image }) {
  return (
    <div className="glyph-display">
      <img 
        src={`data:image/png;base64,${image}`} 
        alt="Generated Glyph" 
        className="glyph-image"
      />
    </div>
  );
}
