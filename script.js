const API_URL = env.API_URL;

async function populateDropdowns() {
    const response = await fetch(`${API_URL}/api/attributes`);
    const data = await response.json();
    
    // Populate each dropdown with its corresponding attributes
    Object.keys(data).forEach(key => {
        const select = document.getElementById(key.replace('_types', ''));
        if (select) {
            select.innerHTML = data[key]
                .map(option => `<option value="${option}">${option}</option>`)
                .join('');
        }
    });
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', populateDropdowns);

async function loadAttributes() {
    const response = await fetch(`${API_URL}/api/attributes`);
    const data = await response.json();
    return data;
}

async function generateGlyph(formData) {
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
    return data;
}

function createFormGroup(label, options, value, onChange) {
    const div = document.createElement('div');
    div.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    
    const select = document.createElement('select');
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
    
    select.value = value;
    select.addEventListener('change', onChange);
    
    div.appendChild(labelElement);
    div.appendChild(select);
    return div;
}

async function initializeForm() {
    const attributes = await loadAttributes();
    const formGrid = document.querySelector('.form-grid');
    const formData = {
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
    };

    // Create form groups for each attribute
    formGrid.appendChild(createFormGroup('Level', attributes.levels, formData.level, 
        e => formData.level = e.target.value));
    formGrid.appendChild(createFormGroup('School', attributes.school, formData.school, 
        e => formData.school = e.target.value));
    formGrid.appendChild(createFormGroup('Duration', attributes.duration, formData.duration, 
        e => formData.duration = e.target.value));
    formGrid.appendChild(createFormGroup('Range', attributes.range, formData.range, 
        e => formData.range = e.target.value));
    formGrid.appendChild(createFormGroup('Area Type', attributes.area_types, formData.area, 
        e => formData.area = e.target.value));
    formGrid.appendChild(createFormGroup('Damage Type', attributes.damage_types, formData.damage, 
        e => formData.damage = e.target.value));
    formGrid.appendChild(createFormGroup('Condition', attributes.conditions, formData.condition, 
        e => formData.condition = e.target.value));
    formGrid.appendChild(createFormGroup('Shape', ['polygon', 'quadratic', 'circle', 'cubic', 'golden'], 
        formData.shape, e => formData.shape = e.target.value));
    formGrid.appendChild(createFormGroup('Line Type', ['straight', 'centreCircle'], 
        formData.lineType, e => formData.lineType = e.target.value));
    formGrid.appendChild(createFormGroup('Concentration', ['false', 'true'], formData.concentration, 
        e => formData.concentration = e.target.value === 'true'));
    formGrid.appendChild(createFormGroup('Ritual', ['false', 'true'], formData.ritual, 
        e => formData.ritual = e.target.value === 'true'));

    // Create generate button
    const button = document.createElement('button');
    button.textContent = 'Generate Glyph';
    button.onclick = async () => {
        const result = await generateGlyph(formData);
        const glyphDisplay = document.querySelector('.glyph-display') || 
            document.createElement('div');
        glyphDisplay.className = 'glyph-display';
        glyphDisplay.innerHTML = `<img src="data:image/png;base64,${result.image}" alt="Generated Glyph">`;
        if (!document.querySelector('.glyph-display')) {
            formGrid.after(glyphDisplay);
        }
    };
    formGrid.appendChild(button);
}

initializeForm();
