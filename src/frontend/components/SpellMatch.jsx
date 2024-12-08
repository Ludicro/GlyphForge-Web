import React from 'react';

export default function SpellMatch({ spell }) {
  if (!spell) return null;
  
  return (
    <div className="spell-match">
      <h3>Matching Spell Found:</h3>
      <div className="spell-details">
        <h4>{spell.name}</h4>
        <p>Level: {spell.level}</p>
        <p>School: {spell.school}</p>
        <p>Duration: {spell.duration}</p>
        <p>Range: {spell.range}</p>
        <p>Area Type: {spell.area_type}</p>
        <p>Damage Type: {spell.dtype}</p>
        <p>Condition: {spell.condition}</p>
        <p>Concentration: {spell.concentration ? "Yes" : "No"}</p>
        <p>Ritual: {spell.ritual ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
