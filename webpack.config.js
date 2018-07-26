// let Autoprefixer = require("autoprefixer")
// let CleanWebpackPlugin = require("clean-webpack-plugin")
// let MiniCssExtractPlugin = require("mini-css-extract-plugin")
// let PostCSSUtils = require("postcss-utilities")
let P = require("path")
let Webpack = require("webpack")

// function cacheGroupsGenerator(name, test) {
//   return {
//     test: test,
//     chunks: "all",
//     name: name,
//     priority: -10,
//     minSize: 1,
//   }
// }

module.exports = {
  mode: "development",
  devtool: "eval",
  target: "web",
  entry: {
    bundle: "./client/index.js",
  },

  output: {
    path: P.resolve("public"),
    // filename: "[name].js",
    // chunkFilename: "[name].chunk.js",
    publicPath: "/public/",
  },

  module: {
    rules: [
      {
        test: /\.(js(x)?(\?.*)?)$/,
        use: {
          loader: "babel-loader",
          // We need different sets of babel configs for BE and FE
          // (syntax-dynamic-import should used only on FE, dynamic-import-node should used only on BE)
          // BE takes config from .babelrc
          // FE from webpack
          // more here: https://github.com/babel/babel/issues/6607#issuecomment-340682519
          // options: {
          //   babelrc: false,
          //   presets: [
          //     // "es2015",
          //     "react"
          //   ],
          //   // plugins: [
          //   //   require("babel-plugin-syntax-dynamic-import"),
          //   //   require("babel-plugin-syntax-trailing-function-commas"),
          //   //   require("babel-plugin-transform-do-expressions"),
          //   //   require("babel-plugin-transform-object-rest-spread")
          //   // ]
          // }
        },
        exclude: /node_modules/,
      },

      // https://github.com/webpack-contrib/mini-css-extract-plugin
      // {
      //   test: /\.css|less$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     "css-loader",
      //     "postcss-loader",
      //     "less-loader",
      //   ],
      // },

      // URL: https://github.com/webpack-contrib/url-loader
      // {
      //   test: /\.(jpg|jpeg|png|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
      //   use: [{
      //     loader: "url-loader",
      //     options: {
      //       limit: 8192,
      //       name: "[path][name].[ext]",
      //     }
      //   }]
      // },

      // FILE: https://github.com/webpack-contrib/file-loader
      // {
      //   test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      //   use: [{
      //     loader: "file-loader",
      //     options: {
      //       name: "[path][name].[ext]",
      //     }
      //   }]
      // },
    ],
  },

  resolve: {
    // alias: {
    //   path: "path-webpack", // fix broken Webpack polyfill
    // },

    // https://webpack.js.org/configuration/resolve/#resolve-extensions
    extensions: [".js", ".jsx", ".json"],
  },

  // https://webpack.js.org/configuration/watch/#watchoptions
  // watchOptions: {
  //   ignored: /node_modules/
  // },

  // optimization: {
  //   splitChunks: {
  //     chunks: "async", // we cannot use "all", because our layout has a predefined list of included JS and CSS files
  //     minSize: 10000, // create a chunk if file is bigger than minSize
  //     cacheGroups: {
  //       // Zone of the manual control of async chunks
  //
  //       // Libs/components used on every page
  //       common: cacheGroupsGenerator("common", /root\/Counters|root\/Footer|root\/Header|root\/Loading|root\/Truncate/),
  //
  //       // Root components
  //       // Without these setting the code will be duplicated in each application chunk.
  //       // Example:
  //       // home -> testimonials -> modal ==> modal will be inside home.js/home.css
  //       // exercise -> modal ==> modal will be inside exercise.js/exercise.css as well
  //       // To avoid dupls, we create manually the following chunks.
  //       // The size of the following components is less than minSize, that is why
  //       // they are not moved to the async chunks automatically.
  //       addthis: cacheGroupsGenerator("addthis", /root\/AddThis/),
  //       "brain-img": cacheGroupsGenerator("brain-img", /root\/BrainImg/),
  //       clipboard: cacheGroupsGenerator("clipboard", /root\/Clipboard/),
  //       "code-highlight": cacheGroupsGenerator("code-highlight", /root\/CodeHighlight/),
  //       contacts: cacheGroupsGenerator("contacts", /root\/Contacts/),
  //       disqus: cacheGroupsGenerator("disqus", /root\/Disqus/),
  //       modal: cacheGroupsGenerator("modal", /root\/Modal/),
  //       "subscription-form": cacheGroupsGenerator("subscription-form", /root\/SubscriptionForm/),
  //       tabulator: cacheGroupsGenerator("tabulator", /root\/Tabulator/),
  //     }
  //   }
  // },

  // plugins: [
  //   new Webpack.ProvidePlugin({
  //     "$": "jquery",
  //     "R": "@paqmind/ramda",
  //   }),
  //
  //   new MiniCssExtractPlugin({
  //     filename: "[name].css",
  //     chunkFilename: "[name].chunk.css",
  //   }),
  // ],
}
