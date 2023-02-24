//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

//CSS
import dash from '../styles/Dashboard.module.css'
import styles from '../styles/Properties.module.css'

//Components
import SideBar from '../components/user/SideBar'
import Chip from '../components/user/Chip'

//Material UI
import { Tooltip, IconButton } from '@mui/material'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

//Material UI - icons
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

//Context
import { useProperties } from '../context/PropertiesContext'

//utils
import formatMoney from '../components/utils/functions/formatMoney'
import getPropertyType from '../components/utils/functions/getPropertyType'

//interfaces
import Property from '../components/utils/interfaces/Property'

//Dashboard page
const Properties: NextPage = () => {
  //Context
  const { properties, fecthProperties, isFirst, checkIfFirst, updateEditProperty, deleteProperty } = useProperties()

  //Router
  const router = useRouter()

  //Material UI
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  //useState - properties
  const [state, setState] = useState({
    properties: [],
    propertiesList: [],
    filter: "",
    deleteOpen: false,
    deleteProperty: "",
    sort: 0,
  })

  //useState - menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  //useState - popover anchor
    const [propertyAnchor, setPropertyAnchor] = useState<HTMLElement | null>(null);
    const [property, setProperty] = useState<string>("");
    const propertyOpen = Boolean(propertyAnchor);

  useEffect(() => {
      handleFecthProperties()

  },[])

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


  /* get properties from firebase */
  const getProperties = async() => {
    let data = await fecthProperties()
    if(data !== false) {
      //set properties state
      setState({
        ...state,
        properties: data,
        propertiesList: data
      })
    } 
  }

  const handleFecthProperties = async() => {
    if(properties){
        if(properties.length === 0){
        
        if(!isFirst) {
          const flag = await checkIfFirst()
          if(flag) {
            //set properties to empty array
          } else {
            //get properties
            getProperties()
          }
        } else {
          getProperties()
        }
      } else {
        getProperties()
      }
    } else {
      getProperties()
    }
    
  }

  /* handle filter change */
  const handleFilterChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    let temp = state.properties.filter((pr:Property) => pr.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
    setState({...state, propertiesList: temp, filter: e.target.value})
  }

  /* order menu functions */
  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOrderChange = (num:number) => {
    let temp: Property[] = [...state.properties]
    if(num === state.sort){
      temp.reverse()
    } else if(num === 0) {
      temp.sort((a,b) => { return a.name < b.name ? -1 : 1})
    } else if(num === 1){
      temp.sort((a,b) => { return a.tenant.name < b.tenant.name ? -1 : 1})
    } else if(num === 2){
      temp.sort((a,b) => { return a.contract.type < b.contract.type ? -1 : 1})
    } else if(num === 3){
      temp.sort((a,b) => { return a.contract.bruta < b.contract.bruta ? -1 : 1})
    } else if(num === 4){
      temp.sort((a,b) => { return a.contract.end < b.contract.end ? -1 : 1})
    } else if(num === 5) {
      temp.sort((a,b) => { return a.status < b.status ? -1 : 1})
    }

    //@ts-ignore
    setState({...state, propertiesList: temp})
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  /* handle edit property click */
  const handleEditClick = (property:Property) => {
    updateEditProperty(property)
    router.push(`/edit_property`)
  }

  /* handle delete property click */
  const handleDeleteClick = (property:string) => {
    console.log(property)
    setState({...state, deleteProperty: property, deleteOpen: true})
  }

  /* handle cancel click */
  const handleCancelClick = () => {
    //@ts-ignore
    setState({...state, deleteProperty: "", deleteOpen: false})
  }

  /* handle delete property */
  const handleDeleteProperty = async() => {
    const res = await deleteProperty(state.deleteProperty)
    if(res !== false){
      console.log(res)
      setState({...state, properties: res, propertiesList: res, deleteOpen: false})
    } else {
      //alert error
      console.log("error")
      setState({...state, deleteOpen: false})
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
            <div className={styles.properties__header}>
              {/* header title */}
              <p className={dash.subtitle}>Edita las propiedades</p>

              {/* header actions */}
              <div className={styles.header__actions}>
                <div className={styles.filter__container}>
                  <SearchRoundedIcon className={dash.table__icon}/>
                  <input placeholder='Nombre propiedad' value={state.filter} onChange={(e) => {handleFilterChange(e)}} className={styles.search__input}/>
                </div>

                {/* Refresh */}
                <Tooltip title="Refrescar" placement='top'>
                  <IconButton
                    onClick={getProperties}
                  >
                    <RefreshRoundedIcon className={dash.header__icon}/>
                  </IconButton>
                </Tooltip>

                {/* Filtrar */}
                <Tooltip title="Filtrar" placement='top'>
                  <IconButton
                    onClick={(e) => {handleClick(e)}}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <FilterAltRoundedIcon className={dash.header__icon}/>
                  </IconButton>
                </Tooltip>

                <Link href={"/add_property"}>
                  <Tooltip title="Agregar" placement='top'>
                    <IconButton>
                      <AddCircleRoundedIcon className={dash.header__icon}/>
                    </IconButton>
                  </Tooltip>
                </Link>
              </div>
            </div>

            {/* properties table */}
            <div className={styles.table__container}>
              {/* table header */}
              <div className={styles.table__header}>
                <div className={styles.header__cell}>
                    Nombre
                </div>
                <div className={styles.header__cell__md}>
                    Arrendatario
                </div>
                <div className={styles.header__cell__sm}>
                    Tipo
                </div>
                <div className={styles.header__cell__sm}>
                    R. Bruta
                </div>
                <div className={styles.header__cell__sm}>
                    R. Neta
                </div>
                <div className={styles.header__cell__sm}>
                    Fin contrato
                </div>
                <div className={styles.header__cell__lg}>
                    Estatus
                </div>
              </div>

              {/* propperties list */}
              {state.propertiesList.length !== 0 ? state.propertiesList.map((item:Property, i) => (
                <div key={i} className={styles.table__row}>
                    <div className={styles.header__cell}>
                        <Typography
                              aria-owns={propertyAnchor ? 'mouse-over-property' : undefined}
                              aria-haspopup="true"
                              onMouseEnter={(e) => {handlePropertyPopoverOpen(e, item.name)}}
                              onMouseLeave={handlePropertyPopoverClose}
                              className={styles.table__text}
                          >
                              {item.name.length > 25 ? item.name.substring(0,25) + "..." : item.name}
                          </Typography>
                    </div>
                    <div className={styles.header__cell__md}>
                        {item.tenant.name ? item.tenant.name : "-"}
                    </div>
                    <div className={styles.header__cell__sm}>
                        {item.type ? getPropertyType(item.type) : ""}
                    </div>
                    <div className={styles.header__cell__sm}>
                        {item.contract.bruta !== 0 ? formatMoney(item.contract.bruta) : "-"}
                    </div>
                    <div className={styles.header__cell__sm}>
                        {item.contract.neta !== 0 ? formatMoney(item.contract.neta) : "-"}
                    </div>
                    <div className={styles.header__cell__sm}>
                        {item.contract.end}
                    </div>
                    <div className={styles.header__cell__lg}>
                        {!item.status ? (
                          <Chip title="Libre" color="#903030"/>
                        ) : (
                          <Chip title="En renta"color="#21812B"/>
                        )}
                        <div className={styles.cell__btns}>
                            <Tooltip title="Editar propiedad" placement='top'>
                                <IconButton onClick={() => {handleEditClick(item)}}>
                                    <EditRoundedIcon className={dash.table__icon}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar propiedad" placement='top'>
                                <IconButton onClick={() => {handleDeleteClick(item.name)}}>
                                    <DeleteRoundedIcon className={dash.table__icon}/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>
              )) : (
                <div className={styles.table__row}>
                  <div className={styles.header__cell}>
                      Todavía no hay propiedades
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>

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
      
      {/* Dialog */}
      <Dialog
          fullScreen={fullScreen}
          open={state.deleteOpen}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
      >
          <DialogTitle id="responsive-dialog-title">
          {`¿Esta seguro de querer eliminar la propiedad: ${state.deleteProperty}?`}
          </DialogTitle>
          <DialogContent>
          <DialogContentText>
              Esta acción no se puede deshacer
          </DialogContentText>
          </DialogContent>
          <DialogActions>
              <button className={dash.cancel__fill__btn} onClick={handleCancelClick}>Cancelar</button>
              <button className={dash.delete__fill__btn} onClick={handleDeleteProperty}>Eliminar</button>
          </DialogActions>
      </Dialog>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
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
          Nombre
        </MenuItem>
        <MenuItem onClick={() => {handleOrderChange(1)}}>
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          Arrendatario
        </MenuItem>
        <MenuItem onClick={() => {handleOrderChange(2)}}>
          <ListItemIcon>
            <MapsHomeWorkRoundedIcon fontSize="small" />
          </ListItemIcon>
          Tipo
        </MenuItem>
        <MenuItem onClick={() => {handleOrderChange(3)}}>
          <ListItemIcon>
            <AttachMoneyRoundedIcon fontSize="small" />
          </ListItemIcon>
          Renta 
        </MenuItem>
        <MenuItem onClick={() => {handleOrderChange(4)}}>
          <ListItemIcon>
            <CalendarMonthRoundedIcon fontSize="small" />
          </ListItemIcon>
          Fin de contrato
        </MenuItem>
        <MenuItem onClick={() => {handleOrderChange(5)}}>
          <ListItemIcon>
            <QuestionMarkRoundedIcon fontSize="small" />
          </ListItemIcon>
          Estatus
        </MenuItem>
       
      </Menu>
    </div>
  )
}

export default Properties
