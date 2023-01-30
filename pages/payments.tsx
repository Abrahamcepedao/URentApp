//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import Head from 'next/head'
import dash from '../styles/Dashboard.module.css'
import styles from '../styles/Payments.module.css'

//Components
import SideBar from '../components/user/SideBar'

//Material UI
import { Tooltip, IconButton, Collapse } from '@mui/material'

//Material UI - icons
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

//constant
import months from '../components/utils/constants/months'
import methods from '../components/utils/constants/methods'

//Context
import { useAuth } from '../context/AuthContext'
import { useProperties } from '../context/PropertiesContext'

//interfaces
interface Property {
  name: string,
  type: string,
  status: number,
  tenant: {
    name: string,
    razon: string,
    phone: string,
    mail: string,
  },
  contract: {
    start: string
    end: string,
    type: string,
    cost: number,
    pdfName: string,
    pdfUrl: string,
    status: number
  }
}

//Dashboard page
const Payments: NextPage = () => {
    //Context
    const { user } = useAuth()
    const { properties, fecthProperties } = useProperties()

    //useState
    const [state, setState] = useState({
        payments: [],
        addOpen: false,
        error: "",
        properties: [],
    })

    const [formData, setFormData] = useState({
        date: "",
        month: "",
        year: 0,
        property: "",
        amount: 0,
        method: "",
        file: "",
        fileName: ""
    })

    useEffect(() => {
       
        setUp()
    },[])

    const setUp = () => {
        if(properties.length !== 0){
            let temp = properties.filter((pr:Property) => { return pr.status})
            setState({...state, properties: temp})

            //formData
            let today = new Date()
            let date = today.toISOString().split('T')[0]
            console.log(properties)
            if(properties.length !== 0){
                const pr:Property = properties[0]
                setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear(), property: pr.name, amount: pr.contract.cost})
            } else {
                setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear()})
            }
        } else {
            getProperties()
        }
    }

    const getProperties = async() => {
    let data = await fecthProperties()
    if(data !== false) {
        //set properties state
        let temp = data.filter((pr:Property) => pr.status)
        setState({
            ...state,
            properties: temp
        })
        //formData
        let today = new Date()
        let date = today.toISOString().split('T')[0]
        console.log(temp)
        if(temp.length !== 0){
            const pr:Property = temp[0]
            setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear(), property: pr.name, amount: pr.contract.cost})
        } else {
            setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear()})
        }

    } 
  }

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setFormData({
        ...formData,
            [e.target.name]: e.target.value
        })

    }


    const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pr:Property|undefined = state.properties.find((el:Property) => el.name === e.target.value)
        if(pr !== undefined){
            //@ts-ignore
            setFormData({...formData, property: e.target.value, amount: Number(pr.contract.cost)})
        }
        
    }

    /* handle file change */
    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files)
        if(e.target.files?.length !== 0) {
            //@ts-ignore
            if(validPdf(e.target.files[0])) {
                //@ts-ignore
                setContract({...contract, pdf: e.target.files[0], pdfName: e.target.files[0].name});
            } else {
                //prompt error here
                alert("El archivo debe ser de tipo PDF")
            }
        }
    }

    /* handle register payment click */
    const verifyData = () => {
        if(formData.year < 2000 || formData.year > 2100){
            setState({...state, error: "Introduzca una fecha válida"})
            return false
        }
        setState({...state, error: ""})
        return true
    }

    const handleRegisterPayment = () => {
        if(verifyData()){
            //save payment
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
                <div className={styles.container}>
                    <div className={styles.inner__container}>
                        {/* header */}
                        <div className={styles.payments__header}>
                            <p className={dash.subtitle}>Registrar pagos</p>
                            {state.addOpen ? (
                                <Tooltip title="Cerrar">
                                    <IconButton onClick={() => {setState({...state, addOpen: false})}}>
                                        <HighlightOffRoundedIcon className={dash.header__icon}/>
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Registrar pago" placement='top'>
                                <IconButton onClick={() => {setState({...state, addOpen: true})}}>
                                    <AddCircleRoundedIcon className={dash.header__icon}/>
                                </IconButton>
                            </Tooltip>
                            )}
                            
                        </div>

                        {/* add user collapse */}
                        <Collapse in={state.addOpen}>
                            <div className={styles.add__container}>
                                <div className={styles.inputs__container}>
                                    {/* property */}
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>Propiedad</p>
                                        <select 
                                            name="type" 
                                            id="type"
                                            className={styles.input}
                                            value={formData.month}
                                            onChange={(e) => {handlePropertyChange(e)}}
                                        >
                                           {state.properties.map((item:Property, i) => (
                                            <>
                                                <option key={i} value={item.name}>{item.name}</option>
                                            </>
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
                                            <>
                                                <option key={i} value={item.en}>{item.es}</option>
                                            </>
                                           ))}
                                        </select>
                                    </div>

                                    {/* year */}
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>año</p>
                                        <input name='year' value={formData.year} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
                                    </div>

                                    {/* amount */}
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>Monto</p>
                                        <input type="number" name='amount' value={formData.amount} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
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
                                            <>
                                                <option key={i} value={item}>{item}</option>
                                            </>
                                           ))}
                                        </select>
                                    </div>

                                    {/* add ticket */}
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>Comprobante</p>
                                        <div>
                                            <label htmlFor='file' className={styles.button}>
                                                <p>Agregar archivo</p>
                                                <FileUploadRoundedIcon className={dash.table__icon}/>
                                            </label>
                                            <input name='file' id='file' type="file" onChange={(e) => {handleFileChange(e)}} className={styles.file__input}/>
                                            <p>{formData.fileName.length > 20 ? formData.fileName.substring(0,20) + "..." : formData.fileName}</p>
                                        </div>
                                    </div>
                                </div>
                                {state.error !== "" && (
                                    <div className={styles.error__container}>
                                        <ErrorRoundedIcon className={styles.error__icon}/>
                                        <p className={styles.error__lbl}>{state.error}</p>
                                    </div>
                                )}
                                <button className={styles.save__btn} onClick={handleRegisterPayment}>
                                    Registrar pago
                                </button>
                            </div>
                        </Collapse>

                        {/* payments list */}
                        <div className={styles.payments__table}>
                            {/* table header */}
                            <div className={styles.table__header}>
                                <div className={styles.header__cell}>
                                    Fecha
                                </div>
                                <div className={styles.header__cell}>
                                    Año
                                </div>
                                <div className={styles.header__cell}>
                                    Mes
                                </div>
                                <div className={styles.header__cell}>
                                    Propiedad
                                </div>
                                <div className={styles.header__cell}>
                                    Monto
                                </div>
                                <div className={styles.header__cell__lg}>
                                    Comprobante
                                </div>
                            </div>

                            {/* table rows */}
                           
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Payments
