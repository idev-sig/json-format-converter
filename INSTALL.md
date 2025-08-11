# JSON Format Converter - 安装指南

## 🚀 Chrome 扩展安装方法

### 方法1: 使用CRX文件（推荐）

1. **下载CRX文件**
   ```bash
   # 构建CRX文件
   just build-crx
   ```
   这会生成 `json-format-converter-v0.1.0.crx` 文件

2. **安装到Chrome**
   - 打开Chrome浏览器
   - 进入扩展管理页面：`chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 将 `.crx` 文件拖拽到扩展管理页面
   - 点击"添加扩展程序"确认安装

### 方法2: 使用解压文件夹

1. **构建扩展文件**
   ```bash
   just build-new
   ```

2. **加载解压的扩展**
   - 打开Chrome浏览器
   - 进入扩展管理页面：`chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist/extension/` 文件夹

### 方法3: 使用ZIP文件

1. **下载ZIP文件**
   ```bash
   # 构建ZIP文件
   just build-new
   ```
   这会生成 `json-format-converter-extension.zip` 文件

2. **解压并安装**
   - 解压ZIP文件到任意文件夹
   - 按照方法2的步骤加载解压的文件夹

## 🔧 开发者安装

### 开发模式安装

```bash
# 启动开发服务器
just dev

# 在另一个终端构建扩展
just build-new

# 在Chrome中加载 dist/extension/ 目录
```

### 自动重载开发

```bash
# 启动自动重载模式（需要inotify-tools）
just dev-watch
```

## ❗ 常见问题

### 问题1: "Your file couldn't be accessed" 错误

**原因**: CRX文件路径不正确或构建有问题

**解决方案**:
1. 确保使用最新的构建命令：`just build-crx`
2. 检查CRX文件是否完整：`ls -la *.crx`
3. 尝试使用方法2（解压文件夹）安装

### 问题2: "Package is invalid" 错误

**原因**: manifest.json文件有问题

**解决方案**:
1. 验证manifest文件：`just validate`
2. 重新构建：`just clean && just build-new`

### 问题3: 扩展图标不显示

**原因**: 图标文件缺失

**解决方案**:
1. 检查图标：`just check-icons`
2. 重新生成图标（如果有SVG源文件）

### 问题4: 功能不工作

**原因**: JavaScript文件有错误

**解决方案**:
1. 检查控制台错误（F12 → Console）
2. 验证文件语法：`just check-all`
3. 重新构建：`just build-new`

## 📋 验证安装

安装成功后，你应该能看到：

1. **扩展图标**: Chrome工具栏中出现JSON转换器图标
2. **新标签页**: 点击图标会在新标签页中打开转换器界面
3. **功能正常**: 能够进行JSON格式转换

## 🎯 使用方式

点击Chrome工具栏中的JSON转换器图标，会自动在新标签页中打开转换器界面，提供完整的转换功能和舒适的使用体验。

## 🛠️ 构建命令参考

| 命令 | 功能 | 输出文件 |
|------|------|----------|
| `just build-new` | 完整构建 | `dist/extension/`, `*.zip` |
| `just build-crx` | 构建CRX | `*.crx` |
| `just clean` | 清理构建 | 删除临时文件 |
| `just check-all` | 验证项目 | 检查报告 |

## 📞 获取帮助

如果遇到问题：

1. 查看构建日志中的错误信息
2. 运行 `just check-all` 进行完整验证
3. 检查Chrome扩展管理页面的错误信息
4. 查看浏览器控制台的JavaScript错误

---

**© 2025 JSON Format Converter. Built with ❤️ for developers.**
