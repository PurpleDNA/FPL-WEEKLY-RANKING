export default async function handler(req, res) {
  const { leagueId } = req.query;

  try {
    const response = await fetch(
      `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`
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
