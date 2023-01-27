import {createContext, useContext}  from 'react'
import React, { useState, useEffect } from 'react'

import { getUsers } from '../database/functions/users'
import { useAuth } from './AuthContext'

const UsersContext = createContext<any>({})

export const useUsers = () => useContext(UsersContext)

export const UsersContextProvider = ({children}: {children:React.ReactNode}) => {
    const [users,setUsers] = useState<any>([])
    const { user } = useAuth()

    useEffect(() => {
        if(users.length === 0){
            fecthUsers(user.orgName)
        }
    })

    const fecthUsers = async (orgName:string) => {
        const temp = await getUsers(orgName)
        
        setUsers(temp)
        return temp
    }

    return <UsersContext.Provider value={{users, fecthUsers}}>
        {children}
    </UsersContext.Provider>
}