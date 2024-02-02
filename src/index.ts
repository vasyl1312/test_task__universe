import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import routerAll from "./routes/routerAll";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 7001;

app.use("/api", routerAll);

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
