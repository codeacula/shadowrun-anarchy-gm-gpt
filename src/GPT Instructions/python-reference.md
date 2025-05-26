# Python Function Reference for Shadowrun Anarchy Backend

This reference explains all callable Python functions available to the game master assistant. These support dice rolls, campaign tracking, character management, and utility automation for Shadowrun Anarchy RPG sessions.

**Key Planning Steps:**

1. Identify what the player/GM wants to accomplish
2. Determine which dice rolls or mechanics are needed
3. Apply the appropriate functions in logical order
4. Log results and update character/campaign state
5. Handle edge cases like glitches, overflow damage, or insufficient resources

---

## 🎲 Core Dice & Combat Mechanics

### `roll_cue(dice_pool: int, edge: bool = False) -> Tuple[int, List[int]]`

**Purpose:** Primary dice rolling function for all Shadowrun Anarchy actions.
**When to use:** Any time a character attempts an action requiring a test.
**Parameters:**

- `dice_pool`: Number of d6 dice to roll (typically attribute + skill + modifiers)
- `edge`: If True, hits count on 4+ instead of 5+ (when player spends Edge)
**Returns:** `(number_of_hits, list_of_dice_results)`
**Always follow with:** `detect_glitch()` to check for complications

```python
# Example: Character with 4 Agility + 3 Firearms + 1 smartgun = 8 dice
hits, rolls = roll_cue(8, edge=False)
glitch_result = detect_glitch(rolls, hits)
```

### `detect_glitch(rolls: List[int], hits: int) -> Dict[str, bool]`

**Purpose:** Determines if a roll resulted in complications.
**When to use:** After every `roll_cue()` call, especially for important actions.
**Logic:** Glitch = half or more dice show 1s; Critical glitch = glitch + zero hits
**Returns:** `{"glitch": bool, "critical_glitch": bool}`

### `reroll_failures(rolls: List[int], hit_threshold: int = 5) -> Tuple[int, List[int]]`

**Purpose:** Rerolls only failed dice when Edge is spent for rerolls.
**When to use:** When player chooses to spend Edge after seeing initial results.
**Note:** Only reroll dice below the threshold; keep successes from original roll.

### `calculate_initiative(attribute: int, skill: int, bonus: int = 0) -> int`

**Purpose:** Determines turn order in combat.
**When to use:** At the start of any combat encounter.
**Formula:** `attribute + skill + bonus + 1d6`

---

## 🏥 Health & Status Management

### `apply_damage_to_condition_monitor(condition_monitor: int, damage: int) -> int`

**Purpose:** Applies damage to character health.
**When to use:** After successful attacks, environmental hazards, or spell effects.
**Returns:** New condition monitor value (minimum 0)
**Follow with:** `handle_condition_overflow()` if damage exceeds current monitor

### `handle_condition_overflow(condition_monitor: int, overflow: int) -> Dict[str, Any]`

**Purpose:** Determines status effects when damage exceeds health.
**When to use:** After `apply_damage_to_condition_monitor()` results in 0 or negative health.
**Returns:** `{"status": str, "overflow": int}` where status can be 'ok', 'overflow', 'unconscious'

### `heal_condition_monitor(condition_monitor: int, healing: int, max_monitor: int) -> int`

**Purpose:** Restores health from first aid, rest, or magic.
**When to use:** After healing actions, between scenes, or during downtime.
**Note:** Cannot exceed max_monitor value.

---

## 🔫 Equipment & Resources

### `track_ammo(current_ammo: int, shots_fired: int, magazine_size: int) -> Dict[str, Any]`

**Purpose:** Manages ammunition usage and reload requirements.
**When to use:** After any firearm attack action.
**Returns:** `{"ammo_left": int, "needs_reload": bool}`
**Edge case:** If ammo_left <= 0, character must reload before firing again.

### `spend_plot_point(current_points: int) -> int`

**Purpose:** Deducts plot points when player uses narrative control.
**When to use:** Player declares plot point use for bonus dice, narrative effects, or special actions.
**Safety:** Will not go below 0; check return value to confirm spending was possible.

### `award_plot_point(current_points: int) -> int`

**Purpose:** Rewards plot points for good roleplay or clever solutions.
**When to use:** GM discretion - creative problem solving, accepting complications, great roleplay.

---

## 👤 Character Development

### `character_create(data: Dict[str, Any]) -> Dict[str, Any]`

**Purpose:** Initializes new character with required default fields.
**When to use:** Character creation or importing existing characters.
**Ensures:** 'karma_spent' tracking and 'cues_used' list are always present.

### `character_spend_karma(character: Dict[str, Any], category: str, amount: int) -> Dict[str, Any]`

**Purpose:** Records karma expenditure for advancement tracking.
**When to use:** Character advancement between sessions or during play.
**Categories:** 'attribute', 'skill', 'gear', 'augmentation', etc.

### `apply_karma_advancement(character: Dict, field: str, amount: int, cost: int, karma_available: int) -> Dict`

**Purpose:** Validates and applies character improvements.
**When to use:** Character wants to increase attributes or skills.
**Validation:** Checks if enough karma is available before applying changes.
**Safety:** Returns unchanged character if insufficient karma.

---

## 📚 Campaign & Session Management

### `campaign_create(settings: Dict[str, Any]) -> Dict[str, Any]`

**Purpose:** Initializes new campaign with proper structure.
**When to use:** Starting new campaigns or importing campaign data.
**Ensures:** 'sessions', 'characters', and 'npcs' lists are always present and validated.

### `session_log(session_number: int, summary: str, npcs: List[str], loot: Dict[str, Any]) -> Dict[str, Any]`

**Purpose:** Creates structured session record for campaign continuity.
**When to use:** End of each session for recap and tracking.
**Best practice:** Include major NPCs encountered and any rewards distributed.

---

## 🎭 NPC & Story Tools

### `get_random_npc(npcs: List[Dict[str, Any]], tag: Optional[str] = None) -> Dict[str, Any]`

**Purpose:** Selects appropriate NPCs for scenes or encounters.
**When to use:** Need a contact, enemy, or background character.
**Filtering:** Use tags like 'fixer', 'enemy', 'corp', 'gang' to get appropriate NPCs.
**Fallback:** Returns empty dict if no matching NPCs found.

### `get_contract_brief(briefs: List[Dict[str, Any]], name: str) -> Dict[str, Any]`

**Purpose:** Retrieves specific job or mission details.
**When to use:** Players ask about specific contracts or jobs.
**Note:** Exact name match required; returns empty dict if not found.

### `prompt_player(prompt_type: str = "Cue") -> str`

**Purpose:** Encourages roleplay and character development.
**When to use:** Player seems uncertain about character actions or needs roleplay nudge.
**Types:** 'Cue' for applying character traits, 'Disposition' for emotional state.

---

## 🔧 Utility & System Functions

### `roll_on_random_table(table: List[Any]) -> Any`

**Purpose:** Generates random results from data-driven tables.
**When to use:** Random encounters, loot generation, inspiration, or oracles.
**Safety:** Returns None and logs warning if table is empty.

### `get_current_timestamp() -> str`

**Purpose:** Provides consistent timestamps for logs and records.
**When to use:** Session logging, character updates, or any time-sensitive data.
**Format:** ISO 8601 UTC format for cross-system compatibility.

### `serialize_data(data: Any, filepath: str)` / `deserialize_data(filepath: str)`

**Purpose:** Persistent storage for campaign state.
**When to use:** Save at session end, load at session start.
**Safety:** `serialize_data` overwrites existing files; `deserialize_data` raises FileNotFoundError if file missing.

---

## 🔄 Common Workflows

### Basic Action Resolution

```python
# 1. Roll dice for action
hits, rolls = roll_cue(dice_pool=6, edge=False)

# 2. Check for complications
glitch_info = detect_glitch(rolls, hits)

# 3. Handle results based on hits and glitches
if glitch_info["critical_glitch"]:
    # Major complication occurs
elif glitch_info["glitch"]:
    # Minor complication with success
elif hits >= threshold:
    # Clean success
else:
    # Failure
```

### Combat Sequence

```python
# 1. Roll initiative for all combatants
player_init = calculate_initiative(4, 2, 1)  # Agility + skill + gear

# 2. Resolve attacks
attack_hits, attack_rolls = roll_cue(8)  # Attacker's pool
defense_hits, defense_rolls = roll_cue(6)  # Defender's pool
result = resolve_opposed_test(attack_hits, defense_hits)

# 3. Apply damage if attack succeeds
if result == "attacker":
    new_health = apply_damage_to_condition_monitor(current_health, damage)
    if new_health <= 0:
        status = handle_condition_overflow(new_health, abs(new_health))

# 4. Track ammunition
ammo_status = track_ammo(current_ammo, 1, magazine_size)
```

### Session Management

```python
# Session start: Load campaign
campaign = load_campaign("campaign.json")

# During play: Update character
character = character_spend_karma(character, "skill", 5)

# Session end: Log and save
session_record = session_log(session_num, summary, npcs_met, loot_gained)
campaign["sessions"].append(session_record)
save_campaign(campaign, "campaign.json")
```

---

## ⚠️ Error Handling & Edge Cases

- **Type Validation:** All functions include automatic type checking and will raise TypeError for invalid inputs
- **Resource Limits:** Functions like `spend_plot_point()` and `apply_karma_advancement()` validate available resources
- **Boundary Conditions:** Health and ammo tracking prevent values below 0
- **Missing Data:** NPC and contract lookups return empty dicts rather than errors when not found
- **File Operations:** Save/load functions will create directories as needed but require valid file paths
