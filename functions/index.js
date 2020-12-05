const functions = require('firebase-functions')
const admin = require('firebase-admin');

admin.initializeApp();

var fireStore = admin.firestore()

exports.linetodo = functions.https.onRequest(async (req, res) => {
  const line_userId = req.query.line_id;
  let userData;
  fireStore.collection("line").where("line_id", "==", line_userId)
    .get()
    .then(async function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            userData = doc.data();
            // doc.data() is never undefined for query doc snapshots
        });
        const uid = userData.user_id;

        //Check関数を入れた
        let userTodo = [];
        fireStore.collection("todo").where("user_id", "==", uid)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach((doc) =>{
                userTodo.push(doc.data());
                  // doc.data() is never undefined for query doc snapshots
              });
              res.json(userTodo);
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
            res.status(500).end(error)
          });
    })
    .catch(function(error) {
      res.status(500).end(error)
    });
});


exports.getLineUsers = functions.https.onRequest(async (req, res) => {
  let userData = [];
  fireStore.collection("line")
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach((doc) =>{
        userData.push(doc.data().line_id);
      });
      res.json(userData);
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
      res.status(500).end(error)
    });
});

const todoCheck = function (uid) {

}