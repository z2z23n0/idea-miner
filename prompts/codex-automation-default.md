使用 `idea-discovery-workflow` skill 运行每日产品/开源项目 idea discovery；在判断、拷打和竞品核验处使用 `ai-founder-playbook`。

目标：按 `ai_oss`、`ai_product`、`ai_prosumer` 三个 AI-focused final bucket 输出最多 9 个值得继续想的 product/OSS ideas，每个 bucket 最多 3 个。不得降低标准凑数；bucket 不足时必须继续补源，或用 `candidate-ledger.jsonl` 证明补搜轮次和 kill reasons。

运行方式：复用当前 skill 的完整契约，不要把 workflow 细节复制进 automation prompt。按 thesis-first、history-aware、Product Shape、Reader Check、artifact checker 的现行规则执行；必须读取已有本地 evidence store，不要新建空历史。

最终中文输出：使用 `idea-discovery-workflow` 固定报告格式，按三个 bucket 分桶；写明 artifact 保存路径和 artifact check 状态。必须保存 `report.md`、`reader-review.md` 或 `reader-review.json`、`candidate-ledger.jsonl`、`source-notes.jsonl`、`handoff-index.md`、以及每个 final idea 的 Markdown/JSON dossier。

必须联网或使用可用实时工具核验当前性、竞品、市场和来源判断。无法访问的信息源标注“未覆盖/受限”，不要编造。
