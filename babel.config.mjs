/**
 * @type {import("@babel/core").TransformOptions}
 */
const job = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      loose: true,
    }],
    '@babel/preset-typescript',
    'babel-preset-solid'
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", {
      version: "2023-11"
    }]
  ]
};
export default job;
