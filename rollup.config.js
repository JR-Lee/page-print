import resolve from 'rollup-plugin-node-resolve'
import tsPlugin from 'rollup-plugin-typescript2'
import commonJS from 'rollup-plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import sizes from 'rollup-plugin-sizes'
import { version, author } from './package.json'

const date = new Date()
const banner = `/*!
 * pagePrint.js v${version}
 * © 2021-${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${author}
 * Released under the MIT License.
 */\n`

const isPro = process.env.ENV.trim() === 'production'

const outputTypes = [ 'umd' ]

const baseConfig = {
  input: 'src/index.ts',
  external: [
    'html2canvas'
  ],
  plugins: [
    resolve(),
    commonJS(),
    tsPlugin({
      useTsconfigDeclarationDir: true, // 是否使用 tsconfig.json 的声明文件输出路径
      tsconfig: 'tsconfig.json',
      extensions: [ '.ts', '.d.ts' ]
    }),
    alias({
      resolve: [ '.ts', '.d.ts' ],
      entries: [
        { find: 'types', replacement: 'src/types' },
        { find: 'utils', replacement: 'src/utils' },
        { find: 'root', replacement: 'src' }
      ]
    }),
    isPro && babel({
      extensions: [ '.ts' ],
      exclude: 'node_modules/**'
    }),
    sizes()
  ],
  watch: {
    include: 'src/**'
  }
}

const config = outputTypes.map(type => Object.assign({
  output: {
    // dir: 'lib',
    file: `lib/index.js`,
    format: type,
    name: 'pagePrint',
    banner
  }
}, baseConfig))

export default config
