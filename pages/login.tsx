//react
import React, { useState, useEffect } from 'react'

//next
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

//CSS
import styles from '../styles/Home.module.css'

//logo-image
import Logo from '../public/logo.png'

//Auth
import { useAuth } from '../context/AuthContext'
import { getUserByMail } from '../database/functions/user'

//loader spinner
import { ThreeDots } from 'react-loader-spinner'

//Material UI - icons
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';


interface formData {
  mail: string,
  password: string,
}

//sign-up page
const Login: NextPage = () => {
    //router
    const router = useRouter()
    //context
    const { user, login, managerSignUp } = useAuth()

    //useState
    const [formData, setFormData] = useState<formData>({
        mail: "",
        password: "",
    })

    const [values, setValues] = useState({
        error: "",
        loading: false,
    })


    //useEffect
    useEffect(() => {
      if(user !== null && user !== undefined){
        router.push('/dashboard')
      }
    },[user])

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        })
    }

    const handleLoginClick = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault()

      try {
          handleLogin()
          /* const temp = await getUserByMail(formData.mail)
          console.log(temp)
          if(temp !== null) {
            //@ts-ignore
            if(temp.type === "user" && !temp.signedUp){
              //@ts-ignore
              if(temp.password === formData.password) {
                //sign up user
                try { 
                  //@ts-ignore
                  await managerSignUp(temp.mail, temp.password, temp.orgName, temp.phone, temp.name)
                  router.push('/dashboard')
                } catch (err) {
                  console.log(err)
                  setValues({...values, error: "Ocurró un error"})
                }
              } else {
                setValues({...values, error: "Contraseña incorrecta"})
              }
              
            } else {
              handleLogin()
            } 
          }*/
          
      } catch(err) {
          console.log(err)
          setValues({...values, error: "Ocurró un error"})
      }
    }

    const handleLogin = async() => {
        

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
                <button className={styles.gradient__btn} onClick={(e) => {handleLoginClick(e)}}>
                    Iniciar sesión
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
