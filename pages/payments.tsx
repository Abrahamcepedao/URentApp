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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
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
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';

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
    const { properties, fecthProperties, addPayment, deletePayment, updateEditPayment } = useProperties()

    //Router
    const router = useRouter()

    //Material UI
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    //useState - state
    const [state, setState] = useState({
        payments: [],
        paymentsList: [],
        addOpen: false,
        open: false,
        error: "",
        properties: [],
        deleteOpen: false,
        deletePayment: 0,
        deleteProperty: "",
        filter: "",
        sort: 0,
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
        comment: ""
    })

    //useState - comment popover anchor
    const [commentAnchor, setCommentAnchor] = useState<HTMLElement | null>(null);
    const [comment, setComment] = useState<string>("");
    const commentOpen = Boolean(commentAnchor);

    //useState - popover anchor
    const [propertyAnchor, setPropertyAnchor] = useState<HTMLElement | null>(null);
    const [property, setProperty] = useState<string>("");
    const propertyOpen = Boolean(propertyAnchor);

    //useState - menu
    const [menuAnchor, setMenuAnchor] = useState(null);
    const menuOpen = Boolean(menuAnchor);
    
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
        let temp = state.payments.filter((pr:Payment) => pr.property.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
        setState({...state, paymentsList: temp, filter: e.target.value})
    }

    /* handle order change */
    const handleOrderChange = (num:number) => {
        let temp: Payment[] = [...state.paymentsList]
        console.log(num, state.sort)
        if(num === state.sort){
            temp.reverse()
        } else if(num === 0) {
            temp.sort((a,b) => { return a.property < b.property ? -1 : 1})
        } else if(num === 1){
            temp.sort((a,b) => { return a.date < b.date ? -1 : 1})
        } else if(num === 2){
            temp.sort((a,b) => { return a.bruta < b.bruta ? -1 : 1})
        } else if(num === 3){
            temp.sort((a,b) => { return a.method < b.method ? -1 : 1})
        } else {
        
        } 
        //@ts-ignore
        setState({...state, paymentsList: temp, sort: num})
    }

    const setUp = () => {
        getProperties(false)
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
            setState({...state, properties: temp, payments: payments, paymentsList: payments, error: "", open: flag, addOpen: false})
            

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
            setFormData({...formData, property: e.target.value, bruta: pr.contract.bruta, neta: pr.contract.neta})
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
            setState({...state, error: "Introduzca una año válida"})
            return false
        }
        if(formData.bruta < 1){
            setState({...state, error: "Introduzca un monto bruto válido"})
            return false
        }
        if(formData.neta < 1){
            setState({...state, error: "Introduzca un monto neto válido"})
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
                    property: formData.property,
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
                    getProperties(true)
                } else {
                    //alert error
                    setState({...state, error: "Ocurrió un error al registrar el pago"})
                }
            }
        }
    }

    /* comment - popover functions */
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, val:string) => {
        if(val.length > 25){
            setCommentAnchor(event.currentTarget);
            setComment(val)
        }
    };

    const handlePopoverClose = () => {
        setCommentAnchor(null);
        setComment("")
    };

    /* property - popover functions */
    const handlePropertyPopoverOpen = (event: React.MouseEvent<HTMLElement>, val:string) => {
        console.log(val)
        if(val.length > 20){
            setPropertyAnchor(event.currentTarget);
            setProperty(val)
        }
    };

    const handlePropertyPopoverClose = () => {
        setPropertyAnchor(null);
        setProperty("")
    };

    /* handle edit payment click */
    const handleEditClick = (payment:Payment) => {
        updateEditPayment(payment)
        router.push(`/edit_payment`)
    }


    /* delete payment functions */

    /* handle delete property click */
    const handleDeleteClick = (payment:number, property:string) => {
        console.log(payment)
        setState({...state, deletePayment: payment, deleteProperty: property, deleteOpen: true})
    }
     /* handle cancel click */
    const handleCancelClick = () => {
        //@ts-ignore
        setState({...state, deletePayment: 0, deleteProperty: "", deleteOpen: false})
    }

    /* handle delete property */
    const handleDeletePayment = async() => {
        const res = await deletePayment(state.deleteProperty, state.deletePayment)
        if(res){
            console.log(res)
            //delete payment from state
            let temp = state.payments.filter((el:Payment) => el.id !== state.deletePayment)
            setState({...state, payments: temp, paymentsList: temp, deletePayment: 0, deleteProperty: "", deleteOpen: false})
        } else {
            //alert error
            console.log("error")
            setState({...state, deleteOpen: false, deletePayment: 0, deleteProperty: "",})
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

                            <div className={styles.header__actions}>
                                <div className={styles.filter__container}>
                                    <SearchRoundedIcon className={dash.table__icon}/>
                                    <input placeholder='Nombre propiedad' value={state.filter} onChange={(e) => {handleFilterChange(e)}} className={styles.search__input}/>
                                </div>
                                {/* Refresh */}
                                <Tooltip title="Refrescar" placement='top'>
                                    <IconButton
                                        onClick={() => {getProperties(false)}}
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
                                    <Tooltip title="Registrar pago" placement='top'>
                                        <IconButton onClick={() => {setState({...state, addOpen: true})}}>
                                            <AddCircleRoundedIcon className={dash.header__icon}/>
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                            
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
                                    M. Bruto
                                </div>
                                <div className={styles.header__cell__sm}>
                                    M. Neto
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
                                        <Typography
                                            aria-owns={propertyAnchor ? 'mouse-over-property' : undefined}
                                            aria-haspopup="true"
                                            onMouseEnter={(e) => {handlePropertyPopoverOpen(e, item.property)}}
                                            onMouseLeave={handlePropertyPopoverClose}
                                        >
                                            {item.property.length > 20 ? item.property.substring(0,20) + "..." : item.property}
                                        </Typography>
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
                                        <Typography
                                            aria-owns={commentAnchor ? 'mouse-over-comment' : undefined}
                                            aria-haspopup="true"
                                            onMouseEnter={(e) => {handlePopoverOpen(e, item.comment)}}
                                            onMouseLeave={handlePopoverClose}
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
                                            <Tooltip title="Editar pago" placement='top'>
                                                <IconButton onClick={() => {handleEditClick(item)}}>
                                                    <EditRoundedIcon className={dash.table__icon}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar pago" placement='top'>
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
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePropertyPopoverClose}
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

                {/* Dialog */}
                <Dialog
                    fullScreen={fullScreen}
                    open={state.deleteOpen}
                    onClose={handleCancelClick}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                    {`¿Esta seguro de querer eliminar el pago?`}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Esta acción no se puede deshacer
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <button className={styles.cancel__fill__btn} onClick={handleCancelClick}>Cancelar</button>
                        <button className={styles.save__fill__btn} onClick={handleDeletePayment}>Eliminar</button>
                    </DialogActions>
                </Dialog>

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
                        Monto
                    </MenuItem>
                    <MenuItem onClick={() => {handleOrderChange(3)}}>
                        <ListItemIcon>
                            <AttachMoneyRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        Método 
                    </MenuItem>
                
                </Menu>
            </main>
        </div>
    )
}

export default Payments
