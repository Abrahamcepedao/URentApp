//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

//CSS
import dash from '../styles/Dashboard.module.css'
import styles from '../styles/AddProperty.module.css'

//Components
import SideBar from '../components/user/SideBar'

//Material UI
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

//Material UI - icons
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';

//Context
import { useProperties } from '../context/PropertiesContext'

//loader spinner
import { ThreeDots } from 'react-loader-spinner'

//Interfaces
import Property from '../components/utils/interfaces/Property'

//Constants
import months from '../components/utils/constants/months'


//Alert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//Dashboard page
const EditReport: NextPage = () => {
    //router
    const router = useRouter()


    //Context - property
    const { properties, editReport, updateReport } = useProperties()

    //useState - state
    const [state, setState] = useState({
        properties: [],
        open: false,
        message: "",
        severity: ""
    })
    
    //useState - formData
    const [formData, setFormData] = useState({
        date: "",
        month: "",
        year: 0,
        property: "",
        amount: 0,
        concept: "",
        file: "",
        fileName: "",
        newFileName: "",
        comment: ""
    })

    //useState - utils
    const [utils, setUtils] = useState({
        error: "",
        loading: false,
        open: false,
    })


    //useEffect
    useEffect(() => {
        if(editReport){
            //set payment data
            setFormData({
                ...formData,
                date: editReport.date,
                month: editReport.month,
                year: editReport.year,
                property: editReport.property,
                amount: editReport.amount,
                concept: editReport.concept,
                file: "",
                fileName: editReport.fileName,
                newFileName: "",
                comment: editReport.comment
            })

            if(properties){
                if(properties.length !== 0){
                    let temp = properties.filter((pr:Property) => { return pr.status})
                    setState({
                        ...state,
                        properties: temp
                    })
                }
            }
        } else {
            router.push('/reports')
        }
    },[editReport])


    const handleClose = () => {
        setUtils({...utils, open: false})
        
    };

     /* handle file change */
    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.length !== 0) {
            //@ts-ignore
            setFormData({...formData, file: e.target.files[0], newFileName: e.target.files[0].name});
        }
    }

    /* check if property and tenant values change */
    const checkChanges = () => {
        if(editReport.date !== formData.date){
            return true
        }
        if(editReport.month !== formData.month){
            return true
        }
        if(editReport.year !== formData.year){
            return true
        }
        if(editReport.amount !== formData.amount){
            return true
        }
        if(editReport.concept !== formData.concept){
            return true
        }
        if(editReport.comment !== formData.comment){
            return true
        }
        if(formData.newFileName){
            return true
        }
        return false
    }

    /* handle input change (property and tenant) */
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    /* handle property change */
    const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pr:Property|undefined = state.properties.find((el:Property) => el.name === e.target.value)
        if(pr !== undefined){
            //@ts-ignore
            setFormData({...formData, property: e.target.value})
        }
        
    }

    /* handle cancel click */
    const handleCancelClick = () => {
        router.push('/reports')
    }

    /* handle save click */
    const verifyData = () => {
        if(formData.year < 2000 || formData.year > 2100){
            setUtils({...utils, error: "Introduzca una año válida"})
            return false
        }
        setUtils({...utils, error: ""})
        return true
    }


    const handleSaveClick = async() => {
        setUtils({...utils, error: "", loading: true})
        if(checkChanges() ){
            if(verifyData()){
                //update payment
                let temp =  {
                    id: editReport.id,
                    property: formData.property,
                    date: formData.date,
                    month: formData.month,
                    year: formData.year,
                    amount: Number(formData.amount),
                    concept: formData.concept,
                    comment: formData.comment,
                    fileName: editReport.fileName,
                    file: formData.file,
                    fileRef: editReport.fileRef,
                    fileUrl: editReport.fileUrl,
                    newFileName: formData.newFileName
                }
                console.log(temp)
                const res = await updateReport(temp, editReport.property !== formData.property ? formData.property : "", editReport.property !== formData.property ? editReport.property : "")
                if(res) {
                    //alert success
                    setUtils({...utils, error: "", loading: false})
                    router.push('/reports')
                } else {
                    //alert error
                    setUtils({...utils, error: "Ocurrión un error al guardar el reporte", loading: false})
                }
            }
        } else {
            //there are no changes
            setUtils({...utils, error: "No se han hecho cambios", loading: false})
        }
    }

    return (
        <div>
        <Head>
            <title>URent | Dashboard</title>
            <meta name="description" content="URent - Property rental management web platform" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={dash.main}>
            {/* @ts-ignore */}
            <SideBar/>

            {/* content */}
            <div className={styles.container}>
                <div className={styles.inner__container}>
                    {/* header */}
                    <div className={styles.header}>
                    {/* header title */}
                    <p className={dash.subtitle}>Editar datos de pago</p>
                    </div>

                    {/* property data */}
                    <div className={styles.form__container}>

                        {/* property */}
                        <div className={styles.inputs__row}>
                            {/* property */}
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Propiedad</p>
                                <select 
                                    name="type" 
                                    id="type"
                                    className={styles.input}
                                    value={formData.property}
                                    onChange={(e) => {handlePropertyChange(e)}}
                                >
                                    {state.properties.map((item:Property, i:number) => (
                                        <option key={i} value={item.name}>{item.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* date */}
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Fecha</p>
                                <input  type="date" name='date' value={formData.date} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
                            </div>


                            {/* amount */}
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Monto</p>
                                <input type="number" name='bruta' value={formData.amount} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
                            </div>

                            {/* concept */}
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Concepto</p>
                                <input type="text" name='concept' value={formData.concept} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
                            </div>

                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Comentario (op.)</p>
                                <input name='comment' value={formData.comment} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
                            </div>

                            {/* add ticket */}
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Comprobante (op.)</p>
                                <div className={styles.file__input__container}>
                                    <label htmlFor='file' className={styles.button}>
                                        <AttachFileRoundedIcon className={dash.table__icon}/>
                                    </label>
                                    <input name='file' id='file' type="file" onChange={(e) => {handleFileChange(e)}} className={styles.file__input}/>
                                    <p>{formData.newFileName.length > 20 ? formData.newFileName.substring(0,20) + "..." : formData.newFileName}</p>
                                </div>
                            </div>
                        </div>

                       
                        {utils.loading && (
                            <div className={styles.loader}>
                                <ThreeDots color="#A58453" height={100} width={100} />
                            </div>
                        )}

                        {/* snack bar */}
                        <Snackbar open={state.open} autoHideDuration={4000} onClose={handleClose}>
                            {/* @ts-ignore */}
                            <Alert onClose={handleClose} severity={state.severity ? state.severity : "info"} sx={{ width: '100%' }}>
                                {state.message}
                            </Alert>
                        </Snackbar>

                        {/* Save or cancel property */}
                        <div className={styles.actions__container}>
                            <button className={styles.cancel__btn} onClick={handleCancelClick}>Cancelar</button>    
                            <button className={styles.save__btn} onClick={handleSaveClick}>Guardar cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </div>
    )
}

export default EditReport
