class GlyphForgeApp {
    constructor() {
        this.dataManager = dataManager;
        this.glyphEngine = new GlyphEngine('glyphCanvas');
        this.setupEventListeners();
    }

    async initialize() {
        await this.dataManager.initialize();
    }

    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateGlyph());
        document.getElementById('randomBtn').addEventListener('click', () => this.generateRandomGlyph());
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
