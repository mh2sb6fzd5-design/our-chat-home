export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只接受 POST 请求" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "没有收到消息" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(response.status).json({
        error: "OpenAI API 请求失败",
        details: data
      });
    }

    return res.status(200).json({
      reply: data.output_text
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "粥粥暂时迷路了"
    });
  }
}
