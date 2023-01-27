import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import route from "./router/index.route";

const app: Express = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1", route);

app.get("/",async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "App is running"})
})

export { app };
