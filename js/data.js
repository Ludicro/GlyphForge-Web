class DataManager {
    constructor() {
        this.attributes = null;
        this.spells = null;
    }

    async loadAttributes() {
        try {
            const response = await fetch('data/attributes.json');
            if (!response.ok) throw new Error('Failed to load attributes');
            this.attributes = await response.json();
            return this.attributes;
        } catch (error) {
            console.error('Error loading attributes:', error);
            throw error;
        }
    }

    async loadSpells() {
        try {
            const levels = ['cantrips', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            this.spells = {};
            
            for (const level of levels) {
                const response = await fetch(`data/grimoire/wizard_${level}.json`);
                if (!response.ok) throw new Error(`Failed to load spells for level ${level}`);
                this.spells[level] = await response.json();
            }
        } catch (error) {
            console.error('Error loading spells:', error);
            throw error;
        }
    }

    getAttributeIndex(attribute, value) {
        const list = this.attributes[attribute];
        return list.findIndex(item => item.toLowerCase() === value.toLowerCase());
    }

    getAttributeIndices(params) {
        return [
            this.getAttributeIndex('levels', params.level),
            this.getAttributeIndex('school', params.school),
            this.getAttributeIndex('duration', params.duration),
            this.getAttributeIndex('range', params.range),
            this.getAttributeIndex('area_types', params.area),
            this.getAttributeIndex('damage_types', params.damage),
            this.getAttributeIndex('conditions', params.condition)
        ];
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
        
        let shape = randomChoice(['polygon', 'quadratic', 'circle', 'cubic', 'golden']);
        let lineType = randomChoice(['straight', 'centreCircle']);
        
        // Prevent invalid combinations
        if (lineType === 'straight' && (shape === 'quadratic' || shape === 'cubic')) {
            shape = 'polygon';
        }

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
            shape: shape,
            lineType: lineType
        };
    }
}

const dataManager = new DataManager();
