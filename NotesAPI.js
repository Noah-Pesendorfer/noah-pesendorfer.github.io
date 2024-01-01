import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBe7d9bllq8RnmI6xxEBk3oub3qogPT2aM",
    authDomain: "thinkwise-c7673.firebaseapp.com",
    databaseURL: "https://thinkwise-c7673-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "thinkwise-c7673",
    storageBucket: "thinkwise-c7673.appspot.com",
    messagingSenderId: "37732571551",
    appId: "1:37732571551:web:9b90a849ac5454f33a85aa",
    measurementId: "G-8957WM4SB7"
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const eventsArr = [];

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Der Benutzer ist angemeldet und `user.uid` ist verfügbar.
      console.log("User is signed in with UID:", user.uid);
      // Hier können Sie Funktionen aufrufen, die die UID verwenden.
      getAllNotes();
    } else {
      // Kein Benutzer ist angemeldet.
      console.log("No user is signed in.");
      NotesAPI.redirectToLogin();
    }
  });

// NotesAPI.js
export default class NotesAPI {

    static getAllNotes() {
        const user = auth.currentUser;
        if (!user) {
            console.log("User not logged in. Cannot retrieve notes.");
            return [];
        }

        const notesRef = collection(db, "users", user.uid, "notes");
        return getDocs(notesRef)
            .then(querySnapshot => {
                return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            })
            .catch(error => {
                console.error("Error getting notes: ", error);
                return [];
            });
    }

   
    static redirectToLogin() {
        window.location.href = 'https://benjiwurfl.github.io/Login/';
      }
    

    static saveNote(noteToSave) {
        const user = auth.currentUser;
        if (!user) {
            console.log("User not logged in. Cannot save note.");
            return;
        }

        const notesRef = collection(db, "users", user.uid, "notes");

        const existing = notesArr.find(note => note.id === noteToSave.id);

        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();

            const noteRef = doc(notesRef, existing.id);
            updateDoc(noteRef, { title: existing.title, body: existing.body, updated: existing.updated });
        } else {
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.updated = new Date().toISOString();
            notesArr.push(noteToSave);

            addDoc(notesRef, noteToSave)
                .then(docRef => {
                    console.log("Note added with ID: ", docRef.id);
                })
                .catch(error => {
                    console.error("Error adding note: ", error);
                });
        }
    }

    static deleteNote(id) {
        const user = auth.currentUser;
        if (!user) {
            console.log("User not logged in. Cannot delete note.");
            return;
        }

        const notesRef = collection(db, "users", user.uid, "notes");

        const noteRef = doc(notesRef, id);
        deleteDoc(noteRef)
            .then(() => {
                console.log("Note successfully deleted!");

                const noteIndex = notesArr.findIndex(note => note.id === id);
                if (noteIndex !== -1) {
                    notesArr.splice(noteIndex, 1);
                }
            })
            .catch(error => {
                console.error("Error removing note: ", error);
            });
    }
}
