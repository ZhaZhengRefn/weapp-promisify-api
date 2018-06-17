import babel from 'rollup-plugin-babel';

const config = {
  input: './index.js',
  output: {
    file: './lib/app.js',
    format: 'cjs'
  }
}

if (process.env.NODE_ENV !== 'development') {
  Object.assign(
    config,
    {
      plugins: [
        babel({
          exclude: 'node_modules/**'
        })
      ]
    }
  )
}

export default config