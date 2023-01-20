import {createContext, use, useContext}  from 'react'
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut } 
from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../database/firebase'
import { addUser, getUser } from '../database/functions/user'

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({children}: {children:React.ReactNode}) => {
    const [user,setUser] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser({
                    uid: user.uid,
                    mail: user.email,
                    name: user.displayName
                })
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
                orgName
            }
            setUser(temp)
            addUser(temp)
        })
    }

    const login = async (mail:string, password:string) => {
        return signInWithEmailAndPassword(auth, mail, password)
            .then((result) => {
                const temp =  getUser(result.user.uid)
                console.log(temp)
                setUser(temp)
            })
    }

    const logout = async() => {
        setUser(null)
        await signOut(auth)
    }

    return <AuthContext.Provider value={{user, login, signup, logout}}>
        {loading ? null : children}
    </AuthContext.Provider>
}