class GlyphForgeApp {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api';
        this.initialize();
    }

    async initialize() {
        try {
            const attributes = await this.fetchAttributes();
            this.populateDropdowns(attributes);
            this.setupEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    async fetchAttributes() {
        const response = await fetch(`${this.apiUrl}/attributes`);
        return await response.json();
    }

    async generateGlyph(params) {
        const response = await fetch(`${this.apiUrl}/generate-glyph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });
        const data = await response.json();
        this.displayGlyph(data.image);
    }

    populateDropdowns(attributes) {
        const dropdownMappings = {
            'level': attributes.levels,
            'school': attributes.school,
            'duration': attributes.duration,
            'range': attributes.range,
            'area': attributes.area_types,
            'damage': attributes.damage_types,
            'condition': attributes.conditions
        };

        for (const [dropdownId, values] of Object.entries(dropdownMappings)) {
            const select = document.getElementById(dropdownId);
            select.innerHTML = '';
            
            values.forEach(value => {
                const option = document.createElement('option');
                option.value = value.toLowerCase();
                option.textContent = value;
                select.appendChild(option);
            });
        }

        this.setDefaultValues();
    }

    setDefaultValues() {
        document.getElementById('level').value = 'none';
        document.getElementById('school').value = 'none';
        document.getElementById('duration').value = 'instantaneous';
        document.getElementById('range').value = 'none';
        document.getElementById('area').value = 'none';
        document.getElementById('damage').value = 'none';
        document.getElementById('condition').value = 'none';
        document.getElementById('concentration').checked = false;
        document.getElementById('ritual').checked = false;
        document.getElementById('shape').value = 'polygon';
        document.getElementById('lineType').value = 'straight';
    }

    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => {
            const params = this.getFormValues();
            this.generateGlyph(params);
        });

        document.getElementById('randomBtn').addEventListener('click', () => {
            this.generateRandomGlyph();
        });
    }

    getFormValues() {
        return {
            level: document.getElementById('level').value,
            school: document.getElementById('school').value,
            duration: document.getElementById('duration').value,
            range: document.getElementById('range').value,
            area: document.getElementById('area').value,
            damage: document.getElementById('damage').value,
            condition: document.getElementById('condition').value,
            concentration: document.getElementById('concentration').checked,
            ritual: document.getElementById('ritual').checked,
            shape: document.getElementById('shape').value,
            lineType: document.getElementById('lineType').value
        };
    }

    displayGlyph(base64Image) {
        const img = document.getElementById('glyphImage');
        img.src = `data:image/png;base64,${base64Image}`;
    }

    async generateRandomGlyph() {
        const attributes = await this.fetchAttributes();
        const randomParams = this.getRandomAttributes(attributes);
        this.setFormValues(randomParams);
        this.generateGlyph(randomParams);
    }

    getRandomAttributes(attributes) {
        const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
        
        return {
            level: randomChoice(attributes.levels),
            school: randomChoice(attributes.school),
            duration: randomChoice(attributes.duration),
            range: randomChoice(attributes.range),
            area: randomChoice(attributes.area_types),
            damage: randomChoice(attributes.damage_types),
            condition: randomChoice(attributes.conditions),
            concentration: Math.random() < 0.5,
            ritual: Math.random() < 0.5,
            shape: randomChoice(['polygon', 'quadratic', 'circle', 'cubic', 'golden']),
            lineType: randomChoice(['straight', 'centreCircle'])
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GlyphForgeApp();
});
