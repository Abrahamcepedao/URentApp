//React
import React, { useState, useEffect } from 'react'

//Next
import { useRouter } from 'next/router'

//CSS
import styles from '../../../styles/components/dashboard/PropertiesStatus.module.css'
import dash from '../../../styles/Dashboard.module.css'

//Nivo
import TwoColorPie from '../../charts/TwoColorPie'

//Material UI
import { IconButton, Tooltip } from '@mui/material';

//Material UI - icons
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

//constants
import months from '../../utils/constants/months'

//Context
import { useProperties } from '../../../context/PropertiesContext'

//Interfaces
import Property from '../../utils/interfaces/Property'
import StatusProperty from '../../utils/interfaces/StatusProperty';


const PropertiesStatus = () => {
    //Context
    const { properties, fecthProperties, updateEditProperty } = useProperties()

    //router
    const router = useRouter()

    //useState - state
    const [state, setState] = useState({
        month: "",
        pieData: [],
        occupied: 12,
        free: 4,
    })

    //useEffect
    useEffect(() => {
        setup()
    },[])

    const setStatus = (data:Property[]) => {
        let occupied:number = 0
        let free:number = 0

        data.forEach((item:Property) => {
            if(item.status) {
                occupied++;
            } else {
                free++;
            }
        })

        let pieData = [
            {
                "id": "Ocupadas",
                "label": "Ocupadas",
                "value": occupied,
                "color": "#01AA55"
            },
            {
                "id": "Libres",
                "label": "Libres",
                "value": free,
                "color": "#FF6342"
            },
        ]

        //@ts-ignore
        setState({...state, occupied, free, pieData})
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
            <h2 className={dash.subtitle}>Propiedades ocupadas</h2>
            <div className={styles.infoContainer}>
                {state.pieData.length !== 0 && (
                    <div className={styles.pieContainer}>
                        <TwoColorPie data={state.pieData}/>
                    </div>
                )}
                <div className={styles.dataContainer}>
                    {/* tabs */}
                    <div className={styles.tabsContainer}>
                        <div className={styles.paidTab}>
                            <div className={styles.tabInner}>
                                <CheckCircleOutlineRoundedIcon className={styles.tabIcon}/> 
                                <span className={styles.tabNumber}>{state.occupied}</span>
                            </div>
                            <p className={styles.tabText}>Ocupadas</p>
                        </div>
                        <div className={styles.notPaidTab} >
                            <div className={styles.tabInner}>
                                <CancelRoundedIcon className={styles.tabIcon}/> 
                                <span className={styles.tabNumber}>{state.free}</span>
                            </div>
                            <p className={styles.tabText}>Libres</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default PropertiesStatus