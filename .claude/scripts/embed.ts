/**
 * embed.ts
 *
 * Lê um arquivo .md de conhecimento gerado pelo summarize.ts.
 * Quebra em chunks de 200-300 tokens.
 * Gera embeddings com all-MiniLM-L6-v2 (local, sem API externa).
 * Insere no rag.db vinculando knowledge + knowledge_vec.
 *
 * Uso:
 *   npx tsx embed.ts --file .claude/knowledge/2024-01-15-backend-auth.md --agent backend-auth
 */

import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { pipeline } from "@xenova/transformers";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, "../knowledge/rag.db");

// --- args ---
function getArg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const filePath = getArg("--file");
const agentSlug = getArg("--agent") ?? "unknown";

if (!filePath) {
  console.error("Uso: npx tsx embed.ts --file <caminho.md> --agent <slug>");
  process.exit(1);
}

// --- categorias reconhecidas ---
const CATEGORY_MAP: Record<string, string> = {
  bugs: "bug",
  architecture: "architecture",
  patterns: "pattern",
  failures: "failure",
};

// --- divide o markdown em chunks por seção ---
function chunkBySection(
  content: string,
  filePath: string
): Array<{ content: string; category: string }> {
  const chunks: Array<{ content: string; category: string }> = [];
  const lines = content.split("\n");

  let currentCategory = "pattern";
  let buffer: string[] = [];

  const flush = () => {
    const text = buffer.join("\n").trim();
    if (text.length > 20) {
      // quebra em sub-chunks de ~250 tokens (~1000 chars)
      const MAX_CHARS = 1000;
      for (let i = 0; i < text.length; i += MAX_CHARS) {
        chunks.push({
          content: text.slice(i, i + MAX_CHARS).trim(),
          category: currentCategory,
        });
      }
    }
    buffer = [];
  };

  for (const line of lines) {
    const sectionMatch = line.match(/^##\s+(\w+)/);
    if (sectionMatch) {
      flush();
      currentCategory = CATEGORY_MAP[sectionMatch[1].toLowerCase()] ?? "pattern";
    } else if (!line.startsWith("---") && !line.startsWith("agent:") && !line.startsWith("created_at:")) {
      buffer.push(line);
    }
  }
  flush();

  return chunks;
}

// --- gera embedding com all-MiniLM-L6-v2 ---
async function generateEmbedding(text: string, extractor: any): Promise<Float32Array> {
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return output.data as Float32Array;
}

// --- main ---
async function main() {
  console.log(`Carregando modelo de embedding (all-MiniLM-L6-v2)...`);

  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    { revision: "main" }
  );

  const content = readFileSync(resolve(filePath!), "utf-8");
  const chunks = chunkBySection(content, filePath!);

  if (chunks.length === 0) {
    console.log("Nenhum chunk válido encontrado no arquivo.");
    process.exit(0);
  }

  const db = new Database(DB_PATH);
  sqliteVec.load(db);

  const insertMeta = db.prepare(`
    INSERT INTO knowledge (path, content, category, agent)
    VALUES (?, ?, ?, ?)
  `);

  const insertVec = db.prepare(`
    INSERT INTO knowledge_vec (rowid, embedding)
    VALUES (?, ?)
  `);

  const insertAll = db.transaction((chunks: Array<{ content: string; category: string }>) => {
    for (const chunk of chunks) {
      return chunk; // processado fora da transaction por ser async
    }
  });

  let inserted = 0;
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.content, extractor);

    const meta = insertMeta.run(filePath!, chunk.content, chunk.category, agentSlug);
    insertVec.run(meta.lastInsertRowid, new Uint8Array(embedding.buffer));
    inserted++;
  }

  db.close();
  console.log(`✓ ${inserted} chunks inseridos no RAG (agent: ${agentSlug})`);
}

main().catch((err) => {
  console.error("ERRO no embed:", err);
  process.exit(1);
});
