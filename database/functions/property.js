import { db, storage } from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { setDoc, doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'

const isFirstFirebase = async(uid) => {
    let flag = false
    const docRef = doc(db, 'properties', uid)
    const res = await getDoc(docRef)
    
    flag = res.exists()
    //
    //console.log(res.data())

    return !flag
}

/* add first property */
const addFirst = async(property,uid) => {
    if(property.status){
      const file = property.contract.pdf
    
      const storageRef = ref(storage, `files/${uid}/${property.type}/${property.contract.pdfName}`)
      
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
                      tenant: {
                          name: property.tenant.name,
                          razon: property.tenant.razon,
                          phone: property.tenant.phone,
                          mail: property.tenant.mail,
                      },
                      contract: {
                          start: property.contract.start,
                          end: property.contract.end,
                          type: property.contract.type,
                          day: property.contract.day,
                          bruta: property.contract.bruta,
                          neta: property.contract.neta,
                          pdfName: property.contract.pdfName,
                          pdfUrl: downloadURL
                      }
                  }
                  let data = []
                  data.push(temp)
                  let payload = {
                      data: data
                  }
                  const docRef = doc(db, 'properties', uid)
                  await setDoc(docRef, payload)
                  return payload.data
              } catch (err) {
                  console.log(err)
                  return false
              }
          });
        }
      );
    } else {
      try {
          const temp = {
              name: property.name,
              type: property.type,
              status: property.status,
              tenant: {
                  name: "",
                  razon: "",
                  phone: "",
                  mail: "",
              },
              contract: {
                  start: "",
                  end: "",
                  type: "",
                  day: 1,
                  bruta: 0,
                  neta: 0,
                  pdfName: "",
                  pdfUrl: ""
              }
          }
          let data = []
          data.push(temp)
          let payload = {
              data: data
          }
          const docRef = doc(db, 'properties', uid)
          await setDoc(docRef, payload)
          return payload.data
      } catch (err) {
          console.log(err)
          return false
      }
    }
    
  
    return true
}

/* add property (not first) */
const addProperty = async(properties, property, uid) => {
    if(property.status) {
      const file = property.contract.pdf
      const storageRef = ref(storage, `files/${uid}/${property.type}/${property.contract.pdfName}`)
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
                      tenant: {
                          name: property.tenant.name,
                          razon: property.tenant.razon,
                          phone: property.tenant.phone,
                          mail: property.tenant.mail,
                      },
                      contract: {
                          start: property.contract.start,
                          end: property.contract.end,
                          day: property.contract.day,
                          type: property.contract.type,
                          bruta: property.contract.bruta,
                          neta: property.contract.neta,
                          pdfName: property.contract.pdfName,
                          pdfUrl: downloadURL
                      }
                  }
                  let data = properties
                  data.push(temp)
                  let payload = {
                      data: data
                  }
                  console.log(payload)
                  const docRef = doc(db, 'properties', uid)
                  await setDoc(docRef, payload)
                  return payload.data
              } catch (err) {
                  console.log(err)
                  return false
              }
          });
        }
      );
    } else {
      try {
          const temp = {
              name: property.name,
              type: property.type,
              status: property.status,
              tenant: {
                  name: "",
                  razon: "",
                  phone: "",
                  mail: "",
              },
              contract: {
                  start: "",
                  end: "",
                  type: "",
                  day: 1,
                  bruta: 0,
                  neta: 0,
                  pdfName: "",
                  pdfUrl: ""
              }
          }
          let data = properties
          data.push(temp)
          let payload = {
              data: data
          }
          const docRef = doc(db, 'properties', uid)
          await setDoc(docRef, payload)
          return payload.data
      } catch (err) {
          console.log(err)
          return false
      }
    }
    

    return true
}


/* update property with new contract */
const updateNewContract = async(properties, property, uid) => {
  const file = property.contract.pdf
  console.log(file)
  const storageRef = ref(storage, `files/${uid}/${property.type}/${property.contract.newPdfName}`)
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
                  tenant: {
                      name: property.tenant.name,
                      razon: property.tenant.razon,
                      phone: property.tenant.phone,
                      mail: property.tenant.mail,
                  },
                  contract: {
                      start: property.contract.start,
                      end: property.contract.end,
                      type: property.contract.type,
                      day: property.contract.day,
                      bruta: property.contract.bruta,
                      neta: property.contract.neta,
                      pdfName: property.contract.newPdfName,
                      pdfUrl: downloadURL
                  }
              }
              //delete property with same name
              let data = properties.filter(el => el.name !== property.name)
              
              data.push(temp)
              let payload = {
                  data: data
              }
              const docRef = doc(db, 'properties', uid)
              await setDoc(docRef, payload)

              //delete other PDF
              const deleteRef = ref(storage, `files/${uid}/${property.type}/${property.contract.pdfName}`)
              await deleteObject(deleteRef).then(() => {
                console.log("File deleted")
              }).catch((err) => {
                console.log(err.message)
              })
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

/* update property with same contract */
const updateSameContract = async(properties, property, uid) => {
    try {
      const temp = {
          name: property.name,
          type: property.type,
          status: property.status,
          tenant: {
              name: property.tenant.name,
              razon: property.tenant.razon,
              phone: property.tenant.phone,
              mail: property.tenant.mail,
          },
          contract: {
              start: property.contract.start,
              end: property.contract.end,
              type: property.contract.type,
              bruta: property.contract.bruta,
              day: property.contract.day,
              neta: property.contract.neta,
              pdfName: property.contract.pdfName,
              pdfUrl: property.contract.pdfUrl
          }
      }

      //delete property with same name
      let data = properties.filter(el => el.name !== property.name)
      console.log(data)
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
}

/* get list of properties */
const getProperties = async(uid) => {
    try {
      const propertiesRef = doc(db, 'properties', uid)
      const res = await getDoc(propertiesRef)

      return res.data().data
    } catch (error) {
      console.log(error)
      return false
    }
    
}

/* delete property from list */
const removeProperty = async(properties,property,uid) => {
  try {
      const docRef = doc(db, 'properties', uid)
      let prop = properties.find(el => el.name === property)
      
      let data = properties.filter(el => el.name !== property)
      let payload = {
        data: data
      }
      await setDoc(docRef, payload)
      if(prop !== undefined){
        if(prop.status){
          //delete contract from storage
          const deleteRef = ref(storage, `files/${uid}/${prop.type}/${prop.contract.newPdfName}`)
          await deleteObject(deleteRef).then(() => {
              console.log("File deleted")
            }).catch((err) => {
              console.log(err.message)
              return false
            })
        }
      }
      return true
  } catch(err) {
      console.log(err)
      return false
  }
}



export { 
  addFirst, 
  isFirstFirebase, 
  getProperties, 
  addProperty, 
  updateNewContract, 
  updateSameContract, 
  removeProperty,
}