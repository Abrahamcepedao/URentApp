import { db } from '../firebase'
import { setDoc, doc, getDoc } from 'firebase/firestore'

const addUser = async (user) => {
    try {
        const docRef = doc(db, 'users', user.uid)
        const payload = {
            uid: user.uid,
            mail: user.mail,
            name: user.name,
            phone: user.phone,
            orgName: user.orgName,
            type: "master",
            accountType: "demo"
        }
        await setDoc(docRef, payload)
    } catch(error) {
        console.log(error)
    }
}

const getUser = async (uid) => {
    try {
        const docRef = doc(db, 'users', uid)
        const res = await getDoc(docRef)
        console.log(res)
        return res
    } catch (error) {
        console.log(error)
    }
}

export { addUser, getUser }