//React
import React, { useState, useEffect } from 'react'

//CSS
import styles from '../../../styles/components/dashboard/BilledRents.module.css'
import dash from '../../../styles/Dashboard.module.css'

//Nivo
import TwoColorPie from '../../charts/TwoColorPie'

//constants
import months from '../../utils/constants/months'

//Context
import { useProperties } from '../../../context/PropertiesContext'

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
                "color": "#E3C37E"
            },
            {
                "id": "SinCobrar",
                "label": "Sin cobrar",
                "value": 4,
                "color": "#F9E0AB"
            }
        ],
        properties: []
    })

    //useEffect
    useEffect(() => {
        setup()
    })

    const setup = async() => {
        let today = new Date()
        setState({...state, month: months[today.getMonth()].es})

        console.log(properties)
        if(properties.length === 0) {
            let data = await fecthProperties()

        } else {
            
        }
        

    }

    return (
        <div className={styles.container}>
            <h2 className={dash.subtitle}>Rentas cobradas en {state.month}</h2>
            <TwoColorPie data={state.pieData}/>
        </div>
    )
}

export default BilledRents