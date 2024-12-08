import React, { useState } from 'react';

export default function GlyphForm({ attributes, onGenerate }) {
  const [formData, setFormData] = useState({
    level: "0",
    school: "None",
    duration: "Instantaneous",
    range: "None",
    area_type: "None",
    dtype: "None",
    condition: "None",
    concentration: false,
    ritual: false,
    base_shape: "polygon",
    line_type: "straight"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Create dropdowns for each attribute */}
      {Object.entries(attributes).map(([key, values]) => (
        <select
          key={key}
          value={formData[key]}
          onChange={(e) => setFormData({...formData, [key]: e.target.value})}
        >
          {values.map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      ))}
      <button type="submit">Generate Glyph</button>
      <button type="button" onClick={() => {}}>Random Spell</button>
    </form>
  );
}
