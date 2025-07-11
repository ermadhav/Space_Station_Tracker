const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/iss", async (req, res) => {
  try {
    const { data } = await axios.get("https://api.wheretheiss.at/v1/satellites/25544");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ISS data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
