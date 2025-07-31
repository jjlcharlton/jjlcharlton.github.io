// Pokemon Generator with CRITICAL FIX for Legal Move Filtering
class PokemonGenerator {
    constructor() {
        this.pokemonData = [];
        this.itemsData = [];
        this.movesData = [];
        this.currentPokemon = null;
        this.currentPokemonMoves = []; // CRITICAL: Store legal moves for current Pokemon
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

            // CRITICAL FIX: Setup move SELECT dropdowns
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

    // CRITICAL FIX: Setup move SELECT dropdowns
    setupMoveSelects() {
        console.log('Setting up move SELECT dropdowns...');
        
        for (let i = 1; i <= 4; i++) {
            const moveSelect = document.getElementById(`moveSelect${i}`);
            if (moveSelect) {
                moveSelect.addEventListener('change', (e) => {
                    const moveIndex = parseInt(e.target.dataset.move);
                    this.selectedMoves[moveIndex] = e.target.value;
                    console.log(`Move ${moveIndex + 1} changed to:`, e.target.value);
                    this.validateForm();
                });
            }
        }
        
        console.log('Move SELECT dropdowns setup complete');
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

        // CRITICAL FIX: Clear and reset move dropdowns immediately
        this.clearMoveSelections();

        // CRITICAL FIX: Load legal moves for this Pokemon
        await this.loadPokemonMoves(pokemon);

        // Try to load detailed data from API in background (for better types/abilities)
        this.loadDetailedPokemonData(pokemon);

        // Immediately validate form
        this.validateForm();
    }

    // CRITICAL FIX: Clear move selections and reset dropdowns
    clearMoveSelections() {
        console.log('Clearing move selections...');
        
        this.selectedMoves = ['', '', '', ''];
        
        // Reset all move SELECT dropdowns to "Loading moves..."
        for (let i = 1; i <= 4; i++) {
            const moveSelect = document.getElementById(`moveSelect${i}`);
            if (moveSelect) {
                moveSelect.innerHTML = '<option value="">Loading moves...</option>';
                moveSelect.value = '';
            }
        }
    }

    // CRITICAL FIX: Load legal moves from PokéAPI for the selected Pokemon
    async loadPokemonMoves(pokemon) {
        console.log('Loading legal moves for Pokemon:', pokemon.name);
        
        // Show loading indicator
        const loadingIndicator = document.getElementById('movesLoadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        try {
            // Fetch Pokemon data from PokéAPI to get legal moves
            console.log(`Fetching Pokemon data for ${pokemon.name}...`);
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            
            const pokemonData = await response.json();
            console.log('Pokemon data received:', pokemonData);
            
            // Extract moves array - only move names
            if (!pokemonData.moves || pokemonData.moves.length === 0) {
                throw new Error('No moves found in Pokemon data');
            }
            
            const legalMoves = pokemonData.moves.map(moveSlot => 
                this.formatName(moveSlot.move.name)
            ).sort();
            
            this.currentPokemonMoves = legalMoves;
            
            console.log(`Successfully loaded ${legalMoves.length} legal moves for ${pokemon.name}`);
            console.log('First 10 moves:', legalMoves.slice(0, 10));
            
            // CRITICAL FIX: Populate all move SELECT dropdowns with legal moves
            this.populateMoveDropdowns(legalMoves);
            
        } catch (error) {
            console.error('Error loading Pokemon moves:', error);
            
            // CRITICAL FIX: Better fallback with generic moves
            const fallbackMoves = [
                'Tackle', 'Quick Attack', 'Swift', 'Double Team', 'Rest', 
                'Sleep Talk', 'Substitute', 'Protect', 'Return', 'Frustration',
                'Hidden Power', 'Double Edge', 'Body Slam', 'Take Down'
            ].sort();
            
            this.currentPokemonMoves = fallbackMoves;
            this.populateMoveDropdowns(fallbackMoves);
            
            console.log('Using fallback moves due to API error');
            
        } finally {
            // Hide loading indicator
            const loadingIndicator = document.getElementById('movesLoadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
    }

    // CRITICAL FIX: Populate move SELECT dropdowns with legal moves only
    populateMoveDropdowns(legalMoves) {
        console.log('Populating move dropdowns with', legalMoves.length, 'legal moves...');
        
        for (let i = 1; i <= 4; i++) {
            const moveSelect = document.getElementById(`moveSelect${i}`);
            if (!moveSelect) {
                console.error(`Move select ${i} not found!`);
                continue;
            }
            
            // Clear existing options
            moveSelect.innerHTML = '';
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Select Move --';
            moveSelect.appendChild(defaultOption);
            
            // Add legal moves as options
            legalMoves.forEach(move => {
                const option = document.createElement('option');
                option.value = move;
                option.textContent = move;
                moveSelect.appendChild(option);
            });
            
            console.log(`Move ${i} dropdown populated with ${legalMoves.length} legal moves`);
        }
        
        console.log('All move dropdowns populated successfully');
        
        // Validate form after populating moves
        this.validateForm();
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
            const genderRate = this.currentPokemon.genderRate;
            
            if (genderRate === -1 || genderRate === 0 || genderRate === 8) {
                // Hide gender selection for:
                // -1 = Genderless Pokemon
                // 0 = Male-only Pokemon (like Tauros, Throh)
                // 8 = Female-only Pokemon (like Chansey, Vullaby)
                genderSection.style.display = 'none';
                genderSelect.value = '';
                
                if (genderRate === -1) {
                    console.log('Pokemon is genderless, hiding gender section');
                } else if (genderRate === 0) {
                    console.log('Pokemon is male-only, hiding gender section');
                } else if (genderRate === 8) {
                    console.log('Pokemon is female-only, hiding gender section');
                }
            } else {
                // Show gender selection for Pokemon that can be both male and female
                // Gender rates 1, 2, 4, 6 represent different male/female ratios
                genderSection.style.display = 'block';
                if (!genderSelect.value) {
                    // Set default gender based on gender rate
                    genderSelect.value = genderRate <= 4 ? 'M' : 'F';
                }
                console.log('Pokemon can be both genders, showing gender section');
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

        // Check gender for Pokemon that can be both genders
        if (this.currentPokemon && this.currentPokemon.genderRate !== -1 && 
            this.currentPokemon.genderRate !== 0 && this.currentPokemon.genderRate !== 8) {
            const genderSelect = document.getElementById('genderSelect');
            if (!genderSelect?.value) {
                errors.push('Select gender');
            }
        }

        // CRITICAL FIX: Check moves from SELECT dropdowns
        const moveSelects = Array.from(document.querySelectorAll('.move-select'));
        const filledMoves = moveSelects.filter(select => select.value.trim()).length;
        if (filledMoves === 0) {
            errors.push('Select at least 1 move');
        }

        // Update selectedMoves array from dropdowns
        this.selectedMoves = moveSelects.map(select => select.value.trim());

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
        // CRITICAL FIX: Get moves from SELECT dropdowns
        const moveSelects = Array.from(document.querySelectorAll('.move-select'));
        const moves = moveSelects.map(select => select.value.trim()).filter(Boolean);

        const ivInputs = Array.from(document.querySelectorAll('.iv-input'));
        const ivs = ivInputs.map(input => parseInt(input.value) || 31);

        const evInputs = Array.from(document.querySelectorAll('.ev-input'));
        const evs = evInputs.map(input => parseInt(input.value) || 0);

        // Get gender for Pokemon
        let gender = '';
        if (this.currentPokemon) {
            const genderRate = this.currentPokemon.genderRate;

            if (genderRate === -1) {
                // Genderless Pokemon - no gender
                gender = '';
            } else if (genderRate === 0) {
                // Male-only Pokemon (like Tauros, Throh)
                gender = 'M';
            } else if (genderRate === 8) {
                // Female-only Pokemon (like Chansey, Vullaby)
                gender = 'F';
            } else {
                // Pokemon that can be both genders - get from dropdown
                const genderSelect = document.getElementById('genderSelect');
                gender = genderSelect?.value || '';
            }
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