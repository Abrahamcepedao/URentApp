//CSS
import styles from '../../styles/components/Chip.module.css'


const Chip = (props:any) => {

    return (
        <div className={styles.chip} style={{background: props.background, color: props.color}}>
            {props.title}
        </div>
    )
}

export default Chip