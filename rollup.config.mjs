import typescript from '@rollup/plugin-typescript';

const external = ['react', 'react/jsx-runtime'];

const input = {
  index: 'src/index.ts',
  element: 'src/element.ts',
};

export default [
  {
    input,
    external,
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].js',
      chunkFileNames: '[name]-[hash].js',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      typescript({ tsconfig: './tsconfig.json', declaration: false }),
    ],
  },
  {
    input,
    external,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].esm.js',
      chunkFileNames: '[name]-[hash].esm.js',
      sourcemap: true,
    },
    plugins: [
      typescript({ tsconfig: './tsconfig.json', declaration: false }),
    ],
  },
];
