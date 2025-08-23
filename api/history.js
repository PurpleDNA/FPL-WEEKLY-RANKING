export default async function handler(req, res) {
  const { entry } = req.query;

  try {
    const response = await fetch(
      `https://fantasy.premierleague.com/api/entry/${entry}/history`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch FPL data" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
