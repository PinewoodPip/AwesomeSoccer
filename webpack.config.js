module.exports = {
  output: {
    libraryTarget: "commonjs2"
  },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ],
          },
         {
          test: /\.(png|svg|jpg|gif)$/,
           use: [
           'url-loader',
         ],
       },
        ],
      },
}