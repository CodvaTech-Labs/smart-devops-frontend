// Dropdown.js
import React, { useState, useEffect } from 'react';

function Dropdown({ setSelectedApp }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch('http://smartdevopsbackend.neuraforgelabs.click/applications')
      .then(response => response.json())
      .then(data => setOptions(data))
      .catch(error => console.error('Error fetching applications:', error));
  }, []);

  return (
    <select onChange={e => setSelectedApp(e.target.value)}>
      <option value="">Select Application</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

export default Dropdown;
