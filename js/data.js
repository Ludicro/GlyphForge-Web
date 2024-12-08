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

    populateDropdowns() {
        // Level dropdown
        const levelSelect = document.getElementById('level');
        this.attributes.levels.forEach(level => {
            const option = document.createElement('option');
            option.value = level.toLowerCase();
            option.textContent = level;
            levelSelect.appendChild(option);
        });

        // School dropdown
        const schoolSelect = document.getElementById('school');
        this.attributes.school.forEach(school => {
            const option = document.createElement('option');
            option.value = school.toLowerCase();
            option.textContent = school;
            schoolSelect.appendChild(option);
        });

        // Duration dropdown
        const durationSelect = document.getElementById('duration');
        this.attributes.duration.forEach(duration => {
            const option = document.createElement('option');
            option.value = duration.toLowerCase();
            option.textContent = duration;
            durationSelect.appendChild(option);
        });

        // Range dropdown
        const rangeSelect = document.getElementById('range');
        this.attributes.range.forEach(range => {
            const option = document.createElement('option');
            option.value = range.toLowerCase();
            option.textContent = range;
            rangeSelect.appendChild(option);
        });

        // Area type dropdown
        const areaSelect = document.getElementById('area');
        this.attributes.area_types.forEach(area => {
            const option = document.createElement('option');
            option.value = area.toLowerCase();
            option.textContent = area;
            areaSelect.appendChild(option);
        });

        // Damage type dropdown
        const damageSelect = document.getElementById('damage');
        this.attributes.damage_types.forEach(damage => {
            const option = document.createElement('option');
            option.value = damage.toLowerCase();
            option.textContent = damage;
            damageSelect.appendChild(option);
        });

        // Condition dropdown
        const conditionSelect = document.getElementById('condition');
        this.attributes.conditions.forEach(condition => {
            const option = document.createElement('option');
            option.value = condition.toLowerCase();
            option.textContent = condition;
            conditionSelect.appendChild(option);
        });

        // Set default values
        levelSelect.value = 'none';
        schoolSelect.value = 'none';
        durationSelect.value = 'instantaneous';
        rangeSelect.value = 'none';
        areaSelect.value = 'none';
        damageSelect.value = 'none';
        conditionSelect.value = 'none';
    }
}

const dataManager = new DataManager();
