使用 `idea-discovery-workflow` skill 运行每日产品/开源项目 idea discovery；在判断、拷打和竞品核验处使用 `ai-founder-playbook`。

目标：按 3 个 AI-focused final bucket 产出最多 9 个值得继续想的 product/OSS ideas：`ai_oss` 最多 3 个、`ai_product` 最多 3 个、`ai_prosumer` 最多 3 个。`ai_oss` 包含 AI-native、agent、AI coding、AI workflow、AI infra、developer tooling、eval、security、protocol、high-star OSS；`ai_product` 必须是完整 AI workflow 产品，面向团队或专业用户，但不默认进入陌生垂直行业；`ai_prosumer` 必须是 founder、creator、researcher、student、independent developer 或其他用户能理解并反复使用的 AI 产品。最终输出必须是 AI-core 或 AI-native workflow 的完整产品/产品方向，或有明显 high-star 潜力的 GitHub OSS 项目。可以跑更多轮、花更多时间和 token 来补足质量，但不得降低标准凑数。

默认采用 thesis-first、imagination-led discovery：先生成 20-30 个高想象力 thesis，并覆盖 `ai_oss`、`ai_product`、`ai_prosumer` 三个 bucket；再把最强 thesis 转成 product/OSS idea sketches；最后才做 evidence sweep。Evidence 的作用是支持、挑战、否决或 sharpen idea，不是从抱怨帖机械生成小工具。不要把“一个用户吐槽 -> 一个 checker/Action/CLI”当成 final idea。

source modules 必须按 AI bucket 扩展：`ai_oss` 覆盖 Reddit、Hacker News、GitHub、Product Hunt、开发者论坛、issue tracker、changelog、官方 blog/release notes、package ecosystem、benchmark/eval/protocol 相关来源；`ai_product` 覆盖 AI 产品 launch、Product Hunt、定价页、help center、官方 docs/changelog、review site、comparison page、用户社区、平台公告和工作流替代方案；`ai_prosumer` 覆盖 App Store、Google Play、Chrome Web Store、Product Hunt 评论、YouTube demo 和评论、creator/founder/researcher/student/indie developer 社区、niche Reddit/HN、低星评论和可见 workaround。无法访问时标注“未覆盖/受限”，不要用更多 developer sources 替代 AI product/prosumer 覆盖，除非本轮明确只做 developer/OSS。

保留 source breadth，但不要回到固定关键词搜索：除非用户明确指定主题，不要先用 `MCP`、`Codex`、`AI coding agents`、`developer tools` 等固定关键词限定世界。若用户没有给主题，这些只能作为 thesis 灵感或 evidence sweep 的一部分。若 shell 可用，先运行 `scripts/idea-scout-kit.mjs` 生成 thesis-first 清单；只有当用户显式给出主题时，才把主题传给该脚本作为 thesis constraints 和 evidence queries。

必须先读取本地 evidence store 里的历史 idea/backlog，再把关键 theses、signals、ideas、claims、competitors、decisions 和 graph-like edges 追加进去。先复用已有可读 store：`${IDEA_MINER_HOME}`、`${CODEX_IDEA_DISCOVERY_HOME}`、`$HOME/.idea-miner`、`$HOME/.codex/data/idea-discovery`；不要因为默认路径不同而新建空历史。不要写入 token、secret、私有账户信息或不可公开内容。每个候选进入 final 前必须标注历史关系：`new`、`update_existing`、`duplicate_of`、`revives`、`merged_from`、`splits_from` 或 `adjacent_to`。纯重复或只有小证据增量的旧 idea 只能进入 backlog update / 重复驳回，不能包装成今日新 idea。

每个 serious idea 必须通过 Product Shape Gate、AI Relevance Gate 和 Promotion Gate。Product Shape 不是机械字段表，也不是人物故事；它必须让读者说清楚：这是什么产品/仓库载体，谁在什么任务里用，用户给它什么输入或权限，它产生什么核心对象/输出/状态，用户可以做什么动作，第一版只做哪条窄流程，以及为什么这是完整产品或 high-star OSS 而不是 prompt、checker、Action、wrapper、dashboard 或平台 hook 配方。若只能写出抽象产品名、市场名词、行业黑话，或者核心解释依赖“不是 X，而是 Y”，就先重写或 reject。Promotion Gate 分别判断 complete AI product path 和 high-star OSS path；`ai_oss` 可以走 high-star OSS 或完整产品路径，`ai_product` 和 `ai_prosumer` 默认必须走完整 AI 产品路径。

必须同时保存 handoff-ready run artifacts：完整报告 `runs/<run_id>/report.md`、独立读者检查 `runs/<run_id>/reader-review.md` 或 `reader-review.json`、补搜候选账本 `runs/<run_id>/candidate-ledger.jsonl`、来源摘要 `runs/<run_id>/source-notes.jsonl`、每个 final idea 的 `runs/<run_id>/ideas/<idea_id>.json` 和 `runs/<run_id>/ideas/<idea_id>.md`、以及 `runs/<run_id>/handoff-index.md`。只有强但卡在一个明确未解决问题上的 paused idea 才保存 dossier；弱 idea、内部小工具、薄 wrapper、Action-only/CI-only、平台 hook 配方和被 veto 的方向只在报告里写 death note，不保存成后续工作。

最终报告和每个 final idea dossier 必须围绕 Idea Spine / Product Shape 写成短产品说明，不要写成故事小剧场，也不要写成机械字段清单。报告必须让一个没参与挖掘的人只读报告也能说清楚这个 idea 是什么产品或 repo、核心对象是什么、输入输出是什么、第一版边界是什么、为什么不是薄包装。Reader Check 必须由单独 Report Reader 完成：它只能读最终报告，不能读 source notes、dossiers、chat history 或内部 scratchpad；它要逐个 idea 写出“我理解它是什么 / 载体和目标用户 / 核心对象 / 输入或权限 / 输出或状态 / 用户动作 / 第一版边界 / 为什么不是 prompt、checker、Action 或 wrapper / 还不清楚的地方 / verdict pass|rewrite|reject”。如果 reader 说不清产品形态，先重写或移出 final。若 shell 可用，artifact 落盘后运行 `node skills/idea-discovery-workflow/scripts/check-run-artifacts.mjs <run_dir>`；失败就修 artifacts 并重跑，不能把 artifact check failed 的 run 当正常成功。

最终报告必须是中文可读的产品说明。必要的专有名词、真实产品名、仓库名和常见技术缩写可以保留英文；非常见英文术语、临时发明的协议名/对象名、以及不显然的领域短语，第一次承担解释作用时必须加中文括注或用一句中文解释清楚。Reader Check 必须单独判断中文读者是否能读懂这些术语；如果只能靠英文对象名列表复述 idea，verdict 必须是 rewrite。

必须联网或使用可用实时工具核验所有当前性、竞品、市场和来源判断。无法访问某信息源时，明确标注“未覆盖/受限”，不要编造。不要把热闹话题、viral 帖、单个抱怨、单个产品新闻或“AI 能做出来”直接当成机会。Evidence 用来刹车和 sharpen，不用来压低想象力。

若当前环境提供真实 sub-agent / multi-agent 工具，就实际创建并调度；尤其 Report Reader 应尽量作为独立 agent/session 执行。否则模拟角色并在报告和 reader-review 里说明。

最终中文输出，严格使用 `idea-discovery-workflow` 的固定报告格式，并按 `ai_oss`、`ai_product`、`ai_prosumer` 分桶。完整报告必须作为普通 Markdown 正文输出，放在任何宿主环境控制块之前。不要因为总数已经有 3 个 idea 就停止；停止条件是每个 bucket 满 3 个，或每个 underfilled bucket 都完成 bucket-specific replenish proof 并通过 checker。若某个 bucket 第一轮找不到 3 个过线 idea，必须根据 kill reasons 换 thesis seed、AI-era capability shift、产品 archetype、product form、core object、repo/product asset、target user、source module 继续补源；若最终仍不足 3 个，必须用 `candidate-ledger.jsonl` 证明该 bucket 的补搜轮次和 kill reasons，不得降低标准凑数。报告末尾必须写明 artifact 保存路径；如果保存失败，要明确说明失败原因。
