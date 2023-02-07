//React
import React, { useState, useEffect } from 'react'

//CSS
import styles from '../../../styles/components/dashboard/BilledRents.module.css'
import dash from '../../../styles/Dashboard.module.css'

//Nivo
import TwoColorPie from '../../charts/TwoColorPie'

//Material UI - icons
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';

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
                "color": "#109B1E"
            },
            {
                "id": "EnTiempo",
                "label": "Entiempo",
                "value": 4,
                "color": "#e08516"
            },
            {
                "id": "SinCobrar",
                "label": "Sin cobrar",
                "value": 4,
                "color": "#ca0b2c"
            },
        ],
        properties: [],
        selected: 0, // 0 = pagadas, 1 = en tiempo, 2 = no cobradas
        paid: 12,
        onTime: 4,
        notPaid: 4
    })

    //useEffect
    useEffect(() => {
        //setup()
    },[properties])

    const setup = async() => {
        let today = new Date()
        setState({...state, month: months[today.getMonth()].es})

        console.log(properties)
        if(properties.length === 0) {
            let data = await fecthProperties()

        } else {
            
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
                            <p className={styles.tabText}>Cobradas: {state.paid}</p>
                        </div>
                        <div className={styles.onTimeTab} 
                            onClick={() => {handleTabClick(1)}}
                            style={{background: state.selected === 1 ? 'var(--medium)' : 'none', color: state.selected === 1 ? 'white' : 'var(--medium)'}}>
                            <p className={styles.tabText}>En tiempo: {state.onTime}</p>
                        </div>
                        <div className={styles.notPaidTab} 
                            onClick={() => {handleTabClick(2)}}
                            style={{background: state.selected === 2 ? 'var(--cancel)' : 'none', color: state.selected === 2 ? 'white' : 'var(--cancel)'}}>
                            <p className={styles.tabText}>Sin cobrar: {state.notPaid}</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default BilledRents