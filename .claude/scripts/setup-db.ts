/**
 * Inicializa o banco RAG com schema SQLite + sqlite-vec.
 * Execute uma vez: npx tsx setup-db.ts
 */

import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, "../knowledge/rag.db");

mkdirSync(resolve(__dirname, "../knowledge"), { recursive: true });

const db = new Database(DB_PATH);
sqliteVec.load(db);

db.exec(`
  -- Metadados dos chunks de conhecimento
  CREATE TABLE IF NOT EXISTS knowledge (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    path        TEXT    NOT NULL,
    content     TEXT    NOT NULL,
    category    TEXT    NOT NULL CHECK(category IN ('bug','architecture','pattern','failure')),
    agent       TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  -- Tabela virtual de vetores (384 dimensões — all-MiniLM-L6-v2)
  CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_vec USING vec0(
    embedding float[384]
  );

  -- Índice para buscas por agent e category
  CREATE INDEX IF NOT EXISTS idx_knowledge_agent    ON knowledge(agent);
  CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge(category);
  CREATE INDEX IF NOT EXISTS idx_knowledge_path     ON knowledge(path);
`);

console.log(`✓ RAG database inicializado em: ${DB_PATH}`);
db.close();
