class PokemonGenerator {
    constructor() {
        this.pokemonData = null;
        this.selectedPokemon = null;
        this.pokemonList = [];
        this.moves = [];
        this.items = [];
        this.currentSuggestionIndex = -1;
        
        this.natures = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"];
        
        this.balls = ["Poke Ball", "Great Ball", "Ultra Ball", "Master Ball", "Premier Ball", "Luxury Ball", "Heal Ball", "Net Ball", "Dive Ball", "Nest Ball", "Repeat Ball", "Timer Ball", "Quick Ball", "Dusk Ball", "Cherish Ball", "Friend Ball", "Level Ball", "Love Ball", "Lure Ball", "Heavy Ball", "Fast Ball", "Moon Ball", "Beast Ball", "Dream Ball"];
        
        this.init();
    }

    async init() {
        this.showLoading(true);
        try {
            await this.loadInitialData();
            this.setupEventListeners();
            this.populateStaticDropdowns();
            console.log('Pokemon Generator initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
            alert('Error initializing application. Some features may not work properly.');
        }
        this.showLoading(false);
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    async loadInitialData() {
        try {
            console.log('Loading complete Pokemon database...');
            // Load Pokemon with a more reasonable limit and better error handling
            const pokemonResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
            if (!pokemonResponse.ok) {
                throw new Error(`Pokemon API error: ${pokemonResponse.status}`);
            }
            const pokemonData = await pokemonResponse.json();
            this.pokemonList = pokemonData.results.map(pokemon => ({
                name: pokemon.name,
                url: pokemon.url
            }));
            console.log(`Loaded ${this.pokemonList.length} Pokemon`);

            // Load competitive items list
            const competitiveItems = [
                'leftovers', 'life-orb', 'choice-band', 'choice-scarf', 'choice-specs',
                'focus-sash', 'assault-vest', 'rocky-helmet', 'heat-rock', 'light-clay',
                'mental-herb', 'power-herb', 'white-herb', 'bright-powder', 'scope-lens',
                'razor-claw', 'expert-belt', 'muscle-band', 'wise-glasses', 'metronome',
                'flame-orb', 'toxic-orb', 'black-sludge', 'sticky-barb', 'iron-ball',
                'lagging-tail', 'shed-shell', 'big-root', 'binding-band', 'grip-claw',
                'quick-powder', 'metal-powder', 'thick-club', 'light-ball', 'soul-dew',
                'deep-sea-tooth', 'deep-sea-scale', 'eviolite', 'float-stone', 'air-balloon',
                'red-card', 'eject-button', 'weakness-policy', 'snowball', 'luminous-moss',
                'absorb-bulb', 'cell-battery', 'adrenaline-orb', 'terrain-extender',
                'protective-pads', 'throat-spray', 'heavy-duty-boots', 'utility-umbrella',
                'blunder-policy', 'room-service', 'eject-pack', 'loaded-dice', 'booster-energy',
                'ability-shield', 'clear-amulet', 'mirror-herb', 'punching-glove', 'covert-cloak',
                // Berries
                'sitrus-berry', 'lum-berry', 'chesto-berry', 'pecha-berry', 'rawst-berry',
                'aspear-berry', 'leppa-berry', 'oran-berry', 'persim-berry', 'cheri-berry',
                'figy-berry', 'wiki-berry', 'mago-berry', 'aguav-berry', 'iapapa-berry',
                'liechi-berry', 'ganlon-berry', 'salac-berry', 'petaya-berry', 'apicot-berry',
                'lansat-berry', 'starf-berry', 'enigma-berry', 'micle-berry', 'custap-berry',
                'jaboca-berry', 'rowap-berry', 'kee-berry', 'maranga-berry',
                // Type-enhancing items
                'silk-scarf', 'black-belt', 'sharp-beak', 'poison-barb', 'soft-sand',
                'hard-stone', 'silver-powder', 'spell-tag', 'metal-coat', 'charcoal',
                'mystic-water', 'miracle-seed', 'magnet', 'twisted-spoon', 'never-melt-ice',
                'dragon-fang', 'black-glasses', 'pink-bow', 'fairy-feather'
            ];

            this.items = competitiveItems.map(item => ({
                name: this.formatName(item),
                value: item
            })).sort((a, b) => a.name.localeCompare(b.name));

            console.log(`Loaded ${this.items.length} held items`);

        } catch (error) {
            console.error('Error loading initial data:', error);
            // Fallback with basic data to ensure app works
            this.pokemonList = [
                {name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/'},
                {name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/'},
                {name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/'},
                {name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/'},
                {name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/'},
                {name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/'},
                {name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/'},
                {name: 'wartortle', url: 'https://pokeapi.co/api/v2/pokemon/8/'},
                {name: 'blastoise', url: 'https://pokeapi.co/api/v2/pokemon/9/'},
                {name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/'},
                {name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/'},
                {name: 'mewtwo', url: 'https://pokeapi.co/api/v2/pokemon/150/'},
                {name: 'mew', url: 'https://pokeapi.co/api/v2/pokemon/151/'}
            ];
            this.items = [
                {name: 'Leftovers', value: 'leftovers'},
                {name: 'Life Orb', value: 'life-orb'},
                {name: 'Choice Band', value: 'choice-band'},
                {name: 'Choice Scarf', value: 'choice-scarf'},
                {name: 'Focus Sash', value: 'focus-sash'}
            ];
            console.log('Using fallback Pokemon and items data');
        }
    }

    setupEventListeners() {
        // Pokemon search with improved error handling
        const pokemonSearch = document.getElementById('pokemon-search');
        const suggestions = document.getElementById('pokemon-suggestions');
        
        if (!pokemonSearch || !suggestions) {
            console.error('Required DOM elements not found');
            return;
        }
        
        pokemonSearch.addEventListener('input', (e) => {
            console.log('Search input:', e.target.value);
            this.handlePokemonSearch(e.target.value);
        });
        
        pokemonSearch.addEventListener('keydown', (e) => this.handleSearchKeydown(e));
        
        pokemonSearch.addEventListener('focus', (e) => {
            if (e.target.value.length >= 1) {
                this.handlePokemonSearch(e.target.value);
            }
        });
        
        pokemonSearch.addEventListener('blur', () => {
            setTimeout(() => suggestions.classList.add('hidden'), 300);
        });

        // EV validation with better error handling
        const evInputs = document.querySelectorAll('.ev-input');
        evInputs.forEach(input => {
            input.addEventListener('input', () => this.validateEVs());
        });

        // Shiny toggle
        const shinyCheckbox = document.getElementById('shiny');
        if (shinyCheckbox) {
            shinyCheckbox.addEventListener('change', (e) => {
                this.updateSprite(e.target.checked);
            });
        }

        // Generate button
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                console.log('Generate button clicked');
                this.generatePokemon();
            });
        }

        // Copy button
        const copyBtn = document.getElementById('copy-discord');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
    }

    populateStaticDropdowns() {
        // Nature dropdown
        const natureSelect = document.getElementById('nature');
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
        const ballSelect = document.getElementById('ball');
        if (ballSelect) {
            ballSelect.innerHTML = '<option value="">Select ball...</option>';
            this.balls.forEach(ball => {
                const option = document.createElement('option');
                option.value = ball;
                option.textContent = ball;
                ballSelect.appendChild(option);
            });
        }

        // Item dropdown
        const itemSelect = document.getElementById('held-item');
        if (itemSelect) {
            itemSelect.innerHTML = '<option value="">No item</option>';
            this.items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.value;
                option.textContent = item.name;
                itemSelect.appendChild(option);
            });
        }
        
        console.log('Static dropdowns populated');
    }

    handlePokemonSearch(query) {
        const suggestions = document.getElementById('pokemon-suggestions');
        
        if (!suggestions) {
            console.error('Suggestions element not found');
            return;
        }
        
        if (query.length < 1) {
            suggestions.classList.add('hidden');
            return;
        }

        const filtered = this.pokemonList.filter(pokemon => 
            pokemon.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

        console.log(`Found ${filtered.length} matches for "${query}"`);

        if (filtered.length === 0) {
            suggestions.innerHTML = '<div class="suggestion-item">No Pokemon found</div>';
            suggestions.classList.remove('hidden');
            return;
        }

        suggestions.innerHTML = '';
        filtered.forEach((pokemon, index) => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = this.formatName(pokemon.name);
            div.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.selectPokemon(pokemon);
            });
            suggestions.appendChild(div);
        });

        suggestions.classList.remove('hidden');
        this.currentSuggestionIndex = -1;
    }

    handleSearchKeydown(e) {
        const suggestions = document.getElementById('pokemon-suggestions');
        if (!suggestions) return;
        
        const items = suggestions.querySelectorAll('.suggestion-item');
        
        if (items.length === 0) return;

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.currentSuggestionIndex = Math.min(this.currentSuggestionIndex + 1, items.length - 1);
                this.highlightSuggestion(items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.currentSuggestionIndex = Math.max(this.currentSuggestionIndex - 1, -1);
                this.highlightSuggestion(items);
                break;
            case 'Enter':
                e.preventDefault();
                if (this.currentSuggestionIndex >= 0) {
                    const selectedText = items[this.currentSuggestionIndex].textContent;
                    const selectedPokemon = this.pokemonList.find(p => 
                        this.formatName(p.name) === selectedText
                    );
                    if (selectedPokemon) {
                        this.selectPokemon(selectedPokemon);
                    }
                }
                break;
            case 'Escape':
                suggestions.classList.add('hidden');
                break;
        }
    }

    highlightSuggestion(items) {
        items.forEach(item => item.classList.remove('highlighted'));
        if (this.currentSuggestionIndex >= 0) {
            items[this.currentSuggestionIndex].classList.add('highlighted');
        }
    }

    async selectPokemon(pokemon) {
        console.log('Selecting Pokemon:', pokemon.name);
        this.showLoading(true);
        
        try {
            // Load Pokemon data
            const response = await fetch(pokemon.url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.pokemonData = await response.json();
            console.log('Pokemon data loaded:', this.pokemonData);
            
            // Load species data for gender info
            const speciesResponse = await fetch(this.pokemonData.species.url);
            if (!speciesResponse.ok) {
                throw new Error(`HTTP error! status: ${speciesResponse.status}`);
            }
            const speciesData = await speciesResponse.json();
            
            this.selectedPokemon = {
                ...this.pokemonData,
                species: speciesData
            };

            // Update UI
            const pokemonSearchInput = document.getElementById('pokemon-search');
            const pokemonSuggestions = document.getElementById('pokemon-suggestions');
            const nicknameInput = document.getElementById('nickname');
            
            if (pokemonSearchInput) pokemonSearchInput.value = this.formatName(pokemon.name);
            if (pokemonSuggestions) pokemonSuggestions.classList.add('hidden');
            if (nicknameInput) nicknameInput.value = this.formatName(pokemon.name);
            
            this.updateGenderDropdown(speciesData.gender_rate);
            this.updateAbilities();
            await this.updateMoves();
            this.updateSprite(false);
            
            console.log('Pokemon selection complete');
            
        } catch (error) {
            console.error('Error loading Pokemon:', error);
            alert('Error loading Pokemon data. Please try again.');
        }
        
        this.showLoading(false);
    }

    updateGenderDropdown(genderRate) {
        const genderGroup = document.getElementById('gender-group');
        const genderSelect = document.getElementById('gender');
        
        if (!genderGroup || !genderSelect) return;
        
        console.log('Gender rate:', genderRate);
        
        // Hide gender dropdown for genderless, male-only, or female-only Pokemon
        if (genderRate === -1 || genderRate === 0 || genderRate === 8) {
            genderGroup.classList.add('hidden');
            
            // Set appropriate gender value for export
            if (genderRate === 0) {
                genderSelect.value = 'M'; // Male-only
            } else if (genderRate === 8) {
                genderSelect.value = 'F'; // Female-only
            } else {
                genderSelect.value = ''; // Genderless
            }
        } else {
            // Show gender dropdown for Pokemon that can be both genders
            genderGroup.classList.remove('hidden');
            genderSelect.value = 'M'; // Default to male
        }
    }

    updateAbilities() {
        const abilitySelect = document.getElementById('ability');
        if (!abilitySelect || !this.pokemonData.abilities) return;
        
        abilitySelect.innerHTML = '<option value="">Select ability...</option>';
        
        // Add regular abilities first
        this.pokemonData.abilities.forEach(abilityData => {
            if (!abilityData.is_hidden) {
                const option = document.createElement('option');
                option.value = abilityData.ability.name;
                option.textContent = this.formatName(abilityData.ability.name);
                abilitySelect.appendChild(option);
            }
        });
        
        // Add hidden ability if it exists
        const hiddenAbility = this.pokemonData.abilities.find(a => a.is_hidden);
        if (hiddenAbility) {
            const option = document.createElement('option');
            option.value = hiddenAbility.ability.name;
            option.textContent = this.formatName(hiddenAbility.ability.name) + ' (HA)';
            abilitySelect.appendChild(option);
        }
        
        // Select first ability by default
        if (this.pokemonData.abilities.length > 0) {
            abilitySelect.value = this.pokemonData.abilities[0].ability.name;
        }
        
        console.log('Abilities updated');
    }

    async updateMoves() {
        console.log('Loading legal moves for', this.pokemonData.name);
        const moveSelects = ['move1', 'move2', 'move3', 'move4'];
        
        // Get all move data for this Pokemon
        const moves = this.pokemonData.moves.map(moveData => ({
            name: this.formatName(moveData.move.name),
            value: moveData.move.name
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        console.log(`Found ${moves.length} legal moves`);
        
        moveSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;
            
            select.innerHTML = '<option value="">Select move...</option>';
            
            moves.forEach(move => {
                const option = document.createElement('option');
                option.value = move.value;
                option.textContent = move.name;
                select.appendChild(option);
            });
        });
        
        console.log('Move selects updated with legal moveset');
    }

    updateSprite(isShiny = false) {
        if (!this.pokemonData) return;
        
        const sprite = document.getElementById('pokemon-sprite');
        const placeholder = document.querySelector('.sprite-placeholder');
        
        if (!sprite) return;
        
        const spriteUrl = isShiny 
            ? this.pokemonData.sprites.front_shiny || this.pokemonData.sprites.front_default
            : this.pokemonData.sprites.front_default;
        
        if (spriteUrl) {
            sprite.src = spriteUrl;
            sprite.classList.remove('hidden');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            console.log('Sprite updated:', spriteUrl);
        }
    }

    validateEVs() {
        const evInputs = document.querySelectorAll('.ev-input');
        let total = 0;
        
        evInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            if (value > 252) {
                input.value = 252;
            }
            total += parseInt(input.value) || 0;
        });
        
        const evCounter = document.getElementById('ev-total');
        const totalEvsDisplay = document.getElementById('total-evs-display');
        
        if (evCounter) {
            evCounter.textContent = `${total}/510`;
            if (total > 510) {
                evCounter.classList.add('over-limit');
            } else {
                evCounter.classList.remove('over-limit');
            }
        }
        
        if (totalEvsDisplay) {
            totalEvsDisplay.textContent = `${total}/510`;
            if (total > 510) {
                totalEvsDisplay.classList.add('over-limit');
            } else {
                totalEvsDisplay.classList.remove('over-limit');
            }
        }
        
        return total <= 510;
    }

    generatePokemon() {
        console.log('Generating Pokemon...');
        
        if (!this.selectedPokemon) {
            alert('Please select a Pokemon first!');
            return;
        }

        if (!this.validateForm()) {
            return;
        }

        const pokemonData = this.collectFormData();
        console.log('Collected form data:', pokemonData);
        
        const discordOutput = this.formatDiscordOutput(pokemonData);
        console.log('Generated output:', discordOutput);
        
        const outputElement = document.getElementById('discord-output');
        const outputSection = document.getElementById('output-section');
        
        if (outputElement && outputSection) {
            outputElement.textContent = discordOutput;
            outputSection.classList.remove('hidden');
            
            // Scroll to output
            outputSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    validateForm() {
        const requiredFields = [
            {id: 'ability', name: 'Ability'},
            {id: 'nature', name: 'Nature'}
        ];
        let isValid = true;
        let missingFields = [];
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element || !element.value) {
                if (element) element.classList.add('error');
                missingFields.push(field.name);
                isValid = false;
            } else {
                element.classList.remove('error');
            }
        });
        
        if (missingFields.length > 0) {
            alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
        }
        
        if (!this.validateEVs()) {
            alert('Total EVs cannot exceed 510!');
            isValid = false;
        }
        
        return isValid;
    }

    collectFormData() {
        const genderRate = this.selectedPokemon.species.gender_rate;
        let gender = '';
        
        if (genderRate === -1) {
            gender = ''; // Genderless
        } else if (genderRate === 0) {
            gender = 'M'; // Male-only
        } else if (genderRate === 8) {
            gender = 'F'; // Female-only
        } else {
            const genderSelect = document.getElementById('gender');
            gender = genderSelect ? genderSelect.value : 'M';
        }
        
        const getValue = (id, defaultValue = '') => {
            const element = document.getElementById(id);
            return element ? element.value : defaultValue;
        };

        const getChecked = (id) => {
            const element = document.getElementById(id);
            return element ? element.checked : false;
        };
        
        return {
            nickname: getValue('nickname') || this.formatName(this.selectedPokemon.name),
            species: this.formatName(this.selectedPokemon.name),
            gender: gender,
            level: getValue('level', '50'),
            ability: this.formatName(getValue('ability')),
            nature: getValue('nature'),
            heldItem: getValue('held-item') ? this.formatName(getValue('held-item')) : '',
            ball: getValue('ball', 'Poke Ball'),
            shiny: getChecked('shiny'),
            ot: getValue('ot', 'Trainer'),
            tid: getValue('tid', '12345'),
            sid: getValue('sid', '54321'),
            otGender: getValue('ot-gender', 'M'),
            ivs: {
                hp: getValue('iv-hp', '31'),
                atk: getValue('iv-atk', '31'),
                def: getValue('iv-def', '31'),
                spa: getValue('iv-spa', '31'),
                spd: getValue('iv-spd', '31'),
                spe: getValue('iv-spe', '31')
            },
            evs: {
                hp: getValue('ev-hp', '0'),
                atk: getValue('ev-atk', '0'),
                def: getValue('ev-def', '0'),
                spa: getValue('ev-spa', '0'),
                spd: getValue('ev-spd', '0'),
                spe: getValue('ev-spe', '0')
            },
            moves: [
                getValue('move1') ? this.formatName(getValue('move1')) : '',
                getValue('move2') ? this.formatName(getValue('move2')) : '',
                getValue('move3') ? this.formatName(getValue('move3')) : '',
                getValue('move4') ? this.formatName(getValue('move4')) : ''
            ].filter(move => move !== '')
        };
    }

    formatDiscordOutput(data) {
        let output = '';
        
        // Pokemon line
        output += `${data.nickname} (${data.species})`;
        if (data.gender) {
            output += ` (${data.gender})`;
        }
        if (data.heldItem) {
            output += ` @ ${data.heldItem}`;
        }
        output += '\n';
        
        // Trainer info
        output += `OT: ${data.ot}\n`;
        output += `TID: ${data.tid}\n`;
        output += `SID: ${data.sid}\n`;
        output += `OTGender: ${data.otGender}\n`;
        output += `Language: English\n`;
        
        // Pokemon details
        output += `Ability: ${data.ability}\n`;
        output += `Shiny: ${data.shiny ? 'Yes' : 'No'}\n`;
        output += `Ball: ${data.ball}\n`;
        
        // EVs (only show non-zero values)
        const evParts = [];
        if (parseInt(data.evs.hp) > 0) evParts.push(`${data.evs.hp} HP`);
        if (parseInt(data.evs.atk) > 0) evParts.push(`${data.evs.atk} Atk`);
        if (parseInt(data.evs.def) > 0) evParts.push(`${data.evs.def} Def`);
        if (parseInt(data.evs.spa) > 0) evParts.push(`${data.evs.spa} SpA`);
        if (parseInt(data.evs.spd) > 0) evParts.push(`${data.evs.spd} SpD`);
        if (parseInt(data.evs.spe) > 0) evParts.push(`${data.evs.spe} Spe`);
        
        if (evParts.length > 0) {
            output += `EVs: ${evParts.join(' / ')}\n`;
        }
        
        // IVs (only show non-31 values)
        const ivParts = [];
        if (parseInt(data.ivs.hp) !== 31) ivParts.push(`${data.ivs.hp} HP`);
        if (parseInt(data.ivs.atk) !== 31) ivParts.push(`${data.ivs.atk} Atk`);
        if (parseInt(data.ivs.def) !== 31) ivParts.push(`${data.ivs.def} Def`);
        if (parseInt(data.ivs.spa) !== 31) ivParts.push(`${data.ivs.spa} SpA`);
        if (parseInt(data.ivs.spd) !== 31) ivParts.push(`${data.ivs.spd} SpD`);
        if (parseInt(data.ivs.spe) !== 31) ivParts.push(`${data.ivs.spe} Spe`);
        
        if (ivParts.length > 0) {
            output += `IVs: ${ivParts.join(' / ')}\n`;
        }
        
        // Nature
        output += `${data.nature} Nature\n`;
        
        // Moves
        data.moves.forEach(move => {
            if (move) {
                output += `- ${move}\n`;
            }
        });
        
        return output.trim();
    }

    async copyToClipboard() {
        const text = document.getElementById('discord-output').textContent;
        try {
            await navigator.clipboard.writeText(text);
            const button = document.getElementById('copy-discord');
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const button = document.getElementById('copy-discord');
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }
        }
    }

    formatName(name) {
        if (!name) return '';
        return name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Pokemon Generator...');
    new PokemonGenerator();
});