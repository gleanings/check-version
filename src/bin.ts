#!/usr/bin/env node
import {
  getNpmPkgInfo,
  fileExist,
  pathJoin,
  readFileToJsonSync,
  _p,
  PackageJson,
  getDirectoryBy,
} from '@vvi/node';
import { isUndefined, isNull } from '@vvi/is';
import { Args } from '@vvi/command';

/**  从版本号中解析到 dist tag  */
const getTag = (version: string): string => {
  const versionList = version.split('-');
  if (versionList.length === 1) {
    return 'latest';
  } else if (versionList[1].includes('.')) {
    return versionList[1].split('.')[0];
  }

  return 'latest';
};

const command = new Args<{
  cwd: undefined;
  name: undefined;
  skip: undefined;
}>('@vvi/check-version');

command.bind([
  'cwd <c> (检测的工作文件夹的位置路径，缺省值为当前跟路径的 packages)',
  'skip <s> (跳过线上包版本检测， 默认值为 false)',
  'name <n> (检测的子包名，默认值为 .)',
]);

command.run().isEnd(true);

const args = command.args.$map;

/**  工作的相对路径  */
const cwd = args.cwd?.value?.[0].toString() ?? 'packages';
/** 获取输入的包名   */
const name = args.name?.value?.[0].toString() ?? '.';
/**  是否跳过检测  */
const skip = args.skip?.value?.[0] !== false ? true : false;

/**  未检测到输入的包名，则返回 false  */
if (isUndefined(name) || name === '') {
  _p('未检测到输入的包名', false);
  process.exit(1);
}

/**  文件路径  */
let filePath = pathJoin(process.cwd(), cwd, name);

/// 下面是冗余步骤，有助于在非根目录下查找 package.json 文件
const dirPath = getDirectoryBy('package.json', 'file', filePath);
if (isUndefined(dirPath)) {
  _p(`文件 ${filePath} 路径不存在`, false);
  process.exit(1);
}

filePath = pathJoin(dirPath, 'package.json');

/**  文件路径  */
const fileIsExist = fileExist(filePath);

if (isUndefined(fileIsExist)) {
  _p(`${filePath} 文件不存在`, false);
  process.exit(1);
}
/**  package.json 文件内容  */
const fileContent = readFileToJsonSync<PackageJson>(filePath);

if (isNull(fileContent)) {
  _p(`读取 ${filePath} 文件出错`, false);
  process.exit(1);
}
if (!fileContent.name || !fileContent.version) {
  _p(`未找到 ${filePath} 文件包名或版本号`, false);
  process.exit(1);
}
/**  线上同名包内容  */
const pkgInfo = await getNpmPkgInfo(fileContent.name);

// 包数据未找到或是版本号已存在则返回
if (isNull(pkgInfo.data)) {
  if (
    pkgInfo.status === 'notFound' &&
    (skip || fileContent.version === '0.0.0')
  ) {
    _p(getTag(fileContent.version), false);
    process.exit(0);
  }

  _p(`${fileContent.name} 包未找到线上信息`, false);
  process.exit(1);
}
// 包数据未找到或是版本号已存在则返回
if (pkgInfo.data.time[fileContent.version]) {
  _p(`${fileContent.name} 包版本号已存在`, false);
  process.exit(1);
}

_p(getTag(fileContent.version), false);
process.exit(0);
