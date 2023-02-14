//React
import React, { useState, useEffect } from 'react'

//Next
import { useRouter } from 'next/router'

//CSS
import styles from '../../../styles/components/dashboard/MonthlyRent.module.css'
import dash from '../../../styles/Dashboard.module.css'

//Nivo
import LineChart from '../../charts/LineChart'

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

const MonthlyRent = () => {
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
                {/* chart */}
                <LineChart data={[]}/>
        </div>
    )
}

export default MonthlyRent