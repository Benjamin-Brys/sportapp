import express, { Express, response, NextFunction } from 'express';
import path from "path";
import {Standings, Teams, Match, Flags} from "./interfaces"


const app = express();

app.set("view engine", "ejs")
app.set("port", 3000)
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended:true}))




app.get("/", async(req, res) => {
    const matches = await fetchMatches();
    res.render("users/main", {matches})
});

app.post("/aside_chekbox", async(req, res) => {
    const favorite = req.body.league
    console.log(favorite)
    const matches = await fetchMatchesLeague(favorite);
    res.render("users/main", {matches})
})

app.get("/main", async(req,res) => {
    const league = req.query.league;
    const matches = await fetchMatchesLeague(league)
    res.render("users/main", {matches})
})





app.get("/teams", async (req, res) => {
    const team = req.query.team;
    const teams = await fetchTeams(team);
    res.render("users/teams", {teams})
});

app.get("/teamsPage", async (req, res) => {
    const team = "PL"
    const teams = await fetchTeams(team);
    res.render("users/teams", {teams})
});

app.get("/standings", async (req, res) => {
    const {year, league} = req.query;
    const standings = await fetchStanding(year, league);
    res.render("users/standings", {standings, league, year})
});

app.get("/StandingsPage", async (req, res) => {
    const league = "PL";
    const year = "2023";
    const standings = await fetchStanding(year, league);
    res.render("users/standings", {standings, year})
})

app.listen(app.get("port"), () => 
    console.log("http://localhost:" + app.get("port"))
);




async function fetchTeams(team: any) {
    try {
        const result = await fetch(`https://api.football-data.org/v4/competitions/${team}/teams`, {
            headers: {'X-Auth-Token': '0a57c6f9ba31492383865d39d1c3c602' }
        });

        if (!result.ok) {
            throw new Error('netwerk error' + result.statusText);
        }

        const data = await result.json();
        const teams: Teams[] = data.teams.map((team: any) => ({
            name: team.name,
            crest: team.crest
        }));
        return teams;
    } catch (error) {
        console.log("fout");
    }
}
async function fetchStanding(year: any, league: any) {
    try {
        const response = await fetch(`https://api.football-data.org/v4/competitions/${league}/standings?season=${year}`, {
            headers: { 'X-Auth-Token': '0a57c6f9ba31492383865d39d1c3c602' }
        });

        const data = await response.json();

        const standings: Standings[] = data.standings[0].table.map((stand: any) => ({            
            position: stand.position,
            team: {
                name: stand.team.name,
                crest: stand.team.crest,
            },
            playedGames: stand.playedGames,
            form: stand.form,
            won: stand.won,
            draw: stand.draw,
            lost: stand.lost,
            points: stand.points,
            goalsFor: stand.goalsFor,
            goalsAgainst: stand.goalsAgainst,
            goalDifference: stand.goalDifference
        }));
        
        return standings;
        
    } catch (error) {
        console.error('Error fetching standings:', error);
        throw error;
    }
}
async function fetchMatches() {
    try {
        const date = new Date();

        let year: number | string = date.getFullYear();
        let month: number | string = date.getMonth() +1;
        let day: number | string = date.getDate() -3;

        if (month < 10) {month = `0${month}`};
        if (day < 10) {day = `0${day}`};

        const date1: string = `${year}-${month}-${day}`
        day = date.getDate() +7;
        const date2: string = `${year}-${month}-${day}`

        const result = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${date1}&dateTo=${date2}`, { 
            headers: {'X-Auth-Token': '0a57c6f9ba31492383865d39d1c3c602' }
        })
        
        if (!result.ok) {
            throw new Error(`HTTP error! Status: ${result.status}`);
        }

        const data = await result.json()

        const matches: Match[] = data.matches.map((match: any) => ({
            area: {
                id: match.area.id,
                name: match.area.name,
                code: match.area.code,
                flag: match.area.flag
            },
            competition: {
                id: match.competition.id,
                name: match.competition.name,
                code: match.competition.code,
                type: match.competition.type,
                emblem: match.competition.emblem
            },
            season: {
                id: match.season.id,
                startDate: match.season.startDate,
                endDate: match.season.endDate,
                currentMatchday: match.season.currentMatchday,
                winner: match.season.winner
            },           
            id: match.id,
            utcDate: match.utcDate,
            status: match.status,
            matchday: match.matchday,
            stage: match.stage,
            group: match.group,
            lastUpdated: match.lastUpdated,
            homeTeam: {
                id: match.homeTeam.id,
                name: match.homeTeam.name,
                shortName: match.homeTeam.shortName,
                tla: match.homeTeam.tla,
                crest: match.homeTeam.crest
            },
            awayTeam: {
                id: match.awayTeam.id,
                name: match.awayTeam.name,
                shortName: match.awayTeam.shortName,
                tla: match.awayTeam.tla,
                crest: match.awayTeam.crest
            },
             score: {
                winner: match.score.winner,
                duration: match.score.duration,
                fullTime: {
                    home: match.score.fullTime.home,
                    away: match.score.fullTime.away
                },
                halfTime: {
                    home: match.score.halfTime.home,
                    away: match.score.halfTime.away
                }
            },
            odds: {
                msg: match.odds.msg
            },
        }));
        return matches;

    } catch (error) {
        console.error('Error fetching matches');
    }
}
async function fetchMatchesLeague(favorite: any) {
    try {
        const date = new Date();

        let year: number | string = date.getFullYear();
        let month: number | string = date.getMonth() +1;
        let day: number | string = date.getDate() -3;

        if (month < 10) {month = `0${month}`};
        if (day < 10) {day = `0${day}`};

        const date1: string = `${year}-${month}-${day}`
        day = date.getDate() +7;
        const date2: string = `${year}-${month}-${day}`

        console.log(favorite)

        const result = await fetch(`https://api.football-data.org/v4/matches?competitions=${favorite}&dateFrom=${date1}&dateTo=${date2}`, { 
            headers: {'X-Auth-Token': '0a57c6f9ba31492383865d39d1c3c602' }
        })
        
        if (!result.ok) {
            throw new Error(`HTTP error! Status: ${result.status}`);
        }

        const data = await result.json()

        const matches: Match[] = data.matches.map((match: any) => ({
            area: {
                id: match.area.id,
                name: match.area.name,
                code: match.area.code,
                flag: match.area.flag
            },
            competition: {
                id: match.competition.id,
                name: match.competition.name,
                code: match.competition.code,
                type: match.competition.type,
                emblem: match.competition.emblem
            },
            season: {
                id: match.season.id,
                startDate: match.season.startDate,
                endDate: match.season.endDate,
                currentMatchday: match.season.currentMatchday,
                winner: match.season.winner
            },           
            id: match.id,
            utcDate: match.utcDate,
            status: match.status,
            matchday: match.matchday,
            stage: match.stage,
            group: match.group,
            lastUpdated: match.lastUpdated,
            homeTeam: {
                id: match.homeTeam.id,
                name: match.homeTeam.name,
                shortName: match.homeTeam.shortName,
                tla: match.homeTeam.tla,
                crest: match.homeTeam.crest
            },
            awayTeam: {
                id: match.awayTeam.id,
                name: match.awayTeam.name,
                shortName: match.awayTeam.shortName,
                tla: match.awayTeam.tla,
                crest: match.awayTeam.crest
            },
             score: {
                winner: match.score.winner,
                duration: match.score.duration,
                fullTime: {
                    home: match.score.fullTime.home,
                    away: match.score.fullTime.away
                },
                halfTime: {
                    home: match.score.halfTime.home,
                    away: match.score.halfTime.away
                }
            },
            odds: {
                msg: match.odds.msg
            },
        }));
        return matches;

    } catch (error) {
        console.error('Error fetching matches');
    }
}