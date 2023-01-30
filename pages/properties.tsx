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

//Context
import { useProperties } from '../context/PropertiesContext'

//utils
import formatMoney from '../components/utils/functions/formatMoney'
import getPropertyType from '../components/utils/functions/getPropertyType'

//interfaces
interface Rent {
  name: string,
  razon: string,
  phone: string,
  mail: string,
  date: string,
  end: string,
  type: string,
  cost: number,
  pdfName: string,
  pdfUrl: string
}

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
const Properties: NextPage = () => {
  //Context
  const { properties, fecthProperties, isFirst, checkIfFirst, updateEditProperty } = useProperties()

  //Router
  const router = useRouter()

  //useState - properties
  const [state, setState] = useState({
    properties: [],
    propertiesList: [],
    filter: ""
  })

  //useState - menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  useEffect(() => {
      handleFecthProperties()

  },[])

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
    if(num === 0) {
      temp.sort((a,b) => { return a.name < b.name ? -1 : 1})
    } else if(num === 1){
      temp.sort((a,b) => { return a.tenant.name < b.tenant.name ? -1 : 1})
    } else if(num === 2){
      temp.sort((a,b) => { return a.contract.type < b.contract.type ? -1 : 1})
    } else if(num === 3){
      temp.sort((a,b) => { return a.contract.cost < b.contract.cost ? -1 : 1})
    } else if(num === 1){
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
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
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
                <div className={styles.header__cell}>
                    Arrendatario
                </div>
                <div className={styles.header__cell}>
                    Tipo
                </div>
                <div className={styles.header__cell}>
                    Costo
                </div>
                <div className={styles.header__cell__lg}>
                    Estatus
                </div>
              </div>

              {/* propperties list */}
              {state.propertiesList.length !== 0 ? state.propertiesList.map((item:Property, i) => (
                <div key={i} className={styles.table__row}>
                    <div className={styles.header__cell}>
                        {item.name}
                    </div>
                    <div className={styles.header__cell}>
                        {item.tenant.name ? item.tenant.name : "-"}
                    </div>
                    <div className={styles.header__cell}>
                        {item.type ? getPropertyType(item.type) : ""}
                    </div>
                    <div className={styles.header__cell}>
                        {item.contract.cost !== 0 ? formatMoney(item.contract.cost) : "-"}
                    </div>
                    <div className={styles.header__cell__lg}>
                        {!item.status ? (
                          <Chip title="Libre" background="#D24B4B" color="#782C2C"/>
                        ) : (
                          <Chip title="En renta" background="#31B73F" color="#18571F"/>
                        )}
                        <div className={styles.cell__btns}>
                            <Tooltip title="Editar propiedad" placement='top'>
                                <IconButton onClick={() => {handleEditClick(item)}}>
                                    <EditRoundedIcon className={dash.table__icon}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar propiedad" placement='top'>
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
                      Todavía no hay propiedades
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>

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
          Costo
        </MenuItem>
        <MenuItem onClick={() => {handleOrderChange(4)}}>
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
