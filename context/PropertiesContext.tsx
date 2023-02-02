import {createContext, useContext}  from 'react'
import React, { useState, useEffect } from 'react'

import { 
    addFirst, 
    isFirstFirebase, 
    getProperties, 
    addProperty, 
    updateNewContract, 
    updateSameContract,
    registerPayment,
    removeProperty
} from '../database/functions/property'
import { useAuth } from './AuthContext'

//Interfaces
import Property from '../components/utils/interfaces/Property'

const PropertiesContext = createContext<any>({})

export const useProperties = () => useContext(PropertiesContext)

export const PropertiesContextProvider = ({children}: {children:React.ReactNode}) => {
    const [properties,setProperties] = useState<any>([])
    const [isFirst, setIsFirst] = useState<boolean>(true)
    const [editProperty, setEditProperty] = useState(null)

    //context
    const { user } = useAuth()

    useEffect(() => {
        
    })

    /* check if is first property */
    const checkIfFirst = async() => {
        if(user){
            const first = await isFirstFirebase(user.uid)
            
            setIsFirst(first)
            return first
        }
        return false
    }

    /* add first property */
    const addFirstProperty = async (property:any) => {
        

        const res = await addFirst(property, user.uid)
        
        if(res) {
            
            //setProperties(res)
            return true
        } 
        return false
    }

    /* add new property */
    const addNewProperty = async(property:any) => {
        const res = await addProperty(properties, property, user.uid)
        
        //@ts-ignore
        if(res !== false) {
            return true
        }
        return false
    }

    /* fetch properties */
    const fecthProperties = async () => {
        const res = await getProperties(user.uid)
        if(res !== false) {
            setProperties(res)
            return res
        }
        return false
    }

    /* update edit property */
    const updateEditProperty = (property:any) => {
        setEditProperty(property)
    }

    /* update property */
    const updateProperty = async(property:any, type: boolean) => {
        if(type) {
            //update property with new contract
            const res = await updateNewContract(properties, property, user.uid)
            if(res !== false) {
                return res
            }
            return false
        } else {
            //update property with same contract
            const res = await updateSameContract(properties, property, user.uid)
            if(res !== false) {
                return res
            }
            return false
        }
    }
    
    /* add payment to property */
    const addPayment = async(property:any, payment:any) => {
        const res = await registerPayment(properties, property, user.uid, payment)
        if(res !== false) {
            return res
        }
        return false
    }

    const deleteProperty = async(property:string) => {
        const res = await removeProperty(properties, property, user.uid)
        if(res !== false){
            let data = properties.filter((el:Property) => el.name !== property)
            setProperties(data)
            return data
        } 
        return false
    }
    

    return <PropertiesContext.Provider value={{
        properties, 
        isFirst, 
        addFirstProperty, 
        checkIfFirst,
        fecthProperties,
        updateEditProperty,
        editProperty,
        addNewProperty,
        updateProperty,
        addPayment,
        deleteProperty
    }}>
        {children}
    </PropertiesContext.Provider>
}