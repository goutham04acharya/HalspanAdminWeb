import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setModalOpen } from '../QuestionnaryFormSlice';
import useOnClickOutside from '../../../../CommonMethods/outSideClick';
import Button2 from '../../../../Components/Button2/ButtonLight';
import Button from '../../../../Components/Button/button';
import StaticDetails from './Components/StaticDetails/StaticDetails'
import AdvancedEditor from './Components/AdvancedEditor/AdvancedEditor';
import { useSelector } from 'react-redux';
import { setUniqueAllSectionDetails } from '../../../QuestionnaryForm/Components/ConditionalLogicAdvanced/Components/SectionDetailsSlice'

function ConditionalLogic({setConditionalLogic}) {
    const modalRef = useRef();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('text'); // default is 'preField'
    const allSectionDetails = useSelector(state => state?.allsectiondetails?.allSectionDetails); 
    const [showSectionList, setShowSectionList] = useState(false)

    // Handlers to switch tabs
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleClose = () => {
        dispatch(setConditionalLogic(false));
    };

    useOnClickOutside(modalRef, () => {
        dispatch(setModalOpen(false));
    });

    const handleListSectionDetails = () => {
        setShowSectionList(true)
    }

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[80%] h-[80%] mx-auto bg-white rounded-[14px] relative p-[18px] flex'>
                <div className='w-[60%]'>
                    <p className='text-start text-lg text-[#2B333B] font-semibold'>shows when...</p>
                    <AdvancedEditor
                    handleListSectionDetails={handleListSectionDetails}
                    showSectionList={showSectionList}
                    />
                </div>
                <div className='w-[40%]'>
                   <StaticDetails
                   handleTabClick={handleTabClick}
                   activeTab={activeTab}
                   setActiveTab={setActiveTab}
                   />
                    <div className='mt-5 flex items-center justify-between'>
                        <Button2
                        text='Cancel'
                            type='button'
                            data-testid='button1'
                            className='w-[162px] h-[50px] text-black font-semibold text-base'
                            onClick={() => handleClose()}
                        >
                        </Button2>
                        <Button
                            text='Save'
                            type='button'
                            data-testid='cancel'
                            className='w-[139px] h-[50px] border text-white border-[#2B333B] bg-[#2B333B] hover:bg-black text-base font-semibold ml-[59px]'
                        >
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConditionalLogic;
