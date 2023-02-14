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
        properties: [],
        data: [
            {
                "id": 'Renta Neta',
                "color": "hsl(149, 94%, 34%)",
                "data": [
                    { x: '2022-01-01', y: 78000 },
                    { x: '2022-02-01', y: 82000 },
                    { x: '2022-03-01', y: 66000 },
                    { x: '2022-04-01', y: 32000 },
                    { x: '2022-05-01', y: 90000 },
                    { x: '2022-06-01', y: 100000 },
                    { x: '2022-07-01', y: 85000 },
                    { x: '2022-08-01', y: 96000 },
                    { x: '2022-09-01', y: 90000 },
                    { x: '2022-10-01', y: 100000 },
                    { x: '2022-11-01', y: 85000 },
                    { x: '2022-12-01', y: 96000 },
                ],
            },
        ],
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
            <h2 className={dash.subtitle}>Ingresos netos mensuales</h2>
                {/* chart */}
                <LineChart data={state.data}/>
        </div>
    )
}

export default MonthlyRent