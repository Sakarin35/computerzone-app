import * as functions from "firebase-functions";
import express, { Request, Response } from "express";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  conf: {
    distDir: ".next", // Next.js 빌드 디렉토리
  },
});

const handle = app.getRequestHandler();
const server = express();

app.prepare().then(() => {
  server.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });
});

export const nextApp = functions.https.onRequest(server);
