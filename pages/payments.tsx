//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

//CSS
import dash from '../styles/Dashboard.module.css'
import styles from '../styles/Payments.module.css'

//Components
import SideBar from '../components/user/SideBar'

//Material UI
import { Tooltip, IconButton, Collapse } from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

//Material UI - icons
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

//Constants
import months from '../components/utils/constants/months'
import methods from '../components/utils/constants/methods'

//Utils
import getMethod from '../components/utils/functions/getMethod'
import formatMoney from '../components/utils/functions/formatMoney'

//Context
import { useAuth } from '../context/AuthContext'
import { useProperties } from '../context/PropertiesContext'
import openInNewTab from '../components/utils/functions/openInNewTab'

//interfaces
import Property from '../components/utils/interfaces/Property'
import Payment from '../components/utils/interfaces/Payment'


//Alert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//Dashboard page
const Payments: NextPage = () => {
    //Context
    const { user } = useAuth()
    const { properties, fecthProperties, addPayment } = useProperties()

    //useState
    const [state, setState] = useState({
        payments: [],
        paymentsList: [],
        addOpen: false,
        open: false,
        error: "",
        properties: [],
    })

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
        comment: ""
    })

    useEffect(() => {
        setUp()
    },[])

    /* handle snack close */
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }

        setState({...state, open: false})
    };

    const setUp = () => {
        if(properties.length !== 0){
            let temp = properties.filter((pr:Property) => { return pr.status})
            let payments:Payment[] = []
            temp.forEach((item:Property) => {
                if(item.payments){
                    item.payments.forEach((payment:Payment) => {
                        payments.push({...payment, property: item.name})
                    })
                }
            })

            //@ts-ignore
            setState({...state, properties: temp, payments: payments, paymentsList: payments})

            //formData
            let today = new Date()
            let date = today.toISOString().split('T')[0]
            if(properties.length !== 0){
                const pr:Property = properties[0]
                setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear(), property: pr.name, bruta: pr.contract.bruta, neta: pr.contract.neta})
            } else {
                setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear()})
            }
        } else {
            getProperties(false)
        }
    }

    const getProperties = async(flag:boolean) => {
        let data = await fecthProperties()
        if(data !== false) {
            //set properties state
            let temp = data.filter((pr:Property) => pr.status)
            let payments:Payment[] = []
            temp.forEach((item:Property) => {
                if(item.payments){
                    item.payments.forEach((payment:Payment) => {
                        payments.push({...payment, property: item.name})
                    })
                }
            })

            //@ts-ignore
            setState({...state, properties: temp, payments: payments, paymentsList: payments, error: "", open: flag})
            

            //formData
            let today = new Date()
            let date = today.toISOString().split('T')[0]
            console.log(temp)
            if(temp.length !== 0){
                const pr:Property = temp[0]
                setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear(), property: pr.name, bruta: pr.contract.bruta, neta: pr.contract.neta,file: "", fileName: "", comment: ""})
            } else {
                setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear(),file: "", fileName: "", comment: ""})
            }

        } 
    }

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
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
        if(e.target.files?.length !== 0) {
            //@ts-ignore
            setFormData({...formData, file: e.target.files[0], fileName: e.target.files[0].name});
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

    const handleRegisterPayment = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if(verifyData()){
            //save payment
            let pr:Property|undefined = state.properties.find((el:Property) => el.name === formData.property)
            if(pr !== undefined) {
                let temp = {
                    date: formData.date,
                    month: formData.month,
                    year: formData.year,
                    bruta: formData.bruta,
                    neta: formData.neta,
                    method: formData.method,
                    fileName: formData.fileName,
                    file: formData.file,
                    comment: formData.comment
                }
                console.log(temp)
                const res = await addPayment(pr,temp)
                if(res) {
                    //alert success
                    //setState({...state, error: "",  open: true})
                    //setFormData({...formData, file: "", fileName: "", comment: ""})
                    getProperties(true)
                } else {
                    //alert error
                    setState({...state, error: "Ocurrió un error al registrar el pago"})
                }
            }
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
                                <Tooltip title="Cerrar" placement='top'>
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
                                            value={formData.property}
                                            onChange={(e) => {handlePropertyChange(e)}}
                                        >
                                           {state.properties.map((item:Property, i) => (
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
                                <button className={styles.save__btn} onClick={(e) => {handleRegisterPayment(e)}}>
                                    Registrar pago
                                </button>
                            </div>
                        </Collapse>

                        {/* payments list */}
                        <div className={styles.payments__table}>
                            {/* table header */}
                            <div className={styles.table__header}>
                                <div className={styles.header__cell}>
                                    Propiedad
                                </div>
                                <div className={styles.header__cell__sm}>
                                    Fecha
                                </div>
                                <div className={styles.header__cell__sm}>
                                    Año
                                </div>
                                <div className={styles.header__cell__sm}>
                                    Mes
                                </div>
                                <div className={styles.header__cell__sm}>
                                    P. Bruto
                                </div>
                                <div className={styles.header__cell__sm}>
                                    P. Neto
                                </div>
                                <div className={styles.header__cell__sm}>
                                    Método
                                </div>
                                <div className={styles.header__cell}>
                                    Comentario
                                </div>
                                <div className={styles.header__cell__lg}>
                                    Comprobante
                                </div>
                            </div>

                            {/* table rows */}
                            {state.paymentsList.length !== 0 ? state.paymentsList.map((item:Payment, i) => (
                                <div key={i} className={styles.table__row}>
                                    <div className={styles.header__cell}>
                                        {item.property.length > 25 ? item.property.substring(0,25) + "..." : item.property}
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {item.date}
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {item.year}
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {item.month}
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {item.bruta !== 0 ? formatMoney(item.bruta) : "-"}
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {item.neta !== 0 ? formatMoney(item.neta) : "-"}
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {getMethod(item.method)}
                                    </div>
                                    <div className={styles.header__cell}>
                                        {item.comment.length > 25 ? item.comment.substring(0,25) + "..." : item.comment}
                                    </div>

                                    <div className={styles.header__cell__lg}>
                                        <div className={styles.cell__btns}>
                                            <Tooltip title={item.fileName} placement='top'>
                                                <IconButton disabled={item.fileUrl === ""} onClick={() => {openInNewTab(item.fileUrl)}}>
                                                    <FileDownloadRoundedIcon className={dash.table__icon}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar pago" placement='top'>
                                                <IconButton>
                                                    <EditRoundedIcon className={dash.table__icon}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar pago" placement='top'>
                                                <IconButton>
                                                    <DeleteRoundedIcon className={dash.table__icon}/>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className={styles.table__row}>
                                    <div className={styles.header__cell}>
                                        Todavía no hay pagos
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* snack bar */}
                <Snackbar open={state.open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        ¡Se registró el pago exitosamente!
                    </Alert>
                </Snackbar>
            </main>
        </div>
    )
}

export default Payments
