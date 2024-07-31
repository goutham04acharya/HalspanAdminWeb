
import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import ContentNotFound from '../../Components/Content-NotFound/ContentNotFound.jsx';
import Button2 from '../../Components/Button2/ButtonLight.jsx';
import Table from './Components/Table.jsx';
import Search from '../../Search/Search.jsx';
import Debounce from '../../CommonMethods/debounce.js';
import { useDispatch, useSelector } from 'react-redux';
import { handleCurrentPage, handlePagination } from '../../redux/paginationSlice.js';
import FilterDropdown from '../../Components/InputField/FilterDropdown.jsx';
import useApi from '../../services/CustomHook/useApi.js';
import objectToQueryString from '../../CommonMethods/ObjectToQueryString.js';

function Questionnaries() {
  const dispatch = useDispatch();
  const { logout } = useAuth0();
  const { getAPI } = useApi();
  const [isContentNotFound, setContentNotFound] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterDropdown, setFilterDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [QueList, setQueList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') !== null ?
    decodeURIComponent(searchParams.get('search')) : '');
  const navigate = useNavigate();
  let observer = useRef();
  const lastEvaluatedKeyRef = useRef(null);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const options = [
    { value: 'Door', label: 'Door' },
  ];

  const handleSelect = (option) => {
    console.log('Selected option:', option);
  };

  const handleCreateQue = (e) => {
    e.preventDefault();
    navigate('/questionnaries/Create-Questionnary');
  };

  // Search related functions
  const handleChange = (e, value) => {
    handleSearch(e, "search", value);
  };

  const changeHandler = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    optimizedFn(e, value); // This should call handleSearch with the current value
  };

  const optimizedFn = useCallback(
    Debounce((e, value) => handleChange(e, value)),
    [searchParams]
  );

  const handleSearch = (e, key, value) => {
    e.preventDefault();    
    let params = Object.fromEntries(searchParams);

    console.log(params, 'paaa')
    delete params.start_key; // Reset the start_key when initiating a new search
    
    const trimmedValue = value.trim();
    const specialCharRegex = /^[^a-zA-Z0-9]+$/;
  
    if (key === 'search') {
      if (specialCharRegex.test(trimmedValue) || trimmedValue === '') {
        // If search contains only special characters or is empty, clear the search parameter
        delete params[key];
      } else {
        params[key] = trimmedValue; // Trim the value before encoding
      }
    } else {
      params[key] = value;
    }
  
    setQueList([]);
    setSearchParams({ ...params });

  };
  
  const handleSearchClose = () => {
    setLoading(true);
    let params = Object.fromEntries(searchParams);
    if (params['search'] !== '') delete params.search;
    setQueList([]);
    setSearchParams({ ...params });
    setSearchValue('');
    setLoading(false);
  };
  
  const handleFilter = (option) => {
    setSelectedOption(option);
    let params = Object.fromEntries(searchParams);
    delete params.last_evaluated_key;
    if (option) {
      params['asset_type'] = option.value;
    } else {
      delete params.asset_type;
    }
    setDropdownOpen(false);
    setQueList([])
    setSearchParams({ ...params });
  };

  const clearFilters = () => {
    let params = Object.fromEntries(searchParams);
    delete params.asset_type;
    setDropdownOpen(false);
    setSearchParams({ ...params });
    setSelectedOption(null); // Reset selected option
  };

const fetchQuestionnaryList = useCallback(async () => {
  setLoading(true);
  console.log('Fetching questionnaires...');
  const params = Object.fromEntries(searchParams);
  console.log(searchParams.get('asset_type'), 'dadadadad')
  if (lastEvaluatedKeyRef.current) {
    params.start_key = encodeURIComponent(JSON.stringify(lastEvaluatedKeyRef.current));
  }
  if(params.asset_type !== ''){
    setSelectedOption(params.asset_type)
  }
  // if(params.search !== ''){
  //   delete params.start_key
  // }
  console.log('Params being sent to API:', params);
  try {
    const response = await getAPI(`questionnaires${objectToQueryString(params)}`);
    const newItems = response?.data?.data?.items || [];
    setQueList(prevItems => [...prevItems, ...newItems]);
    lastEvaluatedKeyRef.current = response?.data?.data?.last_evaluated_key || null;
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
  }

  setLoading(false);
  setIsFetchingMore(false);
}, [searchParams]);

console.log(selectedOption, 'kkkakmaslkamslkamsdlkkmaslkmalksddmlaskm')

const lastElementRef = useCallback(node => {
  if (loading || isFetchingMore) return;
  if (observer.current) observer.current.disconnect();
  observer.current = new IntersectionObserver(entries => {
    if (entries[0]?.isIntersecting && lastEvaluatedKeyRef.current) {
      console.log('Element is intersecting, fetching more...');
      setIsFetchingMore(true);
      fetchQuestionnaryList();
    }
  });
  if (node) observer.current.observe(node);
}, [loading, isFetchingMore]);

useEffect(() => {
  fetchQuestionnaryList();
}, [fetchQuestionnaryList]);


  return (
    <div className='bg-[#F4F6FA]'>
      <div className='py-[33px] px-[25px]'>
        <div className='py-6 px-9 bg-white rounded-[10px] h-customh7'>
          <div className='flex w-full justify-between items-center mb-[26px]'>
            <p className='text-[#2B333B] text-[28px] font-medium'>Questionnaries</p>
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
                labeltestID='option1'
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
          {((isContentNotFound || QueList?.length === 0 || QueList?.items?.length === 0) && !loading) ?
            <ContentNotFound text='No questionnaries available.' className='ml-8' /> :
            <div className='bg-white mt-12'>
              <Table
                loading={loading}
                setQueList={setQueList}
                QueList={QueList}
                lastElementRef={lastElementRef}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default Questionnaries;
