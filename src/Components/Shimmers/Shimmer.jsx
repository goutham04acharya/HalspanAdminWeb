/* eslint-disable max-len */
import React from 'react';

function Shimmer ({ column, row, firstIndex, hight }) {
    return (
        <tbody className=''>
            {[...Array(row)].map((_, index) => (
                <tr className="animate-pulse z-0" key={index}>
                    {[...Array(column)].map((_, ind) => (
                        <td key={`${index}.${ind}`} className={`text-sm font-light text-[#13365C] ${hight ? '' : 'p-2.5'} ${(firstIndex !== undefined && ind === 0) ? 'min-w-[80px]' : 'min-w-[150px]'}`}>
                            <div className={` ${hight || 'h-7'} bg-slate-200 rounded z-[-10] relative`} />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
}

export default Shimmer;
