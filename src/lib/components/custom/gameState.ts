export type TurnStatus = 'playing' | 'editting_game_state' | 'updating_context';

export interface City {
    is_capital: boolean;
}

export interface Army {
    army_id: string;
    faction_id: string;
    numbers: number;
}

export interface Port {}

export interface Fort {}

export interface Faction {
    faction_id: string;
    name: string;

    available: boolean;
    defeated: boolean;
    turn_ended: boolean;
}

export interface Province {
    province_id: string;
    fractal_id: string;
    name?: string | null;

    faction_id?: string | null;
    is_ocean: boolean;

    border?: number[][] | null;
    centriod?: number[] | null;

    city?: City | null;
    army: Army[];
    fort?: Fort | null;
    port?: Port | null;

    neighbors: string[];
}

export interface GameState {
    game_id: string;
    name: string;
    owner: string;
    game_over: boolean;
    turn_status: TurnStatus;

    factions: Faction[];
    provinces: Province[];
}

export function get_province(provinces: Province[], province_id: string): Province | undefined {
    return provinces.find(p => p.province_id === province_id);
}

export function get_faction(factions: Faction[], faction_id: string): Faction | undefined {
    return factions.find(f => f.faction_id === faction_id);
}

export function get_army(provinces: Province[], army_id: string): Army | undefined {
    for (const p of provinces) {
        const found = p.army.find(a => a.army_id === army_id);
        if (found) return found;
    }
    return undefined;
}

export function remove_army_from_current_province(provinces: Province[], army_id: string): Army | undefined {
    for (const p of provinces) {
        const idx = p.army.findIndex(a => a.army_id === army_id);
        if (idx !== -1) {
            const [a] = p.army.splice(idx, 1);
            return a;
        }
    }
    return undefined;
}
