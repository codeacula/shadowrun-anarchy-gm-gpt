export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

export interface Campaign {
    id: string;
    name: string;
    description: string;
    createdBy: string;
}

export interface Session {
    id: string;
    campaignId: string;
    date: Date;
    notes: string;
}

export interface Character {
    id: string;
    name: string;
    campaignId: string;
    attributes: Record<string, any>;
}