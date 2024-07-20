import React, { useContext, useState, useRef } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import GlobalContext from '../../Components/Context/GlobalContext.jsx';
import { useNavigate } from 'react-router-dom';
import ContentNotFound from '../../Components/Content-NotFound/ContentNotFound.jsx';
import InputWithDropDown from '../../Components/InputField/InputWithDropDown.jsx';
import Button2 from '../../Components/Button2/ButtonLight.jsx';


function QuestionnairesList() {
  const { logout } = useAuth0();
  const [isContentNotFount, setContentNotFound] = useState(true);
  const { setToastError, setToastSuccess } = useContext(GlobalContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null)

  const navigate = useNavigate();

  const options = [
    { value: 'Door', label: 'Door' },
    { value: 'Window', label: 'Window' },
    { value: 'Fire Compartment', label: 'Fire Compartment' },
  ];

  const handleSelect = (option) => {
    console.log('Selected option:', option);
  };
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleCreateQue = (e) => {
    e.preventDefault();
    navigate('/QuestionnariesList/Create-Questionnary');
  };

  return (
    <div className='bg-[#F4F6FA]'>
      <div className='py-[33px] px-[25px]'>
        <div className='py-6 px-9 bg-white rounded-[10px]'>
          <div className='flex w-full justify-between items-center mb-[26px]'>
            <p className='text-[#2B333B] text-[28px] font-medium'>Questionnaires</p>
            <Button2
              testId='create-questionnaires'
              onClick={handleCreateQue}
              className='w-[315px] h-[50px]'
              text='Create new questionnaire'
            />
          </div>
          <div className='flex items-center justify-between w-full'>
            <div className='w-[75%] h-[45px] rounded border border-[#AEB3B7] mr-[5%]'></div>
            <InputWithDropDown
              id='asset-type'
              placeholder='Filter by asset type'
              className='w-[400px] cursor-pointer'
              top='20px'
              options={options}
              onSelect={handleSelect}
              isDropdownOpen={isDropdownOpen}
              setDropdownOpen={setDropdownOpen}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              handleOptionClick={handleOptionClick}
            />
          </div>
          {isContentNotFount ?
            <ContentNotFound text='No questionnaires available.' className='ml-8' /> :
            <div className='py-6 px-9 bg-white'>
              llisting
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default QuestionnairesList