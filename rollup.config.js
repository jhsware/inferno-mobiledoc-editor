import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  input: 'src/index.js',
  output: {
    file: `dist/index.cjs${isProduction ? '.min' : ''}.js`,
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    babel({
      runtimeHelpers: true
    }),
    isProduction ? minify({
      comments: false,
    }) : false
  ],
  external: [
    'classnames',
    'inferno',
    'inferno-animation',
    'inferno-create-element',
    'inferno-shared',
    'mobiledoc-kit',
    '@babel/runtime/helpers/objectSpread',
    '@babel/runtime/helpers/objectWithoutProperties',
    '@babel/runtime/helpers/classCallCheck',
    '@babel/runtime/helpers/createClass',
    '@babel/runtime/helpers/possibleConstructorReturn',
    '@babel/runtime/helpers/getPrototypeOf',
    '@babel/runtime/helpers/inherits',
    '@babel/runtime/helpers/assertThisInitialized',
    'inferno-bootstrap'
  ]
}

/*



*/