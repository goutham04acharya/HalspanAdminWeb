import React from 'react'
import Modal from 'react-responsive-modal';
import InputField from '../InputField/InputField';
import InputTextarea from '../InputField/InputTextarea';
import Button2 from '../Button2/ButtonLight';
import Image from '../Image/Image';
import { BeatLoader } from 'react-spinners';

const CreateModal = ({ isModalOpen, handleClose, data, errors, handleChange, handleCreate, isCreateLoading, handleImport, isView, isImportLoading, title }) => {
    return (
        <Modal center open={isModalOpen} onClose={handleClose} closeIcon={<div style={{ color: 'white' }} disabled></div>}>
            <div className='customModal flex flex-col gap-5 w-[352px] relative'>
                <Image testId="cancel" onClick={handleClose} src='close' className='h-6 absolute -right-3 -top-3 cursor-pointer' />
                <h1 className='font-[600] text-[22px] leading-[33px]'>{title}</h1>
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
                    handleChange={handleChange}
                    className='w-full mt-2.5'
                    validationError={errors?.name}
                />
                <InputTextarea
                    className='h-[160px] w-full mt-2.5'
                    label='Choices (Comma separated)'
                    htmlFor='choices'
                    id='choices'
                    labelStyle='font-semibold text-base text-[#2B333B]'
                    value={data.choices}
                    placeholder='Enter choices'
                    testId='choices'
                    maxLength={1000}
                    handleChange={handleChange}
                    validationError={errors?.choices}
                />
                <div className='flex justify-between'>
                    <Button2
                        text={`${isView ? 'Update' : 'Create'}`}
                        testId='create'
                        className='w-[156px] font-[600]'
                        onClick={() => handleCreate('')}
                        isThreedotLoading={isCreateLoading}
                    />
                    <>
                        <input
                            data-testid="import-file"
                            type="file"
                            accept=".csv"
                            onChange={handleImport}
                            disabled={isImportLoading}
                            id="file-upload"
                            style={{ display: 'none' }} // Hide the actual input field
                        />
                        {data?.choices === '' ? <label
                            htmlFor="file-upload"
                            className={`bg-[#fff] hover:bg-[#EFF1F8] h-[50px] border border-[#2B333B] text-base ${isImportLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
                            leading-[24px] py-2 rounded w-[156px] font-[600] flex justify-center items-center`}>
                            {isImportLoading ? (
                                <BeatLoader color="#2B333B" size='10px' />
                            ) : (
                                <>
                                    Import
                                </>
                            )}
                        </label> : <button
                            onClick={handleImport}
                            data-testid="import-btn"
                            className={`bg-[#fff] h-[50px] border border-[#2B333B] text-base ${isImportLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
                            leading-[24px] py-2 rounded w-[156px] font-[600] flex justify-center items-center`}>
                            {isImportLoading ? (
                                <BeatLoader color="#2B333B" size='10px' />
                            ) : (
                                <>
                                    Import
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