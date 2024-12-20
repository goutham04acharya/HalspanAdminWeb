import React, { useEffect, useState } from 'react'  
import Modal from 'react-responsive-modal';  
import InputField from '../InputField/InputField';  
import InputTextarea from '../InputField/InputTextarea';  
import Button2 from '../Button2/ButtonLight';  
import Image from '../Image/Image';  
import { BeatLoader } from 'react-spinners';  
  
const CreateModal = ({ isModalOpen, setData, handleClose, data, errors, handleChange, handleCreate, isCreateLoading, handleImport, isView, isImportLoading, title, createLookup, handleAddChoice, handleRemoveChoice, activeInputs, setActiveInputs }) => {  
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
   const getChoiceHeight = () => {  
  
      if (choicesLength <= 4) return 'h-[calc(100vh-693px)] ';  
      if (choicesLength <= 6) return 'h-[calc(100vh-580px)] ';  
      if (choicesLength < 10) return 'h-[calc(100vh-580px)] ';  
      return 'h-[calc(100vh-580px)] ';  
   };  
   const getColumns = () => {  
      if (choicesLength <= 3) return 1;  
      if (choicesLength <= 6) return 2;  
      return 3;  
   };  
   return (  
      <Modal center open={isModalOpen} onClose={handleClose} closeIcon={<div style={{ color: 'white' }} disabled></div>}>  
        <div className={`h-auto flex flex-col relative  ${getModalWidth()}`}>  
           <Image testId="cancel" onClick={() => {  
              handleClose()  
              // setActiveInputs('')  
           }} src='close' className='h-6 absolute -right-3 -top-3 cursor-pointer' />  
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
           {!createLookup && (  
              <table className="w-full">  
                <thead>  
                   <tr>  
                      {[...Array(getColumns())].map((_, index) => (  
                        <th key={index} className="w-1/2">  
                           <div className="flex gap-4">  
                              <h1 className="font-[600] text-[#2B333B]">Id</h1>  
                              <h1 className="font-[600] text-[#2B333B]">Value</h1>  
                           </div>  
                        </th>  
                      ))}  
                   </tr>  
                </thead>  
                <tbody>  
                   {[...Array(Math.ceil(choicesLength / getColumns()))].map((_, rowIndex) => (  
                      <tr key={rowIndex}>  
                        {[...Array(getColumns())].map((_, columnIndex) => {  
                           const index = rowIndex * getColumns() + columnIndex;  
                           if (index >= choicesLength) return <td key={index} />;  
                           const choice = data.choices[index];  
                           return (  
                              <td key={index} className="p-2">  
                                <div className="flex gap-4">  
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
                                   <img  
                                      src="/Images/trash-black.svg"  
                                      alt="delete"  
                                      className="pl-1 cursor-pointer w-9 p-2 rounded-full hover:bg-[#FFFFFF]"  
                                      data-testid={`delete-choice-${index + 1}`}  
                                      onClick={() => handleRemoveChoice(choice.uuid)}  
                                   />  
                                   <img  
                                      src="/Images/add.svg"  
                                      alt="add"  
                                      data-testid={`add-choice-${index + 2}`}  
                                      className="pl-1 cursor-pointer w-14 p-2 rounded-full hover:bg-[#FFFFFF]"  
                                      onClick={() => handleAddInput(choice.uuid)}  
                                   />  
                                </div>  
                                {activeInputs[choice.uuid] && (  
                                   <div className="flex gap-3 w-full">  
                                      <div className="flex w-[98%]">  
                                        <InputField  
                                           autoComplete="off"  
                                           id={`additional-value-${index}`}  
                                           type="text"  
                                           lookupDataset  
                                           placeholder="Enter Choices"  
                                           testId={`additional-value-${index}`}  
                                           htmlFor={`additional-value-${index}`}  
                                           maxLength={40}  
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
                                        />  
                                      </div>  
                                      <img  
                                        src="/Images/close.svg"  
                                        alt="close"  
                                        onClick={() => handleClearAdditionalInput(choice.uuid, index)}  
                                        className="w-[22px] h-[22px] my-auto cursor-pointer mr-[14px]"  
                                      />  
                                   </div>  
                                )}  
                              </td>  
                           );  
                        })}  
                      </tr>  
                   ))}  
                </tbody>  
              </table>  
           )}  
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
              {!isView ? <>  
                <input  
                   data-testid="import-file"  
                   type="file"  
                   accept=".csv"  
                   onChange={handleImport}  
                   disabled={isImportLoading}  
                   id="file-upload"  
                   style={{ display: 'none' }} // Hide the actual input field  
                />  
                <label  
                   htmlFor="file-upload"  
                   className={`bg-[#fff] hover:bg-[#EFF1F8] h-[50px] border border-[#2B333B] text-base ${isImportLoading ? 'cursor-not-allowed' : 'cursor-pointer'}  
                   leading-[24px] py-2 rounded w-[156px] font-[600] flex justify-center items-center`}>  
                   {isImportLoading ? (  
                      <BeatLoader color="#2B333B" size='10px' />  
                   ) : (  
                      <>  
                        {'Import'}  
                      </>  
                   )}  
                </label>  
              </> : <button  
                onClick={handleClose}  
                data-testid="import-btn"  
                className={`bg-[#fff] hover:bg-[#EFF1F8] h-[50px] border border-[#2B333B] text-base ${isImportLoading ? 'cursor-not-allowed' : 'cursor-pointer'}  
                leading-[24px] py-2 rounded w-[156px] font-[600] flex justify-center items-center`}>  
                   {isImportLoading ? (  
                      <BeatLoader color="#2B333B" size='10px' />  
                   ) : (  
                      <>  
                        {'Cancel'}  
                      </>  
                   )}  
              </button>}  
           </div>  
        </div>  
      </Modal>  
   )  
}  
  
export default CreateModal
