import React, { useState, useRef, useEffect, useContext } from 'react';
import NavrBar from '../../Components/NavBar/NavrBar';
import InputField from '../../Components/InputField/InputField';
import InputTextarea from '../../Components/InputField/InputTextarea';
import InputWithDropDown from '../../Components/InputField/InputWithDropDown';
import Button from '../../Components/Button/button';
import Button2 from '../../Components/Button2/ButtonLight';
import ErrorMessage from '../../Components/ErrorMessage/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/data.services';
import { useAuth0 } from "@auth0/auth0-react";
import GlobalContext from '../../Components/Context/GlobalContext';
import Toast from '../../Components/Toast/Toast';

function CreateQuestionnary() {
  const navigate = useNavigate();
  const { getIdTokenClaims } = useAuth0();
  const { setToastError, setToastSuccess } = useContext(GlobalContext);
  const [isThreedotLoader, setIsThreedotLoader] = useState(false)

  const [createDetails, setCreateDetails] = useState({
    public_name: '',
    internal_name: '',
    description: '',
    asset_type: '',
    language: '',
    is_adhoc: 'No',
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedOption, setSelectedOption] = useState({
    asset_type: null,
    language: null,
  });
  const [validationErrors, setValidationErrors] = useState({});

  const assetDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  const options = [{ value: 'Door', label: 'Door' }];
  const options1 = [{ value: 'UK- English', label: 'UK- English' }]

  const handleChange = (e, id) => {
    const { value } = e.target;

    // Define a regular expression to allow only alphanumeric characters and spaces
    const regex = /^[a-zA-Z0-9 ]*$/;

    if (regex.test(value)) {
      setCreateDetails((prevState) => ({
        ...prevState,
        [id]: value,
      }));

      // Clear the validation error for the current field
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [id]: '',
      }));
    }
  };


  const handleNavigateBack = () => {
    navigate('/QuestionnariesList');
  };

  const handleCreateQuestionnary = async () => {
    const errors = {};
    const payload = {
      public_name: createDetails?.public_name,
      internal_name: createDetails?.internal_name,
      description: createDetails?.description,
      asset_type: selectedOption?.asset_type?.value,
      language: selectedOption?.language?.value,
      is_adhoc: createDetails?.is_adhoc,
    };

    if (!createDetails.public_name) {
      errors.public_name = 'This field is mandatory';
    }
    if (!createDetails.internal_name) {
      errors.internal_name = 'This field is mandatory';
    }
    if (!selectedOption.asset_type) {
      errors.asset_type = 'This field is mandatory';
    }
    if (!selectedOption.language) {
      errors.language = 'This field is mandatory';
    }
    if (!createDetails.description) {
      errors.description = 'This field is mandatory';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      setIsThreedotLoader(true)
      const response = await dataService.PostAPI("questionnaires", payload, getIdTokenClaims);
      console.log('API response:', response?.data?.status);

      if (response?.data?.status === true) {
        setToastSuccess(response?.data?.message);
        setIsThreedotLoader(false)
      } else if (response?.data?.status >= 400 && response?.data?.status < 500 || 'Something Went wrong') {
        setToastError(response?.data?.data?.message);
        setIsThreedotLoader(false)
      } else if (response?.data?.status >= 500) {
        setToastError('Something went wrong');
        setIsThreedotLoader(false)
      }
    } catch (error) {
      setToastError('Something went wrong');
      setIsThreedotLoader(false)
    }
  }

  const handleOptionClick = (option, id) => {
    setSelectedOption((prevOptions) => ({
      ...prevOptions,
      [id]: option,
    }));

    // Clear the validation error for the current dropdown field
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id.toLowerCase()]: '',
    }));

    setOpenDropdown(null);
  };

  const handleadhocChange = (e) => {
    setCreateDetails((prevState) => ({
      ...prevState,
      is_adhoc: e.target.value,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown === 'asset_type' &&
        assetDropdownRef.current &&
        !assetDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
      if (
        openDropdown === 'language' &&
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className='bg-[#F4F6FA] p-7 h-customh2'>
      <div className='bg-white py-10 px-9 rounded-[10px] h-customh3'>
        <p className='font-medium text-[#2B333B] text-[28px]'>Create Questionnaire</p>
        <p className='font-medium text-[#2B333B] text-[22px] mt-8'>Questionnaire settings</p>
        <div className='flex items-start'>
          <div className='w-[70%]'>
            <div className='mt-8 flex items-start w-full'>
              <div className='w-1/2 mr-[114px]'>
                <InputField
                  autoComplete='off'
                  label='Public name'
                  mandatoryField='true'
                  id='public_name'
                  type='text'
                  value={createDetails.public_name}
                  className='w-full mt-2.5'
                  labelStyle='font-semibold text-base text-[#2B333B]'
                  placeholder='Enter Public name'
                  testId='publicName'
                  htmlFor='public_name'
                  maxLength={255}
                  handleChange={handleChange}
                  validationError={validationErrors?.public_name}
                />
                {validationErrors?.public_name && <ErrorMessage error={validationErrors?.public_name} />}
              </div>
              <div className='w-1/2'>
                <InputField
                  autoComplete='off'
                  label='Internal name'
                  mandatoryField='true'
                  id='internal_name'
                  type='text'
                  value={createDetails.internal_name}
                  className='w-full mt-2.5'
                  labelStyle='font-semibold text-base text-[#2B333B]'
                  placeholder='Enter Internal name'
                  testId='internalName'
                  htmlFor='internal_name'
                  maxLength={255}
                  handleChange={handleChange}
                  validationError={validationErrors?.internal_name}
                />
                {validationErrors?.internal_name && <ErrorMessage error={validationErrors?.internal_name} />}
              </div>
            </div>
            <div className='mt-8 flex items-start'>
              <div className='w-1/2 mr-[114px]'>
                <div className='w-full'>
                  <InputWithDropDown
                    label='Asset type'
                    mandatoryField='true'
                    labelStyle='font-semibold text-base text-[#2B333B]'
                    id='asset_type'
                    placeholder='Select'
                    className='w-full cursor-pointer mt-2.5'
                    top='53px'
                    testID='drop-btn'
                    labeltestID='option0'
                    options={options}
                    isDropdownOpen={openDropdown === 'asset_type'}
                    setDropdownOpen={() => setOpenDropdown(openDropdown === 'asset_type' ? null : 'asset_type')}
                    selectedOption={selectedOption?.asset_type}
                    handleOptionClick={(option) => handleOptionClick(option, 'asset_type')}
                    dropdownRef={assetDropdownRef}
                    validationError={validationErrors?.asset_type}
                  />
                </div>
                {validationErrors?.asset_type && <ErrorMessage error={validationErrors?.asset_type} />}
              </div>
              <div className='w-1/2'>
                <InputWithDropDown
                  label='Language'
                  labelStyle='font-semibold text-base text-[#2B333B]'
                  mandatoryField='true'
                  id='language'
                  placeholder='Select'
                  className='w-full cursor-pointer mt-2.5'
                  top='53px'
                  testID='language-drop-btn'
                  labeltestID='language0'
                  options={options1}
                  isDropdownOpen={openDropdown === 'language'}
                  setDropdownOpen={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
                  selectedOption={selectedOption?.language}
                  handleOptionClick={(option) => handleOptionClick(option, 'language')}
                  dropdownRef={languageDropdownRef}
                  validationError={validationErrors?.language}
                />
                {validationErrors?.language && <ErrorMessage error={validationErrors?.language} />}
              </div>
            </div>
          </div>
          <div className='w-[30%] ml-[114px] mt-8'>
            <InputTextarea
              className='h-[160px] w-full mt-2.5'
              label='Description'
              mandatoryField='true'
              htmlFor='description'
              id='description'
              labelStyle='font-semibold text-base text-[#2B333B]'
              value={createDetails.description}
              placeholder='Enter Description'
              testId='description'
              maxLength={500}
              handleChange={handleChange}
              validationError={validationErrors?.description}
            />
            {validationErrors?.description && <ErrorMessage error={validationErrors?.description} />}
          </div>
        </div>
        <div className='mt-10'>
          <p className='font-semibold text-[#2B333B] text-base'>Ad Hoc / Non TAG questionnaire</p>
          <div className='mt-2.5'>
            <div className="relative custom-radioBlue flex items-center" data-testid='yes'
            >
              <input type='radio'
                className='w-[17px] h-[17px]'
                name='is_adhoc'
                id='yes'
                value='Yes'
                checked={createDetails.is_adhoc === 'Yes'}
                onChange={handleadhocChange} />
              <label htmlFor='yes' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                Yes
              </label>
            </div>
            <div className="relative custom-radioBlue flex items-center mt-[12px]" data-testid='no'
            >
              <input type='radio'
                className='w-[17px] h-[17px]'
                name='is_adhoc'
                id='no'
                value='No' checked={createDetails.is_adhoc === 'No'}
                onChange={handleadhocChange} />
              <label htmlFor='no' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                No
              </label>
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <Button
            text='Create Questionnaire'
            testID='createQuestionnaireBtn'
            className='w-[280px] h-[50px]'
            onClick={handleCreateQuestionnary}
            isThreedotLoading={isThreedotLoader}
          />
          <Button2
            testId='Cancel'
            onClick={handleNavigateBack}
            className='w-[162px] h-[50px] ml-[32px]'
            text='Cancel'
          />
        </div>
      </div>
    </div>
  );
}

export default CreateQuestionnary;
