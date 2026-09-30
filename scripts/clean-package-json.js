import {
  pathJoin,
  readFileToJsonSync,
  writeJsonFileSync,
  getDirectoryBy,
} from '@vvi/node';

// 原始 package.json 内容
let packageJson = readFileToJsonSync('./package.json');
const dependencies = packageJson.dependencies;
// 移除冗余的键
[
  'scripts',
  'devDependencies',
  'lint-staged',
  'private',
  'dependencies',
].forEach(key => delete packageJson[key]);
// 查看当前打包 dist 文件路径
const distParentPath = getDirectoryBy('dist', 'directory');

packageJson = {
  ...packageJson,
  module: '/bin.js', // 旧版本 ESM 入口
  author: {
    name: 'MrMudBean',
    email: 'Mr.MudBean@outlook.com',
    url: 'https://mudbean.cn',
  },
  description:
    '一个检测工作目录下或 packages 文件夹下子 npm 包版本是否存在的模块',
  license: 'MIT',
  sideEffects: false, // 核心：开启 Tree Shaking
  files: ['bin.js', 'LICENSE', 'README.md', 'CHANGELOG.md'],
  keywords: ['check-version', 'mudbean', 'vvi'],
  homepage: 'https://npms.pages.cn/check-version',
  dependencies,
  bugs: {
    url: 'https://github.com/gleanings/check-version/issues',
    email: 'Mr.MudBean@outlook.com',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/gleanings/check-version.git',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  browserslist: ['node>=18.0.0'],
  engines: {
    node: '>=18.0.0',
  },
  bin: {
    '@vvi/check-version': './bin.js',
  },
};

{
  // 整理打包后 package.json 文件路径
  const distPackagePath = pathJoin(distParentPath, './dist/package.json');
  // 写入新的 packages.json 文件
  writeJsonFileSync(distPackagePath, packageJson);
}
