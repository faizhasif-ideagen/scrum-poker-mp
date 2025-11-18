// Game State
const GameState = {
    LOGIN: 'login',
    NETWORK_LOGIN: 'network_login',
    ESTIMATION: 'estimation',
    SETUP: 'setup',
    BATTLE: 'battle',
    WINNER: 'winner',
    RANKINGS: 'rankings'
};

class Game {
    constructor() {
        this.state = GameState.LOGIN;
        this.players = [];
        this.networkPlayers = [];
        this.battleKnights = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.battleStartTime = 0;
        this.keys = {};
        this.teams = { left: [], right: [] };
        this.currentBattleStats = {};
        this.battleEnded = false;

        this.loadPlayersFromStorage();
        this.initEventListeners();
    }

    initEventListeners() {
        // Login screen
        document.getElementById('networkLoginBtn').addEventListener('click', () => this.showNetworkLogin());
        document.getElementById('localPlayBtn').addEventListener('click', () => this.showLocalPlay());

        // Network login screen
        document.getElementById('mockLoginBtn').addEventListener('click', () => this.mockPlayerLogin());
        document.getElementById('networkContinueBtn').addEventListener('click', () => this.continueFromNetwork());
        document.getElementById('backToLoginBtn').addEventListener('click', () => this.showScreen(GameState.LOGIN));

        // Estimation screen
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeTask());
        document.getElementById('proceedToSetupBtn').addEventListener('click', () => this.proceedToSetup());
        document.getElementById('taskDescription').addEventListener('input', () => {
            // Clear results when user starts typing again
            const resultsDiv = document.getElementById('analysisResults');
            if (!resultsDiv.querySelector('.waiting-message')) {
                // Results exist, show a hint that they can re-analyze
            }
        });

        // Setup screen
        document.getElementById('addPlayerBtn').addEventListener('click', () => this.addPlayer());
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPlayer();
        });
        document.getElementById('startTournamentBtn').addEventListener('click', () => this.startBattle());
        document.getElementById('finishRoundBtn').addEventListener('click', () => this.showRankings());

        // Winner screen
        document.getElementById('editPointsBtn').addEventListener('click', () => this.editStoryPoints());
        document.getElementById('nextBattleBtn').addEventListener('click', () => this.nextBattle());
        document.getElementById('viewRankingsBtn').addEventListener('click', () => this.showRankings());
        document.getElementById('newTournamentBtn').addEventListener('click', () => this.reset());

        // Rankings screen
        document.getElementById('backToSetupBtn').addEventListener('click', () => {
            this.showScreen(GameState.SETUP);
            // Scroll to player input section
            setTimeout(() => {
                const setupContainer = document.querySelector('.setup-container');
                if (setupContainer) {
                    setupContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        });
        document.getElementById('resetStatsBtn').addEventListener('click', () => this.resetAllStats());
        document.getElementById('clearAllDataBtn').addEventListener('click', () => this.clearAllData());

        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ' && this.state === GameState.BATTLE) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    analyzeTask() {
        const textarea = document.getElementById('taskDescription');
        const text = textarea.value.trim();

        if (!text) {
            alert('Please enter a task description first!');
            return;
        }

        // Show loading state
        const resultsDiv = document.getElementById('analysisResults');
        resultsDiv.innerHTML = '<div class="analyzing"><span class="spinner">⚙️</span><p>Analyzing task complexity...</p></div>';

        // Simulate AI processing delay
        setTimeout(() => {
            const analysis = this.performAIAnalysis(text);
            this.displayAnalysis(analysis);
        }, 1500);
    }

    performAIAnalysis(text) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
        const chars = text.length;

        // Complexity indicators
        const technicalWords = ['API', 'database', 'authentication', 'integration', 'deployment', 'security', 'encryption', 'optimization', 'architecture', 'infrastructure', 'migration', 'refactor', 'algorithm', 'backend', 'frontend', 'microservice', 'cloud', 'server', 'testing', 'validation'];
        const uncertainWords = ['maybe', 'possibly', 'unclear', 'TBD', 'not sure', 'depends', 'complex', 'complicated'];
        const integrationWords = ['integrate', 'connect', 'sync', 'third-party', 'external', 'API', 'webhook', 'service'];
        const multipleWords = ['multiple', 'several', 'many', 'various', 'different', 'all', 'every'];

        const textLower = text.toLowerCase();

        const technicalCount = technicalWords.filter(w => textLower.includes(w.toLowerCase())).length;
        const uncertainCount = uncertainWords.filter(w => textLower.includes(w.toLowerCase())).length;
        const integrationCount = integrationWords.filter(w => textLower.includes(w.toLowerCase())).length;
        const multipleCount = multipleWords.filter(w => textLower.includes(w.toLowerCase())).length;

        // Calculate complexity score (0-100)
        let complexityScore = 0;

        // Base complexity from length
        complexityScore += Math.min(words / 10, 15); // Up to 15 points for length
        complexityScore += Math.min(sentences * 3, 15); // Up to 15 points for detail

        // Technical complexity
        complexityScore += technicalCount * 8; // Each technical term adds
        complexityScore += integrationCount * 6; // Integration points
        complexityScore += multipleCount * 4; // Scope indicators
        complexityScore += uncertainCount * 5; // Uncertainty adds complexity

        // Cap at 100
        complexityScore = Math.min(complexityScore, 100);

        // Map to Fibonacci story points
        let recommendedPoints;
        let confidence;
        let reasoning = [];

        if (complexityScore < 10) {
            recommendedPoints = [1, 2];
            confidence = 'High';
            reasoning.push('Very simple task with minimal complexity');
        } else if (complexityScore < 25) {
            recommendedPoints = [2, 3];
            confidence = 'High';
            reasoning.push('Simple task with straightforward implementation');
        } else if (complexityScore < 40) {
            recommendedPoints = [3, 5];
            confidence = 'Medium';
            reasoning.push('Moderate complexity requiring some planning');
        } else if (complexityScore < 60) {
            recommendedPoints = [5, 8];
            confidence = 'Medium';
            reasoning.push('Complex task with multiple components');
        } else if (complexityScore < 80) {
            recommendedPoints = [8, 13];
            confidence = 'Low';
            reasoning.push('Highly complex task requiring significant effort');
        } else {
            recommendedPoints = [13, 21];
            confidence = 'Low';
            reasoning.push('Very complex task, consider breaking down');
        }

        // Add specific reasoning
        if (technicalCount > 2) reasoning.push(`${technicalCount} technical terms detected`);
        if (integrationCount > 0) reasoning.push('Involves integration with external systems');
        if (uncertainCount > 0) reasoning.push('Contains uncertainty - may need clarification');
        if (multipleCount > 2) reasoning.push('Broad scope - affects multiple areas');
        if (words > 100) reasoning.push('Detailed description suggests complex requirements');

        return {
            text,
            words,
            sentences,
            complexityScore: Math.round(complexityScore),
            recommendedPoints,
            confidence,
            reasoning,
            technicalCount,
            integrationCount,
            uncertainCount
        };
    }

    displayAnalysis(analysis) {
        const resultsDiv = document.getElementById('analysisResults');

        const primaryPoint = analysis.recommendedPoints[0];
        const secondaryPoint = analysis.recommendedPoints[1];

        resultsDiv.innerHTML = `
            <div class="analysis-complete">
                <div class="complexity-meter">
                    <div class="complexity-label">Complexity Score</div>
                    <div class="complexity-bar">
                        <div class="complexity-fill" style="width: ${analysis.complexityScore}%"></div>
                    </div>
                    <div class="complexity-value">${analysis.complexityScore}/100</div>
                </div>

                <div class="recommended-points">
                    <h3>Recommended Story Points</h3>
                    <div class="points-options">
                        <div class="point-option primary">
                            <div class="point-number">${primaryPoint}</div>
                            <div class="point-label">Primary Recommendation</div>
                        </div>
                        <div class="point-option secondary">
                            <div class="point-number">${secondaryPoint}</div>
                            <div class="point-label">Alternative</div>
                        </div>
                    </div>
                    <div class="confidence-badge confidence-${analysis.confidence.toLowerCase()}">
                        Confidence: ${analysis.confidence}
                    </div>
                </div>

                <div class="analysis-details">
                    <h4>Analysis Details</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-icon">📝</span>
                            <span>${analysis.words} words, ${analysis.sentences} sentences</span>
                        </div>
                        ${analysis.technicalCount > 0 ? `
                        <div class="detail-item">
                            <span class="detail-icon">⚙️</span>
                            <span>${analysis.technicalCount} technical terms found</span>
                        </div>` : ''}
                        ${analysis.integrationCount > 0 ? `
                        <div class="detail-item">
                            <span class="detail-icon">🔗</span>
                            <span>${analysis.integrationCount} integration points</span>
                        </div>` : ''}
                        ${analysis.uncertainCount > 0 ? `
                        <div class="detail-item">
                            <span class="detail-icon">❓</span>
                            <span>${analysis.uncertainCount} uncertainty indicators</span>
                        </div>` : ''}
                    </div>

                    <div class="reasoning-section">
                        <h4>AI Reasoning</h4>
                        <ul class="reasoning-list">
                            ${analysis.reasoning.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="action-hint">
                    💡 Use these story points when setting up your team battle!
                </div>
            </div>
        `;
    }

    proceedToSetup() {
        this.showScreen(GameState.SETUP);

        // Scroll to player input section
        setTimeout(() => {
            const playerInputSection = document.querySelector('.player-input-section');
            if (playerInputSection) {
                playerInputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }

    // LocalStorage methods
    loadPlayersFromStorage() {
        const saved = localStorage.getItem('storyPointKnights_players');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.players = data.map(p => {
                    const player = new Player(p.name, p.storyPoints);
                    // Load stats
                    player.kills = p.kills || 0;
                    player.damageDealt = p.damageDealt || 0;
                    player.wins = p.wins || 0;
                    player.gamesPlayed = p.gamesPlayed || 0;
                    return player;
                });
            } catch (e) {
                console.error('Failed to load players from storage', e);
            }
        }
    }

    savePlayersToStorage() {
        const data = this.players.map(p => ({
            name: p.name,
            storyPoints: p.storyPoints,
            kills: p.kills || 0,
            damageDealt: p.damageDealt || 0,
            wins: p.wins || 0,
            gamesPlayed: p.gamesPlayed || 0
        }));
        localStorage.setItem('storyPointKnights_players', JSON.stringify(data));
    }

    // Login screen methods
    showNetworkLogin() {
        this.showScreen(GameState.NETWORK_LOGIN);
        this.networkPlayers = [];
        this.updateNetworkPlayersList();

        // Scroll to network info section
        setTimeout(() => {
            const networkInfo = document.querySelector('.network-info');
            if (networkInfo) {
                networkInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }

    showLocalPlay() {
        this.showScreen(GameState.ESTIMATION);
    }

    mockPlayerLogin() {
        const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
        const points = [1, 2, 3, 5, 8, 13, 21, 34];

        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomPoints = points[Math.floor(Math.random() * points.length)];
        const playerName = `${randomName}_${Date.now() % 1000}`;

        const player = new Player(playerName, randomPoints);
        this.networkPlayers.push(player);
        this.updateNetworkPlayersList();

        const continueBtn = document.getElementById('networkContinueBtn');
        continueBtn.disabled = this.networkPlayers.length < 2;
    }

    updateNetworkPlayersList() {
        const list = document.getElementById('networkPlayersList');

        if (this.networkPlayers.length === 0) {
            list.innerHTML = '<p class="waiting-message">Waiting for players to connect...</p>';
            return;
        }

        list.innerHTML = '';
        this.networkPlayers.forEach((player) => {
            const item = document.createElement('div');
            item.className = 'network-player-item';
            item.innerHTML = `
                <span><strong>${player.name}</strong> - Story Points: ${player.storyPoints}</span>
                <span>✓ Connected</span>
            `;
            list.appendChild(item);
        });
    }

    continueFromNetwork() {
        this.players = [...this.networkPlayers];
        this.savePlayersToStorage();
        this.showScreen(GameState.SETUP);
        this.updatePlayersList();
        this.updateStartButton();

        // Scroll to player list
        setTimeout(() => {
            const playersList = document.getElementById('playersList');
            if (playersList) {
                playersList.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    }

    addPlayer() {
        const nameInput = document.getElementById('playerName');
        const fibSelect = document.getElementById('fibonacciNumber');
        const name = nameInput.value.trim();
        const storyPoints = fibSelect.value;

        if (!name) {
            alert('Please enter a player name');
            return;
        }

        if (!storyPoints) {
            alert('Please select story points');
            return;
        }

        if (this.players.length >= 20) {
            alert('Maximum 20 players allowed');
            return;
        }

        const player = new Player(name, parseInt(storyPoints));
        this.players.push(player);

        nameInput.value = '';
        fibSelect.value = '';

        this.savePlayersToStorage();
        this.updatePlayersList();
        this.updateStartButton();
    }

    removePlayer(index) {
        this.players.splice(index, 1);
        this.savePlayersToStorage();
        this.updatePlayersList();
        this.updateStartButton();
    }

    updatePlayersList() {
        const listContainer = document.getElementById('playersList');
        listContainer.innerHTML = '';

        // Group by story points
        const grouped = {};
        this.players.forEach(player => {
            if (!grouped[player.storyPoints]) {
                grouped[player.storyPoints] = [];
            }
            grouped[player.storyPoints].push(player);
        });

        this.players.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = 'player-item';
            item.innerHTML = `
                <div>
                    <strong>${player.name}</strong>
                    (Story Points: ${player.storyPoints}) -
                    HP: ${player.maxHp}, Dmg: ${player.damage}, Range: ${player.attackRange}
                </div>
                <button onclick="game.removePlayer(${index})">Remove</button>
            `;
            listContainer.appendChild(item);
        });
    }

    updateStartButton() {
        const startBtn = document.getElementById('startTournamentBtn');
        const errorDiv = document.getElementById('startError');

        // Check if we have enough players
        if (this.players.length < 2) {
            startBtn.disabled = true;
            errorDiv.textContent = '';
            return;
        }

        // Check if all players have the same story points
        const uniqueStoryPoints = [...new Set(this.players.map(p => p.storyPoints))];

        if (uniqueStoryPoints.length === 1) {
            startBtn.disabled = true;
            errorDiv.textContent = '⚠️ All players have the same story points! Add players with different values to create teams.';
            return;
        }

        // All checks passed
        startBtn.disabled = false;
        errorDiv.textContent = '';
    }

    createTeams() {
        // Group players by story points
        const storyPointGroups = {};
        this.players.forEach(player => {
            if (!storyPointGroups[player.storyPoints]) {
                storyPointGroups[player.storyPoints] = [];
            }
            storyPointGroups[player.storyPoints].push(player);
        });

        // Get unique story point values
        const storyPointValues = Object.keys(storyPointGroups).map(Number).sort((a, b) => a - b);

        // Assign teams - alternate between left and right, or group by lower vs higher values
        // Split into two groups: lower half goes left, upper half goes right
        const midPoint = Math.ceil(storyPointValues.length / 2);
        const leftValues = storyPointValues.slice(0, midPoint);
        const rightValues = storyPointValues.slice(midPoint);

        this.teams.left = [];
        this.teams.right = [];

        leftValues.forEach(value => {
            storyPointGroups[value].forEach(player => {
                this.teams.left.push(player);
            });
        });

        rightValues.forEach(value => {
            storyPointGroups[value].forEach(player => {
                this.teams.right.push(player);
            });
        });

        // If one team is empty, redistribute
        if (this.teams.left.length === 0 || this.teams.right.length === 0) {
            this.teams.left = [];
            this.teams.right = [];
            this.players.forEach((player, index) => {
                if (index % 2 === 0) {
                    this.teams.left.push(player);
                } else {
                    this.teams.right.push(player);
                }
            });
        }
    }

    startBattle() {
        if (this.players.length < 2) return;

        // Reset battle stats
        this.currentBattleStats = {};
        this.battleEnded = false; // Flag to prevent duplicate stat updates

        // Create teams
        this.createTeams();

        // Setup battle
        this.showScreen(GameState.BATTLE);
        this.initCanvas();
        this.setupAllKnights();
        this.battleStartTime = Date.now();
        this.startBattleLoop();
    }

    initCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1400;
        this.canvas.height = 800;
    }

    setupAllKnights() {
        this.battleKnights = [];

        const leftColor = '#FF6B6B';
        const rightColor = '#4ECDC4';

        // Margin from edges
        const margin = 80;
        const minDistance = 60; // Minimum distance between knights

        // Helper function to generate random position
        const getRandomPosition = () => {
            return {
                x: margin + Math.random() * (this.canvas.width - margin * 2),
                y: margin + Math.random() * (this.canvas.height - margin * 2)
            };
        };

        // Helper function to check if position is too close to existing knights
        const isTooClose = (pos, existingKnights) => {
            return existingKnights.some(knight => {
                const dx = knight.x - pos.x;
                const dy = knight.y - pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < minDistance;
            });
        };

        // Helper function to find valid spawn position
        const findValidPosition = (maxAttempts = 100) => {
            for (let i = 0; i < maxAttempts; i++) {
                const pos = getRandomPosition();
                if (!isTooClose(pos, this.battleKnights)) {
                    return pos;
                }
            }
            // If no valid position found, return random anyway
            return getRandomPosition();
        };

        // Spawn left team randomly
        this.teams.left.forEach((player) => {
            const pos = findValidPosition();
            const knight = new Knight(player, pos.x, pos.y, leftColor, 'left');
            // Randomize initial rotation
            knight.rotation = Math.random() * Math.PI * 2;
            this.battleKnights.push(knight);
        });

        // Spawn right team randomly
        this.teams.right.forEach((player) => {
            const pos = findValidPosition();
            const knight = new Knight(player, pos.x, pos.y, rightColor, 'right');
            // Randomize initial rotation
            knight.rotation = Math.random() * Math.PI * 2;
            this.battleKnights.push(knight);
        });

        // Update HUD
        document.getElementById('currentMatch').textContent =
            `Left Team (${this.teams.left.length}) VS Right Team (${this.teams.right.length})`;
    }

    startBattleLoop() {
        const loop = () => {
            if (this.state !== GameState.BATTLE) return;

            this.updateBattle();
            this.renderBattle();

            this.animationId = requestAnimationFrame(loop);
        };
        loop();
    }

    updateBattle() {
        // Update timer
        const elapsed = Math.floor((Date.now() - this.battleStartTime) / 1000);
        document.getElementById('battleTimer').textContent = `Time: ${elapsed}s`;

        // Update all knights
        this.battleKnights.forEach((knight, index) => {
            if (knight.isAlive()) {
                // First knight is player-controlled
                if (index === 0) {
                    knight.update(this.keys, this.canvas.width, this.canvas.height);
                } else {
                    knight.updateAI(this.battleKnights, this.canvas.width, this.canvas.height);
                }

                // Handle attacks
                if (knight.isAttacking) {
                    this.checkAttackHits(knight);
                }
            }
        });

        // Check for battle end (only once)
        if (!this.battleEnded) {
            const leftAlive = this.battleKnights.filter(k => k.team === 'left' && k.isAlive()).length;
            const rightAlive = this.battleKnights.filter(k => k.team === 'right' && k.isAlive()).length;

            if (leftAlive === 0 && rightAlive > 0) {
                this.endBattle('right');
            } else if (rightAlive === 0 && leftAlive > 0) {
                this.endBattle('left');
            } else if (leftAlive === 0 && rightAlive === 0) {
                this.endBattle('draw');
            }
        }
    }

    checkAttackHits(attacker) {
        if (!attacker.justAttacked) return;
        attacker.justAttacked = false;

        this.battleKnights.forEach(target => {
            // Can't attack same team
            if (target.team === attacker.team) return;
            if (!target.isAlive()) return;
            if (target === attacker) return;

            const dx = target.x - attacker.x;
            const dy = target.y - attacker.y;
            const distance = Math.hypot(dx, dy);

            // Check if target is within range
            if (distance > attacker.attackRange) return;

            // Calculate angle to target (in radians)
            const angleToTarget = Math.atan2(dy, dx);

            // Get attacker's facing angle (in radians)
            const facingAngle = attacker.rotation;

            // Calculate angle difference
            let angleDiff = angleToTarget - facingAngle;

            // Normalize to -PI to PI
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            // Convert attack cone angle to radians
            const coneAngleRad = (attacker.attackAngle * Math.PI / 180) / 2;

            // Check if target is within attack cone
            if (Math.abs(angleDiff) <= coneAngleRad) {
                // Check if target is blocking
                let blocked = false;
                if (target.isBlocking) {
                    // Calculate angle from target to attacker
                    const dx2 = attacker.x - target.x;
                    const dy2 = attacker.y - target.y;
                    const angleFromTarget = Math.atan2(dy2, dx2);

                    // Calculate angle difference between block direction and attack direction
                    let blockAngleDiff = angleFromTarget - target.rotation;

                    // Normalize to -PI to PI
                    while (blockAngleDiff > Math.PI) blockAngleDiff -= Math.PI * 2;
                    while (blockAngleDiff < -Math.PI) blockAngleDiff += Math.PI * 2;

                    // Convert block angle to radians
                    const blockAngleRad = (target.blockAngle * Math.PI / 180) / 2;

                    // Check if attack is within block cone
                    if (Math.abs(blockAngleDiff) <= blockAngleRad) {
                        blocked = true;
                        this.log(`${target.player.name} BLOCKED attack from ${attacker.player.name}!`);
                        console.log(`Block successful: ${target.player.name} blocked ${attacker.player.name}`);
                    }
                }

                if (!blocked) {
                    const damage = attacker.player.damage;
                    target.takeDamage(damage);

                    // Track damage dealt
                    if (!this.currentBattleStats[attacker.player.name]) {
                        this.currentBattleStats[attacker.player.name] = { kills: 0, damageDealt: 0 };
                    }
                    this.currentBattleStats[attacker.player.name].damageDealt += damage;

                    this.log(`${attacker.player.name} hit ${target.player.name} for ${damage} damage!`);

                    if (!target.isAlive()) {
                        // Track kill
                        this.currentBattleStats[attacker.player.name].kills++;
                        console.log(`Kill tracked: ${attacker.player.name} killed ${target.player.name}. Total kills this battle: ${this.currentBattleStats[attacker.player.name].kills}`);
                        this.log(`${target.player.name} has been defeated!`);
                    }
                }
            }
        });
    }

    renderBattle() {
        // Clear canvas
        this.ctx.fillStyle = '#1a4d4d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw center line (more subtle now with random spawns)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([15, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw arena grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Draw team indicators (top corners)
        this.ctx.textAlign = 'left';
        this.ctx.font = 'bold 20px Arial';

        // Left team indicator
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fillText('● RED TEAM', 20, 35);

        // Right team indicator
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#4ECDC4';
        this.ctx.fillText('CYAN TEAM ●', this.canvas.width - 20, 35);

        // Draw swords (behind knights)
        this.battleKnights.forEach(knight => {
            if (knight.isAlive()) {
                knight.renderSword(this.ctx);
            }
        });

        // Draw knights
        this.battleKnights.forEach(knight => {
            knight.render(this.ctx);
        });

        // Draw blocks (in front of knights)
        this.battleKnights.forEach(knight => {
            if (knight.isAlive()) {
                knight.renderBlock(this.ctx);
            }
        });

        // Draw score below team indicators
        const leftAlive = this.battleKnights.filter(k => k.team === 'left' && k.isAlive()).length;
        const rightAlive = this.battleKnights.filter(k => k.team === 'right' && k.isAlive()).length;

        this.ctx.font = 'bold 18px Arial';

        // Left team score
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(`${leftAlive} alive`, 20, 55);

        // Right team score
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${rightAlive} alive`, this.canvas.width - 20, 55);
    }

    endBattle(winner) {
        // Set flag to prevent this from being called multiple times
        this.battleEnded = true;

        cancelAnimationFrame(this.animationId);

        // Update player statistics (only once!)
        this.updatePlayerStats(winner);

        if (winner === 'draw') {
            this.log('Battle ended in a draw!');
            setTimeout(() => this.showWinner(null), 2000);
        } else {
            const winningTeam = winner === 'left' ? 'Left Team' : 'Right Team';
            this.log(`${winningTeam} wins!`);
            setTimeout(() => this.showWinner(winner), 2000);
        }
    }

    updatePlayerStats(winner) {
        console.log('=== Battle Stats Update ===');
        console.log('Battle stats:', this.currentBattleStats);
        console.log('Winner:', winner);

        // Update games played for all players
        this.players.forEach(player => {
            const oldGames = player.gamesPlayed || 0;
            player.gamesPlayed = oldGames + 1;

            // Update stats from battle
            if (this.currentBattleStats[player.name]) {
                const oldKills = player.kills || 0;
                const oldDamage = player.damageDealt || 0;
                const battleKills = this.currentBattleStats[player.name].kills;
                const battleDamage = this.currentBattleStats[player.name].damageDealt;

                player.kills = oldKills + battleKills;
                player.damageDealt = oldDamage + battleDamage;

                console.log(`${player.name}: +${battleKills} kills (${oldKills} → ${player.kills}), +${battleDamage} damage (${oldDamage} → ${player.damageDealt})`);
            }
        });

        // Update wins for winning team
        if (winner !== 'draw') {
            const winningTeam = winner === 'left' ? this.teams.left : this.teams.right;
            console.log('Winning team players:', winningTeam.map(p => p.name));
            winningTeam.forEach(player => {
                const oldWins = player.wins || 0;
                player.wins = oldWins + 1;
                console.log(`${player.name}: +1 win (${oldWins} → ${player.wins})`);
            });
        }

        this.savePlayersToStorage();
        console.log('=== Stats Update Complete ===');
    }

    showWinner(winner) {
        this.showScreen(GameState.WINNER);

        const display = document.getElementById('winnerDisplay');

        // Scroll to winner display after a brief delay
        setTimeout(() => {
            const winnerScreen = document.getElementById('winnerScreen');
            if (winnerScreen) {
                winnerScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);

        if (winner === null) {
            display.innerHTML = `
                <h2>⚔️ Draw! ⚔️</h2>
                <p>Both teams were defeated!</p>
            `;
            return;
        }

        const winningTeamPlayers = winner === 'left' ? this.teams.left : this.teams.right;
        const survivors = this.battleKnights.filter(k => k.team === winner && k.isAlive());

        // Get unique story point values from winning team
        const storyPointValues = [...new Set(winningTeamPlayers.map(p => p.storyPoints))].sort((a, b) => a - b);
        const teamColor = winner === 'left' ? '#FF6B6B' : '#4ECDC4';

        display.innerHTML = `
            <div class="victory-crown">👑</div>
            <div class="victory-numbers" style="color: ${teamColor}">
                ${storyPointValues.map(sp => `<span class="victory-number">${sp}</span>`).join('')}
            </div>
            <h2 class="victory-text">STORY POINTS VICTORIOUS!</h2>
            <div class="winner-stats">
                <p class="survivor-count">Survivors: ${survivors.length} / ${winningTeamPlayers.length}</p>
                <h3>Victory Team Roster:</h3>
                <ul>
                    ${winningTeamPlayers.map(p => `<li>${p.name} <span class="points-badge" style="background: ${teamColor}">${p.storyPoints}</span> - HP: ${p.maxHp}, Dmg: ${p.damage}, Range: ${p.attackRange}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    log(message) {
        const logDiv = document.getElementById('battleLog');
        const p = document.createElement('p');
        p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logDiv.insertBefore(p, logDiv.firstChild);

        // Limit log size
        while (logDiv.children.length > 50) {
            logDiv.removeChild(logDiv.lastChild);
        }
    }

    // Winner screen methods
    editStoryPoints() {
        const display = document.getElementById('winnerDisplay');
        const header = display.previousElementSibling;
        header.textContent = '✏️ Edit Story Points';

        let html = '<div class="edit-points-section">';
        html += '<p style="margin-bottom: 20px;">Update story points for each player:</p>';

        this.players.forEach((player, index) => {
            html += `
                <div class="edit-points-item">
                    <span><strong>${player.name}</strong></span>
                    <select id="editPoints_${index}" class="edit-points-select">
                        <option value="1" ${player.storyPoints === 1 ? 'selected' : ''}>1</option>
                        <option value="2" ${player.storyPoints === 2 ? 'selected' : ''}>2</option>
                        <option value="3" ${player.storyPoints === 3 ? 'selected' : ''}>3</option>
                        <option value="5" ${player.storyPoints === 5 ? 'selected' : ''}>5</option>
                        <option value="8" ${player.storyPoints === 8 ? 'selected' : ''}>8</option>
                        <option value="13" ${player.storyPoints === 13 ? 'selected' : ''}>13</option>
                        <option value="21" ${player.storyPoints === 21 ? 'selected' : ''}>21</option>
                        <option value="34" ${player.storyPoints === 34 ? 'selected' : ''}>34</option>
                        <option value="55" ${player.storyPoints === 55 ? 'selected' : ''}>55</option>
                        <option value="89" ${player.storyPoints === 89 ? 'selected' : ''}>89</option>
                    </select>
                </div>
            `;
        });

        html += '<button id="savePointsBtn" class="start-btn" style="margin-top: 20px;">Save Changes</button>';
        html += '</div>';

        display.innerHTML = html;

        document.getElementById('savePointsBtn').addEventListener('click', () => {
            this.players.forEach((player, index) => {
                const select = document.getElementById(`editPoints_${index}`);
                player.storyPoints = parseInt(select.value);
            });
            this.savePlayersToStorage();
            this.showScreen(GameState.SETUP);
            this.updatePlayersList();
            this.updateStartButton();

            // Scroll to player list after saving
            setTimeout(() => {
                const playersList = document.getElementById('playersList');
                if (playersList) {
                    playersList.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        });
    }

    nextBattle() {
        // Reset battle stats
        this.currentBattleStats = {};
        this.battleEnded = false;
        this.showScreen(GameState.SETUP);

        // Scroll to the player input section after a brief delay
        setTimeout(() => {
            const setupContainer = document.querySelector('.setup-container');
            if (setupContainer) {
                setupContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    }

    // Rankings screen methods
    showRankings() {
        this.showScreen(GameState.RANKINGS);
        this.updateRankingsDisplay();

        // Scroll to top scorer after display is updated
        setTimeout(() => {
            const topScorer = document.querySelector('.top-scorer-section');
            if (topScorer) {
                topScorer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }

    updateRankingsDisplay() {
        // Calculate scores (kills * 10 + wins * 50 + damageDealt / 10)
        const playerRankings = this.players.map(player => {
            const score = (player.kills || 0) * 10 +
                         (player.wins || 0) * 50 +
                         Math.floor((player.damageDealt || 0) / 10);
            return {
                player,
                score
            };
        }).sort((a, b) => b.score - a.score);

        // Top scorer
        const topScorer = playerRankings[0];
        const topScorerDiv = document.getElementById('topScorer');
        if (topScorer && topScorer.score > 0) {
            topScorerDiv.innerHTML = `
                <div class="top-scorer-name">${topScorer.player.name}</div>
                <div class="top-scorer-stats">
                    <div class="stat-item">
                        <div class="stat-label">Score</div>
                        <div class="stat-value">${topScorer.score}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Kills</div>
                        <div class="stat-value">${topScorer.player.kills || 0}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Wins</div>
                        <div class="stat-value">${topScorer.player.wins || 0}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Damage Dealt</div>
                        <div class="stat-value">${topScorer.player.damageDealt || 0}</div>
                    </div>
                </div>
            `;
        } else {
            topScorerDiv.innerHTML = '<p>No battles played yet!</p>';
        }

        // Rankings table
        const tbody = document.getElementById('rankingsTableBody');
        tbody.innerHTML = '';

        playerRankings.forEach((entry, index) => {
            const row = document.createElement('tr');
            const rank = index + 1;
            let rankClass = '';
            if (rank === 1) rankClass = 'rank-1';
            else if (rank === 2) rankClass = 'rank-2';
            else if (rank === 3) rankClass = 'rank-3';

            row.innerHTML = `
                <td><span class="rank-badge ${rankClass}">${rank}</span></td>
                <td><strong>${entry.player.name}</strong></td>
                <td>${entry.player.storyPoints}</td>
                <td>${entry.player.gamesPlayed || 0}</td>
                <td>${entry.player.wins || 0}</td>
                <td>${entry.player.kills || 0}</td>
                <td>${entry.player.damageDealt || 0}</td>
                <td><strong>${entry.score}</strong></td>
            `;
            tbody.appendChild(row);
        });
    }

    resetAllStats() {
        if (!confirm('Are you sure you want to reset ALL player statistics? This cannot be undone!')) {
            return;
        }

        this.players.forEach(player => {
            player.kills = 0;
            player.damageDealt = 0;
            player.wins = 0;
            player.gamesPlayed = 0;
        });

        this.savePlayersToStorage();
        this.updateRankingsDisplay();

        console.log('Stats reset for all players:', this.players.map(p => ({
            name: p.name,
            kills: p.kills,
            wins: p.wins,
            games: p.gamesPlayed
        })));
    }

    clearAllData() {
        if (!confirm('⚠️ WARNING: This will delete ALL players and statistics permanently!\n\nAre you sure you want to continue?')) {
            return;
        }

        // Clear everything
        this.players = [];
        this.battleKnights = [];
        this.teams = { left: [], right: [] };
        this.currentBattleStats = {};
        this.battleEnded = false;

        // Clear localStorage
        localStorage.removeItem('storyPointKnights_players');

        console.log('All data cleared!');

        // Go back to setup screen
        this.showScreen(GameState.SETUP);
        this.updatePlayersList();
        this.updateStartButton();

        alert('✅ All data has been cleared. You can start fresh!');
    }

    showScreen(state) {
        this.state = state;
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const screens = {
            [GameState.LOGIN]: 'loginScreen',
            [GameState.NETWORK_LOGIN]: 'networkLoginScreen',
            [GameState.ESTIMATION]: 'estimationScreen',
            [GameState.SETUP]: 'setupScreen',
            [GameState.BATTLE]: 'battleScreen',
            [GameState.WINNER]: 'winnerScreen',
            [GameState.RANKINGS]: 'rankingsScreen'
        };

        const screenElement = document.getElementById(screens[state]);
        screenElement.classList.add('active');

        // Auto-scroll to the active screen with smooth behavior
        setTimeout(() => {
            screenElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    reset() {
        // Only reset battle state, keep players
        this.battleKnights = [];
        this.teams = { left: [], right: [] };
        this.currentBattleStats = {};
        this.battleEnded = false;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.showScreen(GameState.LOGIN);
        document.getElementById('battleLog').innerHTML = '';
    }
}

class Player {
    constructor(name, storyPoints) {
        this.name = name;
        this.storyPoints = storyPoints;
        this.stats = this.generateStats();

        // Base stats
        this.maxHp = 20;
        this.damage = 5;
        this.attackRange = 40; // Base attack range (reduced by 50%)

        // Statistics
        this.kills = 0;
        this.damageDealt = 0;
        this.wins = 0;
        this.gamesPlayed = 0;

        // Apply stat bonuses
        this.applyStats();
    }

    generateStats() {
        const statCount = 5;
        const stats = [];

        for (let i = 0; i < statCount; i++) {
            const statLevel = Math.floor(Math.random() * 5) + 1; // 1-5
            stats.push(statLevel);
        }

        return stats;
    }

    applyStats() {
        this.stats.forEach((level, index) => {
            switch (index) {
                case 0: // HP bonus
                    this.maxHp += (level * 3);
                    break;
                case 1: // Damage bonus
                    this.damage += (level * 2);
                    break;
                case 2: // Combined HP and damage
                    this.maxHp += level;
                    this.damage += level;
                    break;
                case 3: // Attack Range
                    this.attackRange += (level * 7.5); // 7.5-37.5 extra range (reduced by 50%)
                    break;
                case 4: // Extra damage and speed
                    this.damage += (level * 1.5);
                    break;
            }
        });

        this.damage = Math.round(this.damage);
        this.attackRange = Math.round(this.attackRange);
    }
}

class Knight {
    constructor(player, x, y, color, team) {
        this.player = player;
        this.x = x;
        this.y = y;
        this.color = color;
        this.team = team;
        this.hp = player.maxHp;
        this.size = 35;
        this.speed = 1.25; // Very slow, tactical movement
        this.attackRange = player.attackRange; // Use player's randomized range
        this.attackAngle = 60; // Cone angle in degrees (30° each side)
        this.rotation = team === 'left' ? 0 : Math.PI; // Facing angle in radians (0 = right, PI = left)
        this.rotationSpeed = 0.08; // Rotation speed in radians per frame
        this.isAttacking = false;
        this.justAttacked = false;
        this.attackCooldown = 0;
        this.aiThinkTimer = 0;
        this.aiTarget = null;

        // Sword swing animation
        this.swordSwingProgress = 0; // 0 to 1 (animation progress)
        this.swordSwingDuration = 20; // frames for full swing
        this.swordSwingActive = false;
        this.damageAppliedThisSwing = false;

        // Blocking system
        this.isBlocking = false;
        this.blockDuration = 30; // frames to hold block (0.5 seconds)
        this.blockTimer = 0;
        this.blockCooldown = 0;
        this.blockCooldownMax = 90; // 1.5 second cooldown
        this.blockAngle = 120; // degrees (60° each side, larger than attack cone)
    }

    update(keys, canvasWidth, canvasHeight) {
        // Rotation controls
        if (keys['q'] || keys['Q']) {
            this.rotation -= this.rotationSpeed; // Rotate counter-clockwise
        }
        if (keys['e'] || keys['E']) {
            this.rotation += this.rotationSpeed; // Rotate clockwise
        }

        // Normalize rotation to 0-2PI
        while (this.rotation < 0) this.rotation += Math.PI * 2;
        while (this.rotation >= Math.PI * 2) this.rotation -= Math.PI * 2;

        // Block with C key
        if (keys['c'] || keys['C']) {
            this.startBlock();
        }

        // Movement controls (WASD / Arrow keys) - can't move while blocking
        if (!this.isBlocking) {
            if (keys['ArrowUp'] || keys['w']) {
                this.y -= this.speed;
            }
            if (keys['ArrowDown'] || keys['s']) {
                this.y += this.speed;
            }
            if (keys['ArrowLeft'] || keys['a']) {
                this.x -= this.speed;
            }
            if (keys['ArrowRight'] || keys['d']) {
                this.x += this.speed;
            }

            // Attack with space - can't attack while blocking
            if (keys[' '] && this.attackCooldown === 0) {
                this.attack();
            }
        }

        // Boundary checking
        this.x = Math.max(this.size, Math.min(canvasWidth - this.size, this.x));
        this.y = Math.max(this.size + 50, Math.min(canvasHeight - this.size, this.y));

        this.updateCooldowns();
    }

    updateAI(allKnights, canvasWidth, canvasHeight) {
        this.aiThinkTimer++;

        // Find closest enemy every 15 frames
        if (this.aiThinkTimer % 15 === 0 || !this.aiTarget || !this.aiTarget.isAlive()) {
            this.aiTarget = this.findClosestEnemy(allKnights);
        }

        if (this.aiTarget && this.aiTarget.isAlive()) {
            const dx = this.aiTarget.x - this.x;
            const dy = this.aiTarget.y - this.y;
            const distance = Math.hypot(dx, dy);
            const targetAngle = Math.atan2(dy, dx);

            // Check if target is attacking and close - consider blocking
            const shouldBlock = this.aiTarget.isAttacking &&
                               distance < this.attackRange * 1.5 &&
                               Math.random() < 0.3; // 30% chance to block when under attack

            if (shouldBlock && !this.isBlocking) {
                // Calculate if attack is coming from front
                let angleDiff = targetAngle - this.rotation;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

                // Block if enemy is roughly in front
                if (Math.abs(angleDiff) < Math.PI / 2) {
                    this.startBlock();
                }
            }

            if (!this.isBlocking) {
                // Smoothly rotate towards target
                let angleDiff = targetAngle - this.rotation;

                // Normalize angle difference to -PI to PI
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

                // Rotate towards target
                if (Math.abs(angleDiff) > 0.1) {
                    if (angleDiff > 0) {
                        this.rotation += Math.min(this.rotationSpeed, angleDiff);
                    } else {
                        this.rotation -= Math.min(this.rotationSpeed, Math.abs(angleDiff));
                    }
                }

                // Normalize rotation to 0-2PI
                while (this.rotation < 0) this.rotation += Math.PI * 2;
                while (this.rotation >= Math.PI * 2) this.rotation -= Math.PI * 2;

                // Move towards enemy
                if (distance > this.attackRange * 0.8) {
                    this.x += Math.cos(targetAngle) * this.speed;
                    this.y += Math.sin(targetAngle) * this.speed;
                }

                // Attack if in range AND facing the target
                if (distance <= this.attackRange && this.attackCooldown === 0) {
                    this.attack();
                }
            }
        }

        // Boundary checking
        this.x = Math.max(this.size, Math.min(canvasWidth - this.size, this.x));
        this.y = Math.max(this.size + 50, Math.min(canvasHeight - this.size, this.y));

        this.updateCooldowns();
    }

    findClosestEnemy(allKnights) {
        let closest = null;
        let closestDist = Infinity;

        allKnights.forEach(knight => {
            if (knight.team !== this.team && knight.isAlive()) {
                const dist = Math.hypot(knight.x - this.x, knight.y - this.y);
                if (dist < closestDist) {
                    closestDist = dist;
                    closest = knight;
                }
            }
        });

        return closest;
    }

    updateCooldowns() {
        // Update sword swing animation
        if (this.swordSwingActive) {
            this.swordSwingProgress += 1 / this.swordSwingDuration;

            // Apply damage at the middle of the swing (50% progress)
            if (this.swordSwingProgress >= 0.5 && !this.damageAppliedThisSwing) {
                this.justAttacked = true;
                this.damageAppliedThisSwing = true;
            }

            // End swing animation
            if (this.swordSwingProgress >= 1) {
                this.swordSwingActive = false;
                this.swordSwingProgress = 0;
            }
        }

        // Update block timer
        if (this.isBlocking) {
            this.blockTimer--;
            if (this.blockTimer <= 0) {
                this.isBlocking = false;
                this.blockCooldown = this.blockCooldownMax;
            }
        }

        // Update block cooldown
        if (this.blockCooldown > 0) {
            this.blockCooldown--;
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
            if (this.attackCooldown === 0) {
                this.isAttacking = false;
            }
        }
    }

    startBlock() {
        if (this.blockCooldown === 0 && !this.isBlocking) {
            this.isBlocking = true;
            this.blockTimer = this.blockDuration;
            console.log(`${this.player.name} is blocking!`);
        }
    }

    attack() {
        if (this.attackCooldown === 0) {
            this.isAttacking = true;
            this.attackCooldown = 120; // Very slow attack cooldown (~2 seconds at 60fps)

            // Start sword swing animation
            this.swordSwingActive = true;
            this.swordSwingProgress = 0;
            this.damageAppliedThisSwing = false;
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    }

    isAlive() {
        return this.hp > 0;
    }

    renderBlock(ctx) {
        if (!this.isBlocking) return;

        // Draw shield effect in front of knight
        const shieldDistance = this.size * 0.8;
        const shieldSize = this.size * 1.2;

        // Calculate shield position
        const shieldX = this.x + Math.cos(this.rotation) * shieldDistance;
        const shieldY = this.y + Math.sin(this.rotation) * shieldDistance;

        ctx.save();

        // Shield glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00BFFF';

        // Pulsing effect based on block timer
        const pulseScale = 1 + Math.sin((this.blockTimer / this.blockDuration) * Math.PI * 4) * 0.1;

        // Shield arc (wider than attack cone)
        const blockAngleRad = (this.blockAngle * Math.PI / 180) / 2;

        // Translucent shield bubble
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#00BFFF';
        ctx.beginPath();
        ctx.arc(
            shieldX,
            shieldY,
            shieldSize * pulseScale,
            this.rotation - blockAngleRad,
            this.rotation + blockAngleRad
        );
        ctx.lineTo(shieldX, shieldY);
        ctx.fill();

        // Bright shield outline
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(
            shieldX,
            shieldY,
            shieldSize * pulseScale,
            this.rotation - blockAngleRad,
            this.rotation + blockAngleRad
        );
        ctx.stroke();

        // Shield emblem/cross in center
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        const emblemSize = shieldSize * 0.3;
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(shieldX, shieldY - emblemSize);
        ctx.lineTo(shieldX, shieldY + emblemSize);
        ctx.stroke();
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(shieldX - emblemSize, shieldY);
        ctx.lineTo(shieldX + emblemSize, shieldY);
        ctx.stroke();

        ctx.restore();
    }

    renderSword(ctx) {
        if (!this.swordSwingActive) return;

        // Calculate sword angle based on swing progress
        // Sword sweeps from -30° to +30° relative to facing direction
        const coneAngleRad = (this.attackAngle * Math.PI / 180) / 2;
        const startAngle = this.rotation - coneAngleRad;
        const endAngle = this.rotation + coneAngleRad;
        const currentSwordAngle = startAngle + (endAngle - startAngle) * this.swordSwingProgress;

        // Sword properties
        const swordLength = this.attackRange * 0.8; // 80% of attack range
        const swordWidth = 8;
        const swordStartOffset = this.size * 0.3; // Start from knight body

        // Calculate sword tip position
        const swordTipX = this.x + Math.cos(currentSwordAngle) * (swordStartOffset + swordLength);
        const swordTipY = this.y + Math.sin(currentSwordAngle) * (swordStartOffset + swordLength);
        const swordBaseX = this.x + Math.cos(currentSwordAngle) * swordStartOffset;
        const swordBaseY = this.y + Math.sin(currentSwordAngle) * swordStartOffset;

        // Draw sword with glow effect
        ctx.save();

        // Glow/trail effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(this.swordSwingProgress * Math.PI); // Pulse during swing

        // Sword blade
        ctx.strokeStyle = '#E0E0E0'; // Silver blade
        ctx.lineWidth = swordWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(swordBaseX, swordBaseY);
        ctx.lineTo(swordTipX, swordTipY);
        ctx.stroke();

        // Sword edge highlight
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(swordBaseX, swordBaseY);
        ctx.lineTo(swordTipX, swordTipY);
        ctx.stroke();

        // Motion blur trail (only visible during fast part of swing)
        if (this.swordSwingProgress > 0.3 && this.swordSwingProgress < 0.7) {
            ctx.globalAlpha = 0.3;
            const trailSteps = 5;
            for (let i = 1; i <= trailSteps; i++) {
                const trailProgress = this.swordSwingProgress - (i * 0.05);
                if (trailProgress < 0) continue;

                const trailAngle = startAngle + (endAngle - startAngle) * trailProgress;
                const trailTipX = this.x + Math.cos(trailAngle) * (swordStartOffset + swordLength);
                const trailTipY = this.y + Math.sin(trailAngle) * (swordStartOffset + swordLength);

                ctx.strokeStyle = this.color;
                ctx.lineWidth = swordWidth * (1 - i / trailSteps);
                ctx.beginPath();
                ctx.moveTo(swordBaseX, swordBaseY);
                ctx.lineTo(trailTipX, trailTipY);
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    render(ctx) {
        if (!this.isAlive()) {
            // Draw death marker
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('💀', this.x, this.y + 7);
            return;
        }

        // Save context for rotation
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw knight as a shield/helmet combo (now rotated)
        const size = this.size / 2;

        // Draw shield body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.7, -size * 0.3);
        ctx.lineTo(size * 0.7, size * 0.4);
        ctx.lineTo(0, size);
        ctx.lineTo(-size * 0.7, size * 0.4);
        ctx.lineTo(-size * 0.7, -size * 0.3);
        ctx.closePath();
        ctx.fill();

        // Shield outline
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw helmet top
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(0, -size * 0.3, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw visor slit
        ctx.fillStyle = '#000';
        ctx.fillRect(-size * 0.4, -size * 0.35, size * 0.8, size * 0.15);

        // Draw cross emblem on shield
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.2);
        ctx.lineTo(0, size * 0.5);
        ctx.stroke();
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(-size * 0.3, size * 0.1);
        ctx.lineTo(size * 0.3, size * 0.1);
        ctx.stroke();

        // Draw direction indicator (small arrow pointing forward)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(size * 1.2, 0); // Arrow tip
        ctx.lineTo(size * 0.8, -size * 0.2); // Top wing
        ctx.lineTo(size * 0.8, size * 0.2); // Bottom wing
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Restore context
        ctx.restore();

        // Draw HP bar (not rotated)
        const barWidth = 50;
        const barHeight = 6;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.size / 2 - 12;

        // Background
        ctx.fillStyle = '#000';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // HP
        const hpPercent = this.hp / this.player.maxHp;
        ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

        // HP text (smaller)
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.hp}`, this.x, barY - 3);

        // Draw name (smaller)
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Arial';
        const nameText = this.player.name.length > 10 ? this.player.name.substring(0, 8) + '...' : this.player.name;
        ctx.fillText(nameText, this.x, this.y + this.size / 2 + 15);

        // Draw story points badge
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 12, this.y + this.size / 2 + 18, 24, 14);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(this.player.storyPoints, this.x, this.y + this.size / 2 + 28);

        // Draw block cooldown indicator (only for player-controlled knight at index 0)
        if (this.blockCooldown > 0) {
            const cooldownBarWidth = 40;
            const cooldownBarHeight = 4;
            const cooldownBarX = this.x - cooldownBarWidth / 2;
            const cooldownBarY = this.y + this.size / 2 + 35;

            // Background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(cooldownBarX, cooldownBarY, cooldownBarWidth, cooldownBarHeight);

            // Cooldown progress
            const cooldownPercent = 1 - (this.blockCooldown / this.blockCooldownMax);
            ctx.fillStyle = cooldownPercent === 1 ? '#00FF00' : '#FFA500';
            ctx.fillRect(cooldownBarX, cooldownBarY, cooldownBarWidth * cooldownPercent, cooldownBarHeight);
        }
    }
}

// Initialize game
const game = new Game();
