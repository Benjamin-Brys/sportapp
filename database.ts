import { MongoClient, Collection } from "mongodb";
import dotenv from "dotenv";
import chalk from 'chalk';
import { Teams } from "./interfaces";

dotenv.config();

const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const client = new MongoClient(uri);
  
async function ABC() {
    try {
        const result = await fetch(`https://api.football-data.org/v4/competitions/`, {
            headers: {'X-Auth-Token': '0a57c6f9ba31492383865d39d1c3c602' }
        });

        if (!result.ok) {
            throw new Error('netwerk error' + result.statusText);
        }

        const data = await result.json();

        console.log(data);

        const insertResult = await client.db("Football").collection("Areas").insertMany(data.areas);

        console.log(`Document toegevoegd met _id: ${insertResult.insertedIds}`);
    } catch (error) {
        console.error("fout:", error);
    }
}

export async function fetchTeams(team: any) {
    try {
        const result = await client.db("Football").collection("Areas").find().toArray();

        const teams: Teams[] = result.map((team: any) => ({
            name: team.name,
            crest: team.crest
        }));
        return teams;
    } catch (error) {
        console.log(chalk.red("fout =>", error));
    }
}

async function exit() {
    try {
        await client.close();
        console.log(chalk.cyan("Disconnected from database"));
    } catch (error) {
        console.log(error);
    }
    process.exit(0);
}
export async function connect() {
    try {
        await client.connect();
        console.log(chalk.cyan("Connected to database"));
        process.on("SIGINT", exit);
    } catch (error) {
        console.log("connection fail =>", error);
    }
}