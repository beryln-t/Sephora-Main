const express = require("express");
const path = require("path");
const logger = require("morgan");
require("dotenv").config();
require("./config/database");
// const jwt = require("jsonwebtoken");

const productRouter = require("./routes/products");
const locationRouter = require("./routes/locations");

const customerRouter = require('./routes/customerLoginRouter');
const calendarRouter = require('./routes/calendarRouter');
const appointmentRouter = require('./routes/appointmentRouter');
const makeupArtistRouter = require('./routes/makeupArtistRouter');
const mapsRouter = require('./routes/mapsRouter');

const app = express();
const port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

app.use("/api", productRouter);
app.use("/api/locations", locationRouter);

app.use("/api/customer", customerRouter);
app.use("/api/calender", calendarRouter);
app.use("/api/booking", appointmentRouter);
app.use("/api/maps", mapsRouter);
app.use("/api/makeupartist", makeupArtistRouter);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
