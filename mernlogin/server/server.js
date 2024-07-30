const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {});

app.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await collection.findOne({ email: email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        res.json("exist");
      } else {
        res.json("wrongpassword");
      }
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await collection.findOne({ email: email });
    if (user) {
      res.json("exist");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = {
        email: email,
        password: hashedPassword,
      };
      await collection.insertMany([data]);
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.listen(8000, () => {
  console.log("port connected");
});
