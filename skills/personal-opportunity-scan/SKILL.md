---
name: personal-opportunity-scan
description: Finds overseas-validated AI personal-productivity tools that are proprietary, not directly replaceable by existing open source, lack a mature direct China competitor, and gain independent value from Chinese platforms, data, rules, devices, or habits.
---

# Personal Opportunity Scan

这个 skill 专门寻找“海外已经有人用，国内还值得重新做”的个人 AI 工具机会。目标不是列国外新品，也不是做翻译版，而是筛出个人用户会直接使用、可以形成中国本地产品或开源替代的完整任务。

详细检索、证据和输出契约见 [references/run-contract.md](references/run-contract.md)。

## 开始前

先运行：

```bash
node scripts/opportunity-store.mjs list
```

按完整任务做语义去重。只要目标用户、触发方式、主要行动和最终结果基本相同，就视为历史邻域；换行业词、入口或名字不算新 idea。

## 五个硬门槛

候选必须同时满足：

1. **个人直接使用**：服务个人日常或每周任务，不依赖企业采购、管理员部署或团队治理。
2. **海外真实验证**：存在付费、活跃用户、持续运营、融资、下载/评论或可信社区使用信号；单次发布、概念页和外包需求不算。
3. **原产品不可直接复制使用**：海外原型是闭源或商业产品。已经有可直接安装、功能完整的开源项目，直接淘汰，不能只换中文名字再做一遍。
4. **国内没有成熟直接替代**：必须交叉检查中文搜索、应用商店、GitHub、官方产品页或政府/平台入口。搜索失败、空结果和一条搜索摘要都不能证明空白。
5. **本地化不是翻译**：中国平台、账单/订单/通知、法规、设备能力、支付与售后流程、内容生态或使用习惯至少有一项形成独立价值。

## 方向偏好

- 优先个人效率、信息整理、文档、沟通、购买与售后、账户与隐私、家庭事务、创作交付等边界清楚的完整任务。
- AI 必须参与识别、判断、生成、跟踪或执行的核心闭环；只有聊天入口或摘要能力不够。
- 第一版应能由小团队做出可见 demo，不以接入几十家企业系统才能成立。
- 微信、WPS、淘宝、京东等只在真实任务需要时成为本地抓手，不作为预设主题。

## 直接淘汰

- 企业知识库、销售/客服平台、管理驾驶舱、合规中台、Agent infra；
- 通用助手、万能 RPA、提示词包装、只有中文 UI 的克隆；
- 已可直接使用的开源原项目；
- 国内已有成熟直接产品，只剩轻微功能差异；
- 只有海外热度，没有个人完整任务；
- 只能靠“可能以后接很多平台”解释价值的宽泛构想。

## 完成条件

- 目标 3 个、最多 5 个；不足时保留 underfilled，不凑数；
- 每个候选都有海外原型、验证证据、闭源/商业状态证据、至少两个中国侧核验链接和具体本地化抓手；
- 先用 `node scripts/opportunity-store.mjs check <run.json>` 检查，再用 `record` 落库；
- 最终只输出通过硬门槛的候选，不把淘汰项包装成“备选”。
