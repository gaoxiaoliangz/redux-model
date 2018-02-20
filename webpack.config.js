const { configWebpack, resolveProject } = require('jellyweb')

module.exports = configWebpack({
  features: [
    'babel',
    'define',
    'exclude-externals'
  ],
  production: true,
  presets: [
    'production'
  ]
}, {
  entry: {
    main: resolveProject('src/index.js'),
  },
  output: {
    path: resolveProject('dist'),
    filename: 'redux-model.js',
    library: 'reduxModel',
    libraryTarget: 'umd',
  }
})
