import express from "express";
import { PlayersByType, Teams } from "interfaces&types";
import mongoose from "mongoose";
import TeamSchema from "./TeamSchema";
import Player from "./PlayerSchema";
// Replace the following with your Atlas connection string
const url =
  "mongodb+srv://user:Bs9dPbNshAP5WV6@cluster0.20hkb.mongodb.net/Proxet_challenge?retryWrites=true&w=majority";
const PORT = 8080;

const VEHICLE_TYPES = 3;
// The database to use
const dbName = "Proxet_challenge";

const teams: Teams = {
  firstTeam: [],
  secondTeam: [],
};

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("HOME");
});

async function run() {
  try {
    await mongoose.connect(url);

    const db = mongoose.connection.useDb(dbName);

    app.post("/api/v1/lobby", async (req, res) => {
      let timeInsertingInLobby = new Date();
      const { username, vehicleType } = req.body;
      const post = await Player.create({
        username,
        vehicleType,
        timeInsertingInLobby,
      });

      if (req.body !== null) {
        db.collection("collection").insertOne(post);
        res.status(200).json("all is OK 200");
      }
    });

    app.post("/api/v1/teams/generate", async (req, res) => {
      const lobby = db.collection("collection");
      const query = {};

      const players: PlayersByType = {
        type1: [],
        type2: [],
        type3: [],
      };

      lobby.find(query).toArray((err, result) => {
        if (err || result === undefined) throw err;
        result.map((item) => {
          const player = {
            username: item.username,
            vehicleType: item.vehicleType,
            timeInsertingInLobby: item.timeInsertingInLobby,
          };

          switch (item.vehicleType) {
            case 1:
              players.type1.push(player);
              break;
            case 2:
              players.type2.push(player);
              break;
            case 3:
              players.type3.push(player);
              break;
            default:
              console.log(
                `Player ${item.username} hasn't vehicle type or it's missmatch`
              );
          }
        });

        for (let i = 0; i < VEHICLE_TYPES; i++) {
          players[`type${i + 1}` as keyof PlayersByType].sort(
            (a, b): number => {
              const aTime = a.timeInsertingInLobby,
                bTime = b.timeInsertingInLobby;

              return Number(aTime) - Number(bTime);
            }
          );
        }

        for (let i = 0; i < VEHICLE_TYPES; i++) {
          for (let j = 0; j < VEHICLE_TYPES * 2; j++) {
            const player = players[`type${i + 1}` as keyof PlayersByType].pop();

            if (player === undefined) throw new Error("Couldn't be assigned");

            if (j % 2 === 0) {
              teams.secondTeam.push(player);
            } else {
              teams.firstTeam.push(player);
            }
          }
        }

        const post = TeamSchema.create({
          firstTeam: teams.firstTeam,
          secondTeam: teams.secondTeam
        });

        db.collection('teams').insertOne(post)

        res.status(200).json(teams);
      });
    });

    app.get("/api/v1/healthcheck", (req, res) => {
      if (mongoose.connection.readyState === 1) {
        res.status(200).json("200 OK");
      } else {
        res.status(503).json("503 Service Unavailable");
      }
    });

    app.listen(PORT, () => console.log("SERVER STARTED ON PORT " + PORT));
  } catch (err: any) {
    console.log(err.stack);
  }
}
run();
