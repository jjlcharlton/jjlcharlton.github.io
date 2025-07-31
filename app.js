// Pokemon Generator with SELECT Dropdowns for Moves - FIXED
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

        // Initialize with comprehensive basic data 
        this.initializeBasicData();
    }

    initializeBasicData() {
        // Add comprehensive basic Pokemon data with proper types and abilities
        this.pokemonData = [
            {name: 'bulbasaur', id: 1, types: ['grass', 'poison'], abilities: ['Overgrow', 'Chlorophyll (HA)'], genderRate: 1},
            {name: 'charmander', id: 4, types: ['fire'], abilities: ['Blaze', 'Solar Power (HA)'], genderRate: 1},
            {name: 'squirtle', id: 7, types: ['water'], abilities: ['Torrent', 'Rain Dish (HA)'], genderRate: 1},
            {name: 'pikachu', id: 25, types: ['electric'], abilities: ['Static', 'Lightning Rod (HA)'], genderRate: 4},
            {name: 'mewtwo', id: 150, types: ['psychic'], abilities: ['Pressure', 'Unnerve (HA)'], genderRate: -1},
            {name: 'charizard', id: 6, types: ['fire', 'flying'], abilities: ['Blaze', 'Solar Power (HA)'], genderRate: 1},
            {name: 'blastoise', id: 9, types: ['water'], abilities: ['Torrent', 'Rain Dish (HA)'], genderRate: 1},
            {name: 'venusaur', id: 3, types: ['grass', 'poison'], abilities: ['Overgrow', 'Chlorophyll (HA)'], genderRate: 1},
            {name: 'alakazam', id: 65, types: ['psychic'], abilities: ['Synchronize', 'Inner Focus', 'Magic Guard (HA)'], genderRate: 2},
            {name: 'machamp', id: 68, types: ['fighting'], abilities: ['Guts', 'No Guard', 'Steadfast (HA)'], genderRate: 2},
            {name: 'gengar', id: 94, types: ['ghost', 'poison'], abilities: ['Cursed Body'], genderRate: 4},
            {name: 'dragonite', id: 149, types: ['dragon', 'flying'], abilities: ['Inner Focus', 'Multiscale (HA)'], genderRate: 4}
        ];

        this.itemsData = ['None', 'Leftovers', 'Life Orb', 'Focus Sash', 'Choice Band', 'Choice Specs', 'Choice Scarf', 'Assault Vest'];
        
        // CRITICAL FIX: Extended moves list with more comprehensive coverage
        this.movesData = [
            'Tackle', 'Thunderbolt', 'Surf', 'Earthquake', 'Psychic', 'Flamethrower', 'Ice Beam', 'Shadow Ball', 
            'Thunder Wave', 'Toxic', 'Stealth Rock', 'U-turn', 'Volt Switch', 'Scald', 'Will-O-Wisp', 'Roost',
            'Calm Mind', 'Dragon Dance', 'Swords Dance', 'Nasty Plot', 'Recover', 'Substitute', 'Protect',
            'Fire Blast', 'Hydro Pump', 'Blizzard', 'Thunder', 'Solar Beam', 'Hyper Beam', 'Focus Blast',
            'Energy Ball', 'Giga Drain', 'Drain Punch', 'Close Combat', 'Outrage', 'Stone Edge', 'Rock Slide',
            'Iron Head', 'Bullet Punch', 'Mach Punch', 'Aqua Jet', 'Ice Shard', 'Shadow Sneak', 'Quick Attack',
            'Extremespeed', 'Sucker Punch', 'Pursuit', 'Rapid Spin', 'Defog', 'Spikes', 'Toxic Spikes',
            'Aura Sphere', 'Dark Pulse', 'Dragon Pulse', 'Air Slash', 'Dazzling Gleam', 'Moonblast', 'Play Rough',
            'Knock Off', 'Foul Play', 'Crunch', 'Bite', 'Thunder Fang', 'Ice Fang', 'Fire Fang', 'Poison Jab',
            'Cross Chop', 'High Jump Kick', 'Superpower', 'Hammer Arm', 'Brick Break', 'Low Sweep', 'Rock Tomb',
            'Avalanche', 'Icicle Crash', 'Waterfall', 'Aqua Tail', 'Crabhammer', 'Razor Shell', 'Liquidation',
            'Zen Headbutt', 'Psycho Cut', 'Stored Power', 'Future Sight', 'Trick Room', 'Magic Room', 'Wonder Room',
            'Heat Wave', 'Eruption', 'Overheat', 'Flame Charge', 'Fire Punch', 'Thunder Punch', 'Ice Punch'
        ];
        
        console.log('Basic data initialized. Moves:', this.movesData.length);
    }

    async init() {
        console.log('Initializing Pokemon Generator...');
        this.showLoading(true);
        
        try {
            // Populate static dropdowns
            this.populateStaticDropdowns();
            
            // CRITICAL FIX: Populate move dropdowns immediately with basic data
            this.populateMoveDropdowns();
            
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
                abilities: ['Unknown'], // Will be updated when selected
                genderRate: 4 // Default to 4 (50% chance each gender), will be updated when selected
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
            const movesDataResponse = await movesResponse.json();
            
            const extendedMovesData = movesDataResponse.results.map(move => 
                this.formatName(move.name)
            );
            
            // Merge with existing moves
            const basicMoves = this.movesData;
            const newMoves = extendedMovesData.filter(move => !basicMoves.includes(move));
            this.movesData = [...basicMoves, ...newMoves];
            
            console.log(`Loaded ${this.movesData.length} moves total`);
            
            // CRITICAL FIX: Update move dropdowns with complete data
            this.populateMoveDropdowns();
            
        } catch (error) {
            console.error('Error loading complete data:', error);
            // Continue with basic data - don't show error as basic functionality works
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');

        // Wait a bit for DOM to be ready
        setTimeout(() => {
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

            // Move SELECT dropdowns - setup change event listeners
            this.setupMoveSelects();

            // Regular select dropdowns
            this.setupSelectDropdowns();

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
        }, 100);
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

    setupMoveSelects() {
        // Setup event listeners for all 4 move SELECT dropdowns
        for (let i = 1; i <= 4; i++) {
            const moveSelect = document.getElementById(`moveSelect${i}`);
            if (moveSelect) {
                moveSelect.addEventListener('change', (e) => {
                    const moveIndex = parseInt(e.target.dataset.move);
                    const selectedMove = e.target.value;
                    
                    console.log(`Move ${moveIndex + 1} changed to: "${selectedMove}"`);
                    
                    // Update the selectedMoves array
                    this.selectedMoves[moveIndex] = selectedMove;
                    
                    // Validate form
                    this.validateForm();
                });
                
                console.log(`Move select ${i} event listener added`);
            }
        }
    }

    setupSelectDropdowns() {
        const selects = [
            {id: 'abilitySelect', callback: null},
            {id: 'natureSelect', callback: (value) => this.updateNatureEffect(value)},
            {id: 'ballSelect', callback: null},
            {id: 'genderSelect', callback: null},
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
        const formInputs = document.querySelectorAll('.form-control:not(.iv-input):not(.ev-input):not(.move-select)');
        formInputs.forEach(input => {
            input.addEventListener('input', () => this.validateForm());
            input.addEventListener('change', () => this.validateForm());
        });

        // Add nickname input validation
        const nicknameInput = document.getElementById('nicknameInput');
        if (nicknameInput) {
            nicknameInput.addEventListener('input', () => this.validateForm());
        }
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

    // CRITICAL FIX: Update Pokemon sprite to use correct URL format
    updatePokemonSprite(isShiny = null) {
        if (!this.currentPokemon) return;
        
        const sprite = document.getElementById('pokemonSprite');
        if (!sprite) return;

        // If isShiny is not provided, check the checkbox state
        if (isShiny === null) {
            const shinyToggle = document.getElementById('shinyToggle');
            isShiny = shinyToggle ? shinyToggle.checked : false;
        }

        // CRITICAL FIX: Use official Pokemon sprite URLs
        const spriteUrl = isShiny 
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${this.currentPokemon.id}.png`
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.currentPokemon.id}.png`;
        
        console.log(`Updating sprite to ${isShiny ? 'shiny' : 'normal'} version:`, spriteUrl);
        
        sprite.src = spriteUrl;
        sprite.onerror = () => {
            // Try fallback sprite URL
            const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.currentPokemon.id}.png`;
            console.log('Primary sprite failed, trying fallback:', fallbackUrl);
            sprite.src = fallbackUrl;
            
            sprite.onerror = () => {
                // Final fallback to placeholder
                console.log('All sprite URLs failed, using placeholder');
                sprite.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjQ4IiBjeT0iNDgiIHI9IjI0IiBmaWxsPSIjQ0NDIi8+CjwvZXZnPgo=';
            };
        };
    }

    async selectPokemon(pokemon) {
        console.log('Selecting Pokemon:', pokemon.name);
        
        // CRITICAL FIX: Ensure currentPokemon is properly set with all data
        this.currentPokemon = {
            name: pokemon.name,
            id: pokemon.id,
            types: pokemon.types || ['normal'],
            abilities: pokemon.abilities || ['Unknown'],
            genderRate: pokemon.genderRate !== undefined ? pokemon.genderRate : 4
        };
        
        // Update species input and hide dropdown
        const speciesInput = document.getElementById('speciesInput');
        const speciesDropdown = document.getElementById('speciesDropdown');
        
        if (speciesInput) {
            speciesInput.value = this.formatName(pokemon.name);
        }
        
        if (speciesDropdown) {
            this.hideDropdown(speciesDropdown);
        }

        // Show preview immediately
        const preview = document.getElementById('pokemonPreview');
        if (preview) {
            preview.style.display = 'flex';
            console.log('Pokemon preview shown');
        }

        // CRITICAL FIX: Display types immediately with basic data
        this.updateTypesDisplay();
        
        // CRITICAL FIX: Display abilities immediately with basic data
        this.updateAbilitiesDropdown();
        
        // CRITICAL FIX: Handle gender dropdown immediately
        this.updateGenderSection();

        // Update sprite
        this.updatePokemonSprite();

        // Try to load detailed data from API in background
        this.loadDetailedPokemonData(pokemon);

        // Clear moves
        this.clearMoveSelections();

        // Immediately validate form
        this.validateForm();
    }

    clearMoveSelections() {
        // Clear all move SELECT dropdowns
        for (let i = 1; i <= 4; i++) {
            const moveSelect = document.getElementById(`moveSelect${i}`);
            if (moveSelect) {
                moveSelect.value = '';
            }
        }
        this.selectedMoves = ['', '', '', ''];
        console.log('Move selections cleared');
    }

    updateTypesDisplay() {
        const typesEl = document.getElementById('pokemonTypes');
        if (typesEl && this.currentPokemon) {
            typesEl.innerHTML = '';
            this.currentPokemon.types.forEach(type => {
                const span = document.createElement('span');
                span.className = `type-badge type-${type}`;
                span.textContent = this.formatName(type);
                typesEl.appendChild(span);
            });
            console.log('Types displayed:', this.currentPokemon.types);
        }
    }

    updateAbilitiesDropdown() {
        const abilitySelect = document.getElementById('abilitySelect');
        if (abilitySelect && this.currentPokemon) {
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
            
            console.log('Abilities populated:', this.currentPokemon.abilities);
        }
    }

    updateGenderSection() {
        const genderSection = document.getElementById('genderSection');
        const genderSelect = document.getElementById('genderSelect');
        
        if (genderSection && genderSelect && this.currentPokemon) {
            if (this.currentPokemon.genderRate === -1) {
                // Genderless Pokemon
                genderSection.style.display = 'none';
                genderSelect.value = '';
                console.log('Pokemon is genderless, hiding gender section');
            } else {
                // Pokemon with gender
                genderSection.style.display = 'block';
                if (!genderSelect.value) {
                    // Set default gender based on gender rate
                    genderSelect.value = this.currentPokemon.genderRate <= 4 ? 'M' : 'F';
                }
                console.log('Pokemon has gender, showing gender section');
            }
        }
    }

    async loadDetailedPokemonData(pokemon) {
        try {
            console.log('Loading detailed Pokemon data from API...');
            
            // Load pokemon data
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            if (!pokemonResponse.ok) {
                console.log('API request failed, using basic data');
                return;
            }
            const pokemonData = await pokemonResponse.json();
            
            // Load species data for gender rate
            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
            if (!speciesResponse.ok) {
                console.log('Species API request failed, using basic data');
                return;
            }
            const speciesData = await speciesResponse.json();
            
            // Update with API data
            this.currentPokemon.types = pokemonData.types.map(typeSlot => typeSlot.type.name);
            
            // Parse abilities from API
            const abilities = [];
            pokemonData.abilities.forEach(abilitySlot => {
                const abilityName = this.formatName(abilitySlot.ability.name);
                if (abilitySlot.is_hidden) {
                    abilities.push(`${abilityName} (HA)`);
                } else {
                    abilities.push(abilityName);
                }
            });
            this.currentPokemon.abilities = abilities;
            
            // Update gender rate
            this.currentPokemon.genderRate = speciesData.gender_rate;
            
            // Update displays with new API data
            this.updateTypesDisplay();
            this.updateAbilitiesDropdown();
            this.updateGenderSection();
            
            console.log('Updated Pokemon with API data:', this.currentPokemon);
            
        } catch (error) {
            console.error('Error loading detailed Pokemon data:', error);
            // Continue with basic data - already displayed
        }
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
            console.log('Nature dropdown populated with', this.natures.length, 'natures');
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
            console.log('Ball dropdown populated with', this.balls.length, 'balls');
        }
    }

    populateMoveDropdowns() {
        console.log('Populating move dropdowns with', this.movesData.length, 'moves');
        
        // CRITICAL FIX: Populate all 4 move SELECT dropdowns with moves
        for (let i = 1; i <= 4; i++) {
            const moveSelect = document.getElementById(`moveSelect${i}`);
            if (moveSelect) {
                // Clear existing options except the first one
                moveSelect.innerHTML = '<option value="">Select move...</option>';
                
                // CRITICAL FIX: Sort moves alphabetically for better UX
                const sortedMoves = [...this.movesData].sort();
                
                // Add all moves as options
                sortedMoves.forEach(move => {
                    const option = document.createElement('option');
                    option.value = move;
                    option.textContent = move;
                    moveSelect.appendChild(option);
                });
                
                console.log(`Move select ${i} populated with ${sortedMoves.length} moves`);
            } else {
                console.error(`Move select ${i} not found!`);
            }
        }
        
        console.log('All move dropdowns populated successfully');
    }

    setDefaults() {
        // Set default values
        const elements = {
            natureSelect: 'Hardy',
            ballSelect: 'Poke Ball',
            levelInput: '50',
            otInput: 'Ash',
            tidInput: '12345',
            sidInput: '54321',
            itemInput: 'None',
            otGenderSelect: 'M'
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

        // CRITICAL FIX: Check Pokemon selection properly
        if (!this.currentPokemon || !this.currentPokemon.name) {
            errors.push('Select a Pokémon species');
        }

        // Check required fields
        const requiredFields = [
            {id: 'abilitySelect', name: 'ability'},
            {id: 'natureSelect', name: 'nature'},
            {id: 'ballSelect', name: 'Poké Ball'}
        ];

        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element?.value) {
                errors.push(`Select ${field.name}`);
            }
        });

        // Check gender for gendered Pokemon
        if (this.currentPokemon && this.currentPokemon.genderRate !== -1) {
            const genderSelect = document.getElementById('genderSelect');
            if (!genderSelect?.value) {
                errors.push('Select gender');
            }
        }

        // CRITICAL FIX: Check moves from SELECT dropdowns
        const selectedMoves = [];
        for (let i = 1; i <= 4; i++) {
            const moveSelect = document.getElementById(`moveSelect${i}`);
            if (moveSelect && moveSelect.value) {
                selectedMoves.push(moveSelect.value);
            }
        }
        
        if (selectedMoves.length === 0) {
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

        console.log('Form validation:', errors.length === 0 ? 'PASSED' : 'FAILED', errors);
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
        // Get moves from SELECT dropdowns
        const moves = [];
        for (let i = 1; i <= 4; i++) {
            const moveSelect = document.getElementById(`moveSelect${i}`);
            if (moveSelect && moveSelect.value) {
                moves.push(moveSelect.value);
            }
        }

        const ivInputs = Array.from(document.querySelectorAll('.iv-input'));
        const ivs = ivInputs.map(input => parseInt(input.value) || 31);

        const evInputs = Array.from(document.querySelectorAll('.ev-input'));
        const evs = evInputs.map(input => parseInt(input.value) || 0);

        // Get gender for gendered Pokemon
        let gender = '';
        if (this.currentPokemon && this.currentPokemon.genderRate !== -1) {
            const genderSelect = document.getElementById('genderSelect');
            gender = genderSelect?.value || '';
        }

        // Get nickname
        const nickname = document.getElementById('nicknameInput')?.value.trim() || '';

        return {
            species: this.formatName(this.currentPokemon.name),
            nickname: nickname,
            gender: gender,
            level: parseInt(document.getElementById('levelInput').value) || 50,
            shiny: document.getElementById('shinyToggle').checked || false,
            ability: document.getElementById('abilitySelect').value || '',
            nature: document.getElementById('natureSelect').value || '',
            item: document.getElementById('itemInput').value.trim() || 'None',
            ball: document.getElementById('ballSelect').value || 'Poke Ball',
            moves: moves,
            ivs: { hp: ivs[0], atk: ivs[1], def: ivs[2], spa: ivs[3], spd: ivs[4], spe: ivs[5] },
            evs: { hp: evs[0], atk: evs[1], def: evs[2], spa: evs[3], spd: evs[4], spe: evs[5] },
            ot: document.getElementById('otInput').value || 'Trainer',
            otGender: document.getElementById('otGenderSelect').value || 'M',
            tid: String(document.getElementById('tidInput').value || '12345').padStart(5, '0'),
            sid: String(document.getElementById('sidInput').value || '54321').padStart(5, '0')
        };
    }

    generateDiscordFormat(data) {
        // Use the display name (nickname if provided, otherwise species)
        const displayName = data.nickname || data.species;
        
        let output = '';
        output += `${displayName} (${data.species})`;
        if (data.gender) output += ` (${data.gender})`;
        if (data.item !== 'None') output += ` @ ${data.item}`;
        output += `\nOT: ${data.ot}`;
        output += `\nTID: ${data.tid}`;
        output += `\nSID: ${data.sid}`;
        output += `\nOTGender: ${data.otGender}`;
        output += `\nLanguage: English`;
        output += `\nAbility: ${data.ability}`;
        if (data.shiny) {
            output += `\nShiny: Yes`;
        }
        output += `\nBall: ${data.ball}`;
        
        // Add EVs (only non-zero values)
        const evs = [];
        if (data.evs.hp) evs.push(`${data.evs.hp} HP`);
        if (data.evs.atk) evs.push(`${data.evs.atk} Atk`);
        if (data.evs.def) evs.push(`${data.evs.def} Def`);
        if (data.evs.spa) evs.push(`${data.evs.spa} SpA`);
        if (data.evs.spd) evs.push(`${data.evs.spd} SpD`);
        if (data.evs.spe) evs.push(`${data.evs.spe} Spe`);
        if (evs.length) output += `\nEVs: ${evs.join(' / ')}`;
        
        // Add IVs (only non-31 values)
        const ivs = [];
        if (data.ivs.hp !== 31) ivs.push(`${data.ivs.hp} HP`);
        if (data.ivs.atk !== 31) ivs.push(`${data.ivs.atk} Atk`);
        if (data.ivs.def !== 31) ivs.push(`${data.ivs.def} Def`);
        if (data.ivs.spa !== 31) ivs.push(`${data.ivs.spa} SpA`);
        if (data.ivs.spd !== 31) ivs.push(`${data.ivs.spd} SpD`);
        if (data.ivs.spe !== 31) ivs.push(`${data.ivs.spe} Spe`);
        if (ivs.length) output += `\nIVs: ${ivs.join(' / ')}`;
        
        output += `\n${data.nature} Nature`;
        
        // Add moves
        data.moves.forEach(move => output += `\n- ${move}`);

        return output;
    }

    generateShowdownFormat(data) {
        const displayName = data.nickname || data.species;
        
        let output = `${displayName}`;
        if (data.nickname && data.nickname !== data.species) {
            output = `${data.nickname} (${data.species})`;
        }
        if (data.gender) output += ` (${data.gender})`;
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