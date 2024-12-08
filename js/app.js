class GlyphForgeApp {
    constructor() {
        this.dataManager = new DataManager();
        this.glyphEngine = new GlyphEngine('glyphCanvas');
    }

    async initialize() {
        try {
            // Load data first
            await this.dataManager.loadAttributes();
            await this.dataManager.loadSpells();
            
            // Populate dropdowns
            this.populateDropdowns();
            
            // Setup event listeners
            this.setupEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    populateDropdowns() {
        const dropdownMappings = {
            'level': this.dataManager.attributes.levels,
            'school': this.dataManager.attributes.school,
            'duration': this.dataManager.attributes.duration,
            'range': this.dataManager.attributes.range,
            'area': this.dataManager.attributes.area_types,
            'damage': this.dataManager.attributes.damage_types,
            'condition': this.dataManager.attributes.conditions
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

        // Set default values
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
        document.getElementById('generateBtn').addEventListener('click', () => this.generateGlyph());
        document.getElementById('randomBtn').addEventListener('click', () => this.generateRandomGlyph());
        
        // Add change listeners to all dropdowns for real-time updates
        const dropdowns = ['level', 'school', 'duration', 'range', 'area', 'damage', 'condition', 'shape', 'lineType'];
        dropdowns.forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.generateGlyph());
        });

        // Add change listeners to checkboxes
        document.getElementById('concentration').addEventListener('change', () => this.generateGlyph());
        document.getElementById('ritual').addEventListener('change', () => this.generateGlyph());
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

    setFormValues(values) {
        document.getElementById('level').value = values.level.toLowerCase();
        document.getElementById('school').value = values.school.toLowerCase();
        document.getElementById('duration').value = values.duration.toLowerCase();
        document.getElementById('range').value = values.range.toLowerCase();
        document.getElementById('area').value = values.area.toLowerCase();
        document.getElementById('damage').value = values.damage.toLowerCase();
        document.getElementById('condition').value = values.condition.toLowerCase();
        document.getElementById('concentration').checked = values.concentration;
        document.getElementById('ritual').checked = values.ritual;
        document.getElementById('shape').value = values.shape;
        document.getElementById('lineType').value = values.lineType;
    }

    generateGlyph() {
        const params = this.getFormValues();
        this.glyphEngine.drawGlyph(params);
        this.updateSpellName(params);
    }

    generateRandomGlyph() {
        const randomParams = this.dataManager.getRandomAttributes();
        this.setFormValues(randomParams);
        this.glyphEngine.drawGlyph(randomParams);
        this.updateSpellName(randomParams);
    }

    updateSpellName(params) {
        const matchingSpells = this.dataManager.findMatchingSpell(params);
        const spellNameElement = document.getElementById('spellName');
        
        if (matchingSpells.length > 0) {
            spellNameElement.textContent = `Matching Spell${matchingSpells.length > 1 ? 's' : ''}: ${matchingSpells.join(' | ')}`;
        } else {
            spellNameElement.textContent = 'Spell does not exist... yet';
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    const app = new GlyphForgeApp();
    await app.initialize();
});
