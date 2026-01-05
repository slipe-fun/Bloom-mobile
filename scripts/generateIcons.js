import * as fs from 'node:fs'
import * as path from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// console.log(__dirname)

const INPUT_DIR = path.resolve(__dirname, '../src/icons')
const OUTPUT_DIR = path.resolve(__dirname, '../src/icons/paths')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const files = fs.readdirSync(INPUT_DIR).filter((f) => f.endsWith('.svg'))

const exports = []

for (const file of files) {
  const name = path.basename(file, '.svg')
  const svg = fs.readFileSync(path.join(INPUT_DIR, file), 'utf8')

  const paths = [...svg.matchAll(/<path[^>]*d="([^"]+)"/g)].map((match) => match[1])

  if (paths.length === 0) {
    console.warn(`⚠️  No <path d=""> found in ${file}`)
    continue
  }

  const content =
    paths.length === 1 ? `export const ${name} = \`${paths[0]}\`;\n` : `export const ${name} = ${JSON.stringify(paths, null, 2)};\n`

  fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.ts`), content, 'utf8')

  exports.push(`export { ${name} } from './paths/${name}';`)
}

fs.writeFileSync(path.join(INPUT_DIR, 'index.ts'), exports.join('\n') + '\n', 'utf8')

console.log(`✅ Generated ${exports.length} icons`)
