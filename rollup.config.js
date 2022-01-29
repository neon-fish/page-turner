// import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'dist/index.js',
  output: {
    file: 'min/bundle.js',
    format: 'cjs'
  },
  // plugins: [resolve()],
};
