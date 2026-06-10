/**
 * summarize.ts
 *
 * Recebe via stdin o transcript do agent ou da sessão.
 * Chama o Ollama local (Gemma 3 4B) para extrair aprendizados em 4 categorias.
 * Salva em .claude/knowledge/YYYY-MM-DD-{slug}.md
 *
 * Uso:
 *   echo "<transcript>" | npx tsx summarize.ts --agent backend-auth
 *   cat transcript.txt  | npx tsx summarize.ts --agent session
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OLLAMA_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "gemma3:4b";
const KNOWLEDGE_DIR = resolve(__dirname, "../knowledge");

// --- args ---
const agentArg = process.argv.indexOf("--agent");
const agentSlug = agentArg !== -1 ? process.argv[agentArg + 1] : "unknown";

// --- lê stdin ---
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8").trim();
}

// --- chama Ollama para extração ---
async function extractLearnings(transcript: string): Promise<string> {
  const prompt = `Você é um assistente técnico. Analise o transcript abaixo de uma sessão de desenvolvimento e extraia os aprendizados relevantes em exatamente 4 seções.

TRANSCRIPT:
${transcript.slice(0, 8000)}

Responda APENAS no formato Markdown abaixo, sem introdução nem conclusão:

## bugs
<!-- Bugs resolvidos: descreva o bug, a causa raiz identificada e a solução. Uma linha por bug. -->

## architecture
<!-- Decisões de arquitetura tomadas e o motivo. Uma linha por decisão. -->

## patterns
<!-- Padrões ou convenções adotados durante a sessão. Uma linha por padrão. -->

## failures
<!-- O que foi tentado e não funcionou, e por quê. Uma linha por falha. -->`;

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.2, num_predict: 1024 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama retornou ${response.status}: ${await response.text()}`);
  }

  const data = (await response.json()) as { response: string };
  return data.response.trim();
}

// --- salva arquivo .md ---
function saveKnowledge(content: string, slug: string): string {
  mkdirSync(KNOWLEDGE_DIR, { recursive: true });

  const date = new Date().toISOString().slice(0, 10);
  const filename = `${date}-${slug}.md`;
  const filepath = resolve(KNOWLEDGE_DIR, filename);

  const header = `---
agent: ${slug}
created_at: ${new Date().toISOString()}
---

`;
  writeFileSync(filepath, header + content, "utf-8");
  return filepath;
}

// --- main ---
async function main() {
  const transcript = await readStdin();

  if (transcript.length < 50) {
    console.error("AVISO: transcript muito curto, nada a resumir.");
    process.exit(0);
  }

  let learnings: string;
  try {
    learnings = await extractLearnings(transcript);
  } catch (err) {
    console.error(`ERRO ao chamar Ollama: ${err}`);
    // Fallback: salva o transcript bruto com marcação de revisão manual
    learnings = `## bugs\n_Ollama indisponível — revisar manualmente._\n\n## architecture\n\n## patterns\n\n## failures\n`;
  }

  const filepath = saveKnowledge(learnings, agentSlug);
  console.log(filepath); // stdout = caminho do arquivo gerado (lido pelo hook)
}

main();
