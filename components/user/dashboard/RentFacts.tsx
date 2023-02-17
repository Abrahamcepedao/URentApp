//React
import React, { useState, useEffect } from 'react'

//Next
import { useRouter } from 'next/router'

//CSS
import styles from '../../../styles/components/dashboard/RentFacts.module.css'

//Material UI - icons

//constants
import months from '../../utils/constants/months'

//Context
import { useProperties } from '../../../context/PropertiesContext'

//Utils
import formatMoney from '../../utils/functions/formatMoney'

//Interfaces
import Property from '../../utils/interfaces/Property'


const RentFacts = () => {
    //Context
    const { properties, fecthProperties } = useProperties()

    //useState - state
    const [state, setState] = useState({
        month: "",
        year: "",
        monthRev: 0,
        yearRev: 0,
        allRev: 0,
    })

    //useEffect
    useEffect(() => {
        setup()
    },[])

    const setStatus = (data:Property[]) => {
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()
        let yearRev:number = 0
        let monthRev:number = 0
        let allRev:number = 0

        data.forEach((item:Property) => {
            if(item.status) {
                if(item.payments) {
                    item.payments.forEach((payment) => {
                        if(payment.year === year){
                            yearRev += payment.neta
                            if(payment.month === months[month].en){
                                monthRev += payment.neta
                            }
                        }
                        allRev += payment.neta
                        
                    })
                    
                } 
            }
        })

        //@ts-ignore
        setState({...state, month: months[month].es, year: year, monthRev, yearRev, allRev})
    }

    const setup = async() => {
        if(properties.length === 0) {
            let data = await fecthProperties()
            setStatus(data)
        } else {
            setStatus(properties)
        }
    }

    

    return (
        <div className={styles.container}>
            <div className={styles.fact__container__month}>
                <p className={styles.fact__number}>{formatMoney(state.monthRev)}</p>
                <p className={styles.fact__label}>Ingresos en {state.month}</p>
            </div>

            <div className={styles.fact__container__year}>
                <p className={styles.fact__number}>{formatMoney(state.yearRev)}</p>
                <p className={styles.fact__label}>Ingresos en {state.year}</p>
            </div>

            <div className={styles.fact__container__all}>
                <p className={styles.fact__number}>{formatMoney(state.allRev)}</p>
                <p className={styles.fact__label}>Ingresos Totales</p>
            </div>
        </div>
    )
}

export default RentFacts