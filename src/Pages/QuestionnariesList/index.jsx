
import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ContentNotFound from '../../Components/Content-NotFound/ContentNotFound.jsx';
import Button2 from '../../Components/Button2/ButtonLight.jsx';
import Table from './Components/Table.jsx';
import Search from '../../Search/Search.jsx';
import FilterDropdown from '../../Components/InputField/FilterDropdown.jsx';
import useApi from '../../services/CustomHook/useApi.js';
import objectToQueryString from '../../CommonMethods/ObjectToQueryString.js';
import VersionEditModal from '../../Components/Modals/VersionEditModal.jsx';
import GlobalContext from '../../Components/Context/GlobalContext.jsx';

function Questionnaries() {
  const { setToastError, setToastSuccess } = useContext(GlobalContext);
  const { getAPI, PostAPI } = useApi();
  const [isContentNotFound, setContentNotFound] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterDropdown, setFilterDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [QueList, setQueList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(() => {
    const searchParam = searchParams.get('search');
    return searchParam ? decodeURIComponent(searchParam) : '';
  });
    const navigate = useNavigate();
  let observer = useRef();
  const lastEvaluatedKeyRef = useRef(null);
  const [cloneModal, setCloneModal] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [versionList, setVersionList] = useState([])
  const [dropdownsOpen, setDropdownsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState()
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState('')
  const [cloneLoading, setCloneLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [cloneDisable, setCloneDisable] = useState(false)

  const handleSelect = (option) => {
  };

  const handleCreateQue = (e) => {
    e.preventDefault();
    navigate('/questionnaries/Create-Questionnary');
  };

  const handleFilter = (option) => {
    if(selectedOption !== option.name) {
      lastEvaluatedKeyRef.current = null
    setSelectedOption(option?.name);
    let params = Object.fromEntries(searchParams);
    if (params.asset_type === option?.id) {
      setDropdownOpen(false);
      return;
    } else {
      delete params.start_key;
      setQueList([])
    }
    if (option) {
      params['asset_type'] = option.id;
      params['asset_name'] = option.name
    } else {
      delete params.asset_type;
      delete params.asset_name;
    }
    setSearchParams({ ...params });
  }
  setDropdownOpen(false);
  };

  const clearFilters = () => {
    let params = Object.fromEntries(searchParams);
    delete params?.start_key;
    delete params?.asset_type;
    delete params?.asset_name;
    lastEvaluatedKeyRef.current = null
    setQueList([])
    setDropdownOpen(false);
    setSearchParams({ ...params });
    setSelectedOption(null); // Reset selected option
  };

  const fetchQuestionnaryList = useCallback(async () => {
    const params = Object.fromEntries(searchParams);
    // Only set loading true if it's the first fetch (no start_key)
    if (!params.start_key) {
      setLoading(true);
    }
  
    if (lastEvaluatedKeyRef.current) {
      params.start_key = encodeURIComponent(JSON.stringify(lastEvaluatedKeyRef.current));
    }
  
    if (params.asset_name !== '') {
      setSelectedOption(params.asset_name)
    }
  
    try {
      const response = await getAPI(`questionnaires${objectToQueryString(params)}`);
      const newItems = response?.data?.data?.items || [];
      
      // If this is a new fetch (no start_key), replace the list
      // Otherwise, append to the existing list
      if (!params.start_key) {
        setQueList(newItems);
      } else {
        setQueList(prevItems => [...prevItems, ...newItems]);
      }
      
      lastEvaluatedKeyRef.current = response?.data?.data?.last_evaluated_key || null;
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      lastEvaluatedKeyRef.current = null;
    }
  
    setLoading(false);
    setIsFetchingMore(false);
  }, [searchParams, setSelectedOption]);

  const lastElementRef = useCallback(node => {
    
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && lastEvaluatedKeyRef.current) {
        setIsFetchingMore(true);
        fetchQuestionnaryList();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, fetchQuestionnaryList]);


  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    const currentSearch = params.search;
    
    // Reset lastEvaluatedKey when search value changes
    if (currentSearch !== undefined) {
      lastEvaluatedKeyRef.current = null;
    }
  }, [searchParams]);

  useEffect(() => {
    getAssetTypes();
    // Don't clear the list immediately
    fetchQuestionnaryList();
  }, [fetchQuestionnaryList]);

  const handleVersionList = async (id) => {
    try {
      setSelectedVersion('')
      setCloneDisable(true)
      const response = await getAPI(`questionnaires/versions/${id}`)
      setVersionList(response?.data)
      setSelectedQuestionnaireId(id)
      setCloneModal(true)
      setCloneDisable(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDropdownClick = () => {
    setDropdownsOpen(!dropdownsOpen)
    // setIsCreateModalOpen(false)
  }

  const handleOptionClick = (versionNumber) => {
    setSelectedVersion(versionNumber); // Set the clicked version as the selected version
    setDropdownsOpen(false); // Close the dropdown after selecting an option
  };

  const handleClone = async () => {
    if (!selectedVersion) {
      setToastError('Please select a version to duplicate.');
      return;
  }
    setCloneLoading(true)
    try {
      let body = {
        "from_questionnaire_id": selectedQuestionnaireId,
        "from_version_number": selectedVersion
      }
      const response = await PostAPI(`questionnaires/clone`, body);
      if (!response?.error) {
        setToastSuccess(response?.data?.message)
        
      } else {
        setToastError(response?.data?.data?.message)
      }
      window.location.reload();
      setCloneLoading(false)
      setCloneModal(false)
    } catch (error) {
      console.log(error)
      setCloneLoading(false)
    }
  }

  const getAssetTypes = async () => {
    try {
      let response = await getAPI(`${import.meta.env.VITE_API_BASE_URL}asset_types`, null, true)
      setOptions(response?.data?.results)
    } catch (error) {

    }
  }
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
              text='Create New Questionnaire'
              options={options}
            />
          </div>
          <div className='flex items-center justify-between w-full'>
            <div className='w-[75%] mr-[5%]'>
              <Search
                testId='searchBox'
                searchParams={searchParams}
                setSearchValue={setSearchValue}
                searchValue={searchValue}
                setSearchParams={setSearchParams}
                setLoading={setLoading}
                placeholder='Search by Name and Description'
                setQueList={setQueList}
              />
            </div>
            <div className='w-[400px]'>
              <FilterDropdown
                id='asset-type'
                placeholder='Filter by asset type'
                className='w-full cursor-pointer placeholder:text-[#2B333B] h-[50px]'
                top='20px'
                testID='drop-btn'
                labeltestID='option'
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
          {
            !loading && (isContentNotFound || (QueList?.length === 0 || QueList?.items?.length === 0)) ? (
              <ContentNotFound
                src={searchParams.get('search') !== undefined ? "/Images/empty-search.svg" : "/Images/Content-NotFound.svg"}
                text={searchParams.get('search') !== undefined ? "We're sorry, but we couldn't find any results matching your search query." : 'No questionnaires available.'}
                className={searchParams.get('search') !== undefined ? 'mt-[40px] font-medium text-xl w-[34%] mx-auto text-center' : 'ml-8'}
              />
            ) : (
              <div className='bg-white mt-12'>
                <Table
                  loading={loading}
                  setQueList={setQueList}
                  QueList={QueList}
                  lastElementRef={lastElementRef}
                  setCloneModal={setCloneModal}
                  handleVersionList={handleVersionList}
                  cloneDisable={cloneDisable}
                  cloneLoading={cloneLoading}
                />
              </div>
            )
          }
        </div>
      </div>
      {cloneModal && <VersionEditModal
        text='Select Version'
        subText={'Please select the version you want to duplicate.'}
        versionList={versionList}
        Button1text={'Duplicate'}
        button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
        Button2text='Cancel'
        testIDBtn1={'confirm-duplicate'}
        testIDBtn2='cancel-btn-modal'
        handleDropdownClick={handleDropdownClick}
        setDropdownsOpen={setDropdownsOpen}
        dropdownsOpen={dropdownsOpen}
        clone
        setCloneModal={setCloneModal}
        selectedVersion={selectedVersion}
        handleOptionClick={handleOptionClick}
        handleButton1={handleClone}
        handleButton2={() => setCloneModal(false)}
        loading={cloneLoading}
      />}
    </div>

  );
}

export default Questionnaries;
