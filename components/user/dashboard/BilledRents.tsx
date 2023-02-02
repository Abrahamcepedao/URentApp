//React
import React, { useState, useEffect } from 'react'

//CSS
import styles from '../../../styles/components/dashboard/BilledRents.module.css'
import dash from '../../../styles/Dashboard.module.css'

//Nivo
import TwoColorPie from '../../charts/TwoColorPie'
//constant
import months from '../../utils/constants/months'

const BilledRents = () => {
    //useState - state
    const [state, setState] = useState({
        month: "",
        pieData: [
            {
                "id": "Cobradas",
                "label": "Cobradas",
                "value": 141,
                "color": "#E3C37E"
            },
            {
                "id": "SinCobrar",
                "label": "Sin cobrar",
                "value": 462,
                "color": "#F9E0AB"
            }
        ]
    })

    //useEffect
    useEffect(() => {
        setup()
    })

    const setup = () => {
        let today = new Date()
        setState({...state, month: months[today.getMonth()].es})

    }

    return (
        <div className={styles.container}>
            <h2 className={dash.subtitle}>Rentas cobradas en {state.month}</h2>
            <TwoColorPie data={state.pieData}/>
        </div>
    )
}

export default BilledRents