const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const auth = require('./routes/apis/middleware/verify')

dotenv.config();

const users = require("./routes/apis/users");
const dashboard = require("./routes/apis/dashboard");

const app = express();
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

const db = process.env.DB_CONNECT;
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

// Passport middleware
// app.use(passport.initialize());
// Passport config
// require("./config/passport")(passport);
// route /api/users/login|register
app.use("/api/users", users);
app.use("/api/dashboard", dashboard);

const port = process.env.PORT;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));