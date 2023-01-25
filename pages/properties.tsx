//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

//CSS
import dash from '../styles/Dashboard.module.css'
import styles from '../styles/Properties.module.css'

//Components
import SideBar from '../components/user/SideBar'
import Chip from '../components/user/Chip'

//Material UI
import { Tooltip, IconButton, Collapse } from '@mui/material'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

//Material UI - icons
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Settings from '@mui/icons-material/Settings';

const temp = [
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 0 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 0 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 0 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 0 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
  {
    name: "Tablaje 1019",
    tenant: "José Guemez",
    type: "Bodega",
    cost: 95156.00,
    status: 1 // 1 = en renta, 0 = libre
  },
]

//Dashboard page
const Dashboard: NextPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
                  <input placeholder='Nombre propiedad' className={styles.search__input}/>
                </div>

                {/*  */}
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
              {temp.map((item, i) => (
                <div key={i} className={styles.table__row}>
                   <div className={styles.header__cell}>
                        {item.name}
                    </div>
                    <div className={styles.header__cell}>
                        {item.tenant}
                    </div>
                    <div className={styles.header__cell}>
                        {item.type}
                    </div>
                    <div className={styles.header__cell}>
                        {item.cost}
                    </div>
                    <div className={styles.header__cell__lg}>
                        {item.status === 0 ? (
                          <Chip title="Libre" background="#D24B4B" color="#9F3838"/>
                        ) : (
                          <Chip title="En renta" background="#31B73F" color="#21812B"/>
                        )}
                        <div className={styles.cell__btns}>
                            <Tooltip title="Editar usuario" placement='top'>
                                <IconButton>
                                    <EditRoundedIcon className={dash.table__icon}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar usuario" placement='top'>
                                <IconButton>
                                    <DeleteRoundedIcon className={dash.table__icon}/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>
              ))}

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
        
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
       
      </Menu>
    </div>
  )
}

export default Dashboard
