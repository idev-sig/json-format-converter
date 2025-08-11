# JSON 格式转换器

[![版本](https://img.shields.io/badge/版本-0.1.0-blue.svg)](https://github.com/idev-sig/json-format-converter)
[![许可证](https://img.shields.io/badge/许可证-Apache_2.0-green.svg)](LICENSE)
[![Chrome扩展](https://img.shields.io/badge/Chrome-扩展-orange.svg)](https://chrome.google.com/webstore)

**[English](README.md) | [中文](README_zh.md)**

一个功能强大的 Chrome 扩展和独立网页应用，用于在 JSON、JSONC（带注释的JSON）和 JSON5 格式之间进行转换，具有高级编辑功能和注释保留能力。

## 功能特性

### 🎨 **高级编辑器**
- **语法高亮**: 基于 CodeMirror 的编辑器，支持 JSON 语法高亮
- **行号显示**: 便于导航和调试
- **自动补全**: 智能括号匹配和自动闭合
- **实时验证**: 即时错误检测和高亮显示

### 🔄 **智能格式转换**
- **双向转换**: JSON ↔ JSONC ↔ JSON5
- **注释保留**: 在 JSONC 和 JSON5 之间转换时保持所有注释
- **同格式处理**: JSONC → JSONC 和 JSON5 → JSON5 保留格式和注释
- **智能语法处理**: 自动处理属性名的引号添加/移除
- **实时转换**: 输入时即时转换

### 🛠️ **处理工具**
- **格式化美化**: 美化和格式化 JSON 数据
- **压缩精简**: 移除所有不必要的空白字符
- **转义处理**: 处理用于代码嵌入的 JSON 字符串转义
- **数据类型转换**: 数字 ↔ 字符串转换

### 📊 **高级排序**
- 按字母顺序排序对象键（A-Z 或 Z-A）
- 嵌套对象的深度排序
- 保留或重组数据结构

### 💾 **文件操作**
- 一键复制到剪贴板
- 下载转换后的文件
- 支持多种文件格式

### ⚙️ **可自定义选项**
- 可配置缩进（2个空格、4个空格或制表符）
- 多种排序选项
- 实时预览更改

### 🌐 **双模式**
- Chrome 扩展，便于快速访问
- 独立网页，提供完整功能编辑
- 响应式设计，支持桌面和移动设备

### ⌨️ **生产力功能**
- 常用操作的键盘快捷键
- 输入变化时自动转换
- 全面的帮助文档

### 🌍 **多语言支持**
- **英文（默认）** 和 **中文** 界面
- **自动语言检测**: 检测浏览器语言偏好
- **持久设置**: 语言选择保存在本地存储
- **本地化内容**: 示例数据、帮助文本和错误消息
- **实时切换**: 无需重新加载页面即可更改语言

### 💬 **注释保留**
- **JSONC ↔ JSON5**: 转换期间保留所有注释
- **同格式**: JSONC → JSONC 和 JSON5 → JSON5 保持格式
- **智能处理**: 仅在转换为标准 JSON 时移除注释
- **多种注释类型**: 支持 `//` 单行和 `/* */` 多行注释

## 支持的格式

### JSON (JavaScript Object Notation)
具有严格语法规则的标准 JSON 格式。

### JSONC (JSON with Comments)
支持单行 (`//`) 和多行 (`/* */`) 注释的 JSON 扩展格式。

### JSON5 (JSON for Humans)
更人性化的 JSON 格式，支持：
- 无引号的对象键
- 尾随逗号
- 单行和多行注释
- 十六进制数字
- 多行字符串

## 安装

### 📦 **预构建包**

从 [GitHub Releases](https://github.com/idev-sig/json-format-converter/releases) 下载最新版本：

#### Chrome 扩展
1. 下载 `json-format-converter-extension.zip`
2. 解压 ZIP 文件
3. 打开 Chrome 并导航到 `chrome://extensions/`
4. 在右上角启用"开发者模式"
5. 点击"加载已解压的扩展程序"并选择解压后的文件夹
6. 扩展将出现在您的工具栏中

#### 独立网页应用
1. 下载 `json-format-converter-standalone.zip`
2. 将 ZIP 文件解压到您的网络服务器
3. 在任何现代网络浏览器中打开 `index.html`
4. 或将文件部署到任何网络托管服务

### 🛠️ **从源码构建**

```bash
# 克隆仓库
git clone https://github.com/idev-sig/json-format-converter.git
cd json-format-converter

# 构建项目
just build-new
# 或
./scripts/build.sh

# 文件将在 dist/ 目录中生成
# - dist/extension/ (Chrome 扩展)
# - dist/standalone/ (网页应用)
# - *.zip 文件 (分发包)
```

## 使用方法

### 🎯 **快速开始**

#### Chrome 扩展
1. 点击工具栏中的扩展图标
2. 在输入面板中粘贴您的 JSON、JSONC 或 JSON5 数据
3. 从下拉菜单中选择输入和输出格式
4. 转换会自动实时进行
5. 使用面板按钮进行额外处理
6. 从输出面板复制或下载结果

#### 独立网页应用
1. 在浏览器中打开网页应用
2. 使用与扩展相同的界面，但布局更宽、更舒适
3. 非常适合复杂的编辑任务和书签收藏
4. 访问全面的帮助文档

### 🔄 **转换示例**

#### 注释保留
```javascript
// JSONC → JSON5 (保留注释)
{
    // 配置设置
    "name": "My App",
    "version": "1.0.0", // 当前版本
}

// 转换为:
{
    // 配置设置
    name: "My App",
    version: "1.0.0", // 当前版本
}
```

#### 同格式处理
```javascript
// JSONC → JSONC (保留所有注释和格式)
// JSON5 → JSON5 (保留所有注释和格式)
```

### 🎛️ **按钮功能**

#### 输入面板
- **清空**: 清除输入编辑器中的所有内容
- **格式化**: 美化和格式化输入的 JSON，使用适当的缩进
- **压缩**: 精简输入的 JSON（移除所有空白字符）
- **转义**: 转义 JSON 字符串以便安全嵌入代码
- **去转义**: 从 JSON 字符串中移除转义字符
- **示例**: 为当前格式加载本地化示例数据

#### 输出面板
- **复制**: 将格式化的输出复制到剪贴板，并显示成功反馈
- **下载**: 将输出保存为 `.json` 文件，自动命名
- **数字→字符串**: 将所有数值转换为字符串格式
- **字符串→数字**: 将数字字符串转换回数字格式

### ⌨️ **键盘快捷键**
- **Ctrl/Cmd + Enter**: 格式化和美化输入
- **Ctrl/Cmd + Shift + C**: 复制输出到剪贴板
- **Ctrl/Cmd + Shift + D**: 下载输出为文件
- **Escape**: 清空所有输入和输出

### 🎨 **视觉反馈**
- **按钮状态**: 活动（绿色）→ 成功（绿色）→ 正常状态转换
- **实时验证**: 即时错误高亮和语法检查
- **状态消息**: 清晰的成功/错误通知
- **语言切换**: 无缝的界面语言更改

## 项目结构

```
json-format-converter/
├── src/                    # 源代码目录
│   ├── manifest.json       # Chrome 扩展清单文件
│   ├── html/               # HTML 文件
│   │   ├── popup.html      # 扩展弹窗界面
│   │   ├── standalone.html # 独立网页
│   │   └── help.html       # 帮助文档
│   ├── css/                # 样式文件
│   │   └── styles.css      # 主样式表
│   ├── js/                 # JavaScript 文件
│   │   ├── converter.js    # 核心转换逻辑
│   │   ├── popup.js        # 弹窗界面逻辑
│   │   └── i18n.js         # 国际化支持
│   ├── lib/                # 第三方库
│   │   ├── codemirror.min.js    # CodeMirror 编辑器
│   │   ├── javascript.min.js    # JavaScript 语法模式
│   │   ├── json5.min.js         # JSON5 解析器
│   │   └── codemirror.min.css   # CodeMirror 样式
│   └── icons/              # 图标文件
│       ├── icon.svg        # 矢量图标源文件
│       ├── icon16.png      # 16x16 图标
│       ├── icon32.png      # 32x32 图标
│       ├── icon48.png      # 48x48 图标
│       └── icon128.png     # 128x128 图标
├── scripts/                # 构建和开发脚本
│   ├── build.sh           # 生产构建脚本
│   └── dev-server.sh      # 开发服务器脚本
├── dist/                   # 构建输出目录
│   ├── extension/          # Chrome 扩展构建
│   └── standalone/         # 独立网页应用构建
├── justfile               # Just 命令运行器配置
├── package.json           # 项目元数据
├── .gitignore            # Git 忽略规则
└── README.md             # 英文说明文档
```

## 开发

### 前置要求
- 现代网络浏览器
- Python 3（用于开发服务器）
- [Just](https://github.com/casey/just) 命令运行器（可选但推荐）
- ImageMagick（用于图标生成）

### 🚀 **快速开始**
```bash
# 克隆仓库
git clone https://github.com/idev-sig/json-format-converter.git
cd json-format-converter

# 启动开发服务器
just dev
# 或
./scripts/dev-server.sh

# 构建生产版本
just build-new
# 或
./scripts/build.sh

# 运行测试
just test-comments
# 或
just check-all
```

### 🔧 **开发工作流**
1. **编辑源码**: 修改 `src/` 目录中的文件
2. **实时开发**: 使用 `just dev` 启动开发服务器
3. **测试更改**: 在 `http://localhost:8080/standalone.html` 访问应用
4. **扩展测试**: 先构建，然后在 `chrome://extensions/` 中加载
5. **验证**: 提交前运行 `just check-all`

### 📋 **可用命令**
```bash
# 开发
just dev [端口]          # 启动开发服务器（默认：8080）
just serve               # 在端口 8080 上快速启动开发服务器

# 构建
just build-new           # 构建生产包
just clean               # 清理构建文件和临时目录

# 测试
just test                # 在端口 8081 上启动测试服务器
just test-comments       # 运行注释保留测试
just check-all           # 运行完整项目验证（59项检查）
just check-structure     # 检查项目文件结构

# 验证
just validate            # 运行扩展验证（如果有 web-ext）
```

### 🎨 **构建图标**
如果需要从 SVG 源文件重新生成图标：
```bash
# 需要 ImageMagick
cd src/icons
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 32x32 icon32.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

## 🛠️ **技术栈**

### 核心技术
- **原生 JavaScript**: 无框架依赖，最大兼容性
- **CodeMirror 5**: 具有语法高亮的高级代码编辑器
- **JSON5**: 支持注释的扩展 JSON 解析
- **CSS3**: 使用 flexbox 和 grid 布局的现代样式

### 构建系统
- **Just**: 用于开发任务的现代命令运行器
- **Bash 脚本**: 跨平台构建和开发脚本
- **Python HTTP 服务器**: 内置开发服务器

### 浏览器 API
- **Chrome 扩展 API**: 兼容 Manifest V3 的现代 Chrome 扩展
- **Web API**: 剪贴板、文件下载、本地存储
- **ES6+ 功能**: 具有广泛浏览器支持的现代 JavaScript

## 🌐 **浏览器兼容性**

- **Chrome 扩展**: Chrome 88+（兼容 Manifest V3）
- **独立网页应用**: 所有支持 ES6+ 的现代浏览器
  - Chrome 60+ ✅
  - Firefox 55+ ✅
  - Safari 12+ ✅
  - Edge 79+ ✅
  - Opera 47+ ✅

## 🤝 **贡献**

我们欢迎贡献！请按照以下步骤：

1. **Fork** 在 GitHub 上 fork 仓库
2. **克隆** 在本地克隆您的 fork
3. **创建** 功能分支：`git checkout -b feature/amazing-feature`
4. **进行** 更改并彻底测试
5. **运行** 验证：`just check-all`
6. **提交** 您的更改：`git commit -m 'Add amazing feature'`
7. **推送** 到您的分支：`git push origin feature/amazing-feature`
8. **提交** pull request

### 📝 **开发指南**
- 遵循现有的代码风格和约定
- 为新功能添加测试
- 根据需要更新文档
- 确保所有验证检查通过
- 在扩展和独立模式下都进行测试

## 📄 **许可证**

Apache 2.0 许可证 - 可自由用于个人或商业用途。

详见 [LICENSE](LICENSE) 文件。

## 📈 **更新日志**

### v0.1.0 (2025-08-11)
- 🎉 **首次发布**
- ✅ **核心功能**: JSON ↔ JSONC ↔ JSON5 转换
- 💬 **注释保留**: 格式间的智能注释处理
- 🌍 **多语言支持**: 英文和中文界面
- 🎨 **高级编辑器**: 带语法高亮的 CodeMirror
- 📦 **双重分发**: Chrome 扩展和独立网页应用
- 🛠️ **开发工具**: 全面的构建系统和测试
- ⌨️ **键盘快捷键**: 专注生产力的热键
- 📱 **响应式设计**: 适用于桌面和移动设备
- 🔧 **可自定义**: 可配置的缩进和排序选项

## 🙏 **致谢**

- [CodeMirror](https://codemirror.net/) - 优秀的代码编辑器组件
- [JSON5](https://json5.org/) - 人性化的 JSON 规范和解析器
- [Just](https://github.com/casey/just) - 便捷的命令运行器

## 📞 **支持**

- 🐛 **错误报告**: [GitHub Issues](https://github.com/idev-sig/json-format-converter/issues)
- 💡 **功能请求**: [GitHub Discussions](https://github.com/idev-sig/json-format-converter/discussions)
- 📧 **联系**: 如有任何问题请创建 issue

---

**© 2025 JSON 格式转换器。用 ❤️ 为开发者打造。**
