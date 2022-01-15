const app = require("express")();
const server = app.listen(4000);
const cors = require("cors");
const bodyDashParser = require("body-parser");
const mongoose = require("mongoose");
const { client } = require("websocket");
const logins = require("./models/login");
const chatSchemaFunc = require("./models/chatlog");
const mongoDB =
  "";
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});
mongoose.connect(mongoDB, () => {
  console.log("connected to DB");
});

app.use(cors());
app.use(bodyDashParser());
//logins
app.get("/:id", async (req, res) => {
  logins.find({ email: req.params.id }, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      if (data.length === 0) {
        res.send([]);
      } else {
        res.send(data);
      }
    }
  });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const newLogin = new logins({ email: email, password: password });
  await newLogin.save();
  res.send("account successful!");
});

//server chat logs
app.get("/app/:id", (req, res) => {
  chatSchemaFunc(req.params.id).find({}, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      res.send(data);
    }
  });
});

app.delete("/messages", (req, res) => {
  const { id, _id } = req.body;
  const tempId = mongoose.Types.ObjectId(_id);
  chatSchemaFunc(id).deleteOne({ _id: tempId }, (err, succ) => {
    if (err) {
      res.send(err);
    } else {
      res.send(succ);
    }
  });
});

app.patch("/editMessage", (req, res) => {
  const { newMessage, _id, id } = req.body;
  chatSchemaFunc(id).findByIdAndUpdate(
    { _id },
    { message: newMessage },
    (err, succ) => {
      if (err) {
        res.send(err);
      } else {
        res.send(succ);
      }
    }
  );
});

io.on("connection", (socket) => {
  console.log(`connected with client: ${socket.id}`);
  socket.on("join", (id) => {
    socket.join(id);
  });
  socket.on("message", async ({ email, message, id }) => {
    const tempChatSchemaFunc = chatSchemaFunc(id);
    const chatMessage = new tempChatSchemaFunc({
      email: email,
      message: message,
    });
    await chatMessage.save();
    const _id = chatMessage._id;
    socket.to(id).emit("message", { email, message, id, _id });
  });
  socket.on("deletedMessage", ({ email, message, id, _id }) => {
    socket.to(id).emit("deletedMessage", { email, message, id, _id });
  });

  socket.on("updatedMessage", ({ email, message, id, _id }) => {
    socket.to(id).emit("updatedMessage", { email, message, id, _id });
  });

  socket.on("changeRoom", (id) => {
    socket.leaveAll();
    socket.join(id);
  });
});
