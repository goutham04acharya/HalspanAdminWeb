
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
import VersionEditModal from '../../Components/Modals/VersionEditModal.jsx';
import GlobalContext from '../../Components/Context/GlobalContext.jsx';

function Questionnaries() {
  const { setToastError, setToastSuccess } = useContext(GlobalContext);
  const dispatch = useDispatch();
  const { logout } = useAuth0();
  const { getAPI, PostAPI } = useApi();
  const [isContentNotFound, setContentNotFound] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterDropdown, setFilterDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [QueList, setQueList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') !== null ? encodeURIComponent(searchParams.get('search')) : '');
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
  const options = [
    { value: 'Door', label: 'Door' },
  ];

  const handleSelect = (option) => {
  };

  const handleCreateQue = (e) => {
    e.preventDefault();
    navigate('/questionnaries/Create-Questionnary');
  };

  const handleFilter = (option) => {
    setSelectedOption(option);
    let params = Object.fromEntries(searchParams);
    if (params.asset_type === option?.value) {
      setDropdownOpen(false);
      return;
    } else {
      delete params.start_key;
      setQueList([])
    }
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
    delete params?.start_key;
    delete params?.asset_type;
    lastEvaluatedKeyRef.current = null
    setQueList([])
    setDropdownOpen(false);
    setSearchParams({ ...params });
    setSelectedOption(null); // Reset selected option
  };

  const fetchQuestionnaryList = useCallback(async () => {
    setLoading(true);
    const params = Object.fromEntries(searchParams);
    if (lastEvaluatedKeyRef.current) {
      params.start_key = encodeURIComponent(JSON.stringify(lastEvaluatedKeyRef.current));
    }
    if (params.asset_type !== '') {
      setSelectedOption(params.asset_type)
    }
    if (searchValue !== '') {
      delete params.start_key
    }
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
  }, [loading, isFetchingMore]);

  useEffect(() => {
    fetchQuestionnaryList();
  }, [fetchQuestionnaryList]);

  const handleVersionList = async (id) => {
    try {
      setSelectedVersion('')
      const response = await getAPI(`questionnaires/versions/${id}`)
      setVersionList(response?.data)
      setSelectedQuestionnaireId(id)
      setCloneModal(true)
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
    setCloneLoading(true)
    try {
      let body = {
        "from_questionnaire_id": selectedQuestionnaireId,
        "from_version_number": selectedVersion
      }
      const response = await PostAPI(`questionnaires/clone`, body);

      setCloneLoading(false)
    } catch (error) {
      console.log(error)
      setCloneLoading(false)
    }
  }
  console.log(versionList, 'pop')
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
          {
            !loading && (isContentNotFound || (QueList?.length === 0 || QueList?.items?.length === 0)) ? (
              <ContentNotFound
                src={searchValue !== '' ? "/Images/empty-search.svg" : "/Images/Content-NotFound.svg"}
                text={searchValue !== '' ? "We're sorry, but we couldn't find any results matching your search query." : 'No questionnaires available.'}
                className={searchValue !== '' ? 'mt-[40px] font-medium text-xl w-[34%] mx-auto text-center' : 'ml-8'}
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
                />
              </div>
            )
          }
        </div>
      </div>
      {cloneModal && <VersionEditModal
        text='Select version'
        subText={'Please select the version you want to duplicate.'}
        versionList={versionList}
        Button1text={'Duplicate'}
        button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
        Button2text='Cancel'
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
