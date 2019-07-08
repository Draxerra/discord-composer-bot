import { CleanWebpackPlugin } from "clean-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import { resolve } from "path";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { Configuration } from "webpack";
import * as nodeExternals from "webpack-node-externals";

module.exports = {
    devtool: "source-map",
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
    plugins: [
        new CopyWebpackPlugin([{
            cache: true,
            from: "src/soundfonts",
            ignore: ['*.js', '*.ts']
        }]),
        new CleanWebpackPlugin()
    ],
    externals: [nodeExternals()],
    node: {
        __dirname: false
    }
} as Configuration;