import firebase from 'firebase';

 const firebaseConfig = {
   apiKey: process.env.NEXT_PUBLIC_API_KEY,
   authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
   //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
 };

if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;