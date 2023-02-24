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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

//Material UI - icons
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';

//Context
import { useProperties } from '../context/PropertiesContext'

//loader spinner
import { ThreeDots } from 'react-loader-spinner'

//Interfaces
import Property from '../components/utils/interfaces/Property'

//Constants
import months from '../components/utils/constants/months'
import methods from '../components/utils/constants/methods'

//Dashboard page
const EditPayment: NextPage = () => {
    //router
    const router = useRouter()

    //Material UI
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    //Context - property
    const { properties, editPayment, updatePayment } = useProperties()

    //useState - state
    const [state, setState] = useState({
        properties: []
    })
    
    //useState - formData
    const [formData, setFormData] = useState({
        date: "",
        month: "",
        year: 0,
        property: "",
        bruta: 0,
        neta: 0,
        method: "cash",
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
        if(editPayment){
            //set payment data
            setFormData({
                ...formData,
                date: editPayment.date,
                month: editPayment.month,
                year: editPayment.year,
                property: editPayment.property,
                bruta: editPayment.bruta,
                neta: editPayment.neta,
                method: editPayment.method,
                file: "",
                fileName: editPayment.fileName,
                newFileName: "",
                comment: editPayment.comment
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
            router.push('/payments')
        }
    },[editPayment])


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
        if(editPayment.date !== formData.date){
            return true
        }
        if(editPayment.month !== formData.month){
            return true
        }
        if(editPayment.year !== formData.year){
            return true
        }
        if(editPayment.bruta !== formData.bruta){
            return true
        }
        if(editPayment.neta !== formData.neta){
            return true
        }
        if(editPayment.method !== formData.method){
            return true
        }
        if(editPayment.comment !== formData.comment){
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
            setFormData({...formData, property: e.target.value, bruta: pr.contract.bruta, neta: pr.contract.neta})
        }
        
    }

    /* handle cancel click */
    const handleCancelClick = () => {
        router.push('/payments')
        //delete data from property
    }

    /* handle save click */
    const verifyData = () => {
        if(formData.year < 2000 || formData.year > 2100){
            setUtils({...utils, error: "Introduzca una año válida"})
            return false
        }
        if(formData.bruta < 1){
            setUtils({...utils, error: "Introduzca un monto bruto válido"})
            return false
        }
        if(formData.neta < 1){
            setUtils({...utils, error: "Introduzca un monto neto válido"})
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
                    id: editPayment.id,
                    property: formData.property,
                    date: formData.date,
                    month: formData.month,
                    year: formData.year,
                    bruta: Number(formData.bruta),
                    neta: Number(formData.neta),
                    method: formData.method,
                    comment: formData.comment,
                    fileName: editPayment.fileName,
                    file: formData.file,
                    fileRef: editPayment.fileRef,
                    fileUrl: editPayment.fileUrl,
                    newFileName: formData.newFileName
                }
                console.log(temp)
                const res = await updatePayment(temp, editPayment.property !== formData.property ? formData.property : "", editPayment.property !== formData.property ? editPayment.property : "")
                if(res) {
                    //alert success
                    setUtils({...utils, error: "", loading: false})
                    router.push('/payments')
                } else {
                    //alert error
                    setUtils({...utils, error: "Ocurrión un error al guardar el pago", loading: false})
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

                                    {/* month */}
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>Mes</p>
                                        <select 
                                            name="type" 
                                            id="type"
                                            className={styles.input}
                                            value={formData.month}
                                            onChange={(e) => {setFormData({...formData, month: e.target.value})}}
                                        >
                                           {months.map((item, i) => (
                                                <option key={i} value={item.en}>{item.es}</option>
                                           ))}
                                        </select>
                                    </div>

                                    {/* year */}
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>Año</p>
                                        <input name='year' value={formData.year} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
                                    </div>

                                    {/* amount */}
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>Monto bruto</p>
                                        <input type="number" name='bruta' value={formData.bruta} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
                                    </div>
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>Monto neto</p>
                                        <input type="number" name='neta' value={formData.neta} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
                                    </div>

                                    {/* method */}
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>Método</p>
                                        <select 
                                            name="type" 
                                            id="type"
                                            className={styles.input}
                                            value={formData.method}
                                            onChange={(e) => {setFormData({...formData, method: e.target.value})}}
                                        >
                                           {methods.map((item, i) => (
                                                <option key={i} value={item.val}>{item.txt}</option>
                                           ))}
                                        </select>
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

                        

                        {/* error message */}
                        {utils.error !== "" && (
                            <div className={styles.error__container}>
                                <ErrorRoundedIcon className={styles.error__icon}/>
                                <p className={styles.error__lbl}>{utils.error}</p>
                            </div>
                        )}
                        {utils.loading && (
                            <div className={styles.loader}>
                                <ThreeDots color="#A58453" height={100} width={100} />
                            </div>
                        )}

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

export default EditPayment
