export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://fantasy.premierleague.com/api/bootstrap-static`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch FPL data" });
    }

    const data = await response.json();
    res.status(200).json(data.events);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
