使用 `idea-discovery-workflow` skill 运行每日产品/开源项目 idea discovery；在判断、拷打和竞品核验处使用 `ai-founder-playbook`。

目标：按 3 个 final bucket 产出最多 9 个值得继续想的 product/OSS ideas：`dev_oss` 最多 3 个、`vertical_b2b` 最多 3 个、`consumer_prosumer` 最多 3 个。`dev_oss` 包含 AI-native、agent、AI coding、AI workflow、AI infra、developer tooling、high-star OSS；`vertical_b2b` 必须是面向具体专业/运营/业务工作流的完整产品方向；`consumer_prosumer` 必须是面向普通用户、prosumer、creator、学生、家长、freelancer 或个人工作流的 app/product 方向。最终输出必须是 AI 相关的完整产品/产品方向，或有明显 high-star 潜力的 GitHub OSS 项目。非 AI idea 只有在完整产品性或开源传播潜力显著强于普通机会时才可破例。可以跑更多轮、花更多时间和 token 来补足质量，但不得降低标准凑数；不要用额外 dev/OSS idea 填补 vertical 或 consumer bucket。

默认采用 thesis-first、imagination-led discovery：先生成 20-30 个高想象力 thesis，并覆盖 `dev_oss`、`vertical_b2b`、`consumer_prosumer` 三个 bucket；再把最强 thesis 转成 product/OSS idea sketches；最后才做 evidence sweep。Evidence 的作用是支持、挑战、否决或 sharpen idea，不是从抱怨帖机械生成小工具。不要把“一个用户吐槽 -> 一个 checker/Action/CLI”当成 final idea。

source modules 必须按 bucket 扩展：`dev_oss` 覆盖 Reddit、Hacker News、X/Twitter、GitHub、Product Hunt、开发者论坛、issue tracker、changelog、官方 blog/release notes、package ecosystem 等；`vertical_b2b` 覆盖 G2、Capterra、TrustRadius、定价页、help center、行业论坛、垂直 subreddit、trade publication、job description、workflow template、case study、agency/manual service substitute 等；`consumer_prosumer` 覆盖 App Store、Google Play、Chrome Web Store、Product Hunt 评论、YouTube/TikTok demo 和评论、creator/student/parent/freelancer 社区、niche Reddit、comparison pages、低星评论和可见 workaround。无法访问时标注“未覆盖/受限”，不要用更多 developer sources 替代 vertical/consumer 覆盖。

保留 source breadth，但不要回到固定关键词搜索：除非用户明确指定主题，不要先用 `MCP`、`Codex`、`AI coding agents`、`developer tools` 等固定关键词限定世界。若用户没有给主题，这些只能作为 thesis 灵感或 evidence sweep 的一部分。若 shell 可用，先运行 `scripts/idea-scout-kit.mjs` 生成 thesis-first 清单；只有当用户显式给出主题时，才把主题传给该脚本作为 thesis constraints 和 evidence queries。

必须先读取本地 evidence store 里的历史 idea/backlog，再把关键 theses、signals、ideas、claims、competitors、decisions 和 graph-like edges 追加进去。先复用已有可读 store：`${IDEA_MINER_HOME}`、`${CODEX_IDEA_DISCOVERY_HOME}`、`$HOME/.idea-miner`、`$HOME/.codex/data/idea-discovery`；不要因为默认路径不同而新建空历史。不要写入 token、secret、私有账户信息或不可公开内容。每个候选进入 final 前必须标注历史关系：`new`、`update_existing`、`duplicate_of`、`revives`、`merged_from`、`splits_from` 或 `adjacent_to`。纯重复或只有小证据增量的旧 idea 只能进入 backlog update / 重复驳回，不能包装成今日新 idea。

每个 serious idea 必须通过 Bucket Fit Gate 和 Promotion Gate：标注 final bucket（`dev_oss`、`vertical_b2b`、`consumer_prosumer`）、bucket fit 理由、AI 相关性（`AI-core`、`AI-native workflow`、`AI-leveraged`、`non-AI exceptional`、`non-AI reject`），并分别判断 complete-product path 和 high-star-OSS path。`dev_oss` 可以走 high-star OSS 或完整产品路径；`vertical_b2b` 和 `consumer_prosumer` 默认必须走完整产品路径。`AI-leveraged` 必须证明 AI 不是只写总结、PR comment 或配置转换；`non-AI exceptional` 必须强到可以破例。`GitHub Action`、CI gate、PR comment、template、hook、checklist、thin wrapper、平台 changelog 补丁、一次性脚本都不能作为 final idea 本体，只能作为更大产品/OSS 的 integration surface。

必须同时保存 handoff-ready run artifacts：完整报告 `runs/<run_id>/report.md`、来源摘要 `runs/<run_id>/source-notes.jsonl`、每个 final idea 的 `runs/<run_id>/ideas/<idea_id>.json` 和 `runs/<run_id>/ideas/<idea_id>.md`、以及 `runs/<run_id>/handoff-index.md`。只有强但卡在一个明确未解决问题上的 paused idea 才保存 dossier；弱 idea、内部小工具、薄 wrapper、Action-only/CI-only、平台 hook 配方和被 veto 的方向只在报告里写 death note，不保存成后续工作。每个 idea dossier 要包含：final bucket、bucket fit 理由、一句话、具体使用场景、产品到底是什么、今天怎么解决、关键洞察、为什么现在值得做、现有替代与缺口、第一个版本怎么切、如果做成会积累什么、最大风险、我的判断、原始来源链接、来源支持或反驳了什么 claim、竞品/替代判断、Red Team 记录、CEO 裁决。

最终报告和每个 final idea dossier 必须通过 Reader Check：一个没有参与挖掘的人只读报告也能说清楚这个 idea 给谁用、什么时候用、打开后看到什么、它替代了什么旧做法、为什么现在值得看、现有替代缺什么、第一个版本怎么切、长期资产是什么、最大风险是什么。如果说不清，先重写或降级该 idea，不要把抽象方向、Action、CI gate、PR comment、checker、wrapper 或平台补丁当成 final idea。若 shell 可用，artifact 落盘后运行 `node skills/idea-discovery-workflow/scripts/check-run-artifacts.mjs <run_dir>`；失败就修 artifacts 并重跑，不能把 artifact check failed 的 run 当正常成功。

必须联网或使用可用实时工具核验所有当前性、竞品、市场和来源判断。无法访问某信息源时，明确标注“未覆盖/受限”，不要编造。不要把热闹话题、viral 帖、单个抱怨、单个产品新闻或“AI 能做出来”直接当成机会。Evidence 用来刹车和 sharpen，不用来压低想象力。

若当前环境提供真实 sub-agent / multi-agent 工具，就实际创建并调度；否则模拟角色并在报告里说明。

最终中文输出，严格使用 `idea-discovery-workflow` 的固定报告格式，并按 `dev_oss`、`vertical_b2b`、`consumer_prosumer` 分桶。完整报告必须作为普通 Markdown 正文输出，放在任何宿主环境控制块之前。若某个 bucket 第一轮找不到 3 个过线 idea，必须根据 kill reasons 换 thesis seed、AI-era capability shift、产品 archetype、demo/product moment、repo/product asset、ICP、source module 继续补源；若最终仍不足 3 个，说明该 bucket underfilled 原因和已跑轮次，不得降低标准凑数。报告末尾必须写明 artifact 保存路径；如果保存失败，要明确说明失败原因。
