//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

//CSS
import styles from '../styles/Home.module.css'

//firebase
//import firebase from '../database/firebase'

//Auth
import { useAuth } from '../context/AuthContext'

//logo-image
import Logo from '../public/logo.png'

//loader spinner
import { ThreeDots } from 'react-loader-spinner'

//Material UI - icons
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';


interface formData {
  mail: string,
  name: string,
  orgName: string,
  phone: string,
  password: string,
  confirmPassword: string
}

//sign-up page
const Home: NextPage = () => {
  //Router
  const router = useRouter()

  //Context
  const { user, signup, logout } = useAuth()
  
  //useState
  const [formData, setFormData] = useState<formData>({
    mail: "",
    name: "",
    orgName: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  useEffect(() => {
    logout()
  })

  const [values, setValues] = useState({
    error: "",
    loading: false,
  })

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const verifyData = () => {
    if(formData.password === "" || formData.confirmPassword === "") {
      return false
    }
    return formData.password === formData.confirmPassword
  }

  const handleSignUp = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    if(verifyData()){
      setValues({
        ...values,
        loading: true
      })

      try {
        const { mail, password, name, phone, orgName } = formData
        await signup(mail, password, name, phone, orgName)
        router.push('/dashboard')
      } catch (err) {
        console.log(err)
        setValues({...values, error: "Ocurrión un error"})
      }
    


    } else {
      setValues({
        ...values,
        error: "Las contraseñas no coinciden"
      })
    }
  }

  return (
    <div>
      <Head>
        <title>URent | Sign UP</title>
        <meta name="description" content="URent - Property rental management web platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.background}></div>
        <div className={styles.info__container}>
          {/* logo */}
          <div className={styles.logo__container}>
            <Image src={Logo} alt="URent" className={styles.logo}/>
          </div>

          {/* form */}
          <form className={styles.form__container}>
            {/* inputs */}
            <div className={styles.form__inputs_container}>
              <div className={styles.input__container}>
                <EmailRoundedIcon className={styles.input__icon}/>
                <input placeholder='Correo electrónico' name='mail' value={formData.mail} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
              </div>
              <div className={styles.input__container}>
                <PersonRoundedIcon className={styles.input__icon}/>
                <input placeholder='Nombre y apellido' name='name' value={formData.name} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
              </div>
              <div className={styles.input__container}>
                <BusinessRoundedIcon className={styles.input__icon}/>
                <input placeholder='Nombre de organización/empresa' name='orgName' value={formData.orgName} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
              </div>
              <div className={styles.input__container}>
                <LocalPhoneRoundedIcon className={styles.input__icon}/>
                <input placeholder='Teléfono' name='phone' value={formData.phone} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
              </div>
              <div className={styles.input__container}>
                <LockRoundedIcon className={styles.input__icon}/>
                <input placeholder='Contraseña' type="password" name='password' value={formData.password} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
              </div>
              <div className={styles.input__container}>
                {formData.confirmPassword === "" ? (
                  <LockRoundedIcon className={styles.input__icon}/>
                ) : formData.confirmPassword !== formData.password ? (
                  <HighlightOffRoundedIcon className={styles.input__icon}/>
                ) : (
                  <CheckCircleRoundedIcon className={styles.input__icon}/>
                )}
                <input placeholder='Confirmar contraseña' type="password" name='confirmPassword' value={formData.confirmPassword} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
              </div>
            </div>

            {/* login button */}
            <div>
              <button type='submit' className={styles.gradient__btn} onClick={(e) => {handleSignUp(e)}}>
                Regístrate
              </button>
              {values.error !== "" && (
                <div className={styles.error_container}>
                  <p className={styles.error__text}>{values.error}</p>
                </div>
              )}
              {values.loading && (
                <div className={styles.loader}>
                    <ThreeDots color="#A58453" height={100} width={100} />
                </div>
              )}
            </div>
          </form>

          {/* login button */}
          <Link href={"/login"}>
            <button className={styles.transparent__btn}>
                Iniciar sesión
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
