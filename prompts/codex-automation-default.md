使用 `idea-discovery-workflow` skill 运行每日产品/开源项目 idea discovery；在判断、拷打、竞品核验和最短证据路径处使用 `ai-founder-playbook`。

目标：产出最多 3 个值得继续想的 product/OSS bets。默认偏向 AI-native、agent、AI coding、AI workflow、AI infra、developer tooling for AI era。最终输出必须是 AI 相关的完整产品/产品方向，或有明显 high-star 潜力的 GitHub OSS 项目。非 AI idea 只有在完整产品性或开源传播潜力显著强于普通机会时才可破例。可以跑更多轮、花更多时间和 token 来补足质量，但不得降低标准凑数。

默认采用 thesis-first、imagination-led discovery：先生成 20-30 个高想象力 thesis，再把最强 thesis 转成 product/OSS bet sketches，最后才用 Reddit、Hacker News、X/Twitter、GitHub、Product Hunt、开发者论坛、issue tracker、changelog、review site、博客、搜索引擎、官方 blog/release notes 和产品新闻源做 evidence sweep。Evidence 的作用是支持、挑战、否决或 sharpen bet，不是从抱怨帖机械生成小工具。不要把“一个用户吐槽 -> 一个 checker/Action/CLI”当成 final idea。

保留 source breadth，但不要回到固定关键词搜索：除非用户明确指定主题，不要先用 `MCP`、`Codex`、`AI coding agents`、`developer tools` 等固定关键词限定世界。若用户没有给主题，这些只能作为 thesis 灵感或 evidence sweep 的一部分。若 shell 可用，先运行 `scripts/idea-scout-kit.mjs` 生成 thesis-first 清单；只有当用户显式给出主题时，才把主题传给该脚本作为 thesis constraints 和 evidence queries。

必须先读取本地 evidence store 里的历史 idea/backlog，再把关键 theses、signals、ideas、claims、competitors、decisions 和 graph-like edges 追加进去。优先复用已有可读 store：`${IDEA_MINER_HOME}`、`${CODEX_IDEA_DISCOVERY_HOME}`、`$HOME/.idea-miner`、`$HOME/.codex/data/idea-discovery`；不要因为默认路径不同而新建空历史。不要写入 token、secret、私有账户信息或不可公开内容。每个候选进入 final 前必须标注历史关系：`new`、`update_existing`、`duplicate_of`、`revives`、`merged_from`、`splits_from` 或 `adjacent_to`。纯重复或只有小证据增量的旧 idea 只能进入 backlog update / 重复驳回，不能包装成今日新 bet。

每个 serious bet 必须通过 Promotion Gate：标注 AI 相关性（`AI-core`、`AI-native workflow`、`AI-leveraged`、`non-AI exceptional`、`non-AI reject`），并判断它是不是完整产品或 high-star OSS。默认 final 只收 `AI-core` 或 `AI-native workflow`；`AI-leveraged` 必须证明 AI 不是只写总结、PR comment 或配置转换；`non-AI exceptional` 必须强到可以破例。`GitHub Action`、CI gate、PR comment、template、hook、checklist、thin wrapper、平台 changelog 补丁、一次性脚本都不能作为 final idea 本体，只能作为更大产品/OSS 的 integration surface。

必须同时保存 handoff-ready run artifacts：完整报告 `runs/<run_id>/report.md`、来源摘要 `runs/<run_id>/source-notes.jsonl`、每个 final idea 的 `runs/<run_id>/ideas/<idea_id>.json` 和 `runs/<run_id>/ideas/<idea_id>.md`、以及 `runs/<run_id>/handoff-index.md`。只有强但被明确证据缺口卡住的 paused idea 才保存 dossier；弱 idea、内部小工具、薄 wrapper、Action-only/CI-only、平台 hook 配方和被 veto 的方向只在报告里写 death note，不保存成后续工作。每个 idea dossier 要包含核心 thesis、AI 相关性、Promotion Gate 结果、30 秒 demo、repo/star 资产、原始来源链接、来源支持或反驳了什么 claim、竞品/替代判断、Red Team 记录、CEO 裁决、MVP 边界、最短证据路径和停止线。

最终报告和每个 final idea dossier 必须通过 Reader Clarity Gate：一个没有参与挖掘的人只读报告也能说清楚核心 thesis、AI 相关性、产品形态、目标用户、使用时刻、输入、系统动作、输出、替代的手工动作、为什么现有替代不够、30 秒 demo、repo/star 资产、为什么不是 Action/小工具、最短证据路径和停止线。如果说不清，先重写或降级该 idea，不要把抽象方向、Action、CI gate、PR comment、checker、wrapper 或平台补丁当成 final idea。若 shell 可用，artifact 落盘后运行 `node skills/idea-discovery-workflow/scripts/validate-run-artifacts.mjs <run_dir>`；失败就修 artifacts 并重跑，不能把 validator failed 的 run 当正常成功。

必须联网或使用可用实时工具核验所有当前性、竞品、市场和来源判断。无法访问某信息源时，明确标注“未覆盖/受限”，不要编造。不要把热闹话题、viral 帖、单个抱怨、单个产品新闻或“AI 能做出来”直接当成机会。Evidence 用来刹车和 sharpen，不用来压低想象力。

若当前环境提供真实 sub-agent / multi-agent 工具，就实际创建并调度；否则模拟角色并在报告里说明。

最终中文输出，严格使用 `idea-discovery-workflow` 的固定报告格式。完整报告必须作为普通 Markdown 正文输出，放在任何宿主环境控制块之前。若第一轮找不到 3 个过线 bet，必须根据 kill reasons 换 thesis seed、AI-era capability shift、产品 archetype、demo moment、repo asset、ICP、source module 继续补源；若最终仍不足 3 个，说明 underfilled 原因和已跑轮次，不得降低标准凑数。报告末尾必须写明 artifact 保存路径；如果保存失败，要明确说明失败原因。
