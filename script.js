const API_URL = 'https://l84cd0mebi.execute-api.us-east-2.amazonaws.com/prod';

async function populateDropdowns() {
    const response = await fetch(`${API_URL}/api/attributes`);
    const data = await response.json();
    
    Object.keys(data).forEach(key => {
        const select = document.getElementById(key);
        if (select) {
            select.innerHTML = data[key]
                .map(option => `<option value="${option}">${option}</option>`)
                .join('');
        }
    });
}

async function generateGlyph() {
    const formData = {
        level: document.getElementById('levels').value,
        school: document.getElementById('school').value,
        duration: document.getElementById('duration').value,
        range: document.getElementById('range').value,
        area: document.getElementById('area_types').value,
        damage: document.getElementById('damage_types').value,
        condition: document.getElementById('conditions').value,
        shape: document.getElementById('shape').value,
        lineType: document.getElementById('lineType').value,
        concentration: document.getElementById('concentration').value === 'true',
        ritual: document.getElementById('ritual').value === 'true'
    };

    const response = await fetch(`${API_URL}/api/generate-glyph`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            httpMethod: 'POST',
            path: '/api/generate-glyph',
            body: JSON.stringify(formData)
        })
    });

    const data = await response.json();
    const glyphDisplay = document.getElementById('glyphDisplay');
    glyphDisplay.innerHTML = `<img src="data:image/png;base64,${data.image}" alt="Generated Glyph">`;
}

document.addEventListener('DOMContentLoaded', populateDropdowns);
