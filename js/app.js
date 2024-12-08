class GlyphForgeApp {
    constructor() {
        this.dataManager = new DataManager();
        this.glyphEngine = new GlyphEngine('glyphCanvas');
    }

    async initialize() {
        try {
            await this.dataManager.loadAttributes();
            await this.dataManager.loadSpells();
            this.populateDropdowns();
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

        this.setDefaultValues();
    }

    setDefaultValues() {
        const defaults = {
            'level': 'none',
            'school': 'none',
            'duration': 'instantaneous',
            'range': 'none',
            'area': 'none',
            'damage': 'none',
            'condition': 'none',
            'shape': 'polygon',
            'lineType': 'straight'
        };

        Object.entries(defaults).forEach(([id, value]) => {
            document.getElementById(id).value = value;
        });

        document.getElementById('concentration').checked = false;
        document.getElementById('ritual').checked = false;
    }

    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateGlyph());
        document.getElementById('randomBtn').addEventListener('click', () => this.generateRandomGlyph());
        
        ['level', 'school', 'duration', 'range', 'area', 'damage', 'condition', 'shape', 'lineType',
         'concentration', 'ritual'].forEach(id => {
            const element = document.getElementById(id);
            element.addEventListener('change', () => this.generateGlyph());
        });
    }

    getFormValues() {
        const values = {};
        ['level', 'school', 'duration', 'range', 'area', 'damage', 'condition', 'shape', 'lineType'].forEach(id => {
            values[id] = document.getElementById(id).value;
        });
        values.concentration = document.getElementById('concentration').checked;
        values.ritual = document.getElementById('ritual').checked;
        return values;
    }

    setFormValues(values) {
        Object.entries(values).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element.type === 'checkbox') {
                element.checked = value;
            } else {
                element.value = typeof value === 'string' ? value.toLowerCase() : value;
            }
        });
    }

    generateGlyph() {
        const params = this.getFormValues();
        const attributeIndices = this.dataManager.getAttributeIndices(params);
        this.glyphEngine.drawGlyph(params, attributeIndices);
        this.updateSpellName(params);
    }

    generateRandomGlyph() {
        const randomParams = this.dataManager.getRandomAttributes();
        this.setFormValues(randomParams);
        const attributeIndices = this.dataManager.getAttributeIndices(randomParams);
        this.glyphEngine.drawGlyph(randomParams, attributeIndices);
        this.updateSpellName(randomParams);
    }

    updateSpellName(params) {
        const matchingSpells = this.dataManager.findMatchingSpell(params);
        const spellNameElement = document.getElementById('spellName');
        
        spellNameElement.textContent = matchingSpells.length > 0
            ? `Matching Spell${matchingSpells.length > 1 ? 's' : ''}: ${matchingSpells.join(' | ')}`
            : 'Spell does not exist... yet';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = new GlyphForgeApp();
    await app.initialize();
});
