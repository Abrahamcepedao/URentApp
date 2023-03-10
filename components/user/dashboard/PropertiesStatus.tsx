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
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

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
        properties: [],
        propertiesList: [],
        selected: 0
    })

    //useEffect
    useEffect(() => {
        setup()
    },[])

    const setStatus = (data:Property[]) => {
        let occupied:number = 0
        let free:number = 0
        let temp:any[] = []
        data.forEach((item:Property) => {
            if(item.status) {
                occupied++;
                temp.push({
                    ...item,
                    status: 0 // in use
                })
            } else {
                free++;
                temp.push({
                    ...item,
                    status: 1 //rfee
                })
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
        setState({...state, occupied, free, pieData, properties: temp, propertiesList: temp.filter((el:any) => el.status === state.selected)})
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
        let temp = state.properties.filter((el:any) => el.status === num)
        setState({...state, selected: num, propertiesList: temp})
    }


    /* handle property click */
    const handlePropertyClick = (property:StatusProperty) => {
        updateEditProperty(property)
        router.push(`/edit_property`)
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
                    <div className={styles.tabsContainer2}>
                        <div className={styles.paidTab}
                            onClick={() => {handleTabClick(0)}}
                            style={{background: state.selected === 0 ? 'var(--success)' : 'none', color: state.selected === 0 ? '#07592d' : 'var(--success)'}}
                        >
                            <div className={styles.tabInner}>
                                <span className={styles.tabNumber}>{state.occupied}</span>
                                <CheckCircleOutlineRoundedIcon className={styles.tabIcon}/> 
                            </div>
                            <p className={styles.tabText}>Ocupadas</p>
                        </div>
                        <div className={styles.notPaidTab} 
                            onClick={() => {handleTabClick(1)}}
                            style={{background: state.selected === 2 ? 'var(--cancel)' : 'none', color: state.selected === 2 ? '#a5280e' : 'var(--cancel)'}}
                        >
                            <div className={styles.tabInner}>
                                <span className={styles.tabNumber}>{state.free}</span>
                                <CancelRoundedIcon className={styles.tabIcon}/> 
                            </div>
                            <p className={styles.tabText}>Libres</p>
                        </div>
                    </div>

                    {/* table */}
                    <div className={styles.table}>
                        {state.propertiesList.length !== 0 ? state.propertiesList.map((item:StatusProperty, i:number) => (
                            <div key={i} className={styles.propertyRow}>
                                <p className={styles.rowLabel}>{item.name}</p>
                                <Tooltip title="Ver propiedad" placement='top'>
                                    <IconButton onClick={() => {handlePropertyClick(item)}} className={dash.icon__btn}>
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

export default PropertiesStatus