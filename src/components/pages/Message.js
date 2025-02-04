import styles from './Message.module.css'
import { useState, useEffect } from 'react'

function Message({type, msg}){ 

    const [visible, setVisible] = useState(false)

    useEffect(() =>{
        if(!msg){
            setVisible(false)
            return
        }

        setVisible(true)

        const timer = setTimeout(() => {
            setVisible(false)
        }, 3000);

         return () => { clearTimeout(timer)}

    }, [msg])



    return(
        <>
            {visible && (
                <p className={`${styles.Message} ${styles[type]}`}>{msg}</p>
            )}
        </>
    )
}

export default Message