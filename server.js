import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // 開発用。公開時はドメイン制限推奨

const OPENAI_KEY = "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";

app.post("/api/diagnosis", async (req, res) => {
  const { answers } = req.body;

  const prompt = `
あなたはITキャリアアドバイザーです。
以下の回答に基づいて、ユーザーがどのようなITトレンド分野に興味・適性があるかを診断してください。

回答:
${answers.map((a,i)=>`Q${i+1}: ${a}`).join("\n")}

出力フォーマット:
【あなたのITタイプ】
【おすすめ分野】
【今注目すべきトレンド】
【一言アドバイス】
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "診断に失敗しました";
    res.json({ result: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
