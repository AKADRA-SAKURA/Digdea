const functions = require('firebase-functions')
const admin = require('firebase-admin');

admin.initializeApp();

var fireStore = admin.firestore()

exports.linetodo = functions.https.onRequest(async (req, res) => {
  try{
    if (req.query.line_id){
      const querySnapshot = await fireStore.collection("line").where("line_id", "==", req.query.line_id).get()
      const uid = querySnapshot.docs.map(doc => doc.data().user_id).join('')
      const querySnapshot2 = await fireStore.collection("todo").where("user_id", "==", uid).get()
      const userTodos = querySnapshot2.docs.map(doc => doc.data())
      res.json(userTodos);
    }else{
      throw 'line_idがありませんよーーーん';
    }
  }catch (error){
    functions.logger.log(error)
    res.status(500).end(error)
  }
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