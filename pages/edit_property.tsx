//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

//CSS
import dash from '../styles/Dashboard.module.css'
import styles from '../styles/AddProperty.module.css'

//Components
import SideBar from '../components/user/SideBar'
import { GreenSwitch } from '../components/utils/Switch'
import Chip from '../components/user/Chip'

//Material UI
import { Tooltip, IconButton, Collapse } from '@mui/material'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

//Material UI - icons
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';

//Utils
import { contractStatus } from '../components/utils/functions/contractStatus'
import openInNewTab from '../components/utils/functions/openInNewTab'
//Context
import { useProperties } from '../context/PropertiesContext'

//loader spinner
import { ThreeDots } from 'react-loader-spinner'

//Constants
import { contractStatusList, contractStatusBackground, contractStatusColor } from '../components/utils/constants/contract'

//MUI - Alert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//Dashboard page
const EditProperty: NextPage = () => {
    //router
    const router = useRouter()

    //Material UI
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    //Context - property
    const { editProperty, updateProperty } = useProperties()
    
    //useState - property & tenant
    const [property, setProperty] = useState({
        name: "",
        type: "house",
        status: false,
        tenantName: "",
        razon: "",
        phone: "",
        mail: "",
    })
    
    //useState - contract
    const [contract, setContract] = useState({
        bruta: 0,
        neta: 0,
        type: "month",
        day: 1,
        start: "",
        end: "",
        pdf: "",
        pdfUrl: "",
        pdfName: "",
        newPdfName: "",
        status: -1 //vencidos, 1 mes, 2 meses, 3-6 meses, 7 meses - 1 a??o, 1+ a??o
    })

    //useState - utils
    const [utils, setUtils] = useState({
        error: "",
        loading: false,
        open: false,
        severity: "info"
    })


    //useEffect
    useEffect(() => {
        if(editProperty){
            //set property data
            console.log(editProperty)
            if(editProperty.status) {
                //set tenant
                setProperty({
                    ...property,
                    name: editProperty.name,
                    type: editProperty.type,
                    status: editProperty.status,
                    tenantName: editProperty.tenant.name,
                    razon: editProperty.tenant.razon,
                    phone: editProperty.tenant.phone,
                    mail: editProperty.tenant.mail
                })

                //set contract
                setContract({
                    ...contract,
                    bruta: editProperty.contract.bruta,
                    neta: editProperty.contract.neta,
                    day: editProperty.contract.day,
                    type: editProperty.contract.type,
                    start: editProperty.contract.start,
                    end: editProperty.contract.end,
                    pdfName: editProperty.contract.pdfName,
                    pdfUrl: editProperty.contract.pdfUrl,
                    status: contractStatus(editProperty.contract.end)
                })
            } else {
                setProperty({
                    ...property,
                    name: editProperty.name,
                    type: editProperty.type,
                    status: editProperty.status
                })
            }
        } else {
            router.push('/properties')
        }
    },[editProperty])


    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }

        setUtils({...utils, open: false});
    };

    const handleClosee = () => {
        setUtils({...utils, open: false})
        setProperty({...property, 
            name: "", 
            status: false, 
            type: "house",
            tenantName: "",
            razon: "",
            phone: "",
            mail: "",
        })

        setContract({
            bruta: 0,
            neta: 0,
            type: "month",
            start: "",
            day: 1,
            end: "",
            pdf: "",
            pdfName: "",
            newPdfName: "",
            pdfUrl: "",
            status: -1
        })
    };

    const handleReturnClick = () => {
        //router.push('/properties')
    }
    
    const handleDateChange = (e:React.ChangeEvent<HTMLInputElement>, n:number) => {
        if(n === 0){
            //check start date is before end date
            if(contract.end !== ""){
                if(contract.end > e.target.value) {
                    //set start date
                    setContract({...contract, start: e.target.value})
                } else {
                    //alert "start date must be before start date"
                    alert("start date must be before start date")
                }
            } else {
                //set start date
                setContract({...contract, start: e.target.value})
            }
        } else {
            //check end date is after start date
            if(contract.start !== ""){
                if(contract.start < e.target.value) {
                    //calculate contract status
                    //@ts-ignore
                    let status = contractStatus(e.target.value)
                    console.log(status)

                    //set start date
                    setContract({...contract, end: e.target.value, status: status})
                } else {
                    //alert "end date must be after start date"
                    alert("end date must be after start date")
                }
            } else {
                //@ts-ignore
                let status = contractStatus(e.target.value)
                console.log(status)
                //set start date
                setContract({...contract, end: e.target.value, status: status})
            }
        }
    }

    /* pdf functions */
    const validPdf = (pdf:File) => {
        if(pdf.type === "application/pdf" || pdf.type.includes("pdf")){
            return true
        } else {
            return false
        }
    }

    const handlePDFChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files)
        if(e.target.files?.length !== 0) {
            //@ts-ignore
            if(validPdf(e.target.files[0])) {
                //@ts-ignore
                setContract({...contract, pdf: e.target.files[0], newPdfName: e.target.files[0].name});
            } else {
                //prompt error here
                alert("El archivo debe ser de tipo PDF")
            }
        }
    }

    

    /* handle input change (property and tenant) */
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setProperty({
        ...property,
            [e.target.name]: e.target.value
        })
    }


    /* handle pay day change */
    const handleDayChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        let val:number = parseInt(e.target.value)
        if(val >= 1 && val <= 31){
            //udpdate dat
            setContract({...contract, day: val})
        }

        if(e.target.value === ""){
            setContract({...contract, day: parseInt(e.target.value)})
        }
    }
    
    /* handle cancel click */
    const handleCancelClick = () => {
        //router.push('/properties')
        //delete data from property
    }

    /* handle verify data */
    const verifyData = () => {
        let flag = true
        if(property.name === "") {
            setUtils({...utils, error: "Agrega el nombre de la propiedad", open: true, severity: "error"})
            return false
        }
        if(property.status){
            if(property.tenantName === "") {
                setUtils({...utils, error: "Agrega el nombre del arrendatario", open: true, severity: "error"})
                return false
            }
            if(property.razon === "") {
                setUtils({...utils, error: "Agrega la raz??n social del arrendatario", open: true, severity: "error"})
                return false
            }
            if(property.phone === "") {
                setUtils({...utils, error: "Agrega el tel??fono del arrendatario", open: true, severity: "error"})
                return false
            }
            if(property.mail === "") {
                setUtils({...utils, error: "Agrega el mail del arrendatario", open: true, severity: "error"})
                return false
            }
            if(contract.bruta === 0) {
                setUtils({...utils, error: "Agrega la renta bruta del contrato", open: true, severity: "error"})
                return false
            }
            if(contract.day < 0 && contract.day > 32) {
                setUtils({...utils, error: "Agrega el d??a de pago del contrato", open: true, severity: "error"})
                return false
            }
            if(contract.neta === 0) {
                setUtils({...utils, error: "Agrega la renta neta del contrato", open: true, severity: "error"})
                return false
            }
            if(contract.start === "") {
                setUtils({...utils, error: "Agrega la fecha inicial del contrato", open: true, severity: "error"})
                return false
            }
            if(contract.end === "") {
                setUtils({...utils, error: "Agrega la fecha final del contrato", open: true, severity: "error"})
                return false
            }
            if(contract.pdf === "") {
                setUtils({...utils, error: "Agrega el pdf del contrato", open: true, severity: "error"})
                return false
            }
        }
        return flag
    }


    /* check if property and tenant values change */
    const checkChanges = () => {
        if(editProperty.name !== property.name){
            return true
        }
        if(editProperty.type !== property.type){
            return true
        }
        if(editProperty.status !== property.status){
            return true
        }

        if(property.status){
            if(editProperty.tenant.name !== property.tenantName){
                return true
            }
            if(editProperty.tenant.razon !== property.razon){
                return true
            }
            if(editProperty.tenant.mail !== property.mail){
                return true
            }
            if(editProperty.tenant.phone !== property.phone){
                return true
            }
            if(editProperty.contract.day !== contract.day){
                return true
            }
            if(editProperty.contract.start !== contract.start){
                return true
            }
            if(editProperty.contract.end !== contract.end){
                return true
            }
            if(editProperty.contract.type !== contract.type){
                return true
            }
            if(editProperty.contract.bruta !== contract.bruta){
                return true
            }
            if(editProperty.contract.neta !== contract.neta){
                return true
            }
            if(contract.newPdfName !== ""){
                return true
            }
        }
        setUtils({...utils, error: "No se han hecho cambios", loading: false, open: true, severity: "error"})
        return false
    }

    /* handle save click */
    const handleSaveClick = async() => {
        setUtils({...utils, error: "", loading: true})
        console.log(property)
        console.log(contract)
        if(verifyData() && checkChanges()){
            //changes exist
            //update changes
            if(contract.newPdfName !== ""){
                //udpate with new contract
                let temp = {
                    name: property.name,
                    type: property.type,
                    status: property.status,
                    tenant: {
                        name: property.tenantName,
                        razon: property.razon,
                        phone: property.phone,
                        mail: property.mail,
                    },
                    contract: {
                        start: contract.start,
                        end: contract.end,
                        type: contract.type,
                        bruta: contract.bruta,
                        day: contract.day,
                        neta: contract.neta,
                        pdfName: contract.pdfName,
                        newPdfName: contract.newPdfName,
                        pdf: contract.pdf
                    }       
                }
                const res = await updateProperty(temp, true)
                if(res) {
                    //alert success
                    setUtils({...utils, error: "", loading: false})
                    router.push('/properties')
                } else {
                    //alert error
                    setUtils({...utils, error: "Ocurri??n un error al subir la propiedad", loading: false})
                }
            } else {
                //update with same contract
                let temp = {
                    name: property.name,
                    type: property.type,
                    status: property.status,
                    tenant: {
                        name: property.tenantName,
                        razon: property.razon,
                        phone: property.phone,
                        mail: property.mail,
                    },
                    contract: {
                        start: contract.start,
                        end: contract.end,
                        type: contract.type,
                        bruta: contract.bruta,
                        day: contract.day,
                        neta: contract.neta,
                        pdfName: contract.pdfName,
                        pdfUrl: contract.pdfUrl
                    }       
                }
                const res = await updateProperty(temp, false)
                if(res) {
                    //alert success
                    setUtils({...utils, error: "", loading: false})
                    router.push('/properties')
                } else {
                    //alert error
                    setUtils({...utils, error: "Ocurri??n un error al guardar los datos", loading: false})
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

                {/* content */}
                <div className={styles.container}>
                    <div className={styles.inner__container}>
                        {/* header */}
                        <div className={styles.header}>
                        {/* header title */}
                        <p className={dash.subtitle}>Datos de propiedad</p>
                        </div>

                        {/* property data */}
                        <div className={styles.form__container}>

                            {/* property */}
                            <div className={styles.inputs__row}>
                                <div className={styles.input__container}>
                                    <p className={styles.input__label}>Nombre</p>
                                    <input placeholder='Ingrese el nombre' name="name" className={styles.input} value={property.name} onChange={(e) => {handleInputChange(e)}}/>
                                </div>
                                <div className={styles.input__container}>
                                    <p className={styles.input__label}>Tipo</p>
                                    <select 
                                        name="type" 
                                        id="type" 
                                        className={styles.input}
                                        value={property.type}
                                        onChange={(e) => {setProperty({...property, type: e.target.value})}}
                                    >
                                        <option value="house">Casa</option>
                                        <option value="apartment">Departamento</option>
                                        <option value="storage">Bodega</option>
                                        <option value="ofice">Oficina</option>
                                        <option value="land">Terreno</option>
                                        <option value="local">Local</option>
                                        <option value="roof">Azotea</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                                <div className={styles.input__container}>
                                    <p className={styles.input__label}>En renta</p>
                                    <GreenSwitch checked={property.status} onChange={(e: { target: { checked: any } }) => {
                                        console.log(e.target.checked)
                                        setProperty({...property, status: e.target.checked})
                                    }}/>
                                </div>
                            </div>

                            {/* tenant */}
                            <Collapse in={property.status}>
                                <div className={styles.tenant}>
                                    <p className={dash.subtitle}>Datos de arrendatario</p>
                                    <div className={styles.tenant__container}>
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Nombre</p>
                                            <input placeholder='Ingrese el nombre' name="tenantName" className={styles.input} value={property.tenantName} onChange={(e) => {handleInputChange(e)}}/>
                                        </div>
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Raz??n social</p>
                                            <input placeholder='Ingrese la raz??n social' name="razon" className={styles.input} value={property.razon} onChange={(e) => {handleInputChange(e)}}/>
                                        </div>
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Tel??fono</p>
                                            <input type="number" className={styles.input} name="phone" value={property.phone} onChange={(e) => {handleInputChange(e)}}/>
                                        </div>
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Email</p>
                                            <input placeholder='Ingrese el mail' name="mail" className={styles.input} value={property.mail} onChange={(e) => {handleInputChange(e)}}/>
                                        </div>

                                        {/* renta bruta */}
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Renta bruta</p>
                                            <input type="number" className={styles.input} value={contract.bruta} onChange={(e) => {setContract({...contract, bruta: parseFloat(e.target.value)})}}/>
                                        </div>

                                        {/* renta neta */}
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Renta neta</p>
                                            <input type="number" className={styles.input} value={contract.neta} onChange={(e) => {setContract({...contract, neta: parseFloat(e.target.value)})}}/>
                                        </div>

                                        {/* dia de pago */}
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>D??a de pago</p>
                                            <input type="number" className={styles.input} value={contract.day} onChange={(e) => {handleDayChange(e)}}/>
                                        </div>

                                        {/* type of rent */}
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Tipo de renta</p>
                                            <select 
                                                name="type" 
                                                id="type"
                                                className={styles.input}
                                                value={contract.type}
                                                onChange={(e) => {setContract({...contract, type: e.target.value})}}
                                            >
                                                <option value="month">Mensual</option>
                                                <option value="2months">2 Meses</option>
                                                <option value="3months">3 Meses</option>
                                                <option value="6months">6 Meses</option>
                                                <option value="year">Anual</option>
                                            </select>
                                        </div>

                                        {/* contract */}
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Inicio de contrato</p>
                                            <input type="date" className={styles.input} value={contract.start} onChange={(e) => {handleDateChange(e,0)}}/>
                                        </div>
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Fin de contrato</p>
                                            <input type="date" className={styles.input} value={contract.end} onChange={(e) => {handleDateChange(e,1)}}/>
                                        </div>
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Estado de contrato</p>
                                            {contract.status !== -1 && (
                                                <Chip title={contractStatusList[contract.status]} background={contractStatusBackground[contract.status]} color={contractStatusColor[contract.status]}/>
                                            )}
                                        </div>
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>PDF de contrato</p>
                                            {contract.pdfUrl !== "" && (
                                                <Tooltip title={contract.pdfName} placement='top'>
                                                    <IconButton onClick={() => {openInNewTab(contract.pdfUrl)}}>
                                                        <DownloadRoundedIcon className={dash.table__icon}/>
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </div>
                                        {/* add contract */}
                                        <div className={styles.input__container}>
                                            <p className={styles.input__label}>Cambiar PDF</p>
                                            <div className={styles.file__input__container}>
                                                <label htmlFor='file' className={styles.button}>
                                                    <AttachFileRoundedIcon className={dash.table__icon}/>
                                                </label>
                                                <input name='file' id='file' type="file" onChange={(e) => {handlePDFChange(e)}} className={styles.file__input}/>
                                                <p>{contract.newPdfName.length > 20 ? contract.newPdfName.substring(0,20) + "..." : contract.newPdfName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Collapse>

                            {utils.loading && (
                                <div className={styles.loader}>
                                    <ThreeDots color="#A58453" height={100} width={100} />
                                </div>
                            )}

                            {/* Save or cancel property */}
                            <div className={styles.actions__container} style={{marginTop: property.status ? "0px": "30px"}}>
                                {property.status && (
                                    <button className={dash.delete__fill__btn} onClick={handleCancelClick} style={{marginRight: '15px'}}>Terminar contrato</button>    
                                )}
                                <button className={dash.gradient__btn} onClick={handleSaveClick}>Guardar cambios</button>
                            </div>
                        </div>
                    </div>
                </div>

                <Snackbar open={utils.open} autoHideDuration={6000} onClose={handleClose}>
                    {/* @ts-ignore */}
                    <Alert onClose={handleClose} severity={utils.severity} sx={{ width: '100%' }}>
                    {utils.error}
                    </Alert>
                </Snackbar>
            </main>
        </div>
    )
}

export default EditProperty
