const express = require("express");
require("./db/mongoose");
const assistantRouter = require("./routers/assistant");
const compareRouter = require("./routers/compare");

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(assistantRouter);
app.use(compareRouter);


// ----------- serve in port 5000 -----------------------------
app.listen(port, () => {
  console.log(`server is on port ${port}`);
});
