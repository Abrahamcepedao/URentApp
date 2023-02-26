//React js
import { useEffect, useState } from 'react'

//Next.js
import { useRouter } from 'next/router'

//Context
import { useAuth } from '../../context/AuthContext'

//next
import Link from 'next/link'

//CSS
import styles from '../../styles/components/MobileHeader.module.css'
import dash from '../../styles/Dashboard.module.css'

//Material UI
import { IconButton } from '@mui/material'

//Material UI - icons
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

const MobileHeader = () => {
    //router
    const router = useRouter()

    //context
    const { user, logout } = useAuth()

    //useState - menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    //us
    useEffect(() => {
        console.log(user)
    })

    /* order menu functions */
    const handleClick = (event:any) => {
        setAnchorEl(event.currentTarget);
    };

    /* handle close */
    const handleClose = () => {
        setAnchorEl(null);
    };

    /* handle setting click */
    const handleSettingsClick = () => {
        router.push("/settings")
    }

    return (
        <div className={styles.container}>
            <p>Hola, {user.name}</p>
            <div>
                <IconButton
                    onClick={(e) => {handleClick(e)}}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    className={styles.header__btn}
                >
                    <MenuRoundedIcon className={dash.header__icon}/>
                </IconButton>
            </div>

            {/* Menu */}
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                    },
                    '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    },
                },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleSettingsClick}>
                    <ListItemIcon>
                        <SettingsRoundedIcon fontSize="small" />
                    </ListItemIcon>
                        Configuración
                    </MenuItem>
                <MenuItem>
                    <ListItemIcon onClick={logout}>
                        <LogoutRoundedIcon fontSize="small" />
                    </ListItemIcon>
                        Cerrar sesión
                </MenuItem>
            </Menu>
        </div>
    )
}

export default MobileHeader