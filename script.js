// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
//Copy here your firebase configuration
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//Initialize Auth
const auth = getAuth();
const user = auth.currentUser;
//Initialize DDBB
const db = getFirestore(app);
//Initialize cloudstore
const storage = getStorage();


const signUpForm = document.getElementById('signup-form')
const loginForm = document.getElementById('login-form')
const logout = document.getElementById('logout')

signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const signUpEmail = document.getElementById('signup-email').value
  const signUpPassword = document.getElementById('signup-pass').value
  const signUpUser = document.getElementById('signup-user').value
  const usersRef = collection(db, "users");
  const signUpImg = document.getElementById('signup-picture').files[0];
  const storageRef = ref(storage, signUpImg.name);
  let publicImageUrl;
  try {
    await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential) => {
      console.log('Usuario registrado')
      // Signed in
      const user = userCredential.user;
      // ...
      signUpForm.reset();
    })
    await uploadBytes(storageRef, signUpImg).then(async (snapshot) => {
      console.log('Uploaded a blob or file!')
      publicImageUrl= await getDownloadURL(storageRef);
    })
    await setDoc(doc(usersRef, signUpEmail), {
      username: signUpUser,
      email: signUpEmail,
      profile_picture: publicImageUrl})
  } catch (error) {
    console.log('Error: ', error)
  }
      
})

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const loginEmail = document.getElementById('login-email').value;
  const loginPassword = document.getElementById('login-pass').value;
  const docRef = doc(db, "users", loginEmail);
  const docSnap = await getDoc(docRef);
  const userData = document.getElementById('user-data');

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      console.log('Usuario autenticado')
      const user = userCredential.user;
      loginForm.reset();
    })
    .then(() => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        userData.style.cssText = 'background-color: #73AB84;width: 50%;margin: 2rem auto;padding: 1rem;border-radius: 5px;display: flex;flex-direction: column;align-items: center';
        userData.innerHTML = `<h3>User Data</h3>
                              <p>Username: ${docSnap.data().username}</p>
                              <p>Email: ${docSnap.data().email}</p>
                              <img src=${docSnap.data().profile_picture} alt='User profile picture'>`
      } else {
        console.log("No such document!");
    }})
    .catch((error) => {
      document.getElementById('msgerr').innerHTML='Invalid user or password';
      const errorCode = error.code;
      const errorMessage = error.message;
    });
})


logout.addEventListener('click', () => {
  signOut(auth).then(() => {
    console.log('Te has deslogeado')
    document.getElementById('user-data').innerHTML = ``;
  }).catch((error) => {
    console.log('Error: ', error)
  });
})

const userdata = document.getElementById('user-data')

auth.onAuthStateChanged(user => {
  if(user){
    console.log('existo')
  }else{
    console.log('noexisto');
  }
})