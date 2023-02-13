//React
import React, { useState, useEffect } from 'react'

//Next
import { useRouter } from 'next/router'

//CSS
import styles from '../../../styles/components/dashboard/ContractsStatus.module.css'
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

//Utils
import { contractStatus } from '../../utils/functions/contractStatus'
import { contractStatusList, contractStatusBackground, contractStatusColor } from '../../utils/constants/contract'

const ContractsStatus = () => {
    //Context
    const { properties, fecthProperties } = useProperties()

    //useState - state
    const [state, setState] = useState({
        month: "",
        pieData: [],
        occupied: 12,
        free: 4,
        status: [0,0,0,0,0,0],
        properties: []
    })

    //useEffect
    useEffect(() => {
        setup()
    },[])

    const setStatus = (data:Property[]) => {
        let temp:number[] = [0,0,0,0,0,0]
        let tempProperties:any[] = []
        data.forEach((item:Property) => {
            if(item.status) {
                //check status
                let status = contractStatus(item.contract.end)
                temp[status]++;

                tempProperties.push({
                    ...item,
                    contractStatus: status
                })
            } 
        })

        console.log(temp)

        //@ts-ignore
        setState({...state, status: temp, properties: tempProperties})
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
            <h2 className={dash.subtitle}>Vencimiento de contratos</h2>
                {/* tabs */}
                <div className={styles.tabsContainer}>
                    {state.status.map((item, i) => (
                        <div key={i} className={styles.tab} style={{background: contractStatusBackground[i], color: contractStatusColor[i]}}>
                            <p className={styles.tabNumber}>{item}</p>
                            <p className={styles.tabText}>{contractStatusList[i]}</p>
                        </div>
                    ))}
                </div>
        </div>
    )
}

export default ContractsStatus