import path from 'node:path'
import jsrJson from '../jsr.json'
import packageJson from '../package.json'

console.log(`NPM version: ${packageJson.version}`)
console.log(`JSR version: ${jsrJson.version}`)

await Bun.write(
  path.resolve(__dirname, '../jsr.json'),
  JSON.stringify({ ...jsrJson, version: packageJson.version }, null, 2) + '\n',
)

console.log('Updated jsr.json version to match package.json version.')
