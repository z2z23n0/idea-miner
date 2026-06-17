# idea-miner

[English](README.md) | [简体中文](README.zh-CN.md)

把 agent 的空余 token 用来寻找值得继续做的创业和开源想法。

`idea-miner` 面向有空余 token 预算、固定自动化窗口或长期研究时段的 agent。它先生成 AI 时代的 thesis，再草拟面向产品或开源仓库的想法，然后通过来源扫描来淘汰、收窄、强化或降低这些想法的风险。

这个仓库包含两个 agent skill 和一些辅助脚本。skill 定义了研究流程、来源策略、角色契约、拷打标准、报告格式，以及本地 evidence memory 的格式。

## 产出内容

- 一个覆盖三个 AI final bucket 的 **Discovery Thesis** 组合：`ai_oss`、`ai_product`、`ai_prosumer`。
- 围绕清晰 **Idea Spine** 的产品/开源想法草图：产品或仓库形态、目标用户和任务、输入或权限、核心对象、输出或状态、首版边界，以及为什么它是产品或开源项目，而不是 prompt、wrapper、checker 或集成教程。
- 对严肃候选想法的竞品和替代方案检查。
- Red Team 反对意见、高风险假设，以及 CEO 视角决策：推进、收窄、暂停或拒绝。
- 一份中文报告，读者不需要参与发现过程也能把它当成日报或周报阅读。
- 一个独立 reader review artifact，用来检查每个入选想法能否被解释成具体的产品或仓库形态。
- candidate ledger，用于记录某个 bucket 不足时的 replenish 轮次。
- 可选的本地 JSONL memory，用于保存 signals、ideas、competitors、claims、decisions 和 evidence edges。
- 可 handoff 的 idea dossier，后续只用一句 handoff 请求就能打包已保存的上下文，不需要重新做来源发现。
- 可选的 Codex 新 session handoff：一个想法可以发送到一个新 session，多个想法默认拆到多个新 session。

## 工作方式

```text
prepare_run
  -> load_history
  -> generate_thesis_portfolio
  -> sketch_product_oss_bets
  -> collect_evidence
  -> normalize_signals
  -> ai_relevance_gate
  -> product_shape_gate
  -> product_oss_promotion_gate
  -> history_relation_gate
  -> hard_gate
  -> critic_review
  -> competitor_check
  -> ceo_decision
  -> replenish_if_underfilled
  -> persist_memory
  -> render_report
  -> independent_reader_review
  -> persist_run_artifacts
```

默认运行方式是严谨的 thesis-first。除非用户明确要求窄范围扫描，scout 会先生成 AI 时代 thesis 和产品/开源 bet sketch。Evidence 之后再进入，作用是刹车：它可以支持、质疑、淘汰或打磨一个想法，但不是主要的想象来源。弱候选会在长篇展开前被淘汰；如果某个 bucket 数量不足，会用新的 thesis seed、能力变化、产品 archetype、demo moment、仓库或产品资产、目标用户、来源模块继续 replenish。默认 final set 按最多 3 个 `ai_oss`、最多 3 个 `ai_product`、最多 3 个 `ai_prosumer` 分组；bucket 不足就保持不足，不用低质量想法凑数。如果运行环境提供真实 sub-agent 或 multi-agent 工具，同样的角色契约可以分派出去。只要 runtime 支持，Report Reader 应该由独立 agent 执行。

真正有用的输出是 thesis-to-decision chain 加产品形态：这轮在下注什么，最终会存在什么 artifact 或产品表面，谁会为哪个任务使用它，什么输入会变成什么输出，第一版做什么和不做什么，哪些证据支持或淘汰它，以及它为什么通过了 review。

周期性运行还会保存每个想法的 dossier。Handoff 应该只是打包步骤：读取已存 dossier，写入临时 handoff 文件，并避免刷新网页；只有用户明确要求当前状态时才重新查。

任何运行、市场扫描、发布扫描或用户要求的当前性刷新，只要涉及 web / 实时搜索，都先尝试 Grok search MCP，优先用 `mcp__grok_search.grok_web_search`；如果运行环境只暴露旧接口，则用 `grok_search.grok_ask` / `mcp__grok_search.grok_ask` 并传 `search: "web"`。如果 Grok 不可用、超时、调用失败或覆盖不了目标来源，再回退 Codex 自带 web/search/browser/GitHub 工具，并在 source notes 或覆盖记录里说明回退。

当宿主 runtime 暴露 Codex thread/session 工具时，handoff 也可以直接交付到新 session。默认多个想法会分别交付到多个 session；如果想放到同一个 session，需要明确说 "same session" 或 "combined"。普通的新 session handoff 只应该让接收 session 确认已收到上下文并等待，不应该自动开始研究或实现，除非用户明确要求。

## Skills

| Skill | 作用 |
|---|---|
| `idea-discovery-workflow` | 运行研究流程：thesis portfolio、产品/开源 bet、来源计划、角色、evidence memory 和报告格式 |
| `ai-founder-playbook` | 判断想法质量：拷打、竞品推理、商业/开源拆分，以及发布支持 |

这个拆分让编排和判断保持分离。定时运行可以用 `idea-discovery-workflow` 收集和标准化 evidence，然后在需要压力测试、竞品检查或市场判断时调用 `ai-founder-playbook`。

## 信号来源

| Bucket | 示例 |
|---|---|
| AI / 平台变化 | 模型、agent、API、价格、政策、协议、devtool 变化 |
| OSS mindshare | GitHub trending/new repos、demo、benchmark、standard、playground、stars/forks |
| 痛点 / 抱怨 | Reddit 和 HN 讨论、GitHub issues、低分评价、workaround、"I wish there was..." |
| 产品 / 平台新闻 | 官方博客、release notes、changelog、Show HN、Product Hunt、新 agent/devtool 功能 |
| 竞品缺口 | 闭源、不能自托管、价格贵、文档差、设置复杂、issue 响应慢 |
| 开源生态 | GitHub topics、trending projects、releases、stars/forks、PR、tutorials、dependencies |
| 趋势雷达 | AI 新闻站、builder newsletter、分析师 newsletter、精选 X/Twitter list |
| 趋势窗口 | 最近 7-30 天内跨多个社区重复出现的信号 |
| 评价 / 评测 | G2、Capterra、Chrome Web Store、App Store、Product Hunt comments、博客/视频 review |
| AI 产品类别 | Product Hunt、launch page、pricing page、docs、用户社区、app store、review site、comparison page |
| AI prosumer 行为 | creator/founder/researcher/student/indie-developer 社区、app store、extension store、YouTube demo、Reddit/HN 讨论、可见 workflow |

默认 discovery 不应该从固定主题关键词或 complaint mining 开始。它应该先生成 thesis seed 和产品/开源 bet sketch，再用来源去支持、质疑、淘汰或打磨这些 bet。Source coverage 要匹配目标 bucket，但默认世界仍然聚焦 AI，不漂到陌生垂直行业。Final idea 默认应该是 AI-core 或 AI-native workflow。非 AI 想法进入 backlog，除非用户明确要求放宽范围。

AI 新闻站、newsletter、精选 X/Twitter list 这类趋势雷达，适合用来发现新词、launch cluster、平台变化和时间窗口。它们是 query generator，不是证据本身：由雷达触发的候选想法，仍然需要从 bucket-native source 中确认，例如官方文档、价格页、changelog、GitHub、HN/Reddit、Product Hunt、app 或 extension review、package/download evidence，或直接竞品页面。

GitHub Actions、CI gate、PR comment、template、hook、checklist、thin wrapper 可以是集成表面，但不能成为 final idea 的主体。

## 报告格式

默认报告包含：

- 当天选中的方向，不对入选想法互相排序，并按 `ai_oss`、`ai_product`、`ai_prosumer` 分组。
- Discovery context 和 thesis pool。
- Evidence notes，说明每个来源如何改变判断。
- History relation 和 novelty handling：new、update_existing、duplicate_of、revives、merged_from、splits_from、adjacent_to。
- Final 产品/开源想法，写成围绕产品形态的短 product memo，不写故事场景，也不写字段清单。
- Independent reader review，检查每个入选想法是否能被解释成带目标用户、输入、输出、核心对象、首版边界和产品/开源主体的具体产品或仓库对象。
- 被拒绝或暂停的候选。
- Source appendix。

## 快速开始

把 skills 安装到 agent 可读取的 skills 目录，并初始化本地 evidence store。

Codex：

```bash
git clone git@github.com:z2z23n0/idea-miner.git
cd idea-miner
node scripts/install-local.mjs
```

其他 agent runtime：

```bash
node scripts/install-local.mjs \
  --skills-dir=/path/to/skills \
  --data-dir=/path/to/idea-miner-data
```

只预览操作，不修改文件：

```bash
node scripts/install-local.mjs --dry-run
```

覆盖已有的本地 skill 副本：

```bash
node scripts/install-local.mjs --force
```

用 symlink 代替复制，适合在编辑仓库时使用：

```bash
node scripts/install-local.mjs --link --force
```

## 定时运行

可以把 `prompts/codex-automation-default.md` 作为 Codex 定时运行 prompt，也可以把同一套指令改给其他 agent runtime。

调度属于宿主环境。Prompt 应该聚焦运行目标、来源偏好、排除方向和输出预期。

在 Codex 里，周期性完整 discovery run 应该配置成指向 workspace 的 cron automation，而不是挂在长生命周期 thread 上的 heartbeat。Heartbeat 只应该是很薄的提醒或 controller，不应该承载完整的每日 discovery 上下文。

可选定制可以从这里追加：

```text
prompts/customization-block.md
```

定制示例：

```text
主要关注 thesis：agent-readable software, AI coding aftershocks, AI workflow products
排除方向：unfamiliar vertical SaaS, crypto, generic SEO
final bucket：ai_oss 最多 3 个 / ai_product 最多 3 个 / ai_prosumer 最多 3 个
偏好形态：complete AI product / high-star GitHub OSS / AI workflow app / MCP server / Skill / SDK
成功标准：AI-core product / AI-native workflow / GitHub stars / real installs / paid SaaS / repeat usage
不算 final：GitHub Action-only / CI gate / PR comment / thin wrapper
```

## 辅助脚本

`scripts/install-local.mjs`

把两个 skills 安装到目标 skills 目录，并初始化本地 runtime data。

```bash
node scripts/install-local.mjs --dry-run
node scripts/install-local.mjs --force
node scripts/install-local.mjs --link --force
node scripts/install-local.mjs --skills-dir=/path/to/skills --data-dir=/path/to/data
```

`skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs`

生成 thesis-first scouting plan、thesis seeds、产品/开源 bet sketch template、AI relevance 和 promotion gate、evidence sweep template、history-relation table，以及 Red Team questions。带显式 topic 时，它会把这些 topic 当成 thesis constraint，并加入 topic-guided evidence queries。它只创建结构化 plan，不浏览网页。

```bash
node skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs
node skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs "AI coding agents" "MCP"
```

`skills/idea-discovery-workflow/scripts/init-store.mjs`

创建本地 JSONL evidence store。

```bash
node skills/idea-discovery-workflow/scripts/init-store.mjs
```

`skills/idea-discovery-workflow/scripts/check-run-artifacts.mjs`

检查已完成 run 的 reader clarity 和 artifact completeness：报告章节、每个 idea 的 dossier、产品形态、independent reader review、不足 bucket 的 candidate ledger、AI relevance、promotion gate、source notes、有来源支持的 claims、竞品推理，以及首版边界。

```bash
node skills/idea-discovery-workflow/scripts/check-run-artifacts.mjs ~/.idea-miner/runs/<run_id>
```

`skills/idea-discovery-workflow/scripts/idea-handoff.mjs`

通过名字或 alias 解析一个已保存 idea，并把它的 handoff-ready dossier 复制到临时 handoff 文件。带 `--session-prompt` 时，它还会写出一个可以传给新 Codex session 的 prompt。它不会浏览网页，也不会自己创建 session。

```bash
node skills/idea-discovery-workflow/scripts/idea-handoff.mjs "Tool-Call Compatibility"
node skills/idea-discovery-workflow/scripts/idea-handoff.mjs --session-prompt --idea "Tool-Call Compatibility"
node skills/idea-discovery-workflow/scripts/idea-handoff.mjs --session-prompt --idea "Idea A" --idea "Idea B"
```

## Runtime Data 和隐私

Runtime data 放在仓库外。设置 `IDEA_MINER_HOME` 可以选择 store 位置。脚本也兼容旧的 `CODEX_IDEA_DISCOVERY_HOME` 变量，方便已有安装。辅助脚本会优先使用显式 root，其次复用 `~/.idea-miner` 或 `~/.codex/data/idea-discovery` 下已有且可读的 store，再创建新的空 store。如果找不到已有 store，默认位置是：

```text
~/.idea-miner/
```

Store 是 graph-shaped，但从 JSONL 开始：

```text
signals.jsonl
ideas.jsonl
claims.jsonl
competitors.jsonl
decisions.jsonl
edges.jsonl
handoff-events.jsonl
runs/<run_id>/
  run-manifest.json
  report.md
  reader-review.md
  candidate-ledger.jsonl
  source-notes.jsonl
  signal-portfolio.jsonl
  ideas/<idea_id>.json
  ideas/<idea_id>.md
  handoff-index.md
```

顶层 JSONL 文件是索引。每个 final 或可恢复 paused idea 的详细上下文，应该放在 `runs/<run_id>/ideas/<idea_id>.md`，包含 source links、source-to-claim mapping、竞品推理、Red Team records、CEO decisions、core thesis、AI relevance、promotion-gate result、demo moment、repo/star assets 和首版边界。

`source-notes.jsonl` 里涉及当前性、覆盖差异或回退判断的来源，应该记录使用的搜索工具、查询或回退原因，方便后续 handoff 知道哪些来源经过 Grok，哪些来源是因为 MCP 不可用或不覆盖目标来源而回退到 Codex 工具。

`handoff-events.jsonl` 记录交付事件，例如“idea X 已 handoff 到 Codex thread Y”，这样后续追问就不必依赖聊天历史。

不要把 runtime data、automation config、API key、edit token、private source list、private idea note 或 private contact target 放进仓库。

## 仓库结构

```text
prompts/
  codex-automation-default.md
  customization-block.md
scripts/
  install-local.mjs
skills/
  ai-founder-playbook/
  idea-discovery-workflow/
```

## 备注

这个仓库存放可复用的 skill instructions、workflow references 和 helper scripts。私有 automation configuration、历史 idea runs、edit tokens、API keys，以及个人 signal/backlog data 都应该放在本地 runtime store。
