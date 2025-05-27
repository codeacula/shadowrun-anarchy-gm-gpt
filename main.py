import logging
import random
from typing import List, Dict, Any, Tuple, Optional, Type
import json
import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------- Type Validation Helpers ----------

def _check_type(name: str, value: Any, expected: Type[Any]) -> None:
    """
    Validates that a value is of the expected type.
    Use this in all functions to ensure arguments are correct before processing.
    Args:
        name: The name of the variable (for error messages).
        value: The value to check.
        expected: The expected type (e.g., int, dict).
    Raises:
        TypeError: If value is not of the expected type.
    Notes:
        Helps catch errors early and provides clear logging for debugging.
    """
    if not isinstance(value, expected):
        logger.error(f"Type error: '{name}' must be {expected.__name__}, got {type(value).__name__}")
        raise TypeError(f"'{name}' must be {expected.__name__}, got {type(value).__name__}")


def _check_list_of(name: str, value: List[Any], element_type: Type[Any]) -> None:
    """
    Validates that a value is a list and all elements are of the specified type.
    Use this to check lists of items (e.g., NPCs, briefs, strings).
    Args:
        name: The name of the variable (for error messages).
        value: The list to check.
        element_type: The expected type of each element in the list.
    Raises:
        TypeError: If any element is not of the expected type.
    Notes:
        Ensures data consistency for list-based arguments.
    """
    for idx, item in enumerate(value):
        if not isinstance(item, element_type):
            logger.error(f"Type error: Item {idx} in '{name}' must be {element_type.__name__}, got {type(item).__name__}")
            raise TypeError(
                f"Item {idx} in '{name}' must be {element_type.__name__}, got {type(item).__name__}"
            )

# ---------- Dice Roller ----------

def roll_cue(dice_pool: int, edge: bool = False) -> Tuple[int, List[int]]:
    """
    Rolls a pool of d6 dice for Shadowrun Anarchy actions.
    Use this for any action that requires a dice pool roll.
    Args:
        dice_pool: Number of d6 dice to roll.
        edge: If True, lowers the hit threshold to 4+ (Edge rules). Otherwise, hits are 5+.
    Returns:
        Tuple of (number of hits, list of dice results).
    Notes:
        Call detect_glitch after this to check for glitches. Use reroll_failures if Edge is spent to reroll failures.
    """
    _check_type("dice_pool", dice_pool, int)
    _check_type("edge", edge, bool)
    threshold = 4 if edge else 5
    rolls = [random.randint(1, 6) for _ in range(dice_pool)]
    hits = sum(1 for r in rolls if r >= threshold)
    logger.info(f"Rolled {dice_pool} dice (edge={edge}): {rolls} → Hits: {hits}")
    return hits, rolls

# ---------- Character Management Tools ----------

def ensure_defaults(data: Dict[str, Any], defaults: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensures that a dictionary has all keys from defaults, filling in missing ones.
    Use this to avoid repeated default structure logic in character/campaign/session creation.
    Args:
        data: The dictionary to check.
        defaults: The dictionary of default key-value pairs.
    Returns:
        A new dictionary with all defaults applied.
    Notes:
        Does not mutate the original data.
    """
    result = defaults.copy()
    result.update(data)
    logger.info(f"Ensured defaults: {result}")
    return result


def character_create(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Creates a new character dictionary with default fields for Shadowrun Anarchy.
    Use this when initializing a new character.
    Args:
        data: Dictionary of character attributes and custom fields.
    Returns:
        Character dictionary with defaults merged in.
    Notes:
        Ensures 'karma_spent' and 'cues_used' are always present.
    """
    defaults: Dict[str, Any] = {
        "karma_spent": {},
        "cues_used": []
    }
    character = ensure_defaults(data, defaults)
    logger.info(f"Created character with data: {character}")
    return character


def character_spend_karma(
    character: Dict[str, Any], category: str, amount: int
) -> Dict[str, Any]:
    """
    Spends karma for a character in a specific category (e.g., attribute, skill).
    Use this when a character spends karma for advancement.
    Args:
        character: The character dictionary.
        category: The category of advancement (e.g., 'attribute', 'skill').
        amount: The amount of karma to spend.
    Returns:
        Updated character dictionary with karma spent recorded.
    Notes:
        Tracks karma spending by category for campaign bookkeeping.
    """
    _check_type("character", character, dict)
    _check_type("category", category, str)
    _check_type("amount", amount, int)
    updated: Dict[str, Any] = character.copy()
    spent: Dict[str, Any] = updated.get("karma_spent", {})
    spent[category] = spent.get(category, 0) + amount
    updated["karma_spent"] = spent
    logger.info(f"Character spent {amount} karma on {category}. Total: {spent[category]}")
    return updated

# ---------- Session Management Tools ----------

def session_log(
    session_number: int,
    summary: str,
    npcs: List[str],
    loot: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Logs a session's summary, NPCs, and loot for campaign tracking.
    Use this after each session to record what happened.
    Args:
        session_number: The session's number in the campaign.
        summary: A brief summary of the session's events.
        npcs: List of NPC names involved in the session.
        loot: Dictionary of loot or rewards distributed.
    Returns:
        Dictionary representing the session log.
    Notes:
        Useful for campaign recaps and continuity.
    """
    _check_type("session_number", session_number, int)
    _check_type("summary", summary, str)
    _check_list_of("npcs", npcs, str)
    _check_type("loot", loot, dict)
    session: Dict[str, Any] = {
        "session": session_number,
        "summary": summary,
        "npcs": npcs,
        "loot": loot
    }
    logger.info(f"Logged session {session_number}: {summary}")
    return session

# ---------- Campaign Management Tools ----------

def campaign_create(settings: Dict[str, Any]) -> Dict[str, Any]:
    """
    Creates a new campaign dictionary with default fields.
    Use this when starting a new campaign or importing settings.
    Args:
        settings: Dictionary of campaign settings and custom fields.
    Returns:
        Campaign dictionary with defaults merged in.
    Notes:
        Ensures 'sessions', 'characters', and 'npcs' are always present and validated.
    """
    defaults: Dict[str, Any] = {
        "sessions": [],
        "characters": [],
        "npcs": []
    }
    campaign = ensure_defaults(settings, defaults)
    if "sessions" in campaign:
        _check_list_of("sessions", campaign["sessions"], dict)
    if "npcs" in campaign:
        _check_list_of("npcs", campaign["npcs"], dict)
    logger.info(f"Created campaign with settings: {settings}")
    return campaign

# ---------- NPC & Contract Lookup Tools ----------

def get_random_npc(
    npcs: List[Dict[str, Any]],
    tag: Optional[str] = None
) -> Dict[str, Any]:
    """
    Selects a random NPC from a list, optionally filtered by tag.
    Use this to quickly pick an NPC for encounters or scenes.
    Args:
        npcs: List of NPC dictionaries.
        tag: Optional tag to filter NPCs (e.g., 'fixer', 'enemy').
    Returns:
        Randomly selected NPC dictionary, or empty dict if none found.
    Notes:
        If tag is provided, only NPCs with that tag are considered.
    """
    _check_list_of("npcs", npcs, dict)
    if tag is not None:
        _check_type("tag", tag, str)
        filtered = [n for n in npcs if tag in n.get("tags", [])]
        if filtered:
            npc = random.choice(filtered)
            logger.info(f"Selected random NPC with tag '{tag}': {npc}")
            return npc
        logger.warning(f"No NPC found with tag '{tag}'")
        return {}
    if npcs:
        npc = random.choice(npcs)
        logger.info(f"Selected random NPC: {npc}")
        return npc
    logger.warning("No NPCs available to select.")
    return {}


def get_contract_brief(
    briefs: List[Dict[str, Any]],
    name: str
) -> Dict[str, Any]:
    """
    Looks up a contract brief by name from a list.
    Use this to retrieve mission or job details by name.
    Args:
        briefs: List of contract brief dictionaries.
        name: The name of the contract/job to look up.
    Returns:
        The contract brief dictionary, or empty dict if not found.
    Notes:
        Useful for referencing jobs during play or prep.
    """
    _check_list_of("briefs", briefs, dict)
    _check_type("name", name, str)
    for brief in briefs:
        if brief.get("name") == name:
            logger.info(f"Found contract brief: {brief}")
            return brief
    logger.warning(f"No contract brief found with name '{name}'")
    return {}

# ---------- Storytelling Prompt Tools ----------

def prompt_player(prompt_type: str = "Cue") -> str:
    """
    Provides a storytelling prompt for a player based on prompt type.
    Use this to encourage roleplay or clarify character state.
    Args:
        prompt_type: The type of prompt (e.g., 'Cue', 'Disposition').
    Returns:
        The prompt string for the player.
    Notes:
        Prompts are data-driven and can be extended for more types.
    """
    _check_type("prompt_type", prompt_type, str)
    prompts: Dict[str, str] = {
        "Cue": "Describe how your character applies their Cue in this scene.",
        "Disposition": "What is your character's current disposition?"
    }
    prompt = prompts.get(prompt_type, "")
    if prompt:
        logger.info(f"Prompted player with type '{prompt_type}': {prompt}")
    else:
        logger.warning(f"No prompt found for type '{prompt_type}'")
    return prompt

# ---------- Shadowrun Anarchy Core Mechanics Helpers ----------

def detect_glitch(rolls: List[int], hits: int) -> Dict[str, bool]:
    """
    Determines if a dice roll results in a glitch or critical glitch according to Shadowrun Anarchy rules.
    Use this after any dice pool roll to check for glitches.
    - Glitch: Half or more dice are 1s (and at least one die rolled).
    - Critical Glitch: Glitch occurs and there are zero hits.
    Args:
        rolls: List of integers representing dice results (1-6).
        hits: Number of hits (dice that rolled 5 or 6).
    Returns:
        Dict with keys 'glitch' (bool) and 'critical_glitch' (bool).
    Notes:
        Always call this after rolling dice for actions, especially when the outcome is important.
    """
    _check_list_of("rolls", rolls, int)
    _check_type("hits", hits, int)
    num_ones = rolls.count(1)
    glitch = num_ones >= (len(rolls) // 2) and len(rolls) > 0
    critical = glitch and hits == 0
    logger.info(f"Glitch check: {num_ones} ones in {rolls} (glitch={glitch}, critical={critical})")
    return {"glitch": glitch, "critical_glitch": critical}


def reroll_failures(rolls: List[int], hit_threshold: int = 5) -> Tuple[int, List[int]]:
    """
    Rerolls all dice that did not score a hit (>= hit_threshold) in a dice pool.
    Use this when a player spends Edge to reroll failures.
    Args:
        rolls: List of integers representing the original dice results.
        hit_threshold: The minimum die value that counts as a hit (default 5; use 4 for Edge).
    Returns:
        Tuple of (new hit count, new list of dice results after rerolling failures).
    Notes:
        Only reroll dice that are less than hit_threshold. Do not reroll dice that already scored a hit.
        Call detect_glitch on the new rolls if needed.
    """
    _check_list_of("rolls", rolls, int)
    new_rolls = [r if r >= hit_threshold else random.randint(1, 6) for r in rolls]
    hits = sum(1 for r in new_rolls if r >= hit_threshold)
    logger.info(f"Rerolled failures (threshold={hit_threshold}): {rolls} -> {new_rolls} (hits={hits})")
    return hits, new_rolls


def calculate_initiative(attribute: int, skill: int, bonus: int = 0) -> int:
    """
    Calculates a character's initiative for combat order in Shadowrun Anarchy.
    Use this at the start of combat or any time initiative order is needed.
    Args:
        attribute: The character's relevant attribute (e.g., Agility).
        skill: The character's relevant skill (e.g., Firearms).
        bonus: Any situational or gear bonuses (default 0).
    Returns:
        The total initiative score (int).
    Notes:
        Initiative = attribute + skill + bonus + 1d6 (random die roll).
    """
    _check_type("attribute", attribute, int)
    _check_type("skill", skill, int)
    _check_type("bonus", bonus, int)
    roll = random.randint(1, 6)
    initiative = attribute + skill + bonus + roll
    logger.info(f"Initiative: {attribute} + {skill} + {bonus} + {roll} = {initiative}")
    return initiative


def spend_plot_point(current_points: int) -> int:
    """
    Spends a plot point for a character or player.
    Use this whenever a player spends a plot point for narrative control or special actions.
    Args:
        current_points: The current number of plot points the character/player has.
    Returns:
        The new plot point total (int).
    Notes:
        Will not go below zero. Always check before allowing plot point actions.
    """
    _check_type("current_points", current_points, int)
    if current_points > 0:
        logger.info(f"Spent plot point. Remaining: {current_points - 1}")
        return current_points - 1
    logger.warning("No plot points to spend.")
    return 0


def award_plot_point(current_points: int) -> int:
    """
    Awards a plot point to a character or player.
    Use this when a player earns a plot point for good roleplay, clever ideas, or GM fiat.
    Args:
        current_points: The current number of plot points the character/player has.
    Returns:
        The new plot point total (int).
    Notes:
        Plot points are a core narrative currency in Shadowrun Anarchy.
    """
    _check_type("current_points", current_points, int)
    logger.info(f"Awarded plot point. Total: {current_points + 1}")
    return current_points + 1


def apply_damage_to_condition_monitor(condition_monitor: int, damage: int) -> int:
    """
    Applies damage to a character's condition monitor (health track).
    Use this after a character takes damage from any source.
    Args:
        condition_monitor: The character's current condition monitor value (remaining health).
        damage: The amount of damage to apply.
    Returns:
        The new condition monitor value (int), not less than zero.
    Notes:
        If condition monitor reaches zero, the character is incapacitated or worse.
    """
    _check_type("condition_monitor", condition_monitor, int)
    _check_type("damage", damage, int)
    new_monitor = max(0, condition_monitor - damage)
    logger.info(f"Applied {damage} damage. Condition monitor: {condition_monitor} -> {new_monitor}")
    return new_monitor


def resolve_opposed_test(attacker_hits: int, defender_hits: int) -> str:
    """
    Resolves an opposed test between two parties (e.g., attacker vs. defender).
    Use this after both sides have rolled and counted hits.
    Args:
        attacker_hits: Number of hits for the attacker.
        defender_hits: Number of hits for the defender.
    Returns:
        'attacker' if attacker wins, 'defender' if defender wins, 'tie' if equal.
    Notes:
        Useful for combat, stealth, hacking, and any opposed action.
    """
    logger.info(f"Opposed test: attacker={attacker_hits}, defender={defender_hits}")
    if attacker_hits > defender_hits:
        return 'attacker'
    elif defender_hits > attacker_hits:
        return 'defender'
    else:
        return 'tie'


def handle_condition_overflow(condition_monitor: int, overflow: int) -> Dict[str, Any]:
    """
    Handles condition monitor overflow and determines status effects (e.g., unconscious).
    Use this after applying damage that exceeds the condition monitor.
    Args:
        condition_monitor: The character's current condition monitor (after damage).
        overflow: Amount by which damage exceeded the monitor (can be zero).
    Returns:
        Dict with keys: 'status' (e.g., 'ok', 'overflow', 'unconscious'), 'overflow' (int).
    Notes:
        Customize status logic as needed for campaign rules.
    """
    if condition_monitor > 0:
        status = 'ok'
    elif overflow > 0:
        status = 'unconscious'
    else:
        status = 'overflow'
    logger.info(f"Condition monitor overflow: monitor={condition_monitor}, overflow={overflow}, status={status}")
    return {'status': status, 'overflow': overflow}


def heal_condition_monitor(condition_monitor: int, healing: int, max_monitor: int) -> int:
    """
    Applies healing to a character's condition monitor (health track).
    Use this after first aid, rest, or magical healing.
    Args:
        condition_monitor: The character's current condition monitor value.
        healing: The amount of healing to apply.
        max_monitor: The maximum value for the condition monitor.
    Returns:
        The new condition monitor value (int), not exceeding max_monitor.
    Notes:
        Does not allow healing above the maximum monitor value.
    """
    new_monitor = min(condition_monitor + healing, max_monitor)
    logger.info(f"Healed {healing}. Condition monitor: {condition_monitor} -> {new_monitor}")
    return new_monitor


def track_ammo(current_ammo: int, shots_fired: int, magazine_size: int) -> Dict[str, Any]:
    """
    Tracks ammo usage, decrements ammo, and checks for reloads.
    Use this after a character fires a weapon.
    Args:
        current_ammo: Current ammo in the magazine (>=0).
        shots_fired: Number of shots fired (>=0).
        magazine_size: Maximum ammo capacity of the magazine (>0).
    Returns:
        Dict with keys: 'ammo_left' (int, >=0), 'needs_reload' (bool).
    Notes:
        If ammo_left <= 0, needs_reload is True. Ammo cannot go below zero.
    """
    ammo_left = max(0, current_ammo - shots_fired)
    needs_reload = ammo_left <= 0
    logger.info(f"Ammo tracking: {current_ammo} - {shots_fired} = {ammo_left} (needs_reload={needs_reload})")
    return {'ammo_left': ammo_left, 'needs_reload': needs_reload}


def apply_karma_advancement(character: Dict[str, Any], field: str, amount: int, cost: int, karma_available: int) -> Dict[str, Any]:
    """
    Applies karma to advance a character's attribute or skill, with validation.
    Use this when a character spends karma to improve.
    Args:
        character: The character dictionary.
        field: The attribute or skill to advance (e.g., 'Agility').
        amount: The amount to increase.
        cost: The karma cost for the advancement.
        karma_available: The character's available karma.
    Returns:
        Updated character dictionary with advancement applied if possible.
    Notes:
        Will not apply advancement if not enough karma is available.
    """
    if karma_available < cost:
        logger.warning(f"Not enough karma to advance {field}. Required: {cost}, available: {karma_available}")
        return character
    updated = character.copy()
    updated[field] = updated.get(field, 0) + amount
    updated['karma_spent'] = updated.get('karma_spent', {})
    updated['karma_spent'][field] = updated['karma_spent'].get(field, 0) + cost
    logger.info(f"Advanced {field} by {amount} for {cost} karma. New value: {updated[field]}")
    return updated


def get_current_timestamp() -> str:
    """
    Returns the current date and time in ISO 8601 format (UTC).
    Use this to timestamp logs, session records, or any time-sensitive data.
    Returns:
        ISO 8601 formatted timestamp string.
    Notes:
        Uses UTC for consistency across systems.
    """
    timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
    logger.info(f"Retrieved current timestamp: {timestamp}")
    return timestamp


def serialize_data(data: Any, filepath: str) -> None:
    """
    Serializes (saves) campaign, character, or session data to a JSON file.
    Use this to persist campaign state between sessions.
    Args:
        data: The data to serialize (dict, list, etc.).
        filepath: The file path to save the data to.
    Returns:
        None
    Notes:
        Overwrites the file if it exists. Use with care.
    """
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info(f"Serialized data to {filepath}")


def deserialize_data(filepath: str) -> Any:
    """
    Deserializes (loads) campaign, character, or session data from a JSON file.
    Use this to load campaign state at the start of a session.
    Args:
        filepath: The file path to load the data from.
    Returns:
        The loaded data (dict, list, etc.).
    Notes:
        Raises FileNotFoundError if the file does not exist.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    logger.info(f"Deserialized data from {filepath}")
    return data


def roll_on_random_table(table: List[Any]) -> Any:
    """
    Selects a random result from a data-driven table (list).
    Use this for random encounters, loot, oracles, or inspiration.
    Args:
        table: List of possible results (strings, dicts, etc.).
    Returns:
        A randomly selected entry from the table.
    Notes:
        Table may contain mixed types. If empty, returns None and logs a warning.
    """
    if not table:
        logger.warning("Random table is empty.")
        return None
    result = random.choice(table)
    logger.info(f"Rolled on random table: {result}")
    return result

# ---------- High-Level Save/Load Helpers ----------

def save_campaign(campaign: Dict[str, Any], filepath: str) -> None:
    """
    Saves the campaign dictionary to a JSON file.
    Args:
        campaign: The campaign dictionary to save.
        filepath: The file path to save to.
    Returns:
        None
    Notes:
        Overwrites the file if it exists.
    """
    serialize_data(campaign, filepath)


def load_campaign(filepath: str) -> Dict[str, Any]:
    """
    Loads a campaign dictionary from a JSON file.
    Args:
        filepath: The file path to load from.
    Returns:
        The loaded campaign dictionary.
    Notes:
        Raises FileNotFoundError if the file does not exist.
    """
    return deserialize_data(filepath)


def save_character(character: Dict[str, Any], filepath: str) -> None:
    """
    Saves a character dictionary to a JSON file.
    Args:
        character: The character dictionary to save.
        filepath: The file path to save to.
    Returns:
        None
    Notes:
        Overwrites the file if it exists.
    """
    serialize_data(character, filepath)


def load_character(filepath: str) -> Dict[str, Any]:
    """
    Loads a character dictionary from a JSON file.
    Args:
        filepath: The file path to load from.
    Returns:
        The loaded character dictionary.
    Notes:
        Raises FileNotFoundError if the file does not exist.
    """
    return deserialize_data(filepath)

# ---------- Example Usage ----------
if __name__ == '__main__':
    hits, rolls = roll_cue(6)
    print(f"Rolled {rolls} \u0014 Hits: {hits}")
    # Test get_current_timestamp
    print(f"Current timestamp: {get_current_timestamp()}")
