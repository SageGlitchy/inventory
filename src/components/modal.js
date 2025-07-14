import styles from "@/styles/inventory.module.scss"
import { useState } from "react";

export default function Modal({children, onClose}){
    const [closing, setClosing]=useState(false);

    const handleClose=()=>{
        setClosing(true);
        setTimeout(onClose, 250);
    };

    return(
        <div className={styles.modalOverlay}>
            <div 
            className={styles.modalCard}
            style={{
                animation:closing
                ? "popOut 0.25s cubic-bezier(.68, -0.55, 0.27, 1.55) forwards"
                : "popIn 0.25s cubix-bezier(.68, -0.55, 0.27, 1.55)"
            }}
            >
                {children}
                <button className={styles.modalClose} onClick={handleClose}>x</button>
            </div>
        </div>
    );
}