import React from 'react'

function Radio({text, id, onClick}) {
    return (
        <div className='flex items-center' onClick={onClick}>
            <input type="radio" id={id} className='w-5 h-5' />
            <label htmlFor={id}>{text}</label>
        </div>
    )
}

export default Radio