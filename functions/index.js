const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

app.use(cors({ origin: true }));
app.use(express.json());
app.get("/users", (req, res, next) => {
  return db
    .collection("userList")
    .get()
    .then(snapshot => res.send(snapshot.docs.map(doc => doc.data())));
});

app.post("/users", (req, res, next) => {
  const body = req.body;
  return db
    .collection("userList")
    .doc(body.email)
    .set(body)
    .then(documentSnapshot => {
      let data = documentSnapshot.data();
      return res.status(200).send({ data });
    });
});

app.get("/users/:userID", (req, res, next) => {
  return db
    .collection("userList")
    .doc(req.params.userID)
    .get()
    .then(snapshot => {
      let data = snapshot.data();
      return res.status(200).send({ data });
    });
});

app.del("/users/:userID", (req, res, next) => {
  return db
    .collection("userList")
    .doc(req.params.userID)
    .delete()
    .then(() => res.status(200).send({ message: "user deleted" }));
});

//   .patch(updateUser)

exports.app = functions.https.onRequest(app);
