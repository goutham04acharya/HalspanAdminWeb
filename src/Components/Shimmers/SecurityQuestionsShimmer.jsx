import React from 'react';

const SecurityQuestionsShimmer = () => {
    return (
        <div>{[...Array(4)]?.map((item, index) => (
            <div className='flex gap-2 flex-col mb-6' key={index}>
                <div className="h-[16px] bg-slate-200 rounded animate-pulse" />
                <div className="h-[45px] bg-slate-200 rounded animate-pulse" />
            </div>
        ))}</div>
    );
};

export default SecurityQuestionsShimmer;
