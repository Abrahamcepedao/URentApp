import {createContext, useContext}  from 'react'
import React, { useState, useEffect } from 'react'

import { addFirst, isFirstFirebase } from '../database/functions/property'
import { useAuth } from './AuthContext'

const PropertiesContext = createContext<any>({})

export const useProperties = () => useContext(PropertiesContext)

export const PropertiesContextProvider = ({children}: {children:React.ReactNode}) => {
    const [properties,setProperties] = useState<any>([])
    const [isFirst, setIsFirst] = useState<boolean>(false)

    //context
    const { user } = useAuth()

    useEffect(() => {
        
    })

    const checkIfFirst = async() => {
        if(user){
            const first = await isFirstFirebase(user.uid)
            console.log(first)
            setIsFirst(first)
        }
        
    }

    const addFirstProperty = async (property:any) => {
        console.log(property)
        console.log(user)

        const res = await addFirst(property, user.uid)
        console.log(res)
        if(res) {
            let data = []
            data.push(property)
            console.log(data)
            setProperties(data)
            return true
        } 
        return false
    }

    const fecthProperties = async () => {
        
    }

    return <PropertiesContext.Provider value={{properties, isFirst, addFirstProperty, checkIfFirst}}>
        {children}
    </PropertiesContext.Provider>
}