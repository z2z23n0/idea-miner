使用 `idea-discovery-workflow` skill 运行每日产品/开源项目 idea 挖掘；在判断、拷打、竞品核验和验证计划处使用 `ai-founder-playbook`。

目标：从当前可用的 Reddit、Hacker News、X/Twitter、GitHub、Product Hunt、开发者论坛、issue tracker、changelog、review site、博客、搜索引擎、官方 blog/release notes 和产品新闻源里，发现最新、真实、可验证的需求、痛点、生态变化、竞品缺口和未满足场景，并产出最多 3 个可以进一步验证的 idea。

按 `idea-discovery-workflow` 的 workflow、role contracts、source policy、memory schema 和 report format 执行。若 shell 可用，先运行该 skill 的 `scripts/idea-scout-kit.mjs` 生成查询清单；若本地 evidence store 未初始化，可运行 `scripts/init-store.mjs`。

尽量把关键 signals、ideas、claims、competitors、decisions 和 graph-like edges 追加到 `${CODEX_IDEA_DISCOVERY_HOME:-$HOME/.codex/data/idea-discovery}`。不要写入 token、secret、私有账户信息或不可公开内容。

必须联网或使用可用实时工具核验所有当前性、竞品、市场和来源判断。无法访问某信息源时，明确标注“未覆盖/受限”，不要编造。不要把热闹话题、viral 帖、单个抱怨、单个产品新闻或“AI 能做出来”直接当成机会。

若当前环境提供真实 sub-agent / multi-agent 工具，就实际创建并调度；否则模拟角色并在报告里说明。

最终中文输出，严格使用 `idea-discovery-workflow` 的固定报告格式。完整报告必须作为普通 Markdown 正文输出，放在任何 heartbeat XML 块之前。若找不到 3 个过线 idea，不得降低标准凑数。
