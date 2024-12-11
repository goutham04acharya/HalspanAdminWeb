import React, { useState, useRef, useEffect, useContext } from 'react';
import NavrBar from '../../Components/NavBar/NavrBar';
import InputField from '../../Components/InputField/InputField';
import InputTextarea from '../../Components/InputField/InputTextarea';
import InputWithDropDown from '../../Components/InputField/InputWithDropDown';
import Button from '../../Components/Button/button';
import Button2 from '../../Components/Button2/ButtonLight';
import ErrorMessage from '../../Components/ErrorMessage/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../../Components/Context/GlobalContext';
import Toast from '../../Components/Toast/Toast';
import useApi from '../../services/CustomHook/useApi';
import AssetDropDown from '../../Components/InputField/AssetDropDown';

function CreateQuestionnary() {
  const navigate = useNavigate();
  const { PostAPI, getAPI } = useApi();
  const { setToastError, setToastSuccess } = useContext(GlobalContext);
  const [isThreedotLoader, setIsThreedotLoader] = useState(false)
  const [options, setOptions] = useState([])

  const [createDetails, setCreateDetails] = useState({
    public_name: '',
    internal_name: '',
    description: '',
    asset_type: '',
    services_type: '',
    language: 'UK- English',  // Default language set here
    is_adhoc: 'No',
  });

  const [openDropdown, setOpenDropdown] = useState(null);

  const [selectedOption, setSelectedOption] = useState({
    asset_type: null,
    language: { value: 'UK- English', label: 'UK- English' },  // Set default selection for language
    services_type: null,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const assetDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const serviceDropdownRef = useRef(null);


  const options1 = [{ value: 'UK- English', label: 'UK- English' }]
  const services_type_list = [
    { value: 'FABRICATION', label: 'FABRICATION' },
    { value: 'INSTALLATION', label: 'INSTALLATION' },
    { value: 'INSPECTION', label: 'INSPECTION' },
    { value: 'MAINTENANCE', label: 'MAINTENANCE' }
  ];
  

  const handleChange = (e, id) => {
    const { value } = e.target;

    // Define a regular expression to allow only alphanumeric characters and spaces
    const regex = /^[^?/&]*$/;

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
    navigate('/questionnaries');
  };
console.log(selectedOption, 'gfgfgg')
  const handleCreateQuestionnary = async () => {
    const errors = {};
    const payload = {
      public_name: createDetails?.public_name.trim(),
      internal_name: createDetails?.internal_name.trim(),
      description: createDetails?.description.trim(),
      asset_type: selectedOption?.asset_type?.id.toString(),
      asset_name: selectedOption?.asset_type?.name,
      language: selectedOption?.language?.value,
      services_type: selectedOption?.services_type?.value,
      is_adhoc: createDetails?.is_adhoc,
    };

    if (!createDetails.public_name.trim()) {
      errors.public_name = 'This field is mandatory';
    }
    if (!createDetails.internal_name.trim()) {
      errors.internal_name = 'This field is mandatory';
    }
    if (!selectedOption.asset_type) {
      errors.asset_type = 'This field is mandatory';
    }
    if (!selectedOption.language) {
      errors.language = 'This field is mandatory';
    }
    if (!selectedOption.services_type) {
      errors.services_type = 'This field is mandatory';
    }
    if (!createDetails.description.trim()) {
      errors.description = 'This field is mandatory';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      setIsThreedotLoader(true)
      const response = await PostAPI("questionnaires", payload);
      if (response?.data?.status === true) {
        setToastSuccess(response?.data?.message);
        navigate(`/questionnaries/create-questionnary/questionnary-form/${response?.data?.data?.questionnaire_id}/${response?.data?.data?.version_number}`)
        setIsThreedotLoader(false)
      } else if (response?.data?.status === 400) {
        // Check each field separately to determine which error message(s) to display
        const fieldErrors = {};

        // Check if public_name is too short and set the appropriate error
        if (createDetails?.public_name?.length < 2) {
          fieldErrors.public_name = 'Public name requires at least 2 characters';
        }

        // Check if internal_name is too short and set the appropriate error
        if (createDetails?.internal_name?.length < 2) {
          fieldErrors.internal_name = 'Internal name requires at least 2 characters';
        }

        // Set validation errors for the specific failing fields
        setValidationErrors({ ...errors, ...fieldErrors });

        setIsThreedotLoader(false);
      } else if (response?.data?.status === 409) {
        setValidationErrors({ ...errors, public_name: 'This public name already exists' });
        setIsThreedotLoader(false)
      } else if (response?.data?.status >= 500) {
        setToastError('Something went wrong.');
        setIsThreedotLoader(false)
      }
    } catch (error) {
      setToastError('Something went wrong.');
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
        openDropdown === 'asset_name' &&
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
      if (
        openDropdown === 'services_type' &&
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const getAssetTypes = async () => {
    try {
      let response = await getAPI(`${import.meta.env.VITE_API_BASE_URL}asset_types`, null, true)
      setOptions(response?.data?.results)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getAssetTypes()
  }, [])

  return (
    <div className='bg-[#F4F6FA] p-7 h-customh2'>
      <div className='bg-white py-10 px-9 rounded-[10px] h-customh3'>
        <p className='font-medium text-[#2B333B] text-[28px]'>Create Questionnaire</p>
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
                  maxLength={100}
                  handleChange={handleChange}
                  validationError={validationErrors?.public_name}
                  publicName
                />
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
                  maxLength={100}
                  handleChange={handleChange}
                  validationError={validationErrors?.internal_name}
                  internalName
                />
              </div>
            </div>
            <div className='mt-8 flex items-start'>
              <div className='w-1/2 mr-[114px]'>
                <div className='w-full'>
                  <AssetDropDown
                    label='Asset type'
                    mandatoryField='true'
                    labelStyle='font-semibold text-base text-[#2B333B]'
                    id='asset_type'
                    placeholder='Select'
                    className='w-full cursor-pointer mt-2.5 placeholder:text-[#9FACB9] h-[45px]'
                    top='53px'
                    testID='drop-btn'
                    labeltestID='asset'
                    options={options}
                    isDropdownOpen={openDropdown === 'asset_type'}
                    setDropdownOpen={() => setOpenDropdown(openDropdown === 'asset_type' ? null : 'asset_type')}
                    selectedOption={selectedOption?.asset_type}
                    handleOptionClick={(option) => handleOptionClick(option, 'asset_type')}
                    dropdownRef={assetDropdownRef}
                    validationError={validationErrors?.asset_name}
                    assetType
                  />
                </div>
                {validationErrors?.asset_name && <ErrorMessage error={validationErrors?.asset_name} />}
              </div>
              <div className='w-1/2'>
                <InputWithDropDown
                  label='Language'
                  labelStyle='font-semibold text-base text-[#2B333B]'
                  mandatoryField='true'
                  id='language'
                  placeholder='Select'
                  className='w-full cursor-pointer mt-2.5 placeholder:text-[#9FACB9] h-[45px]'
                  top='53px'
                  testID='language-drop-btn'
                  labeltestID='language'
                  options={options1}
                  isDropdownOpen={openDropdown === 'language'}
                  setDropdownOpen={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
                  selectedOption={selectedOption?.language}
                  handleOptionClick={(option) => handleOptionClick(option, 'language')}
                  dropdownRef={languageDropdownRef}
                  validationError={validationErrors?.language}
                  language
                />
                {validationErrors?.language && <ErrorMessage error={validationErrors?.language} />}
              </div>
            </div>
          </div>
          <div className='w-[30%] ml-[114px] mt-8'>
            <InputTextarea
              className='h-[160px] w-full mt-2.5 px-2.5'
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
          </div>
        </div>
        <div className='mt-10 flex items-start'>
          <div className='w-1/3'>
            <InputWithDropDown
              label='Service records'
              labelStyle='font-semibold text-base text-[#2B333B]'
              mandatoryField='true'
              id='services_type'
              placeholder='Select'
              className='w-full cursor-pointer mt-2.5 placeholder:text-[#9FACB9] h-[45px]'
              top='53px'
              testID='services_type-drop-btn'
              labeltestID='services_type'
              options={services_type_list}
              isDropdownOpen={openDropdown === 'services_type'}
              setDropdownOpen={() => {
                setOpenDropdown(openDropdown === 'services_type' ? null : 'services_type')}}
              selectedOption={selectedOption?.services_type}
              handleOptionClick={(option) => handleOptionClick(option, 'services_type')}
              dropdownRef={serviceDropdownRef}
              validationError={validationErrors?.services_type}
              services
            />
            {validationErrors?.services_type && <ErrorMessage error={validationErrors?.services_type} />}
          </div>
          <div className='w-1/3 ml-[75px] px-11'>
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
          <div className='w-1/3 mr-[114px]'></div>
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
            className='w-[162px] h-[50px] ml-[32px] font-normal'
            text='Cancel'
          />
        </div>
      </div>
    </div>
  );
}

export default CreateQuestionnary;
