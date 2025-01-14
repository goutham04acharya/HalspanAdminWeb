
import React, { useEffect, useState } from 'react'
import Modal from 'react-responsive-modal';
import InputField from '../InputField/InputField';
import InputTextarea from '../InputField/InputTextarea';
import Button2 from '../Button2/ButtonLight';
import Image from '../Image/Image';
import { BeatLoader } from 'react-spinners';
import Shimmer from '../Shimmers/Shimmer';

const CreateModal = ({ isModalOpen, setData, handleClose, data, errors, handleChange, handleCreate, isCreateLoading, handleImport, isView, isImportLoading, title, createLookup, handleAddChoice, initialState, handleRemoveChoice, activeInputs, setActiveInputs, shimmerLoading, maxLengthError, disableDelete }) => {

    const handleAddInput = (uuid) => {
        setActiveInputs(prev => ({
            ...prev,
            [uuid]: true
        }));
    };
    const handleClearAdditionalInput = (uuid, index) => {
        setData(prevData => ({
            ...prevData,
            [`additional-value-${index}`]: '' // Only clear the specified additional input
        }));

        setActiveInputs(prev => ({
            ...prev,
            [uuid]: false
        }));
    };
    const choicesLength = Array.isArray(data.choices) ? data.choices.length : 0;
    const getModalWidth = () => {
        if (choicesLength < 4) return 'importModalXsm';
        if (choicesLength <= 6) return 'importModalSm';
        if (choicesLength <= 10) return 'importModalMd';
        return 'importModalLg';
    };
    const getChoiceWidth = () => {

        if (choicesLength < 4) return 'w-full';
        if (choicesLength <= 6) return 'w-1/2';
        if (choicesLength <= 10) return 'w-1/3';
        return 'w-1/3';
    };
    const getChoiceShimmerWidth = () => {

        if (choicesLength < 4) return 'w-[350px]';
        if (choicesLength <= 6) return 'w-[150px]';
        return 'w-[120px]';
    };
    const getChoiceHeight = () => {

        if (choicesLength <= 4) return 'h-[calc(100vh-693px)] ';
        if (choicesLength <= 6) return 'h-[calc(100vh-480px)] ';
        if (choicesLength < 10) return 'h-[calc(100vh-580px)] ';
        return 'h-[calc(100vh-480px)] ';
    };
    const getChoiceShimmerCol = () => {

        if (choicesLength <= 4) return 2;
        if (choicesLength <= 6) return 2;
        if (choicesLength < 10) return 5;
        return 3;
    };
    // useEffect(()=>{
    //     handleView()
    // },[])
    return (
        <Modal center open={isModalOpen} onClose={handleClose} closeIcon={<div style={{ color: 'white' }} disabled></div>}>
            <div className={`flex flex-col relative overflow-x-auto scrollBar ${getModalWidth()}`}>
                <Image testId="cancel" onClick={() => {
                    handleClose()
                    // setActiveInputs('')
                }} src='close' className='h-6 absolute right-0 top-0 cursor-pointer' />
                <h1 className='font-[600] text-[22px] leading-[33px] mb-5'>{title}</h1>
                <InputField
                    autoComplete='off'
                    label='Name'
                    id='name'
                    type='text'
                    value={data.name}
                    placeholder='Enter name'
                    testId='name'
                    htmlFor='name'
                    maxLength={40}
                    handleChange={(e) => handleChange(e, e.target.id, 'Name')}
                    className='w-full mt-2.5'
                    validationError={errors?.name}
                    lookupDataset
                />
                {createLookup && <InputTextarea
                    className='h-[160px] w-full px-2.5 mt-2.5'
                    label='Choices (Comma separated)'
                    htmlFor='choices'
                    id='choices'
                    mainStyle='mt-5'
                    labelStyle='font-semibold text-base text-[#2B333B] pt-5'
                    value={data.choices}
                    placeholder='Enter choices'
                    testId='choices'
                    maxLength={1000}
                    handleChange={(e) => handleChange(e, e.target.id, 'choices')}
                    validationError={errors?.choices}
                />}
                {
                    <div>
                        {(!createLookup && (choicesLength >= 11)) && <div className='flex w-full mt-5 mb-1.5'>
                            <div className='flex items-center w-1/3'>
                                <h1 className='font-[600] text-[#2B333B] w-[30%]'>Id</h1>
                                <h1 className='font-[600] text-[#2B333B] w-[40%]'>Value</h1>
                            </div>
                            <div className='flex items-center w-1/3'>
                                <h1 className='font-[600] text-[#2B333B] w-[30%]'>Id</h1>
                                <h1 className='font-[600] text-[#2B333B] w-[40%]'>Value</h1>
                            </div>
                            <div className='flex items-center w-1/3'>
                                <h1 className='font-[600] text-[#2B333B] w-[30%]'>Id</h1>
                                <h1 className='font-[600] text-[#2B333B] w-[40%]'>Value</h1>
                            </div>
                        </div>}
                        {(!createLookup && (choicesLength > 6 && choicesLength < 11)) &&
                            <div className='flex mt-5 mb-1.5'
                            >
                                <div className='flex justify-start w-full gap-[11%] items-center'>
                                    <h1 className='font-[600] text-[#2B333B] w-[30%]'>Id</h1>
                                    <h1 className='font-[600] text-[#2B333B] w-[40%]'>Value</h1>
                                </div>
                                <div className='flex justify-start gap-[11%] items-center w-full'>
                                    <h1 className='font-[600] text-[#2B333B] w-[30%]'>Id</h1>
                                    <h1 className='font-[600] text-[#2B333B] w-[40%]'>Value</h1>
                                </div>
                                <div className='flex justify-start gap-[11%] items-center w-full'>
                                    <h1 className='font-[600] text-[#2B333B] w-[30%]'>Id</h1>
                                    <h1 className='font-[600] text-[#2B333B] w-[40%]'>Value</h1>
                                </div>
                            </div>}
                        {(!createLookup && (choicesLength === 4 || choicesLength === 5 || choicesLength === 6)) && <div className='flex mt-5 mb-1.5'>
                            <div className='flex justify-start w-full gap-[7%] items-center'>
                                <h1 className='font-[600] text-[#2B333B] w-[30%]'>Id</h1>
                                <h1 className='font-[600] text-[#2B333B] w-[40%]'>Value</h1>
                            </div>
                            <div className='flex justify-start gap-[7%] items-center w-full'>
                                <h1 className='font-[600] text-[#2B333B] w-[30%]'>Id</h1>
                                <h1 className='font-[600] text-[#2B333B] w-[40%]'>Value</h1>
                            </div>
                        </div>}
                        {(!createLookup && (choicesLength < 4)) && <div className='flex mt-5 mb-1.5'>
                            <div className='flex items-center justify-start gap-[13%] w-full'>
                                <h1 className='font-[600] text-[#2B333B] w-[30%]'>Id</h1>
                                <h1 className='font-[600] text-[#2B333B] w-[40%]'>Value</h1>
                            </div>
                        </div>}
                        {!createLookup && <div className={`${getChoiceHeight()} w-full flex flex-wrap overflow-y-auto ${shimmerLoading ? 'scrollHide' : 'scrollBar'}`}>
                            {(Array.isArray(data.choices) ? data.choices : []).map((choice, index) => (
                                <div className={`${getChoiceWidth()}`}>
                                    <div className='flex flex-col'>
                                        <div key={choice.uuid || index}>
                                            {shimmerLoading ? <Shimmer column={getChoiceShimmerCol()} row={7} width={getChoiceShimmerWidth()} /> :
                                                <div className={`flex py-1 gap-4 ${choicesLength >= 11 ? 'mr-10' : 'mr-3'}`}>
                                                    <InputField
                                                        autoComplete="off"
                                                        id={`uuid-${index}`}
                                                        type="text"
                                                        value={choice.uuid}
                                                        testId={`uuid-${index}`}
                                                        htmlFor={`uuid-${index}`}
                                                        maxLength={40}
                                                        className="w-full mt-2.5"
                                                        validationError={errors?.choices?.[index]?.uuid}
                                                        disabled
                                                    />
                                                    <InputField
                                                        autoComplete="off"
                                                        id={`value-${index}`}
                                                        type="text"
                                                        value={choice.value}
                                                        testId={`value-${index}`}
                                                        htmlFor={`value-${index}`}
                                                        maxLength={40}
                                                        handleChange={(e) => handleChange(e, choice.uuid, 'value')}
                                                        className="w-full mt-2.5"
                                                        validationError={errors?.choices?.[index]?.value}
                                                        // lookupDataset
                                                        placeholder="Enter values separated by commas"
                                                        disabled
                                                    />
                                                    {choicesLength !== 1 &&<img
                                                        src="/Images/trash-black.svg"
                                                        alt="delete"
                                                        className="pl-1 cursor-pointer w-9 p-2 rounded-full hover:bg-[#FFFFFF]"
                                                        data-testid={`delete-choice-${index + 1}`}
                                                        onClick={() => handleRemoveChoice(choice.uuid)}
                                                    />}
                                                    <img
                                                        src="/Images/add.svg"
                                                        alt="add"
                                                        data-testid={`add-choice-${index + 2}`}
                                                        className="pl-1 cursor-pointer w-14 p-2 rounded-full hover:bg-[#FFFFFF]"
                                                        onClick={() => handleAddInput(choice.uuid)}
                                                    />
                                                </div>}

                                        </div>
                                        {activeInputs[choice.uuid] && (
                                            <div className='flex gap-3 w-full'>
                                                <div className="flex w-[98%]">
                                                    <InputField
                                                        autoComplete="off"
                                                        id={`additional-value-${index}`}
                                                        type="text"
                                                        lookupDataset
                                                        placeholder="Enter Choices"
                                                        testId={`additional-value-${index}`}
                                                        htmlFor={`additional-value-${index}`}
                                                        // maxLength={100}
                                                        handleChange={(e) => handleChange(e, e.target.id, `additional-value-${index}`)}
                                                        className="w-full mt-2.5"
                                                        onBlur={() => {
                                                            // Remove the additional input field when it loses focus
                                                            setTimeout(() => {
                                                                setActiveInputs(prev => ({
                                                                    ...prev,
                                                                    [choice.uuid]: false
                                                                }));
                                                            }, 200);
                                                        }}
                                                        validationError={maxLengthError && 'Each choice must not exceed 100 characters'} />
                                                </div>
                                                <img
                                                    src="/Images/close.svg"
                                                    alt="close"
                                                    onClick={() => handleClearAdditionalInput(choice.uuid, index)}
                                                    className="w-[22px] h-[22px] my-auto cursor-pointer mr-[14px]"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>}
                    </div>}
                {/* <div className='flex gap-5'> */}
                {/* </div> */}
                <div className='flex justify-between mt-5'>
                    <Button2
                        text={`${isView ? 'Update' : 'Create'}`}
                        testId='create'
                        className='w-[156px] font-[600]'
                        onClick={() => {
                            handleCreate('')
                            setActiveInputs('')
                        }}
                        isThreedotLoading={isCreateLoading}
                    />
                    <>
                        {!isView ? <><input
                            data-testid="import-file"
                            type="file"
                            accept=".csv"
                            onChange={handleImport}
                            disabled={isImportLoading}
                            id="file-upload"
                            style={{ display: 'none' }} // Hide the actual input field
                        /><label
                            htmlFor="file-upload"
                            className={`bg-[#fff] hover:bg-[#EFF1F8] h-[50px] border border-[#2B333B] text-base ${isImportLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
                            leading-[24px] py-2 rounded w-[156px] font-[600] flex justify-center items-center`}>
                                {isImportLoading ? (
                                    <BeatLoader color="#2B333B" size='10px' />
                                ) : (
                                    <>
                                        {isView ? 'Cancel' : 'Import'}
                                    </>
                                )}
                            </label></>

                            :
                            <button
                                onClick={handleClose}
                                data-testid="import-btn"
                                className={`bg-[#fff] hover:bg-[#EFF1F8] h-[50px] border border-[#2B333B] text-base ${isImportLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
                            leading-[24px] py-2 rounded w-[156px] font-[600] flex justify-center items-center`}>
                                {isImportLoading ? (
                                    <BeatLoader color="#2B333B" size='10px' />
                                ) : (
                                    <>
                                        {isView ? 'Cancel' : 'Import'}
                                    </>
                                )}
                            </button>}
                    </>
                </div>
            </div>
        </Modal>
    )
}

export default CreateModal