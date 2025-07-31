// Pokemon Generator with Complete PokéAPI Integration - FIXED VERSION
class PokemonGenerator {
    constructor() {
        this.pokemonData = [];
        this.itemsData = [];
        this.movesData = [];
        this.currentPokemon = null;
        this.selectedMoves = ['', '', '', ''];
        
        this.natures = [
            'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed',
            'Impish', 'Lax', 'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest',
            'Mild', 'Quiet', 'Bashful', 'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
        ];

        this.balls = [
            'Poke Ball', 'Great Ball', 'Ultra Ball', 'Master Ball', 'Premier Ball', 'Luxury Ball',
            'Heal Ball', 'Net Ball', 'Dive Ball', 'Nest Ball', 'Repeat Ball', 'Timer Ball',
            'Quick Ball', 'Dusk Ball', 'Cherish Ball', 'Friend Ball', 'Level Ball', 'Love Ball',
            'Lure Ball', 'Heavy Ball', 'Fast Ball', 'Moon Ball', 'Beast Ball', 'Dream Ball'
        ];

        this.natureEffects = {
            'Hardy': {boost: null, drop: null}, 'Lonely': {boost: 'Attack', drop: 'Defense'},
            'Brave': {boost: 'Attack', drop: 'Speed'}, 'Adamant': {boost: 'Attack', drop: 'Special Attack'},
            'Naughty': {boost: 'Attack', drop: 'Special Defense'}, 'Bold': {boost: 'Defense', drop: 'Attack'},
            'Docile': {boost: null, drop: null}, 'Relaxed': {boost: 'Defense', drop: 'Speed'},
            'Impish': {boost: 'Defense', drop: 'Special Attack'}, 'Lax': {boost: 'Defense', drop: 'Special Defense'},
            'Timid': {boost: 'Speed', drop: 'Attack'}, 'Hasty': {boost: 'Speed', drop: 'Defense'},
            'Serious': {boost: null, drop: null}, 'Jolly': {boost: 'Speed', drop: 'Special Attack'},
            'Naive': {boost: 'Speed', drop: 'Special Defense'}, 'Modest': {boost: 'Special Attack', drop: 'Attack'},
            'Mild': {boost: 'Special Attack', drop: 'Defense'}, 'Quiet': {boost: 'Special Attack', drop: 'Speed'},
            'Bashful': {boost: null, drop: null}, 'Rash': {boost: 'Special Attack', drop: 'Special Defense'},
            'Calm': {boost: 'Special Defense', drop: 'Attack'}, 'Gentle': {boost: 'Special Defense', drop: 'Defense'},
            'Sassy': {boost: 'Special Defense', drop: 'Speed'}, 'Careful': {boost: 'Special Defense', drop: 'Special Attack'},
            'Quirky': {boost: null, drop: null}
        };

        // Initialize with some basic data to ensure functionality works immediately
        this.initializeBasicData();
    }

    initializeBasicData() {
        // Add basic Pokemon data for immediate functionality
        this.pokemonData = [
            {name: 'bulbasaur', id: 1, types: ['grass', 'poison'], abilities: ['Overgrow', 'Chlorophyll']},
            {name: 'charmander', id: 4, types: ['fire'], abilities: ['Blaze', 'Solar Power']},
            {name: 'squirtle', id: 7, types: ['water'], abilities: ['Torrent', 'Rain Dish']},
            {name: 'pikachu', id: 25, types: ['electric'], abilities: ['Static', 'Lightning Rod']},
            {name: 'mewtwo', id: 150, types: ['psychic'], abilities: ['Pressure', 'Unnerve']},
            {name: 'charizard', id: 6, types: ['fire', 'flying'], abilities: ['Blaze', 'Solar Power']},
            {name: 'blastoise', id: 9, types: ['water'], abilities: ['Torrent', 'Rain Dish']},
            {name: 'venusaur', id: 3, types: ['grass', 'poison'], abilities: ['Overgrow', 'Chlorophyll']}
        ];

        this.itemsData = ['None', 'Leftovers', 'Life Orb', 'Focus Sash', 'Choice Band', 'Choice Specs', 'Choice Scarf', 'Assault Vest'];
        this.movesData = ['Tackle', 'Thunderbolt', 'Surf', 'Earthquake', 'Psychic', 'Flamethrower', 'Ice Beam', 'Shadow Ball', 'Thunder Wave'];
    }

    async init() {
        console.log('Initializing Pokemon Generator...');
        this.showLoading(true);
        
        try {
            // Populate static dropdowns
            this.populateStaticDropdowns();
            
            // Set default values
            this.setDefaults();
            
            // Setup all event listeners
            this.setupEventListeners();
            
            // Load extended data from API in background
            this.loadCompleteData();
            
            console.log('Pokemon Generator initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async loadCompleteData() {
        console.log('Loading complete Pokemon, Items, and Moves data from PokéAPI...');
        
        try {
            // Load Pokemon species (complete list)
            console.log('Fetching Pokemon species...');
            const speciesResponse = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=1000');
            const speciesData = await speciesResponse.json();
            
            const extendedPokemonData = speciesData.results.map((pokemon, index) => ({
                name: pokemon.name,
                id: index + 1,
                types: ['normal'], // Will be updated when selected
                abilities: ['Unknown'] // Will be updated when selected
            }));
            
            // Merge with existing basic data, prioritizing basic data for duplicates
            const basicNames = this.pokemonData.map(p => p.name);
            const newPokemon = extendedPokemonData.filter(p => !basicNames.includes(p.name));
            this.pokemonData = [...this.pokemonData, ...newPokemon];
            
            console.log(`Loaded ${this.pokemonData.length} Pokemon species`);
            
            // Load Items (complete list)
            console.log('Fetching items...');
            const itemsResponse = await fetch('https://pokeapi.co/api/v2/item?limit=1000');
            const itemsData = await itemsResponse.json();
            
            const extendedItemsData = itemsData.results.map(item => 
                this.formatName(item.name)
            );
            
            // Merge with existing items
            const basicItems = this.itemsData;
            const newItems = extendedItemsData.filter(item => !basicItems.includes(item));
            this.itemsData = [...basicItems, ...newItems];
            
            console.log(`Loaded ${this.itemsData.length} items`);
            
            // Load Moves (complete list)
            console.log('Fetching moves...');
            const movesResponse = await fetch('https://pokeapi.co/api/v2/move?limit=800');
            const movesData = await movesResponse.json();
            
            const extendedMovesData = movesData.results.map(move => 
                this.formatName(move.name)
            );
            
            // Merge with existing moves
            const basicMoves = this.movesData;
            const newMoves = extendedMovesData.filter(move => !basicMoves.includes(move));
            this.movesData = [...basicMoves, ...newMoves];
            
            console.log(`Loaded ${this.movesData.length} moves`);
            
        } catch (error) {
            console.error('Error loading complete data:', error);
            // Continue with basic data - don't show error as basic functionality works
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');

        // Species autocomplete
        this.setupAutocomplete('speciesInput', 'speciesDropdown', (query) => {
            return this.pokemonData.filter(pokemon => 
                pokemon.name.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 15);
        }, (pokemon) => {
            this.selectPokemon(pokemon);
        });

        // Item autocomplete
        this.setupAutocomplete('itemInput', 'itemDropdown', (query) => {
            return this.itemsData.filter(item => 
                item.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 15).map(item => ({name: item}));
        }, (item) => {
            const itemInput = document.getElementById('itemInput');
            if (itemInput) {
                itemInput.value = item.name;
            }
            this.hideDropdown(document.getElementById('itemDropdown'));
            this.validateForm();
        });

        // Move autocompletes - CRITICAL: These need highest z-index
        for (let i = 0; i < 4; i++) {
            this.setupMoveAutocomplete(i);
        }

        // Regular select dropdowns
        this.setupSelectDropdowns();

        // Nickname input validation
        const nicknameInput = document.getElementById('nicknameInput');
        if (nicknameInput) {
            nicknameInput.addEventListener('input', () => this.validateForm());
            nicknameInput.addEventListener('change', () => this.validateForm());
        }

        // Shiny toggle event listener
        const shinyToggle = document.getElementById('shinyToggle');
        if (shinyToggle) {
            shinyToggle.addEventListener('change', (e) => {
                console.log('Shiny toggle changed:', e.target.checked);
                this.updatePokemonSprite(e.target.checked);
            });
        }

        // Form validation triggers
        this.setupFormValidation();

        // IV/EV input handlers
        this.setupIVEVInputs();

        // Generate button
        const generateBtn = document.getElementById('generateButton');
        if (generateBtn) {
            generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Generate button clicked');
                this.generatePokemon();
            });
        }

        // Tab switching
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(btn.dataset.tab);
            });
        });

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyToClipboard(btn.dataset.target);
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.autocomplete-wrapper')) {
                this.hideAllDropdowns();
            }
        });

        console.log('All event listeners set up successfully');
    }

    setupAutocomplete(inputId, dropdownId, filterFn, selectFn) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);
        
        if (!input || !dropdown) {
            console.error(`Autocomplete setup failed for ${inputId}/${dropdownId}`);
            return;
        }

        console.log(`Setting up autocomplete for ${inputId}`);

        const inputHandler = (e) => {
            const query = e.target.value.trim();
            console.log(`Input event on ${inputId}:`, query);
            if (query.length < 1) {
                this.hideDropdown(dropdown);
                return;
            }

            const results = filterFn(query);
            console.log(`Found ${results.length} results for "${query}"`);
            this.showDropdownResults(dropdown, results, selectFn);
        };

        const focusHandler = (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                const results = filterFn(query);
                this.showDropdownResults(dropdown, results, selectFn);
            }
        };

        const keydownHandler = (e) => {
            this.handleDropdownKeyboard(e, dropdown);
        };

        input.addEventListener('input', inputHandler);
        input.addEventListener('focus', focusHandler);
        input.addEventListener('keydown', keydownHandler);

        console.log(`Autocomplete setup complete for ${inputId}`);
    }

    setupMoveAutocomplete(moveIndex) {
        const moveInput = document.querySelector(`[data-move="${moveIndex}"].move-input`);
        const moveDropdown = document.querySelector(`[data-move="${moveIndex}"].move-dropdown`);
        
        if (!moveInput || !moveDropdown) {
            console.error(`Move autocomplete setup failed for move ${moveIndex}`);
            return;
        }

        console.log(`Setting up move autocomplete for move ${moveIndex}`);

        const filterFn = (query) => {
            return this.movesData.filter(move => 
                move.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 15).map(move => ({name: move}));
        };

        const selectFn = (move) => {
            moveInput.value = move.name;
            this.selectedMoves[moveIndex] = move.name;
            this.hideDropdown(moveDropdown);
            this.validateForm();
        };

        const inputHandler = (e) => {
            const query = e.target.value.trim();
            this.selectedMoves[moveIndex] = query; // Update selected moves immediately
            console.log(`Move input event on move ${moveIndex}:`, query);
            if (query.length < 1) {
                this.hideDropdown(moveDropdown);
                this.validateForm();
                return;
            }
            const results = filterFn(query);
            console.log(`Found ${results.length} move results for "${query}"`);
            this.showDropdownResults(moveDropdown, results, selectFn);
            this.validateForm();
        };

        const focusHandler = (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                const results = filterFn(query);
                this.showDropdownResults(moveDropdown, results, selectFn);
            }
        };

        const keydownHandler = (e) => {
            this.handleDropdownKeyboard(e, moveDropdown);
        };

        // Add click handler to prevent event bubbling
        const clickHandler = (e) => {
            e.stopPropagation();
            moveInput.focus();
        };

        moveInput.addEventListener('input', inputHandler);
        moveInput.addEventListener('focus', focusHandler);
        moveInput.addEventListener('keydown', keydownHandler);
        moveInput.addEventListener('click', clickHandler);

        console.log(`Move autocomplete setup complete for move ${moveIndex}`);
    }

    setupSelectDropdowns() {
        const selects = [
            {id: 'abilitySelect', callback: null},
            {id: 'natureSelect', callback: (value) => this.updateNatureEffect(value)},
            {id: 'ballSelect', callback: null},
            {id: 'otGenderSelect', callback: null}
        ];

        selects.forEach(select => {
            const element = document.getElementById(select.id);
            if (element) {
                element.addEventListener('change', (e) => {
                    console.log(`${select.id} changed to:`, e.target.value);
                    if (select.callback) {
                        select.callback(e.target.value);
                    }
                    this.validateForm();
                });
            }
        });
    }

    setupFormValidation() {
        const formInputs = document.querySelectorAll('.form-control:not(.iv-input):not(.ev-input)');
        formInputs.forEach(input => {
            input.addEventListener('input', () => this.validateForm());
            input.addEventListener('change', () => this.validateForm());
        });
    }

    setupIVEVInputs() {
        // IV inputs
        const ivInputs = document.querySelectorAll('.iv-input');
        ivInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = parseInt(e.target.value);
                if (isNaN(value) || value < 0) value = 0;
                if (value > 31) value = 31;
                e.target.value = value;
                this.updateStatsDisplay();
                this.validateForm();
            });

            input.addEventListener('change', (e) => {
                let value = parseInt(e.target.value);
                if (isNaN(value) || value < 0) value = 0;
                if (value > 31) value = 31;
                e.target.value = value;
                this.updateStatsDisplay();
                this.validateForm();
            });
        });

        // EV inputs
        const evInputs = document.querySelectorAll('.ev-input');
        evInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = parseInt(e.target.value);
                if (isNaN(value) || value < 0) value = 0;
                if (value > 252) value = 252;
                e.target.value = value;
                this.validateEvs();
                this.updateStatsDisplay();
                this.validateForm();
            });

            input.addEventListener('change', (e) => {
                let value = parseInt(e.target.value);
                if (isNaN(value) || value < 0) value = 0;
                if (value > 252) value = 252;
                e.target.value = value;
                this.validateEvs();
                this.updateStatsDisplay();
                this.validateForm();
            });
        });
    }

    showDropdownResults(dropdown, results, onSelect) {
        if (!dropdown) {
            console.error('No dropdown element provided');
            return;
        }
        
        dropdown.innerHTML = '';
        
        if (results.length === 0) {
            this.hideDropdown(dropdown);
            return;
        }

        console.log(`Showing ${results.length} dropdown results`);

        results.forEach(item => {
            const div = document.createElement('div');
            div.className = 'dropdown-item';
            div.textContent = this.formatName(item.name);
            
            div.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Dropdown item clicked:', item.name);
                onSelect(item);
            });
            
            div.addEventListener('mouseenter', () => {
                dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('highlighted'));
                div.classList.add('highlighted');
            });
            
            dropdown.appendChild(div);
        });

        dropdown.classList.add('show');
        console.log(`Dropdown shown with ${results.length} items`);
    }

    hideDropdown(dropdown) {
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    hideAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-list');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    handleDropdownKeyboard(e, dropdown) {
        if (!dropdown || !dropdown.classList.contains('show')) return;

        const items = dropdown.querySelectorAll('.dropdown-item');
        const highlighted = dropdown.querySelector('.dropdown-item.highlighted');
        let currentIndex = highlighted ? Array.from(items).indexOf(highlighted) : -1;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, items.length - 1);
                this.highlightDropdownItem(items, currentIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                this.highlightDropdownItem(items, currentIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlighted) {
                    highlighted.click();
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.hideDropdown(dropdown);
                break;
        }
    }

    highlightDropdownItem(items, index) {
        items.forEach((item, i) => {
            item.classList.toggle('highlighted', i === index);
        });
    }

    // Update Pokemon sprite based on shiny status
    updatePokemonSprite(isShiny = null) {
        if (!this.currentPokemon) return;
        
        const sprite = document.getElementById('pokemonSprite');
        if (!sprite) return;

        // If isShiny is not provided, check the checkbox state
        if (isShiny === null) {
            const shinyToggle = document.getElementById('shinyToggle');
            isShiny = shinyToggle ? shinyToggle.checked : false;
        }

        // Set the appropriate sprite URL
        const spriteUrl = isShiny 
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${this.currentPokemon.id}.png`
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.currentPokemon.id}.png`;
        
        console.log(`Updating sprite to ${isShiny ? 'shiny' : 'normal'} version:`, spriteUrl);
        
        sprite.src = spriteUrl;
        sprite.onerror = () => {
            // Fallback to placeholder if sprite fails to load
            sprite.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjQ4IiBjeT0iNDgiIHI9IjI0IiBmaWxsPSIjQ0NDIi8+CjwvZXZnPgo=';
        };
    }

    async selectPokemon(pokemon) {
        console.log('Selecting Pokemon:', pokemon.name);
        this.currentPokemon = pokemon;
        
        // Update species input and hide dropdown
        const speciesInput = document.getElementById('speciesInput');
        const speciesDropdown = document.getElementById('speciesDropdown');
        
        if (speciesInput) {
            speciesInput.value = this.formatName(pokemon.name);
        }
        
        if (speciesDropdown) {
            this.hideDropdown(speciesDropdown);
        }

        // Show preview immediately with basic data
        const preview = document.getElementById('pokemonPreview');
        if (preview) {
            preview.style.display = 'flex';
            console.log('Pokemon preview shown');
        }

        // Update sprite with fallback
        this.updatePokemonSprite();

        // Update types with basic data first
        const typesEl = document.getElementById('pokemonTypes');
        if (typesEl) {
            typesEl.innerHTML = '';
            this.currentPokemon.types.forEach(type => {
                const span = document.createElement('span');
                span.className = `type-badge type-${type}`;
                span.textContent = this.formatName(type);
                typesEl.appendChild(span);
            });
        }

        // Update abilities with basic data first
        const abilitySelect = document.getElementById('abilitySelect');
        if (abilitySelect) {
            abilitySelect.innerHTML = '<option value="">Select ability...</option>';
            this.currentPokemon.abilities.forEach(ability => {
                const option = document.createElement('option');
                option.value = this.formatName(ability);
                option.textContent = this.formatName(ability);
                abilitySelect.appendChild(option);
            });
            // Select first ability by default
            if (abilitySelect.options.length > 1) {
                abilitySelect.selectedIndex = 1;
            }
        }

        // Load detailed Pokemon data from API if available
        try {
            console.log('Loading detailed Pokemon data...');
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            const pokemonData = await pokemonResponse.json();
            
            // Update sprite with API data
            this.updatePokemonSprite();
            
            // Update types with API data
            this.currentPokemon.types = pokemonData.types.map(t => t.type.name);
            if (typesEl) {
                typesEl.innerHTML = '';
                this.currentPokemon.types.forEach(type => {
                    const span = document.createElement('span');
                    span.className = `type-badge type-${type}`;
                    span.textContent = this.formatName(type);
                    typesEl.appendChild(span);
                });
            }

            // Update abilities with API data
            this.currentPokemon.abilities = pokemonData.abilities.map(a => this.formatName(a.ability.name));
            if (abilitySelect) {
                const currentValue = abilitySelect.value;
                abilitySelect.innerHTML = '<option value="">Select ability...</option>';
                this.currentPokemon.abilities.forEach(ability => {
                    const option = document.createElement('option');
                    option.value = ability;
                    option.textContent = ability;
                    abilitySelect.appendChild(option);
                });
                // Restore previous selection or select first ability
                if (currentValue && this.currentPokemon.abilities.includes(currentValue)) {
                    abilitySelect.value = currentValue;
                } else if (abilitySelect.options.length > 1) {
                    abilitySelect.selectedIndex = 1;
                }
            }
            
        } catch (error) {
            console.error('Error loading Pokemon details:', error);
            // Continue with basic data - already set above
        }

        // Clear moves
        document.querySelectorAll('.move-input').forEach((input, index) => {
            input.value = '';
            this.selectedMoves[index] = '';
        });

        this.validateForm();
    }

    populateStaticDropdowns() {
        // Nature dropdown
        const natureSelect = document.getElementById('natureSelect');
        if (natureSelect) {
            natureSelect.innerHTML = '<option value="">Select nature...</option>';
            this.natures.forEach(nature => {
                const option = document.createElement('option');
                option.value = nature;
                option.textContent = nature;
                natureSelect.appendChild(option);
            });
        }

        // Ball dropdown
        const ballSelect = document.getElementById('ballSelect');
        if (ballSelect) {
            ballSelect.innerHTML = '<option value="">Select ball...</option>';
            this.balls.forEach(ball => {
                const option = document.createElement('option');
                option.value = ball;
                option.textContent = ball;
                ballSelect.appendChild(option);
            });
        }
    }

    setDefaults() {
        // Set default values
        const elements = {
            natureSelect: 'Hardy',
            ballSelect: 'Poke Ball',
            levelInput: '100',
            otInput: 'Ash',
            tidInput: '12345',
            sidInput: '54321',
            itemInput: 'None',
            otGenderSelect: 'Male'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
        
        // Set default IVs to 31
        document.querySelectorAll('.iv-input').forEach(input => {
            input.value = '31';
        });
        
        // Set default EVs to 0
        document.querySelectorAll('.ev-input').forEach(input => {
            input.value = '0';
        });

        this.updateNatureEffect('Hardy');
        this.updateStatsDisplay();
        this.validateForm();
    }

    updateNatureEffect(nature) {
        const effectEl = document.getElementById('natureEffect');
        if (!effectEl || !nature) return;

        const effect = this.natureEffects[nature];
        if (!effect || (!effect.boost && !effect.drop)) {
            effectEl.innerHTML = '<span class="nature-neutral">No stat changes</span>';
        } else {
            effectEl.innerHTML = `<span class="nature-boost">+${effect.boost}</span>, <span class="nature-drop">-${effect.drop}</span>`;
        }
    }

    updateStatsDisplay() {
        // Update IV display
        const ivInputs = Array.from(document.querySelectorAll('.iv-input'));
        const ivValues = ivInputs.map(input => parseInt(input.value) || 31);
        const ivDisplay = document.getElementById('ivDisplay');
        if (ivDisplay) {
            ivDisplay.textContent = `${ivValues[0]} HP / ${ivValues[1]} Atk / ${ivValues[2]} Def / ${ivValues[3]} SpA / ${ivValues[4]} SpD / ${ivValues[5]} Spe`;
        }

        // Update EV display
        const evInputs = Array.from(document.querySelectorAll('.ev-input'));
        const evValues = evInputs.map(input => parseInt(input.value) || 0);
        const evDisplay = document.getElementById('evDisplay');
        if (evDisplay) {
            evDisplay.textContent = `${evValues[0]} HP / ${evValues[1]} Atk / ${evValues[2]} Def / ${evValues[3]} SpA / ${evValues[4]} SpD / ${evValues[5]} Spe`;
        }
    }

    validateEvs() {
        const evInputs = document.querySelectorAll('.ev-input');
        let total = 0;

        evInputs.forEach(input => {
            let value = parseInt(input.value) || 0;
            if (value > 252) {
                value = 252;
                input.value = value;
            }
            if (value < 0) {
                value = 0;
                input.value = value;
            }
            total += value;
        });

        const totalEl = document.getElementById('evTotal');
        if (totalEl) totalEl.textContent = total;

        const error = document.getElementById('evError');
        if (error) {
            if (total > 510) {
                error.style.display = 'block';
                error.textContent = 'EV total exceeds 510!';
                return false;
            } else {
                error.style.display = 'none';
                return true;
            }
        }
        return true;
    }

    validateForm() {
        const errors = [];

        // Check Pokemon selection
        if (!this.currentPokemon) {
            errors.push('Select a Pokémon species');
        }

        // Check required fields with proper value checking
        const abilitySelect = document.getElementById('abilitySelect');
        if (!abilitySelect || !abilitySelect.value) {
            errors.push('Select ability');
        }

        const natureSelect = document.getElementById('natureSelect');
        if (!natureSelect || !natureSelect.value) {
            errors.push('Select nature');
        }

        const ballSelect = document.getElementById('ballSelect');
        if (!ballSelect || !ballSelect.value) {
            errors.push('Select Poké Ball');
        }

        // Check moves - count filled moves
        const filledMoves = this.selectedMoves.filter(move => move && move.trim()).length;
        if (filledMoves === 0) {
            errors.push('Select at least 1 move');
        }

        // Check EV total
        if (!this.validateEvs()) {
            errors.push('EV total exceeds 510');
        }

        // Check level
        const levelInput = document.getElementById('levelInput');
        if (levelInput) {
            const level = parseInt(levelInput.value);
            if (isNaN(level) || level < 1 || level > 100) {
                errors.push('Level must be 1-100');
            }
        }

        // Display errors
        const errorDiv = document.getElementById('validationErrors');
        if (errorDiv) {
            errorDiv.innerHTML = errors.map(e => `<div class="error-message">${e}</div>`).join('');
        }

        // Enable/disable generate button
        const generateBtn = document.getElementById('generateButton');
        if (generateBtn) {
            generateBtn.disabled = errors.length > 0;
        }

        console.log('Validation result:', {
            errors: errors,
            currentPokemon: this.currentPokemon,
            selectedMoves: this.selectedMoves,
            filledMoves: filledMoves
        });

        return errors.length === 0;
    }

    generatePokemon() {
        if (!this.validateForm()) return;

        const data = this.collectFormData();

        // Generate exports
        const showdownOutput = document.getElementById('showdownOutput');
        if (showdownOutput) {
            showdownOutput.value = this.generateShowdownFormat(data);
        }

        const discordOutput = document.getElementById('discordOutput');
        if (discordOutput) {
            discordOutput.value = this.generateDiscordFormat(data);
        }

        // Show export section
        const exportSection = document.getElementById('exportSection');
        if (exportSection) {
            exportSection.style.display = 'block';
            this.switchTab('discord');
            exportSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    collectFormData() {
        const moves = this.selectedMoves.filter(move => move && move.trim());

        const ivInputs = Array.from(document.querySelectorAll('.iv-input'));
        const ivs = ivInputs.map(input => parseInt(input.value) || 31);

        const evInputs = Array.from(document.querySelectorAll('.ev-input'));
        const evs = evInputs.map(input => parseInt(input.value) || 0);

        return {
            species: this.formatName(this.currentPokemon.name),
            nickname: document.getElementById('nicknameInput').value.trim() || this.formatName(this.currentPokemon.name),
            level: parseInt(document.getElementById('levelInput').value) || 100,
            shiny: document.getElementById('shinyToggle').checked || false,
            ability: document.getElementById('abilitySelect').value || '',
            nature: document.getElementById('natureSelect').value || '',
            item: document.getElementById('itemInput').value.trim() || 'None',
            ball: document.getElementById('ballSelect').value || 'Poke Ball',
            moves: moves,
            ivs: { hp: ivs[0], atk: ivs[1], def: ivs[2], spa: ivs[3], spd: ivs[4], spe: ivs[5] },
            evs: { hp: evs[0], atk: evs[1], def: evs[2], spa: evs[3], spd: evs[4], spe: evs[5] },
            ot: document.getElementById('otInput').value || 'Trainer',
            tid: String(document.getElementById('tidInput').value || '12345').padStart(5, '0'),
            sid: String(document.getElementById('sidInput').value || '54321').padStart(5, '0'),
            otGender: document.getElementById('otGenderSelect').value || 'Male'
        };
    }

    // UPDATED: Discord format with EXACT format requested by user
    generateDiscordFormat(data) {
        let output = '';
        
        // First line: [nickname] (species) @ item
        output += `[${data.nickname}] (${data.species}) @ ${data.item}\n`;
        
        // Required order as specified
        output += `OT: ${data.ot}\n`;
        output += `TID: ${data.tid}\n`;
        output += `SID: ${data.sid}\n`;
        output += `OTGender: ${data.otGender}\n`;
        output += `Language: English\n`;
        output += `Ability: ${data.ability}\n`;
        output += `Shiny: ${data.shiny ? 'Yes' : 'No'}\n`;
        output += `Ball: ${data.ball}\n`;
        
        // EVs format: "252 HP / 4 Atk / 0 Def / 252 SpA / 0 SpD / 0 Spe"
        output += `EVs: ${data.evs.hp} HP / ${data.evs.atk} Atk / ${data.evs.def} Def / ${data.evs.spa} SpA / ${data.evs.spd} SpD / ${data.evs.spe} Spe\n`;
        
        // IVs format: "31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe" 
        output += `IVs: ${data.ivs.hp} HP / ${data.ivs.atk} Atk / ${data.ivs.def} Def / ${data.ivs.spa} SpA / ${data.ivs.spd} SpD / ${data.ivs.spe} Spe\n`;
        
        // Nature format: "[Chosen nature] Nature"
        output += `${data.nature} Nature\n`;
        
        // Moves format: "- Move 1", "- Move 2", etc.
        for (let i = 0; i < 4; i++) {
            const move = data.moves[i] || 'None';
            output += `- ${move}`;
            if (i < 3) output += '\n';
        }

        return output;
    }

    generateShowdownFormat(data) {
        let output = `${data.nickname}`;
        if (data.species !== data.nickname) {
            output = `${data.nickname} (${data.species})`;
        }
        if (data.item !== 'None') output += ` @ ${data.item}`;
        output += `\nAbility: ${data.ability}`;
        output += `\nLevel: ${data.level}`;

        const evs = [];
        if (data.evs.hp) evs.push(`${data.evs.hp} HP`);
        if (data.evs.atk) evs.push(`${data.evs.atk} Atk`);
        if (data.evs.def) evs.push(`${data.evs.def} Def`);
        if (data.evs.spa) evs.push(`${data.evs.spa} SpA`);
        if (data.evs.spd) evs.push(`${data.evs.spd} SpD`);
        if (data.evs.spe) evs.push(`${data.evs.spe} Spe`);
        if (evs.length) output += `\nEVs: ${evs.join(' / ')}`;

        output += `\n${data.nature} Nature`;

        const ivs = [];
        if (data.ivs.hp !== 31) ivs.push(`${data.ivs.hp} HP`);
        if (data.ivs.atk !== 31) ivs.push(`${data.ivs.atk} Atk`);
        if (data.ivs.def !== 31) ivs.push(`${data.ivs.def} Def`);
        if (data.ivs.spa !== 31) ivs.push(`${data.ivs.spa} SpA`);
        if (data.ivs.spd !== 31) ivs.push(`${data.ivs.spd} SpD`);
        if (data.ivs.spe !== 31) ivs.push(`${data.ivs.spe} Spe`);
        if (ivs.length) output += `\nIVs: ${ivs.join(' / ')}`;

        data.moves.forEach(move => output += `\n- ${move}`);

        return output;
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        document.querySelectorAll('.export-tab').forEach(tabEl => {
            tabEl.classList.toggle('active', tabEl.dataset.tab === tab);
        });
    }

    async copyToClipboard(targetId) {
        const textarea = document.getElementById(targetId);
        const btn = document.querySelector(`[data-target="${targetId}"]`);

        if (!textarea || !btn) return;

        try {
            await navigator.clipboard.writeText(textarea.value);
        } catch {
            textarea.select();
            document.execCommand('copy');
        }

        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
        }, 2000);
    }

    formatName(name) {
        if (!name) return '';
        return name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message) {
        console.error('Error:', message);
        const toast = document.getElementById('errorToast');
        if (toast) {
            toast.textContent = message;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Pokemon Generator...');
    window.pokemonGenerator = new PokemonGenerator();
    window.pokemonGenerator.init().catch(error => {
        console.error('Failed to initialize Pokemon Generator:', error);
    });
});