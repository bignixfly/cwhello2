import { createServer } from "node:http";
import service from "./service.mjs";

const { db } = service.load();
const port = service.port();

const server = createServer(async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { "content-type": "text/plain" });
      res.end("Method not allowed\n");
      return;
    }
    if (req.url === "/healthz") {
      res.writeHead(200, { "content-type": "text/plain" });
      res.end("ok\n");
      return;
    }
    if (req.url === "/") {
      const notes = await db.client.orm.public.Note
        .select("id", "text", "createdAt")
        .orderBy((n) => n.id.desc())
        .limit(20)
        .all();
      res.writeHead(200, { "content-type": "application/json" });
      res.end(`${JSON.stringify({ notes })}\n`);
      return;
    }
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found\n");
  } catch (error) {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`dodoumir listening on port ${port}`);
});
