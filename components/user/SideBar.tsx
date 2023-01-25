import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'

//next
import Image from 'next/image'
import Link from 'next/link'

//Logo image
import Logo from '../../public/logo.png'

//CSS
import styles from '../../styles/components/SideBar.module.css'

//Material UI
import { IconButton, Tooltip } from '@mui/material'

//Material UI - icons
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const SideBar = () => {
    //router
    const router = useRouter()

    //context
    const { logout } = useAuth()

    return (
        <div className={styles.container}>
            <div className={styles.logo__container}>
                <Image src={Logo} className={styles.logo} alt="URent"/>
            </div>

            {/* tabs */}
            <div className={styles.tabs}>
                <Link className={styles.tab} href="/dashboard">
                    <DashboardRoundedIcon className={styles.tab__icon}/>
                    <p className={styles.tab__label} style={{opacity: router.pathname === '/dashboard' ? 1 : 0.5}}>Inicio</p>
                </Link>
                <Link className={styles.tab} href="/properties">
                    <MapsHomeWorkRoundedIcon className={styles.tab__icon}/>
                    <p className={styles.tab__label} style={{opacity: router.pathname === '/properties' ? 1 : 0.5}}>Propiedades</p>
                </Link>
                <Link className={styles.tab} href="/users">
                    <PeopleRoundedIcon className={styles.tab__icon}/>
                    <p className={styles.tab__label} style={{opacity: router.pathname === '/users' ? 1 : 0.5}}>Usuarios</p>
                </Link>
            </div>

            {/* actions */}
            <div className={styles.actions}>
                <Link href={"/settings"}>
                    <Tooltip title="Ajustes" placement='top'>
                        <IconButton>
                            <SettingsRoundedIcon className={styles.actions__icon}/>
                        </IconButton>
                    </Tooltip>
                </Link>
                <Tooltip title="Cerrar sesión" placement='top'>
                    <IconButton onClick={logout}>
                        <LogoutRoundedIcon className={styles.actions__icon}/>
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}

export default SideBar