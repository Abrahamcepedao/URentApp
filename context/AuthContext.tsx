import {createContext, useContext}  from 'react'
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut } 
from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../database/firebase'
import { addUser, getUser, signUpManager } from '../database/functions/user'

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({children}: {children:React.ReactNode}) => {
    const [user,setUser] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(user){
                const temp = await getUser(user.uid)
                
                setUser(temp)
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const signup = async (mail:string, password:string, name:string, phone:string, orgName:string) => {
        return await createUserWithEmailAndPassword(auth, mail, password).then((result) => {
            const temp = {
                uid: result.user.uid,
                mail,
                name,
                phone,
                orgName,
                type: "master"
            }
            setUser(temp)
            addUser(temp)
        })
    }

    const managerSignUp = async (mail:string, password:string, orgName:string, phone:string, name:string) => {
        return await createUserWithEmailAndPassword(auth, mail, password).then((result) => {
            const temp = {
                uid: result.user.uid,
                mail,
                orgName,
                phone,
                name,
                type: 'userr'
            }
            setUser(temp)
            signUpManager(mail, orgName, result.user.uid)
        })
    }

    const login = async (mail:string, password:string) => {
        return signInWithEmailAndPassword(auth, mail, password)
            .then(async (result) => {
                const item = await getUser(result.user.uid)
                
                setUser(item)
            })
    }

    const logout = async() => {
        setUser(null)
        await signOut(auth)
    }

    const createUser = async (mail:string, password:string, name:string, phone:string, orgName:string) => {
        const temp = {
            uid: orgName + "_" + mail,
            mail,
            name,
            phone,
            orgName,
            password,
            type: "user"
        }
        
        addUser(temp)
    }

    return <AuthContext.Provider value={{user, login, signup, logout, createUser, managerSignUp}}>
        {loading ? null : children}
    </AuthContext.Provider>
}