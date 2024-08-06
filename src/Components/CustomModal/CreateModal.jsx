import React from 'react'
import Modal from 'react-responsive-modal';
import InputField from '../InputField/InputField';
import InputTextarea from '../InputField/InputTextarea';
import Button2 from '../Button2/ButtonLight';
import Image from '../Image/Image';

const CreateModal = ({ isModalOpen, handleClose, data, errors, handleChange, handleCreate, isCreateLoading, handleImport, isView }) => {
    return (
        <Modal center open={isModalOpen} onClose={handleClose} closeIcon={<div style={{ color: 'white' }} disabled></div>}>
            <div className='customModal flex flex-col gap-5 w-[352px] relative'>
                <Image onClick={handleClose} src='close' className='h-6 absolute -right-3 -top-3 cursor-pointer' />
                <h1 className='font-[600] text-[22px] leading-[33px]'>Create Lookup Dataset</h1>
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
                        text={`${isView ? 'Update' :'Create'}`}
                        testID='create-btn'
                        className='w-[156px] font-[600]'
                        onClick={() => handleCreate('')}
                        isThreedotLoading={isCreateLoading}
                    />
                    <>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleImport}
                            id="file-upload"
                            style={{ display: 'none' }} // Hide the actual input field
                        />
                        <label 
                        htmlFor="file-upload" 
                        data-testid='file-upload'
                        className='bg-[#fff] h-[50px] border border-[#2B333B] text-base cursor-pointer
                            leading-[24px] py-2 rounded w-[156px] font-[600] flex justify-center items-center '>
                                Import
                        </label>
                    </>
                </div>
            </div>
        </Modal>
    )
}

export default CreateModal