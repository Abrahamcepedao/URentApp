//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Dashboard.module.css'

//Components
import SideBar from '../components/user/SideBar'
import BilledRents from '../components/user/dashboard/BilledRents'

//Context
import { useProperties } from '../context/PropertiesContext'

//Material UI - icons

//Dashboard page
const Dashboard: NextPage = () => {
  //Context
  const { properties, fecthProperties } = useProperties()

  //useEffect
  useEffect(() => {
    setup()
  },[])

  const setup = async() => {
    if(properties){
      if(properties.length === 0) {
        await fecthProperties()
      }
    } else {
      await fecthProperties()
    }
  }


  return (
    <div>
      <Head>
        <title>URent | Dashboard</title>
        <meta name="description" content="URent - Property rental management web platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* @ts-ignore */}
        <SideBar/>
        <div className={styles.container}>
          <div className={styles.innner__container}>

            {/* upper container */}
            <div className={styles.upper__container}>
              <BilledRents/>
              {/* <BilledRents/> */}
            </div>
          </div>
            
        </div>
      </main>
    </div>
  )
}

export default Dashboard
