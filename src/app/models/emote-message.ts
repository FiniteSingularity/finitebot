export interface EmoteData {
    id: string;
    positions: [number, number][]
}

export interface EmoteMessage {
    text: string;
    emotes: EmoteData[];
}

export interface MatrixMessageRow {
    mc_type: string;
    value: string;
}
