import { resolve } from "path";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { Configuration } from "webpack";
import * as nodeExternals from "webpack-node-externals";

module.exports = {
    target: "node",
    mode: "production",
    entry: "./src/index.ts",
    output: {
        path: resolve(__dirname, 'dist'),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
        plugins: [new TsconfigPathsPlugin()]
    },
    externals: [nodeExternals()]
} as Configuration;