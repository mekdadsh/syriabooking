const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Test server is running!", status: "success" });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
});
