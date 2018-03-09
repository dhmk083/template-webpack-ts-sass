const {CheckerPlugin} = require('awesome-typescript-loader')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BabelUglifyPlugin = require('webpack-plugin-babel-uglify')
const rxPaths = require('rxjs/_esm2015/path-mapping')
const outDir = '/dist/'

module.exports = prod => ({
  entry: ['raf/polyfill', 'babel-polyfill', './src/index.ts'],
  output: {
    path: __dirname + outDir,
    publicPath: outDir,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: rxPaths()
  },
  mode: prod ? 'production' : 'development',
  devtool: prod ? 'source-map' : 'cheap-module-eval-source-map',
  module: {
    rules: [      
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {errorsAsWarnings: false}
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', 
          use: [
            { loader: 'css-loader', options: { importLoaders: 2 } }, 
            { 
              loader: 'postcss-loader', 
              options: {
                plugins: [
                  require('autoprefixer')(),
                  prod ? require('cssnano')() : null
                ].filter(x => x)
              }
            },
            'sass-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: !prod
    }),
    prod ? new BabelUglifyPlugin() : Function
  ]
})