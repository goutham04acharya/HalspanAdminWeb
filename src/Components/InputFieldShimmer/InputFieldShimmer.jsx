/* eslint-disable max-len */
import React from 'react';

export default function InputFieldShimmer () {
    return (
        <div className={'flex flex-col gap-2 relative my-5 mx-1'}>
            <p className={'animate-pulse z-0 h-[20px] w-[330px] text-slate-200 bg-slate-200'}>
            </p>
            <p className={'animate-pulse z-0  w-[339px] h-[40px] text-slate-200 bg-slate-200 rounded-t-md'}>
            </p>
        </div>
    );
}
