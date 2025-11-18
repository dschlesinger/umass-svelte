import { 
    type GameState, type Province, type Army,
    get_faction, get_army, get_province, remove_army_from_current_province
} from './gameState'; // adjust as needed

export interface GameUpdate {
    type: 
        | 'ended_turn'
        | 'game_turn'
        | 'army_change'
        | 'province_change'
        | 'move_army'
        | 'new_army'
        | string; // fallback

    props: Record<string, any>;
}

export function update_game_state(
    game_state: GameState, 
    updates: GameUpdate[]
): GameState 
{
    for (const u of updates) {

        switch (u.type) {

            case 'ended_turn': {
                const faction_id = u.props['faction_id'];
                const faction = get_faction(game_state.factions, faction_id);
                if (faction) {
                    faction.turn_ended = u.props['turn_status'];
                }
                break;
            }

            case 'game_turn': {
                game_state.turn_status = u.props['status'];
                break;
            }

            case 'army_change': {
                const army_id = u.props['army_id'];
                const army = get_army(game_state.provinces, army_id);
                if (army) {
                    army.numbers += u.props['numbers'];
                }
                break;
            }

            case 'province_change': {
                const { faction_id, province_id } = u.props;
                const p = get_province(game_state.provinces, province_id);
                if (p) {
                    p.faction_id = faction_id;
                }
                break;
            }

            case 'move_army': {
                const { army_id, province_id } = u.props;

                const a = remove_army_from_current_province(game_state.provinces, army_id);
                const p = get_province(game_state.provinces, province_id);

                if (a && p) {
                    p.army.push(a);
                } else {
                    console.log('Could not find army to move');
                }

                break;
            }

            case 'new_army': {
                const { numbers, province_id, faction_id, army_id } = u.props;

                const p = get_province(game_state.provinces, province_id);
                if (p) {
                    p.army.push({
                        army_id,
                        faction_id,
                        numbers
                    });
                }

                break;
            }

            default:
                console.log('update unknown type', u);
                break;
        }
    }

    return game_state;
}
