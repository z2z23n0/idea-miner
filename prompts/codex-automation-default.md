使用 `idea-discovery-workflow` skill 运行每日产品/开源项目 idea 挖掘；在判断、拷打、竞品核验和最短证据路径处使用 `ai-founder-playbook`。

目标：从当前可用的 Reddit、Hacker News、X/Twitter、GitHub、Product Hunt、开发者论坛、issue tracker、changelog、review site、博客、搜索引擎、官方 blog/release notes 和产品新闻源里，发现最新、真实、可验证的需求、痛点、生态变化、竞品缺口和未满足场景，并尽量产出 3 个过线 idea。可以跑更多轮、花更多时间和 token 来补足质量，但不得降低标准凑数。

按 `idea-discovery-workflow` 的 workflow、role contracts、source policy、memory schema 和 report format 执行。若 shell 可用，先运行该 skill 的 `scripts/idea-scout-kit.mjs` 生成查询清单；若本地 evidence store 未初始化，可运行 `scripts/init-store.mjs`。

必须把关键 signals、ideas、claims、competitors、decisions 和 graph-like edges 追加到本地 evidence store（默认 `${IDEA_MINER_HOME:-$HOME/.idea-miner}`，兼容旧的 `CODEX_IDEA_DISCOVERY_HOME`）。不要写入 token、secret、私有账户信息或不可公开内容。

必须同时保存 handoff-ready run artifacts：完整报告 `runs/<run_id>/report.md`、来源摘要 `runs/<run_id>/source-notes.jsonl`、每个 final idea 的 `runs/<run_id>/ideas/<idea_id>.json` 和 `runs/<run_id>/ideas/<idea_id>.md`、以及 `runs/<run_id>/handoff-index.md`。只有强但被明确证据缺口卡住的 paused idea 才保存 dossier；弱 idea、内部小工具、薄 wrapper、平台 hook 配方和被 veto 的方向只在报告里写 death note，不保存成后续工作。每个 idea dossier 要包含原始来源链接、来源支持了什么 claim、竞品/替代判断、Red Team 记录、CEO 裁决、MVP 边界、最短证据路径和停止线。以后用户要求 handoff 时，默认应读取这些 artifact，不重新做搜索；只有用户明确要求刷新当前状态时才联网补查。

必须联网或使用可用实时工具核验所有当前性、竞品、市场和来源判断。无法访问某信息源时，明确标注“未覆盖/受限”，不要编造。不要把热闹话题、viral 帖、单个抱怨、单个产品新闻或“AI 能做出来”直接当成机会。

若当前环境提供真实 sub-agent / multi-agent 工具，就实际创建并调度；否则模拟角色并在报告里说明。

最终中文输出，严格使用 `idea-discovery-workflow` 的固定报告格式。完整报告必须作为普通 Markdown 正文输出，放在任何宿主环境控制块之前。若第一轮找不到 3 个过线 idea，必须根据 kill reasons 扩源/换关键词/换 ICP/换产品形态继续补源；若最终仍不足 3 个，说明 underfilled 原因和已跑轮次，不得降低标准凑数。报告末尾必须写明 artifact 保存路径；如果保存失败，要明确说明失败原因。
