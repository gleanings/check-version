# @vvi/check-version

[![version](<https://img.shields.io/npm/v/@vvi/check-version.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/@vvi/check-version) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/gleanings/check-version/issues)

一个简单的本地版本检测工具

## 安装

```bash
npm install --save-dev @vvi/check-version
```

## 使用

默认使用方式为传入 `name` 参数，代码将执行判断工作目录下的 'packages/[name]' 子 npm 包的版本号是否已存在于线上

```bash
# 写法一
npx @vvi/check-version name=[name]
# 写法二
npx @vvi/check-version n=[name]
# 写法三
npx @vvi/check-version name [name]
# 写法四
npx @vvi/check-version n [name]
```

也可以传入 `cwd` 参数覆盖默认的判断文件夹，默认查找 'packages' 文件夹下子 npm 包，若您习惯于其他命名方式

```bash
# 倘若子主包 core 在 lists 文件夹下
npx @vvi/check-version name=core cwd=lists  # 推荐模式

npx @vvi/check-version name core cwd lists

npx @vvi/check-version name=core cwd lists

npx @vvi/check-version name core cwd=lists

npx @vvi/check-version n=core c=lists  # 推荐模式

npx @vvi/check-version n core c lists
```

默认的 name 值为 "." ，即以 packages 目录为项目的根（倘若 package.json 文件在这里的话）

使用 skip 参数是否跳过执行线上版本检测（因为 '0.0.0' 的版本默认为跳过检测，若初始版本非 '0.0.0' 时 ，也可以使用该参数跳过检测）

```bash
# 倘若子主包 core 在 lists 文件夹下
npx @vvi/check-version name=core cwd=lists skip  # 推荐模式

npx @vvi/check-version name=core cwd lists skip

npx @vvi/check-version n=core c=lists s # 推荐模式

npx @vvi/check-version n=core c lists s
```

若想在其他非分包的项目使用，即单独的项目使用配置，使用 `npx @vvi/check-version c=.` 即可。

## 使用示例

在 `pub.sh` 文件中使用时：

```bash
CHECK_VERSION="@vvi/check-version"

# 输出的 npm 发布的 tag。也可以通过调整 cwd 和 name 的参数来适配实际的项目地址
tag=""
if ! tag=$(npx --yes "${CHECK_VERSION}" c=. 2>&1); then
    echo "未通过版本校验：$tag"
    exit 1
fi
echo "获取🉐发布标签为 ${tag}"
# 安装
npm ci

echo "开始发布 npm 包"

if ! npm publish --provenance --access public --tag ${tag} ; then
    echo "发布失败"
    exit 0
fi

echo "🚀🚀  发布成功，完结 🎉🎉 撒花 🎉🎉"
```

使用 [`npx @vvi/check-version`](https://www.npmjs.com/package/@vvi/check-version) 获取的 tag 是符合标准 npm 的预发布版本的版本号的规则。通过 [`npx vjj`](https://www.npmjs.com/package/vjj) 进行版本的迭代管理即符合标准的 npm 的 publish 的预发布的 tag ，也将在 `CHANGELOG.md` 文件添加更新迭代的版本的日志记录的标题（广子，这就是广子）。

所以，上面的 .sh 文件将提取 "0.0.1" 的 tag 值为 "latest"，若提取 "0.1.0-test.0" 则提取出 "test"

## 状态

此软件包是 `MrMudBean` 生态系统的一部分。
它使用严格的 TypeScript 编写，并通过 Rollup 构建进行验证。
虽然单元测试较少，但 API 稳定，并在生产环境中大量使用。
