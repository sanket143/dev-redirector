// @ts-nocheck
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./manifest.json",
          to: "../dist",
        },
        {
          from: "./icons",
          to: "../dist/icons",
        },
      ],
    }),
  ],
  entry: {
    background: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../dist/"),
  },
};
