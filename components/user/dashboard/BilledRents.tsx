//React
import React, { useState, useEffect } from 'react'

//CSS
import styles from '../../../styles/components/dashboard/BilledRents.module.css'
import dash from '../../../styles/Dashboard.module.css'

//Nivo
import TwoColorPie from '../../charts/TwoColorPie'

//Material UI - icons
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

//constants
import months from '../../utils/constants/months'

//Context
import { useProperties } from '../../../context/PropertiesContext'

//Interfaces
import Property from '../../utils/interfaces/Property'
import Payment from '../../utils/interfaces/Payment';

interface StatusProperty {
    name: string,
    type: string,
    status: number,
    paidStatus: string,
    tenant: {
        name: string,
        razon: string,
        phone: string,
        mail: string,
    },
    contract: {
        start: string
        end: string,
        type: string,
        day: number,
        bruta: number,
        neta: number,
        pdfName: string,
        pdfUrl: string,
        status: number
    },
    payments: Payment[]

}

const BilledRents = () => {
    //Context
    const { properties, fecthProperties } = useProperties()

    //useState - state
    const [state, setState] = useState({
        month: "",
        pieData: [
            {
                "id": "Cobradas",
                "label": "Cobradas",
                "value": 12,
                "color": "#01AA55"
            },
            {
                "id": "EnTiempo",
                "label": "Entiempo",
                "value": 4,
                "color": "#e99517"
            },
            {
                "id": "SinCobrar",
                "label": "Sin cobrar",
                "value": 4,
                "color": "#FF6342"
            },
        ],
        properties: [],
        propertiesList: [],
        selected: 2, // 0 = pagadas, 1 = en tiempo, 2 = no cobradas
        paid: 12,
        onTime: 4,
        notPaid: 4
    })

    //useEffect
    useEffect(() => {
        setup()
    },[properties])

    const setup = async() => {
        let today = new Date()
        let day = today.getDate()
        let year = today.getFullYear()
        let month = today.getMonth()
        setState({...state, month: months[month].es})

        console.log(properties)
        if(properties.length === 0) {
            let data = await fecthProperties()

        } else {
            let temp:StatusProperty[] = []
            
            properties.forEach((item:Property) => {
                if(item.status) {
                    let status:string = "notPaid"
                    if(item.payments) {
                        let pay = item.payments.find(el => el.year === year && el.month === months[month].es)
                        console.log(pay)
                        if(pay === undefined){
                            //check if is on time
                            if(day <= item.contract.day){
                                //is on time
                                status = "onTime"
                            }
                        } else {
                            //there has been a payment
                            status = "paid"
                        }
                    }
                    
                    temp.push({
                        ...item,
                        paidStatus: status
                    })
                }
            })

            let temp2 = temp.filter((el:StatusProperty) => el.paidStatus === "notPaid")
            setState({...state, properties})
        }
        

    }

    const handleTabClick = (num:number) => {
        setState({...state, selected: num})
    }

    return (
        <div className={styles.container}>
            <h2 className={dash.subtitle}>Rentas cobradas en {state.month}</h2>
            <div className={styles.infoContainer}>
                <TwoColorPie data={state.pieData}/>
                <div className={styles.dataContainer}>
                    <div className={styles.tabsContainer}>
                        <div className={styles.paidTab} 
                            onClick={() => {handleTabClick(0)}}
                            style={{background: state.selected === 0 ? 'var(--success)' : 'none', color: state.selected === 0 ? 'white' : 'var(--success)'}}>
                            <div className={styles.tabInner}>
                                <PaidRoundedIcon className={styles.tabIcon}/> 
                                <span className={styles.tabNumber}>{state.paid}</span>
                            </div>
                            <p className={styles.tabText}>Cobradas</p>
                        </div>
                        <div className={styles.onTimeTab} 
                            onClick={() => {handleTabClick(1)}}
                            style={{background: state.selected === 1 ? 'var(--medium)' : 'none', color: state.selected === 1 ? 'white' : 'var(--medium)'}}>
                            <div className={styles.tabInner}>
                                <AccessTimeFilledRoundedIcon className={styles.tabIcon}/> 
                                <span className={styles.tabNumber}>{state.onTime}</span>
                            </div>
                            <p className={styles.tabText}>En tiempo</p>
                        </div>
                        <div className={styles.notPaidTab} 
                            onClick={() => {handleTabClick(2)}}
                            style={{background: state.selected === 2 ? 'var(--cancel)' : 'none', color: state.selected === 2 ? 'white' : 'var(--cancel)'}}>
                            <div className={styles.tabInner}>
                                <ErrorRoundedIcon className={styles.tabIcon}/> 
                                <span className={styles.tabNumber}>{state.notPaid}</span>
                            </div>
                            <p className={styles.tabText}>Sin cobrar</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default BilledRents