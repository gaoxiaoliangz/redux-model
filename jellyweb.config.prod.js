const { resolveProject, presets } = require('jellyweb')

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
  features: Object.assign({}, presets.production, {
    babel: true,
    define: {},
    excludeExternals: {
      whitelist: [
        /^lodash/
      ]
    }
  })
}
