import { db } from '../firebase'
import { setDoc, doc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'


const getUsers = async (orgName) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("orgName", "==", orgName))
        const snapshot = await getDocs(q)
        let data = []
        snapshot.docs.forEach((doc) => {
            if(doc.exists){
                
                if(doc.data().type === 'user') {
                    data.push(doc.data())
                }
            }
        })
        
        return data
    } catch (error) {
        console.log(error)
    }
}

export { getUsers }