import path from 'node:path'
import denoJson from '../deno.json'
import packageJson from '../package.json'

console.log(`NPM version: ${packageJson.version}`)
console.log(`JSR version: ${denoJson.version}`)

await Bun.write(
  path.resolve(__dirname, '../deno.json'),
  JSON.stringify({ ...denoJson, version: packageJson.version }, null, 2) + '\n',
)

console.log('Updated deno.json version to match package.json version.')
