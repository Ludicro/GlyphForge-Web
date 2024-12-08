class DataManager {
    constructor() {
        this.attributes = null;
        this.spells = null;
    }

    async initialize() {
        await Promise.all([
            this.loadAttributes(),
            this.loadSpells()
        ]);
        this.populateDropdowns();
    }

    async loadAttributes() {
        const response = await fetch('data/attributes.json');
        this.attributes = await response.json();
    }

    async loadSpells() {
        const levels = ['cantrips', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.spells = {};
        
        for (const level of levels) {
            const response = await fetch(`data/spells/wizard_${level}.json`);
            this.spells[level] = await response.json();
        }
    }

    populateDropdowns() {
        // Populate all dropdowns with their respective attributes
        for (const [key, values] of Object.entries(this.attributes)) {
            const select = document.getElementById(key);
            if (select) {
                values.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value.toLowerCase();
                    option.textContent = value;
                    select.appendChild(option);
                });
            }
        }
    }

    findMatchingSpell(params) {
        const level = params.level === 'none' ? 'cantrips' : params.level;
        const spellList = this.spells[level] || [];
        
        return spellList.filter(spell => 
            spell.level.toLowerCase() === params.level &&
            spell.school.toLowerCase() === params.school &&
            spell.duration.toLowerCase() === params.duration &&
            spell.range.toLowerCase() === params.range &&
            spell.area_type.toLowerCase() === params.area &&
            spell.dtype.toLowerCase() === params.damage &&
            spell.condition.toLowerCase() === params.condition &&
            spell.concentration === params.concentration &&
            spell.ritual === params.ritual
        ).map(spell => spell.name);
    }

    getRandomAttributes() {
        const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
        
        return {
            level: randomChoice(this.attributes.levels),
            school: randomChoice(this.attributes.school),
            duration: randomChoice(this.attributes.duration),
            range: randomChoice(this.attributes.range),
            area: randomChoice(this.attributes.area_types),
            damage: randomChoice(this.attributes.damage_types),
            condition: randomChoice(this.attributes.conditions),
            concentration: Math.random() < 0.5,
            ritual: Math.random() < 0.5,
            shape: randomChoice(['polygon', 'quadratic', 'circle', 'cubic', 'golden']),
            lineType: randomChoice(['straight', 'centreCircle'])
        };
    }
}

const dataManager = new DataManager();
