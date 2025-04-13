const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPluginPartials = require('html-webpack-partials-plugin');

module.exports = {
    entry: {
        app: [
          './src/js/plugins/google/geolocation.js',
          './src/app.js',
          './src/app.scss'
        ]
    },
    externals: {
      jquery: 'jQuery',
    },
    optimization: {
      concatenateModules: false,
      providedExports: false,
      usedExports: false,
      minimizer: [
        new TerserPlugin({
          //minify: TerserPlugin.uglifyJsMinify,
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          },
        }),
      ],
    },
    output: {
      filename: 'main.min.js',
      // [chunkhash]: her build işleminde benzersiz bir çıktı üretmek için kullanılır.
      //filename: 'main.min.js',
      path: path.resolve(__dirname, 'dist'),
      assetModuleFilename: 'assets/images/[name][ext][query]' 
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: false,
      open: true,
      port: 1907,
      devMiddleware: {
        writeToDisk: true,
      },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/pages/index.html',
            inject: 'head',
            favicon: ''
            // inject: true => Otomatik olarak build dosyasını script tag'ı olarak eklemeyi sağlar.
          }), 
          new MiniCssExtractPlugin({
            filename: 'main.min.css'
          }),
          new CopyPlugin({
            patterns: [
              { from: 'src/assets', to: 'assets', noErrorOnMissing: true }
            ],
          })
    ],
    module: {
        rules: [
          {
            test: [/.js$/], // test => Hangi dosya tiplerinin işlemden geçeceğini belirttiğimiz property
            exclude: /(node_modules)/, // exclude => Hangi klasörlerin işlemden geçmeyeceğini belirttiğimiz property
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
          {
            test: /\.css$|.scss$|.sass$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader',
              {
                loader: 'sass-loader',
                options: {
                  sassOptions: {
                    quietDeps: true  // This will suppress dependency warnings
                  }
                }
              }
            ]
          },
            {
              test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
              type: 'asset/resource'
            },
            {
              test: /\.svg/,
              type: 'asset/resource'
            },
          {
            test: /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/,
            type: 'asset/resource',
            generator: {
              filename: "assets/fonts/[name][ext]",
            }
          }
        ]
    },
    resolve: {
        alias: {
          '@node_modules': path.resolve(__dirname, 'node_modules'),
          '@base': path.resolve(__dirname, 'src/scss/base'),
          '@functions': path.resolve(__dirname, 'src/scss/functions'),
          '@atoms': path.resolve(__dirname, 'src/scss/atoms'),
          '@organisms': path.resolve(__dirname, 'src/scss/organisms'),
          '@pages': path.resolve(__dirname, 'src/scss/pages'),
          '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
          '@images': path.resolve(__dirname, 'src/assets/images')
        }
    }
  }