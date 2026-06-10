/**
 * search.ts
 *
 * Recebe a pergunta atual e o agent ativo.
 * Gera embedding da pergunta com all-MiniLM-L6-v2.
 * Busca top-3 chunks mais similares no rag.db.
 * Prioriza chunks da mesma categoria do agent ativo.
 * Imprime os chunks no stdout para injeção no contexto.
 *
 * Uso:
 *   echo "como tratar erro 401 no frontend?" | npx tsx search.ts --agent frontend-auth
 *   npx tsx search.ts --agent backend-perfil --query "faixas de pontuação CVM"
 */

import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { pipeline } from "@xenova/transformers";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, "../knowledge/rag.db");

// Mapa: agent → categoria principal para priorização
const AGENT_CATEGORY: Record<string, string> = {
  "orchestrador": "architecture",
  "backend-setup": "pattern",
  "backend-db": "architecture",
  "backend-auth": "pattern",
  "backend-perfil": "pattern",
  "backend-acoes": "pattern",
  "backend-precos": "bug",
  "backend-recomendacoes": "architecture",
  "backend-ia": "failure",
  "backend-investimentos": "pattern",
  "frontend-auth": "pattern",
  "frontend-perfil": "pattern",
  "frontend-recomendacoes": "architecture",
  "frontend-investimentos": "pattern",
  "frontend-admin": "pattern",
  "code-reviewer": "architecture",
};

// --- args ---
function getArg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const agentSlug = getArg("--agent") ?? "unknown";
const queryArg = getArg("--query");

async function readStdin(): Promise<string> {
  if (queryArg) return queryArg;
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8").trim();
}

async function main() {
  if (!existsSync(DB_PATH)) {
    // Banco não inicializado ainda — falha silenciosa
    process.exit(0);
  }

  const query = await readStdin();
  if (query.length < 5) process.exit(0);

  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    { revision: "main" }
  );

  const output = await extractor(query, { pooling: "mean", normalize: true });
  const queryEmbedding = new Uint8Array((output.data as Float32Array).buffer);

  const db = new Database(DB_PATH, { readonly: true });
  sqliteVec.load(db);

  const preferredCategory = AGENT_CATEGORY[agentSlug] ?? "pattern";

  // Busca top-5 por similaridade vetorial e re-ranqueia priorizando category
  const rows = db.prepare(`
    SELECT
      k.content,
      k.category,
      k.agent,
      k.created_at,
      kv.distance
    FROM knowledge_vec kv
    JOIN knowledge k ON k.id = kv.rowid
    WHERE kv.embedding MATCH ?
      AND kv.k = 5
    ORDER BY
      CASE WHEN k.category = ? THEN 0 ELSE 1 END,
      kv.distance
    LIMIT 3
  `).all(queryEmbedding, preferredCategory) as Array<{
    content: string;
    category: string;
    agent: string;
    created_at: string;
    distance: number;
  }>;

  db.close();

  if (rows.length === 0) process.exit(0);

  // Formata para injeção no contexto
  const output_lines = [
    "---",
    "## Conhecimento relevante do projeto (RAG)",
    `_Contexto recuperado para o agent **${agentSlug}** com base no prompt atual._`,
    "",
  ];

  for (const row of rows) {
    output_lines.push(
      `### [${row.category}] — agent: ${row.agent} (${row.created_at.slice(0, 10)})`,
      row.content,
      ""
    );
  }

  output_lines.push("---");
  console.log(output_lines.join("\n"));
}

main().catch(() => process.exit(0)); // falha silenciosa — não bloqueia o prompt
