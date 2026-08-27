# dev-log

我个人各个小工具（[pyff-ny/toolbox](https://github.com/pyff-ny/toolbox)）的公开发布日志，用 GitHub Pages 托管：

**https://pyff-ny.github.io/dev-log/**

按 `fix` / `improve` / `feature` 三类分栏，首页有时间线 feed 和发表活动热力图。这个仓库本身不手写内容——`docs/` 下的所有页面都是从 toolbox 仓库自动同步渲染出来的静态 HTML，人工只做事后微调（改错别字、补充说明之类）。

## 内容从哪来

两条自动同步链路，源头都在 `pyff-ny/toolbox` 的 `.github/workflows/sync-fix-improve-log.yml`：

1. **Case 路径**：toolbox 的 Case Manager 走完正式发布流程（Stage 3 `MERGE` → Stage 4 `ALLOW CLOSE`）后，`case-manager-app/cases/<CASE-ID>/50-release/release-notes.md` 的 `status` 变成 `released`。push 到 `develop` 时这个文件变更会被检测到，按 `release-notes.md` frontmatter 里的 `change_type`（fix/improve/feature）分类渲染成 `docs/<change_type>/<CASE-ID>.html`。
2. **非 Case 路径**（M2 窄修复/维护，不走完整 Case 流程的改动）：push 到 `develop` 时，对没有碰 `case-manager-app/cases/**` 的合并 PR，按其 commit 的 Conventional Commit 前缀分类（`fix`/`improve`/`feat` → fix/improve/feature），用 PR 标题和正文渲染成 `docs/<change_type>/PR-<PR号>.html`。前缀不是这三类之一（`chore`/`docs`/`test`/...）的 commit 会被跳过，不会出现在这里。

两条链路渲染完都会自动开 PR 并 squash merge 到这个仓库的 `main`，全程无人工审核——发布及时优先于内容打磨；错别字或翻译之类可以之后直接在这个仓库里改对应的 HTML 文件（保留文件里的 `<script id="case-meta">` JSON 元数据不动，首页/分类页/热力图靠它排序和分类）。

## 目录结构

```
docs/
  index.html          首页：时间线 feed + 活动热力图
  fix/                bug 修复
  improve/            体验/性能改进
  feature/            新功能
  assets/             共享 CSS/JS
```

## 时间显示

所有发布时间统一按美国东部时间（America/New_York）显示，不管源数据是 UTC 时间戳还是本地时间——渲染脚本会自动转换。
