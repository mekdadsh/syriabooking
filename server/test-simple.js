const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Simple test server is running!", status: "success" });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Simple test server is running on port ${PORT}`);
});
