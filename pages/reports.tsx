//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

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
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

//Material UI - icons
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
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

//utils
import formatMoney from '../components/utils/functions/formatMoney'

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
    const { properties, fecthProperties, addReport, updateEditReport, deleteReport } = useProperties()

    //Router
    const router = useRouter()

    //Material UI
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    //useState - menu
    const [menuAnchor, setMenuAnchor] = useState(null);
    const menuOpen = Boolean(menuAnchor);

    //useState - property anchor
    const [propertyAnchor, setPropertyAnchor] = useState<HTMLElement | null>(null);
    const [property, setProperty] = useState<string>("");
    const propertyOpen = Boolean(propertyAnchor);

    //useState - comment popover anchor
    const [commentAnchor, setCommentAnchor] = useState<HTMLElement | null>(null);
    const [comment, setComment] = useState<string>("");
    const commentOpen = Boolean(commentAnchor);

    //useState - concept popover anchor
    const [conceptAnchor, setConceptAnchor] = useState<HTMLElement | null>(null);
    const [concept, setConcept] = useState<string>("");
    const conceptOpen = Boolean(conceptAnchor);

    //useState - reports
    const [state, setState] = useState({
        reports: [],
        reportsList: [],
        addOpen: false,
        deleteOpen: false,
        deleteReport: 0,
        deleteProperty: "",
        properties: [],
        filter: "",
        sort: 0
    })

    //useState - form data
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

    //useState - utils
    const [utils, setUtils] = useState({
        error: "",
        loading: false,
        open: false,
        severity: "info"
    })

    useEffect(() => {
        setUp()
    },[])

    /* handle snack close */
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }

        setUtils({...utils, open: false})
    };

     /* handle cancel click */
    const handleCancelClick = () => {
        
        setState({...state, deleteReport: 0, deleteProperty: "", deleteOpen: false})
    }

    /* handle delete eport */
    const handleDeleteReport = async() => {
        const res = await deleteReport(state.deleteProperty, state.deleteReport)
        if(res){
            console.log(res)
            //delete payment from state
            let temp = state.reports.filter((el:Report) => el.id !== state.deleteReport)
            setState({...state, reports: temp, reportsList: temp, deleteReport: 0, deleteProperty: "", deleteOpen: false})
        } else {
            //alert error
            console.log("error")
            setState({...state, deleteOpen: false, deleteReport: 0, deleteProperty: "",})
        }
    }

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
            let temp = properties.filter((pr:Property) => pr.status)
            let reports:Report[] = []
            temp.forEach((item:Property) => {
                if(item.reports){
                    item.reports.forEach((report:Report) => {
                        reports.push({...report, property: item.name})
                    })
                }
            })

            console.log(temp)
            //@ts-ignore
            setState({...state, properties: temp, reports: reports, reportsList: reports})

            //formData
            let today = new Date()
            let date = today.toISOString().split('T')[0]
            if(properties.length !== 0){
                const pr:Property = temp[0]
                console.log(pr)
                setFormData({...formData, date: date, property: pr.name, month: months[today.getMonth()].en, year: today.getFullYear()})
            } else {
                setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear()})
            }
        } else {
            getProperties()
        }
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
                console.log(pr)
                setFormData({...formData, date: date, property: pr.name, month: months[today.getMonth()].en, year: today.getFullYear()})
            } else {
                setFormData({...formData, date: date, month: months[today.getMonth()].en, year: today.getFullYear()})
            }

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

    /* handle input change */
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

    /* handle property change */
    const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(state.properties)
        console.log(e.target.value)
        const pr:Property|undefined = state.properties.find((el:Property) => el.name === e.target.value)
        if(pr !== undefined){
            //@ts-ignore
            setFormData({...formData, property: e.target.value})
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
            //alert error
            setUtils({...utils, error: "Ingrese un concepto", severity: 'error', open: true})
            return false
        }
        //check data
        setUtils({...utils, error: "", open: false})
        return true
    }

    /* handle register report */
    const handleRegisterReport = async() => {
        if(verifyData()){
            console.log(formData)
            //save payment
            console.log(properties)
            let pr:Property|undefined = state.properties.find((el:Property) => el.name === formData.property)
            console.log(pr)
            if(pr !== undefined) {
                let temp = {
                    date: formData.date,
                    amount: Number(formData.amount),
                    concept: formData.concept,
                    fileName: formData.fileName,
                    file: formData.file,
                    comment: formData.comment,
                    property: formData.property,
                    month: formData.month,
                    year: formData.year
                }
                console.log(temp)
                const res = await addReport(pr,temp)
                if(res) {
                    //alert success
                    setUtils({...utils, error: "Reporte registrado correctamente",  open: true, severity: 'success'})
                    setFormData({...formData, file: "", fileName: "", comment: ""})
                    await getProperties()
                } else {
                    //alert error
                    setUtils({...utils, error: "Ocurrió un error al registrar el reporte", severity: 'error', open: true})
                }
            } else {
                //alert error
                    setUtils({...utils, error: "Ocurrió un error al registrar el reporte", severity: 'error', open: true})
            }
        }
    }

    /* property - popover functions */
    const handlePropertyPopoverOpen = (event: React.MouseEvent<HTMLElement>, val:string) => {
        console.log(val)
        if(val.length > 25){
            setPropertyAnchor(event.currentTarget);
            setProperty(val)
        }
    };

    const handlePropertyPopoverClose = () => {
        setPropertyAnchor(null);
        setProperty("")
    };

    /* comment - popover functions */
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, val:string) => {
        console.log(val)
        if(val.length > 25){
            setCommentAnchor(event.currentTarget);
            setComment(val)
        }
    };

    const handlePopoverClose = () => {
        setCommentAnchor(null);
        setComment("")
    };


    /* concept - popover functions */
    const handleConceptOpen = (event: React.MouseEvent<HTMLElement>, val:string) => {
        if(val.length > 25){
            setConceptAnchor(event.currentTarget);
            setConcept(val)
        }
    };

    const handleConceptClose = () => {
        setConceptAnchor(null);
        setConcept("")
    };

    /* handle edit payment click */
    const handleEditClick = (report:Report) => {
        updateEditReport(report)
        router.push(`/edit_report`)
    }

    /* handle delete property click */
    const handleDeleteClick = (report:number, property:string) => {
        console.log(report)
        setState({...state, deleteReport: report, deleteProperty: property, deleteOpen: true})
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
                                <button className={dash.gradient__btn} onClick={handleRegisterReport}>
                                    Registrar reporte
                                </button>
                            </div>
                        </Collapse>

                        {/* payments list */}
                        <div className={styles.payments__table} style={{maxHeight: state.addOpen ? "calc(100vh - 450px)" : "calc(100vh - 220px)"}}>
                            {/* table header */}
                            <div className={styles.table__header}>
                                <div className={styles.header__cell2}>
                                    Propiedad
                                </div>
                                <div className={styles.header__cell__sm}>
                                    Fecha
                                </div>
                                <div className={styles.header__cell__md}>
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
                                    <div className={styles.header__cell2}>
                                        <Typography
                                            aria-owns={propertyAnchor ? 'mouse-over-property' : undefined}
                                            aria-haspopup="true"
                                            onMouseEnter={(e) => {handlePropertyPopoverOpen(e, item.property)}}
                                            onMouseLeave={handlePropertyPopoverClose}
                                            className={styles.table__text}
                                        >
                                            {item.property.length > 25 ? item.property.substring(0,25) + "..." : item.property}
                                        </Typography>
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {item.date}
                                    </div>
                                    <div className={styles.header__cell__md}>
                                        <Typography
                                            aria-owns={conceptAnchor ? 'mouse-over-concept' : undefined}
                                            aria-haspopup="true"
                                            onMouseEnter={(e) => {handleConceptOpen(e, item.concept)}}
                                            onMouseLeave={handleConceptClose}
                                            className={styles.table__text}
                                        >
                                            {item.concept.length > 20 ? item.concept.substring(0,20) + "..." : item.concept}
                                        </Typography>
                                    </div>
                                    <div className={styles.header__cell__sm}>
                                        {item.amount ? formatMoney(item.amount) : "-"}
                                    </div>
                                    <div className={styles.header__cell}>
                                        <Typography
                                            aria-owns={commentAnchor ? 'mouse-over-comment' : undefined}
                                            aria-haspopup="true"
                                            onMouseEnter={(e) => {handlePopoverOpen(e, item.comment)}}
                                            onMouseLeave={handlePopoverClose}
                                            className={styles.table__text}
                                        >
                                            {item.comment.length > 25 ? item.comment.substring(0,25) + "..." : item.comment}
                                        </Typography>
                                    </div>

                                    <div className={styles.header__cell__lg}>
                                        <div className={styles.cell__btns}>
                                            <Tooltip title={item.fileName} placement='top'>
                                                <IconButton disabled={item.fileUrl === ""} onClick={() => {openInNewTab(item.fileUrl)}}>
                                                    <FileDownloadRoundedIcon className={dash.table__icon} style={{opacity: item.fileUrl !== "" ? 1 : 0.5}}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar reporte" placement='top'>
                                                <IconButton onClick={() => {handleEditClick(item)}}>
                                                    <EditRoundedIcon className={dash.table__icon}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar reporte" placement='top'>
                                                <IconButton onClick={() => {handleDeleteClick(item.id, item.property)}}>
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

                {/* Dialog */}
                <Dialog
                    fullScreen={fullScreen}
                    open={state.deleteOpen}
                    onClose={handleCancelClick}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                    {`¿Esta seguro de querer eliminar el reporte?`}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Esta acción no se puede deshacer
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <button className={dash.cancel__fill__btn} onClick={handleCancelClick}>Cancelar</button>
                        <button className={dash.delete__fill__btn} onClick={handleDeleteReport}>Eliminar</button>
                    </DialogActions>
                </Dialog>

                {/* snack bar */}
                <Snackbar open={utils.open} autoHideDuration={4000} onClose={handleClose}>
                    {/* @ts-ignore */}
                    <Alert onClose={handleClose} severity={utils.severity !== "" ? utils.severity : "info"} sx={{ width: '100%' }}>
                        {utils.error}
                    </Alert>
                </Snackbar>

                {/* property anchor */}
                <Popover
                    id="mouse-over-property"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={propertyOpen}
                    anchorEl={propertyAnchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <Typography sx={{ p: 1 }}>{property}</Typography>
                </Popover>

                {/* comment anchor */}
                <Popover
                    id="mouse-over-comment"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={commentOpen}
                    anchorEl={commentAnchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <Typography sx={{ p: 1 }}>{comment}</Typography>
                </Popover>

                {/* concept anchor */}
                <Popover
                    id="mouse-over-concept"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={conceptOpen}
                    anchorEl={conceptAnchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={handleConceptClose}
                    disableRestoreFocus
                >
                    <Typography sx={{ p: 1 }}>{concept}</Typography>
                </Popover>

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
