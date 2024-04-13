import typescript from "@rollup/plugin-typescript";
import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import terser from '@rollup/plugin-terser';

export default {
  input: "src/index.ts",
  output: {
    sourcemap: true,
    file: 'dist/index.min.js',
    format: "esm",
  },
  external: ["react"],
  plugins: [
    peerDepsExternal(),
    typescript(),
    babel({
      extensions: [".ts", ".tsx"],
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    nodeResolve(),
    commonjs(),
    terser(),
  ],
};
