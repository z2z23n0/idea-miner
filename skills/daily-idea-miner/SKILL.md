---
name: daily-idea-miner
description: Runs the combined daily idea-miner report: a 21-item source-balanced complete-task Agent feed plus a strict shortlist of validated overseas personal-productivity products that still have a real China gap.
---

# Daily Idea Miner

这个 skill 是每日组合入口。它并行保留两种价值不同的发现方式：

1. `agent-idea-feed` 从具体任务出发，提供足够宽、新鲜、可想象的 Agent 灵感；
2. `personal-opportunity-scan` 从海外已验证产品出发，筛出值得做中国本地化或开源替代的个人效率机会。

必须完整读取并分别遵守两个子 skill。不要用第二条线的重型判断改写第一条线，也不要拿第一条线的外包需求链接充当第二条线的市场验证。

## 运行顺序

1. 读取两份历史：

   ```bash
   node scripts/seen-store.mjs list
   node scripts/opportunity-store.mjs list
   ```

2. 按 `agent-idea-feed` 完成七来源各 3 条的任务灵感线；在合格来源任务中优先选能转成单人直接使用的效率、信息处理、沟通、文档、创作或生活事务工具，跳过需要企业采购、管理员部署、多席位协同或重行业实施的任务。
3. 按 `personal-opportunity-scan` 完成个人效率机会线，目标 3 个、最多 5 个；可以 underfilled。
4. 将两部分分别写入临时 JSON，先执行两个 `check`。只有两边都通过，才分别执行两个 `record`，避免一边未完成就提前输出。
5. 用下面的合并格式返回一份中文日报。

## 共同边界

- 两条线都必须任务级去重，不靠换名字绕过历史。
- 最终 idea 必须是个人能直接理解和使用的完整任务，不是企业平台、通用 Agent 框架或 builder tooling。第一条线可以来自企业或自由职业需求，但产品化后的使用者必须是个人，不能只是把企业需求改个名字。
- 微信只是可能出现的一个本地入口，不是检索主题、硬门槛或默认产品形态。
- 不因目标数量而降低标准。任务灵感线靠继续补搜满足固定数量；个人效率机会线允许少于 3 个。
- 不读取旧 `~/.codex/data/idea-discovery` 或旧 run artifacts；以两个当前 store 为唯一去重历史。

## 最终格式

先原样使用 `agent-idea-feed` 的七来源格式，标题改为：

```markdown
# 今日任务型 Agent 灵感
```

然后输出：

```markdown
# 今日个人效率搬运机会

## 1. 名字

- **海外原型：** 产品名与一句验证信号。[产品](链接) · [验证](链接)
- **替个人完成：** 用户给它什么，它连续做什么，最后交付什么。
- **国内空位：** 已核验哪些直接近邻，为什么仍不是成熟替代。[核验 1](链接) · [核验 2](链接)
- **本地化抓手：** 中国平台、数据、规则、设备或使用习惯带来的独立价值。
- **为什么值得做：** 一句话写清第一版产品或开源替代的边界。
```

如果少于 3 个，只写“今天只有 N 个通过全部硬门槛”，不要把淘汰项补进来，也不要输出搜索流水账。

全文最后从两部分合计选出个人最想玩的 5 个名字，不补排名或长分析。
