//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import Head from 'next/head'
import dash from '../styles/Dashboard.module.css'
import styles from '../styles/Users.module.css'

//Components
import SideBar from '../components/user/SideBar'

//Material UI
import { Tooltip, IconButton, Collapse } from '@mui/material'

//Material UI - icons
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { useAuth } from '../context/AuthContext'
import { useUsers } from '../context/UsersContext'


interface Manager {
    mail: string,
    name: string,
    phone: string,
    signeUp: boolean
}

//Dashboard page
const Settings: NextPage = () => {
    //Context
    const { createUser, user } = useAuth()
    const { users, fecthUsers } = useUsers()

    //useState
    const [state, setState] = useState({
        users: [],
        addOpen: false,
        error: ""
    })

    const [formData, setFormData] = useState({
        mail: "",
        name: "",
        phone: "",
        password: "",
    })

    const handleFetchUsers = async() => {
        const temp = await fecthUsers(user.orgName)
        console.log(temp)
        setState({
            ...state,
            users: temp
        })
    }


    useEffect(() => {
        if(user) {
            if(users) {
                console.log(users)
                setState({...state, users: users})
            } else {
                handleFetchUsers()
            }   
        }
        
    },[])

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        })

    }

    const verifyData = () => {
        if(formData.mail === ""){
            setState({...state, error: "Falta agregar el mail"})
            return false
        }  
        if(formData.name === ""){
            setState({...state, error: "Falta agregar el nombre"})
            return false
        }
        if(formData.phone === ""){
            setState({...state, error: "Falta agregar el teléfono"})
            return false
        }
        if(formData.password === ""){
            setState({...state, error: "Falta agregar la contraseña"})
            return false
        }
        return true
    }

    const handleCreateUser = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if(verifyData()){
            setState({...state, addOpen: false})
            if(user) {
                console.log(user)
                try {
                    const { mail, password, name, phone } = formData
                    await createUser(mail, password, name, phone, user.orgName)
                    setState({...state, addOpen: false})
                } catch (err) {
                    console.log(err)
                    setState({...state, error: "Ocurrió un error"})
                }

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
            <div className={styles.container}>
                <div className={styles.inner__container}>
                    {/* header */}
                    <div className={styles.users__header}>
                        <p className={dash.subtitle}>Settings</p>
                        
                    </div>
                </div>
            </div>
        </main>
        </div>
    )
}

export default Settings
