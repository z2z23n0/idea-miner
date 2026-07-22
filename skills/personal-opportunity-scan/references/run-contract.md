# Run Contract

## 搜索顺序

每轮按候选逐个完成证据闭环，不要先堆一长串国外产品再凭印象筛选。

1. **发现海外原型**：从 Product Hunt、App Store、Chrome Web Store、Reddit/HN 讨论、科技媒体或垂直产品目录发现候选。
2. **核验海外验证**：回到产品官网、定价页、官方公告、应用商店评论/下载、融资公告或可信第三方报道。把“官方自报”和独立信号分开理解。
3. **核验源码状态**：搜索产品官方 GitHub、`open source`、self-hosted alternative 和许可证。原产品或成熟替代已经开源且个人能直接使用时淘汰。
4. **核验中国直接近邻**：至少使用两类中国侧来源，例如中文搜索 + 中国区应用商店、GitHub/Gitee + 官方产品页、平台入口 + 政府数据。找到成熟直接替代时淘汰。
5. **写清本地化抓手**：必须落到具体平台、数据、规则、设备或习惯，不能只写“更懂中文用户”。

实时检索不可用时要明确停止该候选，不得用旧记忆或空结果断言“国内没有”。

## 证据最低要求

每个 final 至少包含：

- 1 个海外产品官方链接；
- 1 个海外验证链接；
- 1 个能支持其闭源/商业状态的链接；
- 2 个来自不同中国侧入口的直接竞品核验链接；
- 一段可复述的个人任务闭环；
- 一个具体本地化抓手；
- 一个小团队第一版边界。

外包任务、产品目录、搜索摘要、媒体转述都不能单独承担“市场已验证”或“国内没有竞品”的结论。

## 运行 JSON

最终候选与关键淘汰项写成：

```json
{
  "run_id": "run_YYYY-MM-DD_HHmm",
  "opportunities": [
    {
      "title": "个人工具名",
      "personal_task": "用户给它什么，它连续判断和执行什么，最后交付什么。",
      "ai_role": "AI 在核心闭环中承担什么。",
      "overseas_product": "海外产品名",
      "overseas_url": "https://...",
      "validation_signal": "可核验的使用、收入、融资、评论或持续运营信号。",
      "validation_url": "https://...",
      "source_status": "proprietary",
      "source_status_url": "https://...",
      "china_gap": "检查了哪些直接近邻，为什么仍未形成成熟替代。",
      "china_check_urls": ["https://...", "https://..."],
      "local_wedge": "中国平台、数据、规则、设备或习惯形成的独立价值。",
      "mvp_boundary": "第一版只完成什么，不做什么。"
    }
  ],
  "rejections": [
    {
      "candidate": "被淘汰的候选",
      "reason_code": "direct_open_source",
      "reason": "为什么没有通过硬门槛。",
      "url": "https://..."
    }
  ]
}
```

`source_status` 当前只接受 `proprietary`。如果源码状态无法确认，或者原产品/成熟替代已经开源，不能进入 final。

`reason_code` 使用以下之一：

- `direct_open_source`
- `mature_china_competitor`
- `enterprise_only`
- `translation_only`
- `weak_validation`
- `not_ai_core`
- `unbounded_mvp`
- `duplicate_or_adjacent`

当 final 少于 3 个时，`rejections` 至少要有 `3 - final 数量` 条，证明这是主动 underfilled，不是提前停止。

检查并记录：

```bash
node scripts/opportunity-store.mjs check /path/to/opportunities.json
node scripts/opportunity-store.mjs record /path/to/opportunities.json
```

## 最终写法

最终报告每个机会只保留决策所需信息：

```markdown
## 1. 名字

- **海外原型：** 产品名与一句验证信号。[产品](链接) · [验证](链接)
- **替个人完成：** 完整任务闭环。
- **国内空位：** 核验过的直接近邻与剩余空位。[核验 1](链接) · [核验 2](链接)
- **本地化抓手：** 具体平台、数据、规则、设备或习惯。
- **为什么值得做：** 第一版产品或开源替代的清楚边界。
```

不要写企业战略、长篇市场报告、技术架构或虚构 TAM。证据的作用是决定候选是否能留下，不是把结果写成咨询报告。
