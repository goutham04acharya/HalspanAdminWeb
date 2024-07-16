import React from 'react'
import { motion } from 'framer-motion'

const Image = ({src, type, alt, className, id, onClick, toolTipId, testId, cdnImg}) => {
    return (
        <motion.img
            id={id}
            data-testid={testId}
            data-tooltip-id={toolTipId}
            onClick={onClick}
            className={className}
            src={cdnImg ? `${cdn}` :  `/Images/${src}.${type || 'svg'}`}
            alt={alt || src}
            loading='lazy'
        />
    )
}

export default Image