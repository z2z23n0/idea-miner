# Source Map

这个 skill 是方法论合成，不是原文摘要。不要在回答里大段引用来源；需要引用时只用短句，并优先转述。

## 核心来源

- Anthropic / Claude Founder's Playbook, 2026
- 官方 CDN PDF：https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/69fe2a55b93bb0732b1fe33c_The-Founders-Playbook-05062026_v3%20(1).pdf

Playbook 的核心抽象：

- 四阶段：Idea、MVP、Launch、Scale。
- 主线：AI 压缩构建和运营周期，但验证、判断、信任和系统化更重要。
- 关键风险：把构建当验证、过早扩张、确认偏误、AI 技术债、虚假 PMF、零摩擦 scope creep、安全/合规延后、创始人成为瓶颈。

## 外部融合来源

- 已存在的同类 skill：`https://github.com/xiang-lee/ai-native-startup-founder-playbook`
  - 参考点：把 playbook 做成 agent 可执行的阶段诊断、证据缺口、反方验证和下一 sprint 计划。
  - 不要直接复制其正文；只沿用“可触发、可执行、可复盘”的 skill 结构思想。
- YC Requests for Startups：`https://www.ycombinator.com/rfs`
  - 参考点：到 2026 年，AI 更像基础设施和重构机会，而不是单个 feature；看行业工作流如何被 AI 重做。
- a16z Big Ideas 2026 Part 1：`https://a16z.com/newsletter/big-ideas-2026-part-1/`
  - 参考点：agentic workflow 需要可靠上下文、语义层、数据新鲜度和机器可读接口；企业 AI 的瓶颈经常是数据和流程，不只是模型。
- Bessemer Venture Partners, The AI Pricing Playbook for Founders, 2026：`https://www.bvp.com/assets/uploads/2026/02/The_AI_pricing_playbook_for_founders_Bessemer_Venture_Partners_2026.pdf`
  - 参考点：AI 产品毛利、收费指标、copilot/agent/service 类型、混合定价、ROI 叙事和成本风险。
- Kappaemme-git / `codex-startup-pressure-test-skill`：`https://github.com/Kappaemme-git/codex-startup-pressure-test-skill`
  - 参考点：强/弱/转向 verdict、fatal flaws、problem validation、早期真实证据路径、2 周 MVP。
- OpenClaw `solo-validate`：`https://playbooks.com/skills/openclaw/skills/solo-validate`
  - 参考点：truth-first validation、S.E.E.D. niche check、Devil's Advocate inversion、go/kill/pivot、dead startup / competitor failure 搜索、单位经济压力测试。
- OpenClaw `saas-idea-discovery`：`https://playbooks.com/skills/openclaw/skills/saas-idea-discovery`
  - 参考点：用 Reddit/HN 抱怨模式挖 micro-SaaS idea、0-100 评分、去重、每周机会流总结。
- mvanhorn / `last30days-skill`：`https://github.com/mvanhorn/last30days-skill`
  - 参考点：跨 Reddit、X/Twitter、YouTube、TikTok、Hacker News、Polymarket、GitHub、web 的近 30 天真实讨论与参与度研究。
- MRRScout：`https://mrrscout.com/`
  - 参考点：把 Product Hunt、HN、GitHub Trending、新域名和早期产品作为 product/news feed，辅助发现 niche 与早期 traction。只借鉴“多源产品信号”模式，不把其评分当事实。
- Affivora：`https://affivora.com/`
  - 参考点：从 Reddit、G2、Capterra、HN、Product Hunt 等来源做 SaaS niche discovery 和验证。只借鉴评论/竞品/社区组合方法；实际结论仍要重新搜索核验。
- shawnpang / `startup-founder-skills`：`https://github.com/shawnpang/startup-founder-skills`
  - 参考点：competitive-analysis、review-mining、daily-product-digest 的竞品、评论、社区趋势扫描流程。
- coreyhaines31 / `marketingskills`：`https://github.com/coreyhaines31/marketingskills`
  - 参考点：launch、social、community-marketing、directory-submissions。融合为 Owned/Rented/Borrowed 渠道判断、社区优先、launch readiness、社交平台内容骨架。
- shawnpang / `startup-founder-skills` launch 相关 skills：`https://github.com/shawnpang/startup-founder-skills`
  - 参考点：launch-strategy、community-discovery、founder-thought-leadership。融合为社区发现、推广容忍度分级、X/LinkedIn founder voice 和 launch sequence。
- ognjengt / `founder-skills`：`https://github.com/ognjengt/founder-skills`
  - 参考点：product-hunt-launch-plan、marketing-ideas。融合为 Product Hunt 资产包、支持网络、发售准备度和营销 idea 评分。
- michaelboeding / `skills` cmo-agent：`https://github.com/michaelboeding/skills`
  - 参考点：跨 SEO、Reddit、HN、X 的 CMO agent 输出。融合为 Reddit 线程、HN post、tweet thread、7 天 calendar、竞品跟踪和 Effort/Impact/Risk 优先级。
- gooseworks-ai / `goose-skills`：`https://github.com/gooseworks-ai/goose-skills`
  - 参考点：hacker-news-scraper、product-hunt-scraper、reddit-post-finder、social-kit、feature-launch-playbook。融合为 HN/PH/Reddit 信号扫描、feature launch 文案包和 X/LinkedIn 社交变体。
- aaronjmars / `aeon`：`https://github.com/aaronjmars/aeon`
  - 参考点：show-hn-draft、product-hunt-launch、write-tweet。融合为 Show HN 草稿、Product Hunt tagline/first comment/maker comment、X 短帖和 thread 变体。
- yoyothesheep / `claude-skills` distribute-social：`https://github.com/yoyothesheep/claude-skills`
  - 参考点：Reddit live thread 评论、LinkedIn 发布格式、人工粘贴发布和反 AI 口吻限制。融合为 Reddit 先贡献后链接、LinkedIn 链接靠后、社区规则与人工发布 checklist。
- jpeggdev / `humanize-writing`：`https://github.com/jpeggdev/humanize-writing`
  - 参考点：8-pass 去 AI 写作检查，包括公式结构、夸大意义、AI 词汇、节奏、hedging、连接词和人味。
- hardikpandya / `stop-slop`：`https://github.com/hardikpandya/stop-slop`
  - 参考点：删 filler、打破公式结构、主动语态、具体化、少 em dash、节奏变化和 trust readers。
- blader / `humanizer`：`https://github.com/blader/humanizer`
  - 参考点：识别 AI 生成文案的常见模式，并在不损失含义的前提下重写成更有人味的表达。

## 使用提醒

- 若用户要评估当下机会，必须重新搜索竞品、价格、法规、融资/平台变化。
- 若用户要求 Twitter/X、HN、GitHub、Reddit、Product Hunt 或评论站扫描，不要只用 playbook 判断；必须给外部信号和搜索边界。
- 若用户只给一句 idea，先输出初判和最高杠杆问题，不要编造市场事实。
- 若用户要“像投资人一样看”，要同时看市场、团队、分发、商业模式和可防守性。
