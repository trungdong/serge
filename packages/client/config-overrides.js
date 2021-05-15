// module.exports = (config) => {
//   // Let Babel compile outside of src/.
//   const tsRule = config.module.rules[1].oneOf[2];
//   tsRule.include = undefined;
//   tsRule.exclude = /node_modules/;
//   // config.module.rules.push({
//   //   test: /\.(ts|tsx)$/,
//   //   loader: require.resolve('babel-loader'),
//   //   options: {
//   //     presets: [
//   //       '@babel/preset-env',
//   //       '@babel/preset-react',
//   //       '@babel/preset-typescript'
//   //     ]
//   //   }
//   // });
//
//   return config;
// };

const path = require('path')
const { override, babelInclude, addBabelPresets, addBabelPlugins, removeModuleScopePlugin } = require('customize-cra')

module.exports = override(
  removeModuleScopePlugin(),
  ...addBabelPlugins(
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods',
  ),
  ...addBabelPresets(
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ),
  babelInclude([
    /* transpile (converting to es5) code in src/ and shared component library */
    path.resolve('src'),
    path.resolve('../components'),
  ])
);
