import { ObjectId } from "mongodb";

export interface Teams {
    name: string;
    crest: string;
}



export interface Standings {
    position: number,
    team: {
        name: string,
        crest: string
    },
    playedGames: number,
    form: string,
    won: number,
    draw: number,
    lost: number,
    points: number,
    goalsFor: number,
    goalsAgainst: number,
    goalDifference: number
};
export interface Team {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
}
export interface Match {
    area: Area;
    competition: Competition;
    season: Season;
    id: number;
    utcDate: string;
    status: string;
    matchday: number;
    stage: string;
    group: null | string;
    lastUpdated: string;
    homeTeam: Team;
    awayTeam: Team;
    score: Score;
    odds: {
        msg: string;
    };
    referees: Array<any>;
}



export interface Area {
    id: number;
    name: string;
    code: string;
    flag: string;
}
export interface Competition {
    id: number;
    name: string;
    code: string;
    type: string;
    emblem: string;
}
export interface Season {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner: null | string;
}



export interface Score {
    winner: null | string;
    duration: string;
    fullTime: {
        home: null | number;
        away: null | number;
    };
    halfTime: {
        home: null | number;
        away: null | number;
    };
}
export interface Areas {
    _id?: ObjectId;
    name: string;
    countryCode: string;
    flag: string;
    parentAreaId: number;
    parentArea: string;
}