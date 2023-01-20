//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

//logo-image
import Logo from '../public/logo.png'

//Auth
import { useAuth } from '../context/AuthContext'

//Material UI - icons
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import Link from 'next/link'

interface formData {
  mail: string,
  password: string,
}

//sign-up page
const Login: NextPage = () => {
    //router
    const router = useRouter()
    //context
    const { user, login } = useAuth()

    //useState
    const [formData, setFormData] = useState<formData>({
        mail: "",
        password: "",
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

    const handleLogin = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        try {
            const { mail, password } = formData
            await login(mail, password)
            router.push('/dashboard')
        } catch (error:any) {
            var errorMessage = error.message
            if(errorMessage === "There is no user record corresponding to this identifier. The user may have been deleted."){
                errorMessage = "No existe el usuario"
            } else if(errorMessage === "The email address is badly formatted."){
                errorMessage = "Formato de email incorrecto"
            } else {
                errorMessage = "Contraseña incorrecta. Favor de ingresarla de nuevo."
            }
            setValues({...values, error: errorMessage})
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
          <form className={styles.login__container}>
            {/* inputs */}
            <div className={styles.login__inputs_container}>
              <div className={styles.input__container}>
                <EmailRoundedIcon className={styles.input__icon}/>
                <input placeholder='Correo electrónico' name='mail' value={formData.mail} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
              </div>
              <div className={styles.input__container}>
                <LockRoundedIcon className={styles.input__icon}/>
                <input placeholder='Contraseña' type="password" name='password' value={formData.password} onChange={(e) => {handleInputChange(e)}} className={styles.input}/>
              </div>
              
            </div>
            {/* forgot password */}
            <div className={styles.forgot__container}>
              <Link href={"/forgot-password"} className={styles.forgot__link}>
                ¿Olvidaste la contraseña?
              </Link>
            </div>

            {/* login button */}
            <div>
                <button className={styles.gradient__btn} onClick={(e) => {handleLogin(e)}}>
                    Iniciar sesión
                </button>
                {values.error !== "" && (
                    <div className={styles.error_container}>
                    <p className={styles.error__text}>{values.error}</p>
                    </div>
                )}
            </div>
          </form>

          {/* login button */}
          <Link href={"/"}>
            <button className={styles.transparent__btn}>
                Regístrate
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Login
