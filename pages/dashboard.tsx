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

//Material UI - icons

//Dashboard page
const Dashboard: NextPage = () => {
  

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
              <BilledRents/>
            </div>
          </div>
            
        </div>
      </main>
    </div>
  )
}

export default Dashboard
