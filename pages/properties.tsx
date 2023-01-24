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

//Material UI - icons
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

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
                  <IconButton>
                    <FilterAltRoundedIcon className={dash.header__icon}/>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Agregar" placement='top'>
                  <IconButton>
                    <AddCircleRoundedIcon className={dash.header__icon}/>
                  </IconButton>
                </Tooltip>
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
    </div>
  )
}

export default Dashboard
