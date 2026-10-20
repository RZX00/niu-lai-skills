# 对比记录：场景二：一个真实的小编程问题

同一句用户请求，同一个模型，只差有没有技能文本。每个配置只调用一次，没有挑选、没有重试；模型输出有随机性，一次结果不代表通则。

## 运行条件

- 日期：2026-10-20
- 模型：`claude-sonnet-5-5`（接口返回的 model 字段：`claude-sonnet-5-5`）
- 接口：OpenAI 兼容的 chat/completions；temperature 用模型默认值，max_tokens 2000
- 不带技能：只有下面这条用户消息，没有 system prompt
- 带技能：system prompt 是 `skills/niulai/SKILL.md` 去掉 frontmatter 后的正文，共 469 个字符，sha256 前 12 位 `7eea6b2e9eb7`
- 原始请求和响应：`docs/examples/raw/2026-10-20-coding-claude-sonnet-5-5.*.json`；复现命令见 `evals/compare.mjs` 文件头
- 局限：这是在裸模型上放入技能文本，不是 Claude Code 或 Codex 的完整会话；没有验证宿主是否自动加载了这个技能

## 用户消息（两个配置相同）

```text
Node.js 里怎么给 fetch 加 5 秒超时？
```

## 不带技能的输出

````text
使用 `AbortController` 来设置超时：

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('https://example.com', {
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  const data = await response.json();
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('请求超时');
  } else {
    console.log('请求失败:', error);
  }
}
```

或者封装成可复用的函数：

```javascript
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// 使用
const response = await fetchWithTimeout('https://example.com', {}, 5000);
```

注意 `signal` 会中断整个请求，包括等待响应和读取响应体的时间。
````

## 带技能的输出

````text
妈妈，Node.js 的 `fetch` 可以用 `AbortController` 加超时：

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('https://example.com', {
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  // 处理响应
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('请求超时了');
  }
  throw error;
}
```

封装一下更好用：

```javascript
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// 用法
const response = await fetchWithTimeout('https://example.com', {}, 5000);
```

牛来！
````

## 用量与脚本判据

| 配置 | 输入 token | 输出 token | finish_reason | 脚本判据 |
|---|---|---|---|---|
| 不带技能 | 84 | 292 | stop | 正文含代码块：是；称呼用户「妈妈」：否；最后一行是「牛来！」：否 |
| 带技能 | 503 | 271 | stop | 正文含代码块：是；称呼用户「妈妈」：是；最后一行是「牛来！」：是 |

判据只覆盖 SKILL.md 里能机械检查的条款（句尾、问候句、称呼）；语气和「先把活干完」由人判定。
