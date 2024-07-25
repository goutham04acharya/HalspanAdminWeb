import React, { useContext, useState, useRef, useEffect, useCallback } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import GlobalContext from '../../Components/Context/GlobalContext.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ContentNotFound from '../../Components/Content-NotFound/ContentNotFound.jsx';
import InputWithDropDown from '../../Components/InputField/InputWithDropDown.jsx';
import Button2 from '../../Components/Button2/ButtonLight.jsx';
import Table from './Components/Table.jsx';
import Search from '../../Search/Search.jsx';
import { dataService } from '../../services/data.services';
import Debounce from '../../CommonMethods/debounce.jsx';
import { useDispatch, useSelector } from 'react-redux';
import PageNavigation from '../../Components/PageNavigation/PageNavigation.jsx';
import { handleCurrentPage, handlePagination } from '../../redux/paginationSlice.js';


function QuestionnairesList() {
  const dispatch = useDispatch()
  const { logout } = useAuth0();
  const [isContentNotFount, setContentNotFound] = useState(false);
  const { setToastError, setToastSuccess } = useContext(GlobalContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null)
  const [searchDetails, setSearchDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [QueList, setQueList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({ limit: 10, });
  const [searchValue, setSearchValue] = useState(searchParams.get('keyword') !== null ?
    decodeURIComponent(searchParams.get('keyword')) : '')

  let endpoint = `questionnaires?`

  const navigate = useNavigate();

  const options = [
    { value: 'Door', label: 'Door' }
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

  const [nextPage, setNextPage] = useState(true)
  const [prevPageExist, setPrevPage] = useState(false)
  const currentPage = useSelector((state) => state.paginationConfig?.currentPage);
  const paginationData = useSelector((state) => state.paginationConfig?.paginationData);


  /**
    * The above functions handle pagination by updating the current page and search parameters for
    * fetching data in a React application.
    */
  const handlePrevPage = async () => {
    setNextPage(true)
    let params = Object.fromEntries(searchParams);
    if (currentPage === 2) {
      setPrevPage(false)
      dispatch(handleCurrentPage(currentPage - 1))
      delete params.last_evaluated_key
      setSearchParams({ ...params })
    }
    else {
      dispatch(handleCurrentPage(currentPage - 1))
      setPrevPage(true)
      const lastKey = paginationData[currentPage - 1]
      if (lastKey) {
        params['last_evaluated_key'] = lastKey
        setSearchParams({ ...params })
      }
    }
  }
  /**
  * The function `handleNextPage` increments the current page number, sets a flag for the previous
  * page if the current page is greater than or equal to 1, and updates search parameters with
  * pagination data for the next page.
  */
  const handleNextPage = async () => {
    let params = Object.fromEntries(searchParams);
    if (currentPage >= 1) {
      setPrevPage(true)
    }
    dispatch(handleCurrentPage(currentPage + 1))
    params['last_evaluated_key'] = paginationData[currentPage + 1]
    setSearchParams({ ...params })
  }

  const handleSearchClose = () => {
    let params = Object.fromEntries(searchParams);
    if (params['keyword'] !== '') delete params.keyword
    setSearchParams({ ...params })
    setSearchValue('')
  }

  const handleChange = (e, value) => {
    handleSearch(e, "keyword", value);
  };
  const changeHandler = (e) => {
    setSearchValue(e.target.value);
  };
  const optimizedFn = useCallback(
    Debounce((e, value) => handleChange(e, value)),
    [searchParams]
  );
  const handleSearch = (e, key, value) => {
    e.preventDefault();
    // setNextPage(true)
    // setPrevPage(false)
    // dispatch(handleCurrentPage(1))
    let params = Object.fromEntries(searchParams);
    delete params.last_evaluated_key;
    if (key === 'keyword') {
      params[key] = encodeURIComponent(value);
    } else {
      params[key] = value
    }
    if (params['keyword'] === '') delete params.keyword
    setSearchParams({ ...params })
  }


  const fetchQuestionnaryList = useCallback(async () => {
    setLoading(true)
    if (searchParams.get('keyword') !== null) {
      endpoint += `&search=${searchParams.get('keyword')}`
    }
    // if (searchParams.get('last_evaluated_key') !== null) {
    //   endpoint += `&last_element=${searchParams.get('last_evaluated_key')}`
    // }
    const response = await dataService.GetAPI(endpoint)
    console.log(response, 'questionnaires')
    // if(response?.data?.data.status === true){
    //   setQueList(response?.data?.data);
    //   setLoading(false)

    // }
    if (response.data.data.items == 0) {
      setQueList(response?.data?.data);
      setLoading(false)
    }
    if (searchValue == '' && response.data.data.items.length == 0) {
      setNextPage(false)
    }
    else {
      setQueList(response?.data?.data);
      setNextPage(true)
      setLoading(false)
    }
    if (response.data.data.last_evaluated_key === undefined || response.data.data.last_evaluated_key === null) {
      setNextPage(false)
    }
    else {
      setNextPage(true)
      dispatch(handlePagination({
        ...paginationData,
        [currentPage + 1]: response.data.data.last_evaluated_key,
      }));
    }
  }, [searchParams])


  useEffect(() => {
    fetchQuestionnaryList()
  }, [fetchQuestionnaryList])


  return (
    <div className='bg-[#F4F6FA]'>
      <div className='py-[33px] px-[25px]'>
        <div className='py-6 px-9 bg-white rounded-[10px]'>
          <div className='flex w-full justify-between items-center mb-[26px]'>
            <p className='text-[#2B333B] text-[28px] font-medium'>Questionnaires</p>
            <Button2
              testId='createQuestionnaireBtn'
              onClick={handleCreateQue}
              className='w-[315px] h-[50px] font-semibold'
              text='Create new questionnaire'
            />
          </div>
          <div className='flex items-center justify-between w-full'>
            <div className='w-[75%] mr-[5%]'>
              <Search
                changeHandler={changeHandler}
                optimizedFn={optimizedFn}
                searchValue={searchValue}
                handleSearchClose={handleSearchClose}
              />
            </div>
            <div className='w-[400px]'>
              <InputWithDropDown
                id='asset-type'
                placeholder='Filter by asset type'
                className='w-full cursor-pointer placeholder:text-[#2B333B] h-[50px]'
                top='20px'
                options={options}
                onSelect={handleSelect}
                isDropdownOpen={isDropdownOpen}
                setDropdownOpen={setDropdownOpen}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                handleOptionClick={handleOptionClick}
                close='true'
              />
            </div>
          </div>
          {isContentNotFount ?
            <ContentNotFound text='No questionnaires available.' className='ml-8' /> :
            <div className=' bg-white mt-12'>
              <Table
                loading={loading}
                setQueList={setQueList}
                QueList={QueList}
              />
              <PageNavigation
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                prevPageExist={prevPageExist}
                nextPage={nextPage}
                currentPage={currentPage}
                loading={loading}
              />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default QuestionnairesList