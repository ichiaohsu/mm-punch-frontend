import firebase from 'firebase'

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: 'https://mm-punch.firebaseio.com'
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

firebase
  .auth()
  .signInWithEmailAndPassword(
    process.env.FIREBASE_AUTH_EMAIL,
    process.env.FIREBASE_AUTH_PASSWORD
  )

const db = firebase.database().ref('members')

export default (context, inject) => {
  inject('checkMemberExist', (id) => {
    return db
      .child(id)
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          return 'exist'
        } else {
          return 'not exist'
        }
      })
      .catch((error) => {
        throw error
      })
  })
  inject('setMember', ({ id, password }) => {
    return db
      .child(id)
      .set({ id, password })
      .then((res) => {
        return res
      })
      .catch((error) => {
        throw error
      })
  })
  inject('removeMember', ({ id, password }) => {
    return db
      .child(id)
      .once('value')
      .then((snapshot) => {
        const { password: passwordInDB } = snapshot.val()
        if (passwordInDB === password) {
          return db.child(id).remove()
        } else {
          throw new Error('Invalid password')
        }
      })
      .catch((error) => {
        throw error
      })
  })
}
