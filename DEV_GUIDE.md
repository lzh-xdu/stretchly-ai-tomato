# Stretchly AI Tomato - 开发指南

> 基于 [hovancik/stretchly](https://github.com/hovancik/stretchly) v1.21.0 的二次开发分支

---

## 1. 项目位置

```
c:\Users\lzh\Desktop\lzh\note\stretchly-ai-tomato\
```

Git 远程仓库: `git@github.com:lzh-xdu/stretchly-ai-tomato.git`

---

## 2. 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 运行时 | **Node.js** | **24.15.0**（见 `.nvmrc`） |
| 桌面框架 | **Electron** | 41.3.0 |
| 打包构建 | **electron-builder** | 26.8.1 |
| 测试框架 | **Vitest** | 4.1.5 |
| 代码规范 | **StandardJS** | 17.1.2 |
| 模块系统 | **ESM**（`"type": "module"`） | — |

### 核心依赖

| 包名 | 用途 |
|------|------|
| `electron-log` | 日志系统（主进程 + 渲染进程） |
| `electron-store` | 用户设置持久化存储（JSON） |
| `i18next` + `i18next-fs-backend` | 国际化（45 种语言） |
| `humanize-duration` | 人性化时间格式 |
| `luxon` | 日期时间处理 |
| `dompurify` | HTML 内容净化（XSS 防护） |
| `auto-launch` | 开机自启动 |
| `ps-list` | 进程列表查询（应用排除功能） |
| `node-desktop-idle-v2` | 桌面空闲检测（自然休息） |
| `windows-focus-assist` | Windows 焦点助手状态检测 |
| `meeussunmoon` | 日出日落计算（"直到早晨"功能） |

---

## 3. 环境要求与安装

### 3.1 当前环境状态

```
Node.js:   v24.15.0  ✅
npm:       11.6.4    ✅
Rust:      1.95.0    (本项目不需要)
OS:        Windows
```

### 3.2 安装步骤

```bash
# 克隆项目
git clone git@github.com:lzh-xdu/stretchly-ai-tomato.git
cd stretchly-ai-tomato

# 安装依赖（跳过原生模块编译，windows-focus-assist 可选）
npm install --ignore-scripts

# 单独安装 Electron 二进制
node node_modules/electron/install.js

# 启动开发模式（带调试）
npm run dev

# 或者简单启动
npm start
```

### 3.3 可用 npm 脚本

| 命令 | 说明 |
|------|------|
| `npm start` | 启动应用 |
| `npm run dev` | 开发模式（启用远程调试端口 9222 + 日志） |
| `npm test` | 运行全部测试（Vitest） |
| `npm run tdd` | 测试驱动开发（watch 模式） |
| `npm run coverage` | 生成测试覆盖率报告 |
| `npm run lint` | StandardJS 代码风格检查 |
| `npm run pack` | 打包到目录（不生成安装器） |
| `npm run dist` | 构建发布包（NSIS/7z/appx/portable） |

---

## 4. 目录结构

```
stretchly-ai-tomato/
├── app/                          # 📦 应用核心代码
│   ├── main.js                   #   Electron 主进程入口
│   ├── breaksPlanner.js          #   休息调度核心（EventEmitter）
│   ├── electron-bridge.mjs       #   设置页 contextBridge
│   ├── platform.js               #   平台检测
│   │
│   ├── break.html                #   长休息窗口
│   ├── break-renderer.js         #     └─ 渲染进程
│   ├── break-preload.mjs         #     └─ 预加载脚本
│   │
│   ├── microbreak.html           #   微休息窗口
│   ├── microbreak-renderer.js    #     └─ 渲染进程
│   ├── microbreak-preload.mjs    #     └─ 预加载脚本
│   │
│   ├── preferences.html          #   设置窗口
│   ├── preferences-renderer.js   #     └─ 渲染进程
│   ├── preferences-preload.mjs   #     └─ 预加载脚本
│   │
│   ├── welcome.html              #   欢迎窗口
│   ├── welcome-renderer.js       #     └─ 渲染进程
│   ├── welcome-preload.mjs       #     └─ 预加载脚本
│   │
│   ├── contributor-preferences.html     # 贡献者设置窗口
│   ├── contributor-preferences-renderer.js
│   ├── contributor-preferences-preload.mjs
│   │
│   ├── process.html              #   进程信息窗口
│   ├── process-renderer.js       #     └─ 渲染进程
│   ├── process-preload.mjs       #     └─ 预加载脚本
│   │
│   ├── utils/                    #   🔧 工具模块（26个）
│   │   ├── appExclusionsManager.js   # 应用排除管理
│   │   ├── appIcon.js                # 系统托盘图标
│   │   ├── autostartManager.js       # 自启动管理
│   │   ├── breakHealthEffect.js      # 休息健康效果
│   │   ├── breakShortcuts.js         # 快捷键注册
│   │   ├── commands.js               # 命令行参数处理
│   │   ├── context-bridge-exposers.js# IPC 桥接暴露函数集
│   │   ├── defaultBreakIdeas.js      # 默认长休息创意
│   │   ├── defaultMicrobreakIdeas.js # 默认微休息创意
│   │   ├── defaultSettings.js        # 默认设置值
│   │   ├── displayManager.js         # 多显示器管理
│   │   ├── dndManager.js             # 勿扰模式管理
│   │   ├── flatpakPortalManager.js   # Flatpak 门户管理
│   │   ├── htmlTranslate.js          # HTML i18n 翻译
│   │   ├── ideasLoader.js            # 休息创意加载器
│   │   ├── imageResolver.js          # 图片路径解析
│   │   ├── naturalBreaksManager.js   # 自然休息（空闲检测）
│   │   ├── runOnce.js                # 按钮单次执行保护
│   │   ├── sameWidths.js             # UI 统一宽度工具
│   │   ├── sanitizeIdea.js           # 创意内容过滤
│   │   ├── scheduler.js              # 定时器调度器
│   │   ├── shuffled.js               # 随机洗牌工具
│   │   ├── statusMessages.js         # 状态消息生成
│   │   ├── untilMorning.js           # "直到早晨"时间计算
│   │   ├── utils.js                  # 通用工具函数
│   │   └── versionChecker.js         # 版本检查器
│   │
│   ├── css/                      #   🎨 样式文件
│   │   ├── break.css             #     休息窗口样式
│   │   ├── color-scheme.css      #     颜色方案
│   │   ├── commons.css           #     公共样式
│   │   ├── contributor.css       #     贡献者页面样式
│   │   ├── normalize.css         #     CSS Reset
│   │   ├── preferences.css       #     设置页面样式
│   │   ├── welcome.css           #     欢迎页面样式
│   │   └── fonts/                #     多语言字体文件
│   │
│   ├── images/                   #   🖼️ 图片资源
│   │   ├── app-icons/            #     托盘图标（900+文件，含编号/进度变体）
│   │   ├── breaks/               #     休息操作图标 SVG
│   │   └── preferences/          #     设置页面图标
│   │
│   ├── locales/                  #   🌍 国际化（45种语言 JSON）
│   └── audio/                    #   🔊 音频文件（5个 .wav）
│
├── test/                         # 🧪 测试文件（19个）
├── build/                        # 📦 构建资源（icon.ico, icon.icns）
├── graphics/                     # 🎨 矢量图形源文件（SVG）
├── examples/                     # 📄 示例配置
├── .github/                      # CI/CD 工作流
├── .nvmrc                        # Node.js 版本锁定: 24.15.0
├── package.json                  # 项目配置
├── vitest.config.ts              # 测试配置
├── Dockerfile                    # Docker 构建
└── docker-compose.yml            # Docker Compose
```

---

## 5. 架构设计

### 5.1 Electron 多进程架构

```
┌─────────────────────────────────────────────────┐
│                  Main Process                   │
│                  (main.js)                      │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │BreaksPlan│ │AppIcon   │ │DisplayManager    │ │
│  │ner       │ │(Tray)    │ │(多显示器)         │ │
│  └────┬─────┘ └──────────┘ └──────────────────┘ │
│       │ Events                                  │
│  ┌────┴────────────────────────────────────┐    │
│  │         IPC 通道 (ipcMain/ipcRenderer)   │    │
│  └────┬──────────┬──────────┬──────────┬───┘    │
│       │          │          │          │         │
└───────┼──────────┼──────────┼──────────┼─────────┘
        │          │          │          │
   ┌────▼────┐┌────▼────┐┌───▼─────┐┌──▼──────┐
   │ Break   ││Microbreak││Settings ││Welcome  │
   │ Window  ││ Window   ││ Window  ││ Window  │
   │         ││          ││         ││         │
   │ preload ││ preload  ││ preload ││ preload │
   │ renderer││ renderer ││ renderer││ renderer│
   └─────────┘└──────────┘└─────────┘└─────────┘
```

每个窗口由三件套组成：
- `xxx.html` — 页面结构
- `xxx-preload.mjs` — 预加载脚本（contextBridge 暴露安全 API）
- `xxx-renderer.js` — 渲染进程逻辑

### 5.2 核心调度流程

```
BreaksPlanner (EventEmitter)
  ├── NaturalBreaksManager  → 空闲检测，超时自动暂停
  ├── DndManager            → 勿扰模式，自动暂停/恢复
  └── AppExclusionsManager  → 应用排除规则

事件流：
  start → [计时] → microbreakStarted → [计时] → finishMicrobreak
                                  ↓
                           (每 N 个微休息)
                                  ↓
                           breakStarted → [计时] → finishBreak
```

### 5.3 IPC 通信模式

预加载脚本通过 `context-bridge-exposers.js` 统一暴露 API：

```javascript
// break-preload.mjs
exposeElectronApi()   // window.electronApi   → 打开外部链接等
exposeBreaks('long')  // window.breaks        → 获取休息数据、完成/推迟
exposeI18next()       // window.i18next       → 国际化翻译
exposeRuntime()       // window.runtime       → Node.js 运行时信息
exposeSettings()      // window.settings      → 读取设置
exposeStretchly()     // window.stretchly     → 应用级操作
exposeUtils()         // window.utils         → 工具函数
```

---

## 6. 默认配置参数

定义在 `app/utils/defaultSettings.js`：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `microbreakDuration` | 20000 (20s) | 微休息时长 |
| `microbreakInterval` | 600000 (10min) | 微休息间隔 |
| `breakDuration` | 300000 (5min) | 长休息时长 |
| `breakInterval` | 2 | 每 N 个微休息后触发长休息 |
| `mainColor` | `#478484` | 主色调 |
| `opacity` | 0.9 | 休息窗口不透明度 |
| `transparentMode` | false | 透明模式 |
| `blurredBackground` | false | 毛玻璃背景 |
| `fullscreen` | false | 全屏休息窗口 |
| `breakWindowWidth` | 0.85 (85%) | 休息窗口宽度比 |
| `breakWindowHeight` | 0.85 (85%) | 休息窗口高度比 |
| `naturalBreaks` | true | 启用自然休息（空闲检测） |
| `naturalBreaksInactivityResetTime` | 300000 (5min) | 空闲超时重置计时 |
| `morningHour` | 6 | "直到早晨"的早晨时间 |
| `breakHealthMode` | false | 健康模式（渐变色效果） |
| `allScreens` | true | 所有显示器显示休息窗口 |
| `monitorDnd` | true | 监听系统勿扰模式 |
| `showTrayIcon` | true | 显示托盘图标 |
| `trayIconStyle` | `default` | 托盘图标风格 |

---

## 7. 开发调试

### 7.1 启动开发模式

```bash
npm run dev
```

这将启用：
- `--trace-warnings` — Node.js 警告追踪
- `--trace-deprecation` — 废弃 API 追踪
- `--enable-logging` — Electron 日志
- `--remote-debugging-port=9222` — Chrome DevTools 远程调试

调试时打开浏览器访问 `http://localhost:9222` 可连接 DevTools。

### 7.2 日志位置

- Windows: `%APPDATA%\Stretchly\logs\`
- 使用 `electron-log`，支持 `log.info()` / `log.warn()` / `log.error()`

### 7.3 用户数据存储

- Windows: `%APPDATA%\Stretchly\`（包含 `config.json`）
- Windows Portable: 应用所在目录的 `Stretchly\` 子目录

### 7.4 命令行参数

```bash
npx electron . --reset      # 重置休息计时
npx electron . --mini       # 立即跳到微休息
npx electron . --long       # 立即跳到长休息
npx electron . --pause      # 暂停所有休息
npx electron . --resume     # 恢复休息
npx electron . --toggle     # 切换暂停状态
npx electron . --preferences # 打开设置窗口
```

---

## 8. 测试

```bash
# 运行全部测试
npm test

# 测试驱动开发（watch 模式，文件变化自动重跑）
npm run tdd

# 生成覆盖率报告（输出到 coverage/ 目录）
npm run coverage

# 运行单个测试文件
npm run test-single -- test/scheduler.js
```

测试框架为 **Vitest**，配置在 `vitest.config.ts`：
- 使用 `forks` 进程池隔离测试
- 全局 API 启用（无需 import describe/it）
- 覆盖率使用 Istanbul provider

---

## 9. 构建发布

### Windows 构建目标

```bash
npm run dist
```

生成：
- **NSIS** 安装器（`.exe`）— 支持自定义安装路径
- **7z** 压缩包
- **appx** — Microsoft Store 包
- **portable** — 便携版（单文件）

### 构建产物位置

```
dist/
├── Stretchly Setup x.x.x.exe      # NSIS 安装器
├── Stretchly-x.x.x-win.7z         # 7z 压缩包
├── Stretchly-x.x.x.appx           # Store 包
└── Stretchly Portable x.x.x.exe   # 便携版
```

---

## 10. 关键文件快速索引

### 要修改休息界面
- 样式 → `app/css/break.css` + `app/css/color-scheme.css`
- HTML → `app/break.html` / `app/microbreak.html`
- 逻辑 → `app/break-renderer.js` / `app/microbreak-renderer.js`

### 要修改调度逻辑
- 核心 → `app/breaksPlanner.js`
- 定时器 → `app/utils/scheduler.js`
- 空闲检测 → `app/utils/naturalBreaksManager.js`
- 勿扰 → `app/utils/dndManager.js`

### 要修改设置
- 默认值 → `app/utils/defaultSettings.js`
- 设置界面 → `app/preferences.html` + `app/preferences-renderer.js` + `app/css/preferences.css`
- 存储 → `electron-store`（`%APPDATA%\Stretchly\config.json`）

### 要修改托盘图标
- 图标管理 → `app/utils/appIcon.js`
- 图标文件 → `app/images/app-icons/`（900+ 文件）

### 要添加国际化
- 翻译文件 → `app/locales/`（JSON 格式，45 种语言）
- HTML 翻译 → `app/utils/htmlTranslate.js`

### 要修改音频
- 音频文件 → `app/audio/`（5 个 .wav）
- 播放逻辑 → 在 `break-renderer.js` / `microbreak-renderer.js` 中

---

## 11. 代码规范

- **StandardJS** — 无分号、2 空格缩进、单引号
- **ESM** — 使用 `import/export`，不使用 `require`
- **Husky** pre-commit 钩子 — 提交前自动运行 lint
- 函数命名：camelCase
- 文件名：camelCase（如 `breaksPlanner.js`）
- 类名：PascalCase（如 `BreaksPlanner`）
