import React, { useContext, useState, useRef, useEffect, useCallback } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import GlobalContext from '../../Components/Context/GlobalContext.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ContentNotFound from '../../Components/Content-NotFound/ContentNotFound.jsx';
import Button2 from '../../Components/Button2/ButtonLight.jsx';
import Table from './Components/Table.jsx';
import Search from '../../Search/Search.jsx';
import Debounce from '../../CommonMethods/debounce.js';
import { useDispatch, useSelector } from 'react-redux';
import PageNavigation from '../../Components/PageNavigation/PageNavigation.jsx';
import { handleCurrentPage, handlePagination } from '../../redux/paginationSlice.js';
import FilterDropdown from '../../Components/InputField/FilterDropdown.jsx';
import useApi from '../../services/CustomHook/useApi.js';
import objectToQueryString from '../../CommonMethods/ObjectToQueryString.js';

function QuestionnairesList() {
  const dispatch = useDispatch()
  const { logout } = useAuth0();
  const { getAPI } = useApi();
  const [isContentNotFount, setContentNotFound] = useState(false);
  const { setToastError, setToastSuccess } = useContext(GlobalContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterDropdown, setFilterDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null)
  const [searchDetails, setSearchDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [QueList, setQueList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') !== null ?
    decodeURIComponent(searchParams.get('search')) : '')
  const [nextPage, setNextPage] = useState(true)
  const [prevPageExist, setPrevPage] = useState(false)
  const currentPage = useSelector((state) => state.paginationConfig?.currentPage);
  const paginationData = useSelector((state) => state.paginationConfig?.paginationData);

  let endpoint = `questionnaires?`

  const navigate = useNavigate();

  const options = [
    { value: 'Door', label: 'Door' },
    { value: 'Window', label: 'Window' }
  ];

  const handleSelect = (option) => {
    console.log('Selected option:', option);
  };

  const handleCreateQue = (e) => {
    e.preventDefault();
    navigate('/QuestionnariesList/Create-Questionnary');
  };


  const handlePrevPage = async () => {
    setNextPage(true);
    let params = Object.fromEntries(searchParams);
    if (currentPage === 2) {
      setPrevPage(false);
      dispatch(handleCurrentPage(currentPage - 1));
      delete params.start_key;
      setSearchParams({ ...params });
    } else {
      dispatch(handleCurrentPage(currentPage - 1));
      setPrevPage(true);
      const lastKey = paginationData[currentPage - 1];
      if (lastKey) {
        console.log(lastKey, 'yuty');
        params['start_key'] = encodeURIComponent(JSON.stringify(lastKey));
        setSearchParams({ ...params });
      }
    }
  };

  const handleNextPage = async () => {
    let params = Object.fromEntries(searchParams);
    if (currentPage >= 1) {
      setPrevPage(true);
    }
    dispatch(handleCurrentPage(currentPage + 1));
    const nextKey = paginationData[currentPage + 1];
    if (nextKey) {
      params['start_key'] = encodeURIComponent(JSON.stringify(nextKey));
      setSearchParams({ ...params });
    }
  };

  const handleSearchClose = () => {
    let params = Object.fromEntries(searchParams);
    if (params['search'] !== '') delete params.search
    setSearchParams({ ...params })
    setSearchValue('')
  }

  // search related functions
  const handleChange = (e, value) => {
    handleSearch(e, "search", value);
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
    setNextPage(true)
    setPrevPage(false)
    dispatch(handleCurrentPage(1))
    let params = Object.fromEntries(searchParams);
    delete params.start_key;
    if (key === 'search') {
      params[key] = encodeURIComponent(value);
    } else {
      params[key] = value
    }
    if (params['search'] === '') delete params.search
    setSearchParams({ ...params })
  }

  // filter related states
  const [filterData, setFilterData] = useState({
    asset_type: searchParams.get('asset_type') !== null ?
      decodeURIComponent(searchParams.get('asset_type')) : ''
  });
  const [filterError, setFilterError] = useState({
    country: ""
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false)


  const handleFilter = (option) => {
    setSelectedOption(option);
    setNextPage(true);
    setPrevPage(false);
    dispatch(handleCurrentPage(1));
    let params = Object.fromEntries(searchParams);
    delete params.last_evaluated_key;
    if (option) {
      params['asset_type'] = option.value;
    } else {
      delete params.asset_type;
    }
    setDropdownOpen(false);
    setSearchParams({ ...params });
  };

  const clearFilters = () => {
    let params = Object.fromEntries(searchParams);
    delete params.asset_type;
    setDropdownOpen(false);
    setSearchParams({ ...params });
    setSelectedOption(null); // Reset selected option
  };


  // const fetchQuestionnaryList = useCallback(async () => {
  //   setLoading(true)
  //   if (searchParams.get('search') !== null) {
  //     endpoint += `&search=${searchParams.get('search')}`
  //   }
  //   // if (searchParams.get('start_key') !== null) {
  //   //   endpoint += `&last_element=${searchParams.get('start_key')}`
  //   // }
  //   const params = Object.fromEntries(searchParams);
  //   const response = await getAPI(`questionnaires${objectToQueryString(params)}`)
  //   console.log(response, 'questionnaires')
  //   if (response.data.data.items == 0) {
  //     setQueList(response?.data?.data);
  //     setLoading(false)
  //   }
  //   if (searchValue == '' && response.data?.data?.items?.length == 0) {
  //     setNextPage(false)
  //   }
  //   else {
  //     setQueList(response?.data?.data);
  //     setNextPage(true)
  //     setLoading(false)
  //   }
  //   if (response.data.data.last_evaluated_key === undefined || response.data.data.last_evaluated_key === null) {
  //     setNextPage(false)
  //   }
  //   else {
  //     setNextPage(true)
  //     dispatch(handlePagination({
  //       ...paginationData,
  //       [currentPage + 1]: response.data.data.last_evaluated_key,
  //     }));
  //   }
  // }, [searchParams])

  const fetchQuestionnaryList = useCallback(async () => {
    setLoading(true);
    const params = Object.fromEntries(searchParams);
    const response = await getAPI(`questionnaires${objectToQueryString(params)}`);
    console.log(response, 'questionnaires');

    if (response.data.data.items.length === 0) {
      setQueList(response?.data?.data);
      setLoading(false);
    } else {
      setQueList(response?.data?.data);
      setNextPage(true);
      setLoading(false);
    }

    if (response.data.data.last_evaluated_key === undefined || response.data.data.last_evaluated_key === null) {
      setNextPage(false);
    } else {
      setNextPage(true);
      dispatch(handlePagination({
        [currentPage + 1]: response.data.data.last_evaluated_key,
      }));
    }
  }, [searchParams, dispatch, currentPage]);


  useEffect(() => {
    fetchQuestionnaryList()
  }, [fetchQuestionnaryList])


  return (
    <div className='bg-[#F4F6FA]'>
      <div className='py-[33px] px-[25px]'>
        <div className='py-6 px-9 bg-white rounded-[10px] h-customh7'>
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
                testId='searchBox'
                changeHandler={changeHandler}
                optimizedFn={optimizedFn}
                searchValue={searchValue}
                handleSearchClose={handleSearchClose}
              />
            </div>
            <div className='w-[400px]'>
              <FilterDropdown
                id='asset-type'
                placeholder='Filter by asset type'
                className='w-full cursor-pointer placeholder:text-[#2B333B] h-[50px]'
                top='20px'
                testID='drop-btn'
                labeltestID='option2'
                options={options}
                onSelect={handleSelect}
                isFilterDropdown={isFilterDropdown}
                setIsFilterDropdown={isFilterDropdown}
                isDropdownOpen={isDropdownOpen}
                setDropdownOpen={setDropdownOpen}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                handleOptionClick={handleFilter}
                handleRemove={clearFilters}
                close='true'
              />
            </div>
          </div>
          {(isContentNotFount || QueList?.items?.length === 0) ?
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