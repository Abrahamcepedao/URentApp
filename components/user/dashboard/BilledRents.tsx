//React
import React, { useState, useEffect } from 'react'

//Next
import { useRouter } from 'next/router'

//CSS
import styles from '../../../styles/components/dashboard/BilledRents.module.css'
import dash from '../../../styles/Dashboard.module.css'

//Nivo
import TwoColorPie from '../../charts/TwoColorPie'

//Material UI
import { IconButton, Tooltip } from '@mui/material';

//Material UI - icons
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

//constants
import months from '../../utils/constants/months'

//Context
import { useProperties } from '../../../context/PropertiesContext'

//Interfaces
import Property from '../../utils/interfaces/Property'
import StatusProperty from '../../utils/interfaces/StatusProperty';


const BilledRents = () => {
    //Context
    const { properties, fecthProperties, updateEditProperty } = useProperties()

    //router
    const router = useRouter()

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
    },[])

    const setStatus = (data:Property[]) => {
        let today = new Date()
        let day = today.getDate()
        let year = today.getFullYear()
        let month = today.getMonth()
        let temp:StatusProperty[] = []
        let paid:number = 0
        let onTime:number = 0
        let notPaid:number = 0

        data.forEach((item:Property) => {
            if(item.status) {
                let status:string = "notPaid"
                if(item.payments) {
                    let pay = item.payments.find(el => el.year === year && el.month === months[month].en)
                    console.log(pay)
                    if(pay === undefined){
                        //check if is on time
                        if(day <= item.contract.day){
                            //is on time
                            status = "onTime"
                            onTime++;
                        } else {
                            notPaid++;
                        }
                    } else {
                        //there has been a payment
                        paid++;
                        status = "paid"
                    }
                } else {
                    notPaid++;
                }
                
                temp.push({
                    ...item,
                    paidStatus: status
                })
            }
        })

        console.log(paid, onTime, notPaid)
        console.log(temp)
        let temp2 = temp.filter((el:StatusProperty) => el.paidStatus === "notPaid")
        console.log(temp2)

        let pieData = [
            {
                "id": "Cobradas",
                "label": "Cobradas",
                "value": paid,
                "color": "#01AA55"
            },
            {
                "id": "EnTiempo",
                "label": "Entiempo",
                "value": onTime,
                "color": "#e99517"
            },
            {
                "id": "SinCobrar",
                "label": "Sin cobrar",
                "value": notPaid,
                "color": "#FF6342"
            },
        ]
        
        //@ts-ignore
        setState({...state, properties: temp, propertiesList: temp2, paid, onTime, notPaid, month: months[month].es, pieData})
    }

    const setup = async() => {
        if(properties.length === 0) {
            let data = await fecthProperties()
            setStatus(data)
        } else {
            setStatus(properties)
        }
    }

    /* handle tab click */
    const handleTabClick = (num:number) => {
        let status:string[] = ["paid", "onTime", "notPaid"]
        let temp = state.properties.filter((el:StatusProperty) => el.paidStatus === status[num])
        setState({...state, selected: num, propertiesList: temp})
    }

    /* handle property click */
    const handlePropertyClick = (property:StatusProperty) => {
        updateEditProperty(property)
        router.push(`/edit_property`)
    }

    return (
        <div className={styles.container}>
            <h2 className={dash.subtitle}>Rentas cobradas en {state.month}</h2>
            <div className={styles.infoContainer}>
                {state.pieData.length !== 0 && (
                    <TwoColorPie data={state.pieData}/>
                )}
                <div className={styles.dataContainer}>
                    {/* tabs */}
                    <div className={styles.tabsContainer}>
                        <div className={styles.paidTab} 
                            onClick={() => {handleTabClick(0)}}
                            style={{background: state.selected === 0 ? 'var(--success)' : 'none', color: state.selected === 0 ? '#07592d' : 'var(--success)'}}>
                            <div className={styles.tabInner}>
                                <PaidRoundedIcon className={styles.tabIcon}/> 
                                <span className={styles.tabNumber}>{state.paid}</span>
                            </div>
                            <p className={styles.tabText}>Cobradas</p>
                        </div>
                        <div className={styles.onTimeTab} 
                            onClick={() => {handleTabClick(1)}}
                            style={{background: state.selected === 1 ? 'var(--medium)' : 'none', color: state.selected === 1 ? '#845207' : 'var(--medium)'}}>
                            <div className={styles.tabInner}>
                                <AccessTimeFilledRoundedIcon className={styles.tabIcon}/> 
                                <span className={styles.tabNumber}>{state.onTime}</span>
                            </div>
                            <p className={styles.tabText}>En tiempo</p>
                        </div>
                        <div className={styles.notPaidTab} 
                            onClick={() => {handleTabClick(2)}}
                            style={{background: state.selected === 2 ? 'var(--cancel)' : 'none', color: state.selected === 2 ? '#a5280e' : 'var(--cancel)'}}>
                            <div className={styles.tabInner}>
                                <ErrorRoundedIcon className={styles.tabIcon}/> 
                                <span className={styles.tabNumber}>{state.notPaid}</span>
                            </div>
                            <p className={styles.tabText}>Sin cobrar</p>
                        </div>
                    </div>

                    {/* table */}
                    <div className={styles.table}>
                        {state.propertiesList.length !== 0 ? state.propertiesList.map((item:StatusProperty, i:number) => (
                            <div key={i} className={styles.propertyRow}>
                                <p>{item.name}</p>
                                <Tooltip title="Ver propiedad" placement='top'>
                                    <IconButton onClick={() => {handlePropertyClick(item)}}>
                                        <InfoRoundedIcon className={styles.propertyIcon}/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        )) : (
                            <div>
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default BilledRents