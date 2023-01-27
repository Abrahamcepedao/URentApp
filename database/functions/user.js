import { db } from '../firebase'
import { setDoc, doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'

const addUser = async (user) => {
    try {
        const docRef = doc(db, 'users', user.uid)
        if(user.password){
            const payload = {
                uid: user.uid,
                mail: user.mail,
                name: user.name,
                phone: user.phone,
                orgName: user.orgName,
                type: user.type,
                password: user.password,
                signedUp: false,
                accountType: "demo"
            }
            await setDoc(docRef, payload)
        } else {
            const payload = {
                uid: user.uid,
                mail: user.mail,
                name: user.name,
                phone: user.phone,
                orgName: user.orgName,
                type: user.type,
                accountType: "demo"
            }
            
            await setDoc(docRef, payload)
        }
        
    } catch(error) {
        console.log(error)
    }
}

const getUser = async (uid) => {
    try {
        const docRef = doc(db, 'users', uid)
        const res = await getDoc(docRef)
        

        return res.data()
    } catch (error) {
        console.log(error)
    }
}

const getUserByMail = async (mail) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("mail", "==", mail))
        const snapshot = await getDocs(q)
        let user = null
        snapshot.docs.forEach((doc) => {
            if(doc.exists){
                console.log(doc.data())
                user = doc.data()
            }
        })
        
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

const signUpManager = async (mail, orgName, uid) => {
    try {
        const docRef = doc(db, 'users', orgName + "_" + mail)
        const res = await getDoc(docRef)
        const temp = res.data()

        await deleteDoc(docRef)

        const payload = {
            uid: uid,
            mail: temp.mail,
            name: temp.name,
            phone: temp.phone,
            orgName: temp.orgName,
            type: temp.type,
            signedUp: true,
            accountType: "demo"
        }
        const newDocRef = doc(db, 'users', uid)
        await setDoc(newDocRef, payload)
    } catch (err) {
        console.log(err)
    }
}

export { addUser, getUser, getUserByMail, signUpManager }