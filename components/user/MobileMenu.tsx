//Next.js
import { useRouter } from 'next/router'

//Context
import { useAuth } from '../../context/AuthContext'

//next
import Image from 'next/image'
import Link from 'next/link'

//Logo image
import Logo from '../../public/logo.png'

//CSS
import styles from '../../styles/components/MobileMenu.module.css'

//Material UI
import { IconButton, Tooltip } from '@mui/material'

//Material UI - icons

import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';

const MobileMenu = () => {
    //router
    const router = useRouter()

    //context
    const { logout } = useAuth()

    return (
        <div className={styles.container}>
            <Link className={styles.tab} href="/dashboard" style={{background: router.pathname === '/dashboard' ? 'rgba(255,255,255,0.05)' : 'none', opacity: router.pathname === '/dashboard' ? 1 : 0.5}}>
                {router.pathname === '/dashboard' ? (
                    <AnalyticsRoundedIcon className={styles.tab__icon}/>
                ) : (
                    <AnalyticsOutlinedIcon className={styles.tab__icon}/>
                )}
                <p className={styles.tab__label}>Inicio</p>
            </Link>
            <Link className={styles.tab} href="/properties" style={{background: router.pathname === '/properties' ? 'rgba(255,255,255,0.05)' : 'none', opacity: router.pathname === '/properties' ? 1 : 0.5}}>
                {router.pathname === '/properties' ? (
                    <MapsHomeWorkRoundedIcon className={styles.tab__icon}/>
                ) : (
                    <MapsHomeWorkOutlinedIcon className={styles.tab__icon}/>
                )}
                <p className={styles.tab__label}>Propiedades</p>
            </Link>
            <Link className={styles.tab} href="/payments" style={{background: router.pathname === '/payments' ? 'rgba(255,255,255,0.05)' : 'none', opacity: router.pathname === '/payments' ? 1 : 0.5}}>
                {router.pathname === '/payments' ? (
                    <PaymentsRoundedIcon className={styles.tab__icon}/>
                ) : (
                    <PaymentsOutlinedIcon className={styles.tab__icon}/>
                )}
                <p className={styles.tab__label}>Pagos</p>
            </Link>
            <Link className={styles.tab} href="/reports" style={{background: router.pathname === '/reports' ? 'rgba(255,255,255,0.05)' : 'none', opacity: router.pathname === '/reports' ? 1 : 0.5}}>
                {router.pathname === '/reports' ? (
                    <StickyNote2RoundedIcon className={styles.tab__icon}/>
                ) : (
                    <StickyNote2OutlinedIcon className={styles.tab__icon}/>
                )}
                <p className={styles.tab__label}>Reportes</p>
            </Link>
            <Link className={styles.tab} href="/users" style={{background: router.pathname === '/users' ? 'rgba(255,255,255,0.05)' : 'none', opacity: router.pathname === '/users' ? 1 : 0.5}}>
                {router.pathname === '/users' ? (
                    <PeopleRoundedIcon className={styles.tab__icon}/>
                ) : (
                    <PeopleAltOutlinedIcon className={styles.tab__icon}/>
                )}
                <p className={styles.tab__label}>Usuarios</p>
            </Link>
        </div>
    )
}

export default MobileMenu