# Firebase_auth

Frontend workshop with Firebase Authentication, Firestore Database and Storage using the Firebase version 9.

Create a user profile with username, email and password and upload a profile image.

Paste paste your firebase configuration object.

Steps:

Create the user profile with email and password:

```javascript
await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential) => {
      console.log('User registered')
      const user = userCredential.user;
      signUpForm.reset();
    })
```

Upload the image to Firebase Storage and generate the URL:

```javascript
await uploadBytes(storageRef, signUpImg).then(async (snapshot) => {
      console.log('Uploaded a blob or file!')
      publicImageUrl= await getDownloadURL(storageRef);
    })
```

Create a document in Firestore Database that includes a relationship of the profile data (username, email and profile pic):

```javascript
await setDoc(doc(usersRef, signUpEmail), {
      username: signUpUser,
      email: signUpEmail,
      profile_picture: publicImageUrl})

```

![img](/assets/gif_firebase.gif)
