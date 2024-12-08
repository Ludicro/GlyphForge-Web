import React, { useState, useEffect } from 'react';
import './GlyphGenerator.css';

const API_URL = 'YOUR_API_GATEWAY_URL';

function GlyphGenerator() {
  const [attributes, setAttributes] = useState(null);
  const [formData, setFormData] = useState({
    level: '1',
    school: 'Evocation',
    duration: 'Instantaneous',
    range: '60 feet',
    area: 'cone (15)',
    damage: 'Fire',
    condition: 'None',
    concentration: false,
    ritual: false,
    shape: 'polygon',
    lineType: 'straight'
  });
  const [glyph, setGlyph] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/attributes`)
      .then(res => res.json())
      .then(data => setAttributes(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/api/generate-glyph`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    setGlyph(data.image);
  };

  if (!attributes) return <div>Loading attributes...</div>;

  return (
    <div className="glyph-generator">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Level:</label>
            <select 
              value={formData.level}
              onChange={e => setFormData({...formData, level: e.target.value})}
            >
              {attributes.levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>School:</label>
            <select 
              value={formData.school}
              onChange={e => setFormData({...formData, school: e.target.value})}
            >
              {attributes.school.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Duration:</label>
            <select 
              value={formData.duration}
              onChange={e => setFormData({...formData, duration: e.target.value})}
            >
              {attributes.duration.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Range:</label>
            <select 
              value={formData.range}
              onChange={e => setFormData({...formData, range: e.target.value})}
            >
              {attributes.range.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Area Type:</label>
            <select 
              value={formData.area}
              onChange={e => setFormData({...formData, area: e.target.value})}
            >
              {attributes.area_types.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Damage Type:</label>
            <select 
              value={formData.damage}
              onChange={e => setFormData({...formData, damage: e.target.value})}
            >
              {attributes.damage_types.map(damage => (
                <option key={damage} value={damage}>{damage}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Condition:</label>
            <select 
              value={formData.condition}
              onChange={e => setFormData({...formData, condition: e.target.value})}
            >
              {attributes.conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Shape:</label>
            <select 
              value={formData.shape}
              onChange={e => setFormData({...formData, shape: e.target.value})}
            >
              <option value="polygon">Polygon</option>
              <option value="quadratic">Quadratic</option>
              <option value="circle">Circle</option>
              <option value="cubic">Cubic</option>
              <option value="golden">Golden</option>
            </select>
          </div>

          <div className="form-group">
            <label>Line Type:</label>
            <select 
              value={formData.lineType}
              onChange={e => setFormData({...formData, lineType: e.target.value})}
            >
              <option value="straight">Straight</option>
              <option value="centreCircle">Centre Circle</option>
            </select>
          </div>

          <div className="form-group">
            <label>Concentration:</label>
            <select 
              value={formData.concentration}
              onChange={e => setFormData({...formData, concentration: e.target.value === 'true'})}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ritual:</label>
            <select 
              value={formData.ritual}
              onChange={e => setFormData({...formData, ritual: e.target.value === 'true'})}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>

        <button type="submit">Generate Glyph</button>
      </form>

      <div className="glyph-display">
        {glyph && <img src={`data:image/png;base64,${glyph}`} alt="Generated Glyph" />}
      </div>
    </div>
  );
}

export default GlyphGenerator;
