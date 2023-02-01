import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import html from '@rollup/plugin-html';
import babel from "@rollup/plugin-babel";
import livereload from "rollup-plugin-livereload";
import replace from 'rollup-plugin-replace';

export default {
  input: 'src/index.tsx',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    html(),
    resolve(),
    commonjs(),
    typescript(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    babel({
      presets: [
        '@babel/preset-react'
      ]
    }),
    //terser(),
    livereload({
      watch: 'dist',
      port:35729
    }),
    serve({
      contentBase: 'dist',
      open: true,
      host: 'localhost',
      port: 10001,
    })
  ]
};
