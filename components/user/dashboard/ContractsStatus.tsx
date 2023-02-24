//React
import React, { useState, useEffect } from 'react'

//Next
import { useRouter } from 'next/router'

//CSS
import styles from '../../../styles/components/dashboard/ContractsStatus.module.css'
import dash from '../../../styles/Dashboard.module.css'

//Material UI
import { IconButton, Tooltip } from '@mui/material';

//Material UI - icons
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

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
    const { properties, fecthProperties, updateEditProperty } = useProperties()

    //router 
    const router = useRouter()

    //useState - state
    const [state, setState] = useState({
        month: "",
        pieData: [],
        occupied: 12,
        free: 4,
        status: [0,0,0,0,0,0],
        properties: [],
        propertiesList: [],
        selected: 0,
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
        let selected = 0
        for(let i = 5; i >= 0; i--){
            if(temp[i] !== 0){
                selected = temp[i];
            }
        }
        console.log(selected)

        let propertiesList = tempProperties.filter((el:any) => el.contractStatus === selected)
        //@ts-ignore
        setState({...state, status: temp, properties: tempProperties, propertiesList: tempProperties.filter((el:any) => el.contractStatus === selected), selected})
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
        let temp = state.properties.filter((el:any) => el.contractStatus === num)
        setState({...state, selected: num, propertiesList: temp})
    }

    /* handle property click */
    const handlePropertyClick = (property:StatusProperty) => {
        updateEditProperty(property)
        router.push(`/edit_property`)
    }

    return (
        <div className={styles.container}>
            <h2 className={dash.subtitle}>Vencimiento de contratos</h2>
                {/* tabs */}
                <div className={styles.tabsContainer}>
                    {state.status.map((item, i) => (
                        <div key={i} 
                            className={styles.tab} 
                            style={{background: state.selected === i ? contractStatusBackground[i] : 'none', borderColor: state.selected !== i ? contractStatusBackground[i] : 'none', color: contractStatusColor[i]}}
                            onClick={() => {handleTabClick(i)}}
                        >
                            <p className={styles.tabText}>{contractStatusList[i]}</p>
                            <div className={styles.numContainer} style={{borderColor: contractStatusBackground[i]}}>
                                <p className={styles.tabNumber}>{item}</p>
                            </div>
                        </div>
                    ))}
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
                                <p className={styles.rowLabel}>No hay propiedades que el contracto venza en {contractStatusList[state.selected]}</p>
                            </div>
                        )}
                    </div>
        </div>
    )
}

export default ContractsStatus