import { db, storage } from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { setDoc, doc } from 'firebase/firestore'

/* register new report */
const registerReport = async(properties, property, uid, report) => {
  if(report.fileName !== "" || report.file) {
      let name = property.name.replace(/\s+/g, '');
      const file = report.file
      const storageRef = ref(storage, `files/${uid}/reports/${name}/${report.year}/${report.month}/${report.fileName}`)
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
                  let reports = []
                  if(property.reports){
                      reports = property.reports
                  }

                  reports.push({
                    id: Date.now(),
                    date: report.date,
                    month: report.month,
                    year: report.year,
                    amount: report.amount,
                    concept: report.concept,
                    fileName: report.fileName,
                    fileUrl: downloadURL,
                    fileRef: `files/${uid}/reports/${name}/${report.year}/${report.month}/${report.newFileName}`,
                    comment: report.comment
                  })

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
                    },
                    payments: property.payments,
                    reports: reports
                  }

                  console.log(temp)
                  
                  //delete property with same name
                  let data = properties.filter(el => el.name !== property.name)
                  
                  data.push(temp)
                  let payload = {
                      data: data
                  }
                  console.log(properties)
                  console.log(payload)
                  const docRef = doc(db, 'properties', uid)
                  await setDoc(docRef, payload)
                  return true
              } catch (err) {
                  console.log(err)
                  return false
              }
          });
        })
  } else {
      try {
        let reports = []
        if(property.reports){
            reports = property.reports
        } else {
            reports = []
        }

        reports.push({
          id: Date.now(),
          property: report.property,
          date: report.date,
          month: report.month,
          year: report.year,
          concept: report.concept,
          fileName: "",
          fileUrl: "",
          fileRef: "",
          comment: report.comment
        })

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
          },
          payments: property.payments,
          reports: reports
        }

        console.log(temp)
        
        //delete property with same name
        let data = properties.filter(el => el.name !== property.name)
        
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
  return true
}

/* update report */
const updateReportFirebase = async(properties, uid, report, property, pastProperty) => {
  if(report.newFileName !== "" && report.file !== ""){
    //update with new file
    let name = ""
    if(property !== ""){
      name = property.replace(/\s+/g, '');
    } else {
      name = report.property.replace(/\s+/g, '');
    }
    
    const file = report.file
    const storageRef = ref(storage, `files/${uid}/reports/${name}/${report.year}/${report.month}/${report.newFileName}`)
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
                let prop = null
                if(property !== ""){
                  prop = properties.find(el => el.name === property)
                } else {
                  prop = properties.find(el => el.name === report.property)
                }

                let reports = prop.reports.filter(el => el.id !== report.id)
                let tempreport = prop.reports.find(el => el.id === report.id)
                reports.push({
                    id: Date.now(),
                    property: report.property, 
                    date: report.date,
                    month: report.month,
                    year: report.year,
                    concept: report.concept,
                    fileName: report.newFileName,
                    fileUrl: downloadURL,
                    fileRef: `files/${uid}/reports/${name}/${report.year}/${report.month}/${report.newFileName}`,
                    comment: report.comment
                })

                const temp = {
                  ...prop,
                  reports: reports
                }

                console.log(temp)
                
                //delete property with same name
                let data = []
                if(property !== ""){
                  data = properties.filter(el => el.name !== property || el.name !== pastProperty)
                  
                  //delete report from the other property
                  let prop2 = properties.find(el => el.name === pastProperty)
                  let tempreports = prop2.reports.filter(el => el.id !== report.id)
                  let temp2 = {
                    ...prop2,
                    reports: tempreports
                  }
                  data.push(temp2)
                } else {
                  data = properties.filter(el => el.name !== report.property)
                }
                
                
                data.push(temp)
                let payload = {
                    data: data
                }
                console.log(properties)
                console.log(payload)
                const docRef = doc(db, 'properties', uid)
                await setDoc(docRef, payload)


                //delete last file
                if(report.fileName !== "") {
                  let name2 = ""
                  if(property !== ""){
                    name2 = pastProperty.replace(/\s+/g, '');
                  } else {
                    name2 = report.property.replace(/\s+/g, '');
                  }
                  
                  const deleteRef = ref(storage, `files/${uid}/reports/${name2}/${tempreport.year}/${tempreport.month}/${tempreport.fileName}`)
                  await deleteObject(deleteRef).then(() => {
                    console.log("File deleted")
                  }).catch((err) => {
                    console.log(err.message)
                    return false
                  })
                }
                
                return true
            } catch (err) {
                console.log(err)
                return false
            }
        });
      })

      return true

  } else {
    //update with same file
    try {
        const docRef = doc(db, 'properties', uid)
        let prop = null
        if(property !== ""){
          prop = properties.find(el => el.name === property)
        } else {
          prop = properties.find(el => el.name === report.property)
        }

        let reports = prop.reports.filter(el => el.id !== report.id)
        reports.push({
          id: Date.now(),
          date: report.date,
          month: report.month,
          year: report.year,
          concept: report.concept,
          fileName: report.fileName,
          fileUrl: report.fileUrl,
          fileRef: report.fileRef,
          comment: report.comment
        })

        const temp = {
          ...prop,
          reports: reports
        }

        let data = []
        if(property !== ""){
          data = properties.filter(el => el.name !== property|| el.name !== pastProperty)
          
          //delete report from the other property
          let prop2 = properties.find(el => el.name === pastProperty)
          let tempreports = prop2.reports.filter(el => el.id !== report.id)
          let temp2 = {
            ...prop2,
            reports: tempreports
          }
          data.push(temp2)
        } else {
          data = properties.filter(el => el.name !== report.property)
        }

        data.push(temp)

        let payload = {
          data: data
        }
        console.log(payload)

        await setDoc(docRef, payload)
        return true
    } catch(err) {
        console.log(err)
        return false
    }
  }
}

/* remove report */
const removeReport = async(properties, property, uid, report) => {
  try {
    const docRef = doc(db, 'properties', uid)
    let prop = properties.find(el => el.name === property)
    
    if(prop !== undefined){
      let reports = prop.reports
      if(reports){
        let tempreports = reports.filter(el => el.id !== report)
        let temp = {
          ...prop,
          reports: tempreports
        }

        let data = properties.filter(el => el.name !== property)
        data.push(temp)
        let payload = {
          data: data
        }
        
        await setDoc(docRef, payload)

        //delete file if exists
        let tempreport = prop.reports.find(el => el.id === report)
        if(tempreport !== undefined){
          if(tempreport.fileName !== ""){
            let name = tempreport.property.replace(/\s+/g, '');
            let deleteRef = null
            if(report.fileRef) {
              deleteRef = report.fileRef
            } else {
              deleteRef = ref(storage, `files/${uid}/reports/${name}/${tempreport.year}/${tempreport.month}/${tempreport.fileName}`)  
            }
            console.log(deleteRef)
            await deleteObject(deleteRef).then(() => {
              console.log("File deleted")
            }).catch((err) => {
              console.log(err.message)
              return false
            })
          }
        }

        return true
      }
    }
  } catch(err) {
    console.log(err)
    return false
  }
}


export { 
  registerReport,
  removeReport,
  updateReportFirebase
}