import { db, storage } from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { setDoc, doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'

const isFirstFirebase = async(uid) => {
    let flag = false
    const docRef = doc(db, 'properties', uid)
    const res = await getDoc(docRef)
    console.log(res.exists())
    flag = res.exists()
    //
    //console.log(res.data())

    return !flag
}

/* add first property */
const addFirst = async(property,uid) => {
    const file = property.rentHistory[0].pdf
    console.log(file)
    const storageRef = ref(storage, `files/${uid}/${property.type}/${property.rentHistory[0].pdfName}`)
    console.log(storageRef)
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(progress);
      },
      (error) => {
        console.log(error);
        return false
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          //upload property to firestore
            

            try {
                console.log(downloadURL)
                const temp = {
                    name: property.name,
                    type: property.type,
                    status: property.status,
                    rentHistory: [
                        {
                            name: property.rentHistory[0].name,
                            razon: property.rentHistory[0].razon,
                            phone: property.rentHistory[0].phone,
                            mail: property.rentHistory[0].mail,
                            start: property.rentHistory[0].start,
                            end: property.rentHistory[0].end,
                            type: property.rentHistory[0].type,
                            cost: property.rentHistory[0].cost,
                            pdfName: property.rentHistory[0].pdfName,
                            pdfUrl: downloadURL
                        }
                    ]
                }
                let data = []
                data.push(temp)
                let payload = {
                    data: data
                }
                const docRef = doc(db, 'properties', uid)
                await setDoc(docRef, payload)
                return true
            } catch (err) {
                console.log(err)
                return false
            }
            


        });
      }
    );
  
    return true
}

/* add property (not first) */

/* get list of properties */
const getProperties = async(uid) => {
    try {
      const propertiesRef = doc(db, 'properties', uid)
      const res = await getDoc(propertiesRef)
      
      console.log(res.data().data)

      return res.data().data
    } catch (error) {
      console.log(error)
      return false
    }
    
}


export { addFirst, isFirstFirebase, getProperties }