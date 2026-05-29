# Launch Distribution

用于用户要发布、推广、写发帖文案、做 Product Hunt / Show HN / Reddit / GitHub / X / LinkedIn launch，或想把一个商业产品/开源项目推给第一批真实用户时。

目标不是“帮用户到处发广告”，而是把项目包装成对应社区愿意讨论的东西：具体、有用、诚实、有边界，并且不像 AI 营销稿。

## 启动前分流

先判断目标类型，再选渠道和叙事。

| 目标类型 | 主要目标 | 证据指标 | 发布重点 |
|---|---|---|---|
| **商业产品** | waitlist、试用、收入、销售线索、反馈电话 | signup、demo booking、trial activation、付费意向、渠道转化 | 痛点、ROI、可信案例、明确 CTA |
| **开源影响力项目** | stars、安装、fork、issue、PR、生态引用、开发者口碑 | stars/forks、install、downloads、issue、PR、教程、HN/Reddit 推荐 | README、5 分钟 demo、技术新意、对比、可贡献点 |
| **混合型** | 开源 adoption + hosted/cloud/enterprise 转化 | stars/downloads + hosted signup、enterprise lead、support/插件需求 | 开源诚意、商业边界、迁移路径、信任 |

不要把开源项目硬写成 SaaS 广告，也不要把商业产品伪装成“开源分享”来绕过社区规则。

## 发布前 readiness gate

没有过 gate 就先补基础，不急着发。

商业产品至少准备：

- 一句话定位：给谁、在什么场景、把什么痛点变成什么结果。
- 可访问链接：landing page、demo、waitlist、trial 或预约入口。
- 核心截图/视频：能让陌生人 30 秒内懂，不靠长文解释。
- 可信证据：用户反馈、样例输出、节省时间/成本、beta 数据、案例或明确限制。
- CTA：只选一个主动作，不要同时让人注册、加群、约电话、看文档。
- 基础追踪：来源参数、signup/demo/activation 记录。

开源项目至少准备：

- README：一句话定位、安装命令、30 秒 demo、常见用例、对比/替代方案、限制。
- Repo hygiene：license、topics、release、example、issue 模板；若希望贡献，准备 `CONTRIBUTING` 或 good first issues。
- Aha moment：用户 5 分钟内能跑通一个真实例子。
- 维护边界：支持范围、roadmap、breaking change 态度。
- 分发目标：star、install、issue、PR、生态引用还是后续商业化，不要混在一起。

## 渠道选择

按 fit 选 1-3 个主渠道，不要同一天把同一段文案复制到所有地方。

| 渠道 | 适合 | 不适合 | 主要风险 |
|---|---|---|---|
| **Hacker News / Show HN** | 技术新意、开发者工具、开源项目、可试玩 demo、坦诚 build story | 泛 SaaS 广告、没有 demo、夸大 AI 能力 | 被质疑 hype、隐私/安全、定价、已有替代 |
| **Reddit** | 明确 subreddit、能回答当前 thread、能提供实用经验或数据 | 冷启动硬广、跨多个社区复制粘贴 | 自推、违反规则、AI 口吻、link 过早 |
| **GitHub** | 开源项目、开发者工具、库、CLI、模板、awesome list、release | 没有可运行代码、README 薄、只是产品广告 | star 虚高但没人用、issue 支持失控 |
| **Product Hunt** | 可视化强、普通用户能试、maker 社区会懂、有 launch 资产 | 纯开发库、必须销售电话才懂、企业采购长周期 | 一日流量、无留存、支持网络太弱 |
| **X / Twitter** | founder voice、build in public、短观点、demo clip、回复相关讨论 | 只有链接、没有观点、没有现有受众 | 噪音大，viral 不等于需求 |
| **LinkedIn** | B2B、职业身份明确、数据/案例/创始人故事、行业痛点 | 太技术的库、匿名或玩梗项目 | 变成公司通稿或 AI 鸡汤 |

## 通用流程

1. **目标类型**：商业产品 / 开源影响力项目 / 混合型。
2. **发布目标**：只选一个主目标：feedback、stars、installs、trial、waitlist、paid pilot、contributors、sales call。
3. **受众和场景**：写清楚谁会在什么工作流里关心。
4. **外部扫描**：如果要发 HN/Reddit/GitHub/Product Hunt/X/LinkedIn，先查相似发布、相关讨论、社区规则、竞品反应和近期热点。
5. **渠道排序**：给 fit、风险、准备成本、预期指标，选 1-3 个主渠道。
6. **叙事骨架**：一句话 angle，不同渠道改写，不能复制粘贴。
7. **发帖包**：每个渠道输出发帖角度、社区规则、标题、正文、首评/补充评论、评论回复库、风险等级、人工发布 checklist。
8. **去 AI 味 pass**：所有正文和回复都必须过“社区真人口吻”检查。
9. **人工发布**：默认只给可粘贴草稿和 checklist；除非用户明确要求并最终确认，不要代发。

## 渠道细则

### Hacker News / Show HN

适合商业产品里的技术 demo、开发者工具和开源项目。正文要短、清楚、可验证。

- 标题：`Show HN: <name> - <plain description>` 或 `Show HN: I built <specific tool> for <specific workflow>`。
- 角度：技术新意、反直觉发现、开源实现、真实限制、从用户痛点来的小工具。
- 首评：创始人补充背景、为什么做、当前状态、限制、想听哪类反馈。
- 回复库：提前准备 privacy/security、pricing/open-source、why not existing tool、accuracy/reliability、maintenance、roadmap。
- 避免：marketing headline、emoji、夸张 ROI、过度“AI-powered”、空泛愿景。
- 风险：技术受众会直接拷打实现、隐私、安全、成本、开源诚意和已有替代。

### Reddit

优先找 live thread 回复，其次才写 standalone post。每个 subreddit 都要读规则。

- 先分类：`Promote`（允许展示）/ `Contribute-first`（先回答问题）/ `Listen-only`（只调研不发）。
- 评论角度：先回答 OP 的问题，再给一个具体经验/数据/限制，链接放后面且可不放。
- 字数：评论通常控制在 250 字以内；standalone post 只在社区规则允许且内容本身有价值时写。
- 避免开头：`Great question`、`As someone who`、`I actually built`、`Excited to share`。
- 避免行为：多个 subreddit 同文复制、第一句就贴链接、假装普通用户、隐藏利益关系。
- 风险：Reddit 对自推和 AI 味高度敏感，高风险社区宁可只做调研。

### GitHub

GitHub 的“推广”首先是 repo 产品化，不只是发帖。

- 必备：README、demo gif/terminal cast、install、quickstart、examples、topics、license、release notes、issues。
- 开源发布角度：解决一个窄开发者问题、替代付费闭源工具、接手停更生态位、把复杂工作流变成 5 分钟 demo。
- 可发布位置：GitHub release、Discussions、awesome list PR、相关 issue 中的谨慎回复、个人 profile、README badges。
- 标题/文案：直接描述 repo 做什么，不写创业愿景。
- 回复库：installation error、license、comparison、roadmap、maintainer bandwidth、contribution scope。
- 风险：star 多但安装少、README 承诺过度、issue 支持超出维护能力。

### Product Hunt

Product Hunt 是 launch event，不是 PMF 证明。适合有清楚截图、可试用入口和 maker story 的产品。

- 资产包：tagline、description、gallery、demo video、maker comment、first comment、FAQ、supporter list。
- 角度：用户能立刻试的具体价值，创始人为什么做，今天希望大家测试什么。
- 评论：maker comment 讲背景和限制；first comment 引导反馈，不要只喊 upvote。
- 准备：账号预热、早期用户通知、站点抗流量、support rota、launch day tracking。
- 风险：一天流量后无留存；适合收集反馈和社会证明，但不能替代长期渠道。

### X / Twitter

适合观点、demo clip、build-in-public、快速测试 positioning。

- 形式：短帖、thread、demo video、reply to relevant conversations。
- 角度：一个具体痛点、一个反直觉发现、一个前后对比、一个小 demo。
- 语气：短、直接、有个人判断；少 hashtag，不要 emoji 墙，不要企业口吻。
- 回复库：用事实和限制回答，不和路人争论价值观。
- 风险：噪音高，单条爆不等于有效需求；要看点击、试用、star/install、后续对话。

### LinkedIn

适合 B2B、创始人故事、行业数据、案例、招聘/合作、beta 试点。

- 开头：用一个具体事实、观察或场景换取展开，不要 `Excited to share`。
- 结构：短段落，链接靠后，2-3 个精准 hashtag 足够。
- 角度：为什么这个工作流现在值得重做、学到的客户事实、一次 demo/试点结果、公开限制。
- 图片：最好有截图、流程图、数据图或 demo，不用抽象插图。
- 风险：太像公司通稿、AI 鸡汤或“创始人感悟模板”会被滑走。

## 去 AI 味强制 pass

所有草稿交付前做一轮“人味/社区味”重写。目标不是装成口语，而是删掉模型写作的统计指纹。

必须删除或重写：

- 空泛营销词：game-changing、seamless、unlock、revolutionary、powerful、robust、cutting-edge、transform、supercharge。
- AI 套话：delve、landscape、leverage、it is worth noting、in today's fast-paced world、whether you're、not just X but Y。
- 公式结构：三段式排比、每段同长度、结尾金句、过度整齐的 bullet、先夸后转折。
- 假亲近：`Great question`、`As someone who...`、`I couldn't agree more`、`Excited to share`。
- 过度符号：emoji、em dash、粗体强调、hashtag 墙、标题党冒号。
- 远距离旁白：`users struggle with` 这种泛称，改成具体人、具体场景、具体动作。
- 没有代价的承诺：省多少时间、提高多少准确率、替代什么流程，必须有证据或改成假设。

应该加入：

- 具体对象：谁、在哪个工具/流程、什么输入、什么输出。
- 真实限制：现在还不能做什么、为什么、欢迎哪类反馈。
- 个人判断：为什么你选这个切口，放弃了什么更大但更虚的范围。
- 社区语气：HN 朴素直接；Reddit 先帮忙后链接；X 有观点；LinkedIn 有事实和场景；GitHub 让 README 说话。
- 不完美节奏：短句和中句混用，少一点整齐，多一点自然取舍。

交付草稿时给一个 AI 味自检：

```markdown
去 AI 味检查：
- AI 味等级：低 / 中 / 高
- 已删除的套话：
- 仍可能显得营销的地方：
- 平台口吻是否匹配：
```

## 输出模板

```markdown
发布结论：适合现在发 / 先补 readiness / 暂缓发布
目标类型：商业产品 / 开源影响力项目 / 混合型
发布目标：feedback / stars / installs / waitlist / trial / paid pilot / contributors / sales call
主叙事：一句话 angle

渠道选择：
| 渠道 | 是否建议 | 为什么 | 风险等级 | 发布前缺口 | 成功指标 |
|---|---|---|---|---|---|

渠道包：

## HN / Reddit / GitHub / Product Hunt / X / LinkedIn
发帖角度：
社区规则/平台注意：
标题候选：
正文：
首评/补充评论：
评论回复库：
| 可能评论/质疑 | 回复草稿 |
|---|---|
风险等级：低 / 中 / 高
去 AI 味检查：
人工发布 checklist：
- 链接、截图、demo、UTM/来源记录已确认
- 社区规则已读，利益关系不隐藏
- 首小时有人值守回复
- 负面反馈记录到产品/开源 issue
- 24 小时后复盘 clicks/signups/stars/installs/replies

7 天跟进：
1. ...
2. ...
3. ...
```

## 风险等级口径

- **低**：自有渠道、GitHub release、个人 X/LinkedIn、已有社区关系、明确允许 self-promo。
- **中**：Show HN、Product Hunt、相关 Reddit thread 中的克制回复、awesome list PR。
- **高**：陌生 subreddit standalone post、多个社区复制同文、未披露利益关系、没有 demo 的硬广、AI 味明显的长帖。

风险高不代表不能发，但必须降低动作强度：先评论、先问反馈、先贡献答案、先补 repo/landing page，再考虑正式发布。
