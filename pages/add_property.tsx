//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
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

//Material UI - icons
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';

//Utils
import { contractStatus } from '../components/utils/functions/contractStatus'


//Dashboard page
const AddProperty: NextPage = () => {
    const [property, setProperty] = useState({
        name: "",
        type: "house",
        status: false
    })
    
    const [tenant, setTenant] = useState({
        name: "",
        razon: "",
        phone: "",
        mail: "",
    })

    const [contract, setContract] = useState({
        cost: 0,
        type: "month",
        start: "",
        end: "",
        pdf: "",
        pdfName: "",
        status: -1 //vencidos, 1 mes, 2 meses, 3-6 meses, 7 meses - 1 año, 1+ año
    })

    let contractStatusList = ["Vencido", "1 mes", "2 meses", "3-6 meses", "7 meses - 1 año", "1+ año"]
    let contractStatusBackground = ["#D24B4B", "#DF5A3D", "#D27C4B", "#E3C37E", "#38AC97", "#31B73F"]
    let contractStatusColor = ["#903030", "#983925", "#95542F", "#A37E2F", "#257567", "#21812B"]

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
                setContract({...contract, pdf: e.target.files[0], pdfName: e.target.files[0].name});
            } else {
                //prompt error here
                alert("El archivo debe ser de tipo PDF")
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
                        <input placeholder='Ingrese el nombre' className={styles.input} value={property.name} onChange={(e) => {setProperty({...property, name: e.target.value})}}/>
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
                        <GreenSwitch value={property.status} onChange={(e: { target: { checked: any } }) => {setProperty({...property, status: e.target.checked})}}/>
                    </div>
                </div>

                {/* tenant */}
                <Collapse in={property.status}>
                    <div className={styles.tenant}>
                        <p className={dash.subtitle}>Datos de arrendatario</p>
                        <div className={styles.tenant__container}>
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Nombre</p>
                                <input placeholder='Ingrese el nombre' className={styles.input} value={tenant.name} onChange={(e) => {setTenant({...tenant, name: e.target.value})}}/>
                            </div>
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Razón social</p>
                                <input placeholder='Ingrese la razón social' className={styles.input} value={tenant.name} onChange={(e) => {setTenant({...tenant, razon: e.target.value})}}/>
                            </div>
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Teléfono</p>
                                <input type="number" className={styles.input} value={tenant.name} onChange={(e) => {setTenant({...tenant, phone: e.target.value})}}/>
                            </div>
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Email</p>
                                <input placeholder='Ingrese el mail' className={styles.input} value={tenant.name} onChange={(e) => {setTenant({...tenant, mail: e.target.value})}}/>
                            </div>

                            {/* contract */}
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>Costo</p>
                                <input type="number" className={styles.input} value={contract.cost} onChange={(e) => {setContract({...contract, cost: parseFloat(e.target.value)})}}/>
                            </div>
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
                            {/* add contract */}
                            <div className={styles.input__container}>
                                <p className={styles.input__label}>PDF de contrato</p>
                                <div>
                                    <label htmlFor='file' className={styles.button}>
                                        <p>Agregar archivo</p>
                                        <FileUploadRoundedIcon className={dash.table__icon}/>
                                    </label>
                                    <input name='file' id='file' type="file" onChange={(e) => {handlePDFChange(e)}} className={styles.file__input}/>
                                    <p>{contract.pdfName.length > 20 ? contract.pdfName.substring(0,20) + "..." : contract.pdfName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Collapse>

                {/* Save property */}
                <div>
                    
                </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddProperty
