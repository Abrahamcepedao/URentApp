//CSS
import styles from '../../styles/components/Chip.module.css'


const Chip = (props:any) => {

    return (
        <div className={styles.chip} style={{borderColor: props.color, color: props.color}}>
            {props.title}
        </div>
    )
}

export default Chip