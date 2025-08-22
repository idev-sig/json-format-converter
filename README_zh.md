# JSON 格式转换器

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/idev-sig/json-format-converter)
[![License](https://img.shields.io/badge/license-Apache_2.0-green.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-orange.svg)](https://chromewebstore.google.com/detail/hmjkpcfhmideofmhbcejbpilnonoladc)

**[English](README.md) | [中文](README_zh.md)**

一款功能强大的 Chrome 浏览器扩展与独立网页应用，用于在 JSON、JSONC（带注释的 JSON）与 JSON5 之间相互转换，并提供高级编辑能力与注释保留功能。

## 🚀 快速开始

### Chrome 扩展
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue?logo=google-chrome)](https://chromewebstore.google.com/detail/hmjkpcfhmideofmhbcejbpilnonoladc)

**从 Chrome 应用商店安装**：[JSON Format Converter](https://chromewebstore.google.com/detail/hmjkpcfhmideofmhbcejbpilnonoladc)

1. 点击上面的链接或打开 Chrome 应用商店
2. 点击“添加到 Chrome”
3. 点击工具栏图标开始使用

### 在线网页应用
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Try%20Now-green?logo=github)](https://idev-sig.github.io/json-format-converter/)

**在线试用**：[https://idev-sig.github.io/json-format-converter/](https://idev-sig.github.io/json-format-converter/)

无需安装，打开即用！

## 功能特性

### 🎨 高级编辑器
- 语法高亮：基于 CodeMirror 的 JSON 语法高亮
- 行号与匹配：更易阅读与定位
- 自动补全：智能括号匹配与自动闭合
- 实时校验：即时错误检测与高亮

### 🔄 智能格式转换
- 双向转换：JSON ↔ JSONC ↔ JSON5
- 注释保留：JSONC 与 JSON5 互转保留全部注释
- 同格式处理：JSONC → JSONC、JSON5 → JSON5 保留原格式与注释
- 智能语法处理：属性名自动加/去引号
- 实时转换：输入即转换

### 🛠️ 处理工具
- 格式化：美化与对齐
- 压缩：去除多余空白
- 转义/反转义：便于在代码中嵌入
- 数据类型转换：数字 ↔ 字符串

### 📊 高级排序
- 键名排序：A→Z 或 Z→A
- 深度排序：支持嵌套对象
- 可保留或重组结构

### 💾 文件操作
- 一键复制到剪贴板
- 下载结果文件
- 支持多种文件格式

### ⚙️ 可配置选项
- 可配置缩进（2/4 空格或制表符）
- 多种排序方式
- 实时预览变更

### 🌐 双模式
- Chrome 扩展：随手即用
- 独立网页：更宽阔的编辑空间
- 响应式设计：桌面与移动端友好

### ⌨️ 效率功能
- 常用操作快捷键
- 输入变更自动转换
- 完整的帮助文档

### 🌍 多语言支持
- 支持：英文（默认）、简体中文、日语、韩语、德语、法语、西班牙语、俄语、阿拉伯语、葡萄牙语
- 自动语言检测：根据浏览器偏好语言
- 持久化设置：语言选择持久保存（localStorage）
- 本地化内容：示例数据、帮助文本与错误提示
- 实时切换：无需刷新即可切换语言
- 帮助文档：提供多语言帮助与快捷键说明

### 💬 注释保留
- JSONC ↔ JSON5：转换时保留全部注释
- 同格式处理：JSONC → JSONC、JSON5 → JSON5 保留原格式
- 智能处理：仅在转换到标准 JSON 时移除注释
- 支持注释类型：`//` 单行、`/* */` 多行

## 支持的格式

### JSON（JavaScript 对象表示法）
标准 JSON 格式，语法严格。

### JSONC（带注释的 JSON）
支持以下特性：
- 单行注释（`//`）
- 多行注释（`/* */`）
- 尾随逗号

### JSON5（更易读的 JSON）
扩展 JSON 语法，支持：
- 单行/多行注释
- 尾随逗号
- 非引号属性名
- 单引号字符串
- 多行字符串
- 额外数字格式

## 安装

### 📦 预构建包

从 [GitHub Releases](https://github.com/idev-sig/json-format-converter/releases) 下载：

#### Chrome 扩展
1. 下载 `json-format-converter-chrome.zip`
2. 解压 ZIP 文件
3. 打开 `chrome://extensions/`
4. 打开右上角“开发者模式”
5. 点击“加载已解压的扩展程序”，选择解压后的目录
6. 扩展会显示在工具栏

#### 独立网页应用
1. 下载 `json-format-converter-standalone.zip`
2. 解压到任意静态服务器目录
3. 直接用现代浏览器打开 `index.html`
4. 或部署到任意 Web 托管服务

### 🛠️ 从源码构建

```bash
# 克隆仓库
git clone https://github.com/idev-sig/json-format-converter.git
cd json-format-converter

# 构建全部目标（Chrome / Firefox / Standalone）
npm run build

# 或仅构建特定目标
npm run build:chrome      # 仅 Chrome 扩展
npm run build:firefox     # 仅 Firefox 扩展
npm run build:standalone  # 仅独立网页

# 构建输出目录
# - dist/chrome/（Chrome 扩展）
# - dist/firefox/（Firefox 扩展）
# - dist/standalone/（网页应用）
# - *.zip（分发包）
```

## 使用说明

### 🎯 快速上手

#### Chrome 扩展
1. 点击工具栏图标
2. 将 JSON/JSONC/JSON5 粘贴到输入面板
3. 在下拉菜单中选择输入与输出格式
4. 转换实时进行
5. 使用面板按钮进行格式化/压缩/转义等操作
6. 从输出面板复制或下载结果

#### 独立网页应用
1. 在浏览器中打开网页
2. 更宽阔的编辑布局，适合复杂场景与收藏
3. 可访问完整帮助文档

### 🔄 转换示例

#### 注释保留
```
// JSONC → JSON5（保留注释）
{
    // 配置
    "name": "My App",
    "version": "1.0.0", // 当前版本
}

// 转换为：
{
    // 配置
    name: "My App",
    version: "1.0.0", // 当前版本
}
```

#### 同格式处理
```
// JSONC → JSONC（保留注释与格式）
// JSON5 → JSON5（保留注释与格式）
```

### 🎛️ 按钮功能

#### 输入面板
- 清空：移除所有输入内容
- 格式化：按缩进美化 JSON
- 压缩：移除所有空白
- 转义：将 JSON 转义以便嵌入代码
- 反转义：移除转义符
- 示例：载入当前格式的本地化示例数据

#### 输出面板
- 复制：复制格式化后的输出
- 下载：以 `.json` 文件名自动下载
- 数→字串：将所有数字转为字符串
- 字串→数：将数字字符串还原为数字

### ⌨️ 键盘快捷键
- Ctrl/Cmd + Enter：格式化输入
- Ctrl/Cmd + Shift + C：复制输出
- Ctrl/Cmd + Shift + D：下载输出
- Escape：清空输入与输出
- F1：打开帮助与快捷键说明

### 🎨 视觉反馈
- 按钮状态：激活（绿）→ 成功（绿）→ 恢复正常
- 实时校验：即时错误高亮与语法检查
- 状态提示：清晰的成功/错误提示
- 语言切换：无刷新实时切换

## 项目结构

```
json-format-converter/
├── src/                    # 源码目录
│   ├── manifest.json       # Chrome 扩展清单
│   ├── html/               # HTML 页面
│   │   ├── popup.html      # 扩展弹窗
│   │   ├── standalone.html # 独立网页
│   │   └── help.html       # 帮助文档
│   ├── css/                # 样式
│   │   └── styles.css      # 主样式
│   ├── js/                 # JavaScript 文件
│   │   ├── i18n.js         # 国际化
│   │   ├── converter.js    # 核心转换逻辑
│   │   └── popup.js        # UI 交互逻辑
│   ├── lib/                # 第三方库
│   │   ├── codemirror.min.js
│   │   ├── javascript.min.js
│   │   └── json5.min.js
│   └── icons/              # 图标
│       ├── icon.svg
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
├── scripts/                # 构建与开发脚本（Node）
│   ├── build.js            # 生产构建（Chrome/Firefox/Standalone）
│   ├── dev-server.js       # 轻量开发服务器
│   ├── clean.js            # 清理产物
│   └── update-libs.js      # 更新第三方库（JSON5/CodeMirror）
├── dist/                   # 构建输出
│   ├── chrome/
│   ├── firefox/
│   └── standalone/
├── package.json
├── .gitignore
└── README.md
```

## 开发

### 环境要求
- Node.js 18+ 与 npm
- 现代浏览器
- ImageMagick（若需重新生成图标）

### 🚀 快速开始
```bash
# 克隆仓库
git clone https://github.com/idev-sig/json-format-converter.git
cd json-format-converter

# 启动开发服务器
npm run dev

# 生产构建（Chrome + Firefox + Standalone）
npm run build

# 构建指定目标
npm run build:chrome
npm run build:firefox
npm run build:standalone

# 更新第三方库（JSON5/CodeMirror）
npm run update:libs

# 清理产物
npm run clean
```

### 🔧 开发流程
1. 编辑源码：修改 `src/` 下的文件
2. 本地开发：`npm run dev` 后打开 `http://localhost:8080/standalone.html`
3. 扩展调试：先构建，再在 `chrome://extensions/` 或 `about:debugging` 中加载
4. 打包：根目录会自动生成 zip 分发包

### 📋 可用命令
```bash
# 开发
npm run dev               # 启动开发服务器（默认端口 8080）

# 构建
npm run build             # 构建全部目标
npm run build:chrome
npm run build:firefox
npm run build:standalone

# 工具
npm run update:libs       # 从 jsDelivr 更新 JSON5/CodeMirror
npm run clean             # 清理 dist 与打包文件
```

### 🎨 图标构建
如需从 SVG 重生成图标：
```bash
# 需要 ImageMagick
cd src/icons
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 32x32 icon32.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

## 🛠️ 技术栈

### 核心技术
- 原生 JavaScript：无框架依赖，兼容性好
- CodeMirror 5：高级代码编辑器与语法高亮
- JSON5：扩展 JSON 语法，支持注释
- CSS3：现代布局与样式

### 构建系统
- Node.js：跨平台构建（Windows/Linux/macOS）
- NPM Scripts：标准化管理与脚本

### 浏览器 API
- Chrome/Firefox 扩展 API
- Web API：剪贴板、文件下载、LocalStorage
- ES6+：现代 JavaScript 特性

## 📦 第三方库与 CDN

- JSON5：用于 JSON5/JSONC 兼容
  - 仓库：https://github.com/json5/json5
  - 文件：`src/lib/json5.min.js`
  - 源：https://cdn.jsdelivr.net/npm/json5@<version>/dist/index.min.js
- CodeMirror 5：代码编辑与语法高亮
  - 主页：https://codemirror.net/
  - 文件：`src/lib/codemirror.min.js`、`src/lib/codemirror.min.css`、`src/lib/javascript.min.js`
  - 源：https://cdn.jsdelivr.net/npm/codemirror@<version>/(lib|mode/javascript)/...

更新这些库：

```bash
npm run update:libs
# 或指定版本
node scripts/update-libs.js --json5 2.2.3 --cm 5.65.16
```

所有第三方文件会被保存到 `src/lib/`，以便离线/打包使用。

## 🌐 浏览器兼容性

- Chrome 扩展：Chrome 88+（Manifest V3）
- 独立网页应用：现代 ES6+ 浏览器
  - Chrome 88+ ✅
  - Firefox 128+ ✅
  - Safari 14+ ✅
  - Edge 88+ ✅
  - Opera 74+ ✅

## 🤝 贡献

欢迎贡献！请按如下步骤：

1. 在 GitHub 上 Fork 本仓库
2. 将你的 Fork 克隆到本地
3. 新建分支：`git checkout -b feature/amazing-feature`
4. 开发并充分测试
5. 运行校验：`node scripts/validate.js`
6. 提交：`git commit -m 'Add amazing feature'`
7. 推送：`git push origin feature/amazing-feature`
8. 发起 Pull Request

### 📝 开发指南
- 遵循既有代码风格
- 新功能请添加相应测试
- 需要时更新文档
- 确保所有校验通过
- 在扩展与网页模式下均测试

## 📄 许可证

Apache 2.0，适用于个人或商业用途。

详见 [LICENSE](LICENSE)。

## 🙏 致谢

- [CodeMirror](https://codemirror.net/) —— 优秀的代码编辑器
- [JSON5](https://json5.org/) —— 更易读的 JSON 规范与解析器

## 📞 支持

- 🐛 Bug 反馈：[GitHub Issues](https://github.com/idev-sig/json-format-converter/issues)
- 💡 功能建议：[GitHub Discussions](https://github.com/idev-sig/json-format-converter/discussions)
- 📧 联系方式：请新建 Issue 进行交流

---

**© 2025 JSON Format Converter.**
