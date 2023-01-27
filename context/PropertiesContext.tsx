import {createContext, useContext}  from 'react'
import React, { useState, useEffect } from 'react'

import { addFirst, isFirstFirebase, getProperties, addProperty } from '../database/functions/property'
import { useAuth } from './AuthContext'

const PropertiesContext = createContext<any>({})

export const useProperties = () => useContext(PropertiesContext)

export const PropertiesContextProvider = ({children}: {children:React.ReactNode}) => {
    const [properties,setProperties] = useState<any>([])
    const [propertiesLength, setPropertiesLength] = useState<number>(0);
    const [isFirst, setIsFirst] = useState<boolean>(false)
    const [editProperty, setEditProperty] = useState(null)

    //context
    const { user } = useAuth()

    useEffect(() => {
        
    })

    const checkIfFirst = async() => {
        if(user){
            const first = await isFirstFirebase(user.uid)
            
            setIsFirst(first)
            return first
        }
        return false
    }

    const addFirstProperty = async (property:any) => {
        

        const res = await addFirst(property, user.uid)
        
        if(res) {
            
            setProperties(res)
            setPropertiesLength(1)
            return true
        } 
        return false
    }

    const addNewProperty = async(property:any) => {
        const res = await addProperty(properties, property, user.uid)
        
        //@ts-ignore
        if(res !== false) {
            setPropertiesLength(propertiesLength + 1)
            return true
        }
        return false
    }

    const fecthProperties = async () => {
        const res = await getProperties(user.uid)
        if(res !== false) {
            setProperties(res)
            setPropertiesLength(res.length)
            return res
        }
        return false
    }

    const updateEditProperty = (property:any) => {
        setEditProperty(property)
    }

    const updateProperty = (property:any, type: boolean) => {
        if(type) {
            //update property with new contract
        } else {
            //update property with same contract
        }
    }
    

    return <PropertiesContext.Provider value={{
        properties, 
        isFirst, 
        addFirstProperty, 
        checkIfFirst,
        fecthProperties,
        updateEditProperty,
        editProperty,
        addNewProperty
    }}>
        {children}
    </PropertiesContext.Provider>
}