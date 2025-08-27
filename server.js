const express = require("express");
require("dotenv").config();
const colors = require("colors");
const { initDB } = require("./db");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

//Routes
const indexRoute = require("./routes/indexRoute");
app.use("/api", indexRoute);
const authRoute = require("./routes/auth.routes");
app.use("/api/auth", authRoute);



// Start server only if DB connects
(async () => {
  try {
    await initDB();
    // const users = await getAllUsers();
    // console.log(users);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`.bgRed.white);
    });
  } catch (err) {
    console.error("Failed to start server because DB connection failed.");
    process.exit(1);
  }
})();
