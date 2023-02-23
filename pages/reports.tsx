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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

//Material UI - icons
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';

//Constants
import months from '../components/utils/constants/months'

//Context
import { useAuth } from '../context/AuthContext'
import { useProperties } from '../context/PropertiesContext'
import openInNewTab from '../components/utils/functions/openInNewTab'

//interfaces
import Property from '../components/utils/interfaces/Property'
import Report from '../components/utils/interfaces/Report'

//Alert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//Dashboard page
const Reports: NextPage = () => {
    //Context
    const { user } = useAuth()
    const { properties, fecthProperties, addPayment } = useProperties()

    //useState - menu
    const [menuAnchor, setMenuAnchor] = useState(null);
    const menuOpen = Boolean(menuAnchor);

    //useState
    const [state, setState] = useState({
        reports: [],
        reportsList: [],
        addOpen: false,
        open: false,
        error: "",
        properties: [],
        filter: "",
        sort: 0
    })

    const [formData, setFormData] = useState({
        date: "",
        month: "",
        year: 0,
        property: "",
        amount: 0,
        file: "",
        fileName: "",
        comment: "",
        concept: ""
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


    /* order menu functions */
    const handleClick = (event:any) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };


    /* handle filter change */
    const handleFilterChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        let temp = state.reports.filter((pr:Report) => pr.property.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
        setState({...state, reportsList: temp, filter: e.target.value})
    }

    const setUp = () => {
        if(properties.length !== 0){
            let temp = properties.filter((pr:Property) => { return pr.status})
            let reports:Report[] = []
            temp.forEach((item:Property) => {
                if(item.reports){
                    item.reports.forEach((report:Report) => {
                        reports.push({...report, property: item.name})
                    })
                }
            })

            //@ts-ignore
            setState({...state, properties: temp, reports: reports, reportsList: reports})

            //formData
            let today = new Date()
            let date = today.toISOString().split('T')[0]
            if(properties.length !== 0){
                const pr:Property = properties[0]
                setFormData({...formData, date: date, property: pr.name, month: months[today.getMonth()].en, year: today.getFullYear()})
            } else {
                setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear()})
            }
        } else {
            getProperties()
        }
    }


    /* handle order change */
    const handleOrderChange = (num:number) => {
        let temp:Report[] = [...state.reportsList]
        console.log(num, state.sort)
        if(num === state.sort){
            temp.reverse()
        } else if(num === 0) {
            temp.sort((a,b) => { return a.property < b.property ? -1 : 1})
        } else if(num === 1){
            temp.sort((a,b) => { return a.date < b.date ? -1 : 1})
        } else if(num === 2){
            temp.sort((a,b) => { return a.concept < b.concept ? -1 : 1})
        }
        //@ts-ignore
        setState({...state, paymentsList: temp, sort: num})
    }

    /* get proopertiess */
    const getProperties = async() => {
        let data = await fecthProperties()
        if(data !== false) {
            //set properties state
            let temp = data.filter((pr:Property) => pr.status)
            let reports:Report[] = []
            temp.forEach((item:Property) => {
                if(item.reports){
                    item.reports.forEach((report:Report) => {
                        reports.push({...report, property: item.name})
                    })
                }
            })

            //@ts-ignore
            setState({...state, properties: temp, reports: reports, reportsList: reports})

            //formData
            let today = new Date()
            let date = today.toISOString().split('T')[0]
            console.log(temp)
            if(temp.length !== 0){
                const pr:Property = temp[0]
                setFormData({...formData, date: date, property: pr.name})
            } else {
                setFormData({...formData, date: date})
            }

        } 
    }

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
            [e.target.name]: e.target.value
        })

    }

    /* handle date change */
    const handleDateChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        let date = new Date(e.target.value)
        console.log(date.getMonth(), date.getFullYear())
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            month: months[date.getMonth()].en,
            year: date.getFullYear()
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
        if(formData.concept === ""){
            return false
        }
        //check data
        setState({...state, error: ""})
        return true
    }

    const handleRegisterReport = async() => {
        if(verifyData()){
            console.log(formData)
            /* //save payment
            let pr:Property|undefined = state.properties.find((el:Property) => el.name === formData.property)
            if(pr !== undefined) {
                let temp = {
                    date: formData.date,
                    amount: formData.amount,
                    concept: formData.concept,
                    fileName: formData.fileName,
                    file: formData.file,
                    comment: formData.comment
                }
                console.log(temp)
                const res = await addPayment(pr,temp)
                if(res) {
                    //alert success
                    setState({...state, error: "",  open: true})
                    setFormData({...formData, file: "", fileName: "", comment: ""})
                    await getProperties()
                } else {
                    //alert error
                    setState({...state, error: "Ocurrió un error al registrar el reporte"})
                }
            } */
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
                            <p className={dash.subtitle}>Registrar reportes</p>
                            
                            <div className={styles.header__actions}>
                                <div className={styles.filter__container}>
                                    <SearchRoundedIcon className={dash.table__icon}/>
                                    <input placeholder='Nombre propiedad' value={state.filter} onChange={(e) => {handleFilterChange(e)}} className={styles.search__input}/>
                                </div>
                                {/* Refresh */}
                                <Tooltip title="Refrescar" placement='top'>
                                    <IconButton
                                        onClick={() => {getProperties()}}
                                    >
                                        <RefreshRoundedIcon className={dash.header__icon}/>
                                    </IconButton>
                                </Tooltip>

                                {/* Filtrar */}
                                <Tooltip title="Filtrar" placement='top'>
                                    <IconButton
                                        onClick={(e) => {handleClick(e)}}
                                        aria-controls={menuOpen ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={menuOpen ? 'true' : undefined}
                                    >
                                        <FilterListRoundedIcon className={dash.header__icon}/>
                                    </IconButton>
                                </Tooltip>
                                {state.addOpen ? (
                                    <Tooltip title="Cerrar" placement='top'>
                                        <IconButton onClick={() => {setState({...state, addOpen: false})}}>
                                            <HighlightOffRoundedIcon className={dash.header__icon}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Registrar reporte" placement='top'>
                                        <IconButton onClick={() => {setState({...state, addOpen: true})}}>
                                            <AddCircleRoundedIcon className={dash.header__icon}/>
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                        </div>

                        {/* add report collapse */}
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
                                        <input  type="date" name='date' value={formData.date} onChange={(e) => {handleDateChange(e)}} className={styles.input}/>
                                    </div>


                                    {/* concept */}
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>Concepto</p>
                                        <input type="text" name='concept' value={formData.concept} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
                                    </div>

                                    {/* amount */}
                                    <div className={styles.input__container}>
                                        <p className={styles.input__label}>Monto</p>
                                        <input type="number" name='amount' value={formData.amount} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
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
                                <button className={dash.gradient__btn} onClick={handleRegisterReport}>
                                    Registrar reporte
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
                                    Concepto
                                </div>
                                <div className={styles.header__cell__sm}>
                                    Monto
                                </div>
                                <div className={styles.header__cell}>
                                    Comentario
                                </div>
                                <div className={styles.header__cell__lg}>
                                    Comprobante
                                </div>
                            </div>

                            {/* table rows */}
                            {state.reportsList.length !== 0 ? state.reportsList.map((item:Report, i) => (
                                <div key={i} className={styles.table__row}>
                                    <div className={styles.header__cell}>
                                        {item.property.length > 25 ? item.property.substring(0,25) + "..." : item.property}
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {item.date}
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {item.concept}
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {item.amount}
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
                                    Todavía no hay reportes
                                </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* snack bar */}
                <Snackbar open={state.open} autoHideDuration={4000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        ¡Se registró el reporte exitosamente!
                    </Alert>
                </Snackbar>

                {/* Menu */}
                <Menu
                    anchorEl={menuAnchor}
                    id="account-menu"
                    open={menuOpen}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                        },
                        '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        },
                    },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={() => {handleOrderChange(-1)}}>
                        <ListItemIcon>
                            <HighlightOffRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        Quitar filtros
                    </MenuItem>
                    <MenuItem onClick={() => {handleOrderChange(0)}}>
                        <ListItemIcon>
                            <ApartmentRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        Propiedad
                    </MenuItem>
                    <MenuItem onClick={() => {handleOrderChange(1)}}>
                        <ListItemIcon>
                            <PersonRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        Fecha
                    </MenuItem>
                    <MenuItem onClick={() => {handleOrderChange(2)}}>
                        <ListItemIcon>
                            <MapsHomeWorkRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        Concepto
                    </MenuItem>
                </Menu>
            </main>
        </div>
    )
}

export default Reports
