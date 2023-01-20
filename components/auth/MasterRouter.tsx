import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const MasterRoute = ({children}: {children: React.ReactNode}) => {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(!user){
            router.push('/login')
        } else {
            if(user.type !== 'master'){
                router.push('/dashboard')
            }
        }
    },[router, user])
    return <>{user ? children : null}</>
}

export default MasterRoute