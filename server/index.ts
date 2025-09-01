import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

export const app = express();
// Debug: Log all incoming requests
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming: ${req.method} ${req.originalUrl}`);
  next();
});

const whitelist = [
  "https://menubosse.netlify.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`[CORS] Blocked origin: ${origin}`);
      callback(null, false); // Do not throw, just block
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

const serverPromise = registerRoutes(app);

async function startServer() {
  const server = await serverPromise;

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  app.use((req, res) => {
    console.error(`[DEBUG] 404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: "Not Found", path: req.originalUrl });
  });

  const port = Number(process.env.PORT) || 5000;
  server.listen(port, '0.0.0.0', () => {
    log(`serving on port ${port}`);
  });

  server.keepAliveTimeout = 120000;
  server.headersTimeout = 120000;
}

import { fileURLToPath } from 'url';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}
