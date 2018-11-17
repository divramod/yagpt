'use strict';
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
    mode: "development",
    target: 'node',
    entry: {
        taskNpmPublish: "./src/tasks/npm/publish/index.ts",
        testJson: "./src/test/json/index.ts",
    },
    output: {
        filename: "[name].js",
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.build.json" })],
        extensions: ["json", ".ts", ".js", "d.ts"],
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            {test: /\.json$/, loader: "json"},
        ]
    }
}
