const { resolveProject } = require('jellyweb')

module.exports = {
  entry: {
    main: resolveProject('src/index.js'),
  },
  output: {
    path: resolveProject('dist'),
    filename: 'redux-model.js',
    library: 'reduxModel',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  features: {
    babel: true,
    define: {},
    production: false,
    excludeExternals: {}
  }
}
