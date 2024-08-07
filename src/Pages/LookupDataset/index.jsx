import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Button2 from '../../Components/Button2/ButtonLight'
import Search from '../../Search/Search'
import ContentNotFound from '../../Components/Content-NotFound/ContentNotFound'
import Table from '../QuestionnariesList/Components/Table'
import useApi from '../../services/CustomHook/useApi'
import { useSearchParams } from 'react-router-dom'
import CreateModal from '../../Components/CustomModal/CreateModal'
import { data } from 'autoprefixer'
import useObjects from '../../customHooks/useObjects'
import isNotEmptyValidation from '../../CommonMethods/emptyValidation'
import GlobalContext from '../../Components/Context/GlobalContext'
import Papa from 'papaparse';
import objectToQueryString from '../../CommonMethods/ObjectToQueryString'
import LookupTable from './components/LookupTable'


const LookupDataset = () => {
    const { getAPI, PostAPI } = useApi();
    const [isContentNotFound, setContentNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [LookupList, setLookupList] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get('search') !== null ?
        encodeURIComponent(searchParams.get('search')) : '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState();
    const initialState = {
        name: '',
        choices: ''
    }
    const [data, setData] = useObjects(initialState)
    const [errors, setErrors] = useObjects(initialState)
    const [isCreateLoading, setIsCreateLoading] = useState(false);
    const [isImportLoading, setIsImportLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isView, setIsView] = useState(false);

    const lastEvaluatedKeyRef = useRef(null);
    const observer = useRef();

    const { setToastError, setToastSuccess } = useContext(GlobalContext);

    // Functions
    // List Functions
    const fetchLookupList = useCallback(async () => {
        setLoading(true);
        const params = Object.fromEntries(searchParams);
        if (lastEvaluatedKeyRef.current) {
            params.start_key = encodeURIComponent(JSON.stringify(lastEvaluatedKeyRef.current));
        }
        if (searchValue !== '') {
            delete params.start_key
        }
        try {
            const response = await getAPI(`lookup-data${objectToQueryString(params)}`);
            const newItems = response?.data?.data?.items || [];
            setLookupList(prevItems => [...prevItems, ...newItems]);
            lastEvaluatedKeyRef.current = response?.data?.data?.last_evaluated_key || null;
        } catch (error) {
            console.error('Error fetching questionnaires:', error);
        }

        setLoading(false);
        setIsFetchingMore(false);
    }, [searchParams]);

    // Create Functions
    const handleChange = (e, id, type) => {
        setErrors(id, '')
        const value = e.target.value;
        setData(id, value);
    }

    const handleClose = () => {
        setIsCreateModalOpen(false);
        setTimeout(() => {
            setErrors(initialState);
            setData(initialState);
            setIsView(false);
        }, 200);
    }

    const handleCreate = async (file) => {
        if(isView && !file ){
            console.log('update in the view');
            return;
        }
        setErrors(initialState);
        // Only perform validation if there's no file
        if (!file && !isNotEmptyValidation(data, setErrors)) {
            return;
        }
        const payload = {
            "name": file?.name || data?.name,
            "choices": file?.choices || data?.choices.split(',').map(choice => choice.trim())
        }
        if (!file) {
            setIsCreateLoading(true);
        }
        try {
            const response = await PostAPI("lookup-data", payload);
            if (!response?.error) {
                setLookupList([])
                fetchLookupList();
                setToastSuccess('Created new lookup dataset successfully');
                setData(initialState);
                setTimeout(() => {
                    setIsCreateLoading(false);
                    setIsImportLoading(false);
                }, 500);
            } else if (response?.data?.status === 409) {
                if (!file) {
                    setErrors('name', response?.data?.data?.message)
                    setIsCreateLoading(false);
                } else {
                    setToastError('This lookup data name already exists')
                    handleClose();
                    setIsImportLoading(false);
                }
                return
            } else {
                console.log(response, 'error response');
                setToastError('Something went wrong!')
                setData(initialState);
                setTimeout(() => {
                    setIsCreateLoading(false);
                    setIsImportLoading(false);
                }, 500);
            }
            setIsCreateModalOpen(false);
        } catch (error) {
            handleClose();
            setToastError('Something went wrong!')
            setTimeout(() => {
                setIsCreateLoading(false);
                setIsImportLoading(false);
            }, 500);
        }
    }

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file || !file.name.endsWith('.csv')) {
            handleClose();
            setToastError('Please upload a CSV file.');
            return;
        }
        setIsImportLoading(true);
        Papa.parse(file, {
            header: false,
            complete: (results) => {
                const flatData = results.data.flat().filter(value => value.trim() !== '');
                if (flatData.length > 500) {
                    handleClose();
                    setToastError('Only 500 data entries are accepted.');
                } else {
                    const fileName = file.name.replace('.csv', '');
                    const payload = {
                        name: fileName,
                        choices: flatData
                    }

                    console.log(payload);
                    handleCreate(payload);
                }
            },
            error: (error) => {
                setToastError('Something went wrong');
                console.error('Error parsing CSV:', error);
            }
        });
        event.target.value = ''; // Reset the input to allow re-uploading the same file
    };

    // View Functions
    const handleView = (name, choices) => {
        console.log(name, 'lookuplist');
        console.log(choices, 'lookuplist');
        setIsView(true);
        setData({
            name,
            choices: choices.join(',')
        })
        setIsCreateModalOpen(true);
    }

    // Hooks
    useEffect(() => {
        fetchLookupList();
    }, [fetchLookupList])

    const lastElementRef = useCallback(node => {
        if (loading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0]?.isIntersecting && lastEvaluatedKeyRef.current) {
                setIsFetchingMore(true);
                fetchLookupList();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, isFetchingMore]);

    return (
        <>
            <div className='bg-[#F4F6FA]'>
                <div className='py-[33px] px-[25px]'>
                    <div className='py-6 px-9 bg-white rounded-[10px] h-customh7'>
                        <div className='flex w-full justify-between items-center mb-[26px]'>
                            <h1 className='text-[#2B333B] text-[28px] font-medium'>Lookup Dataset</h1>
                            <Button2
                                testId='create-lookup-dataset'
                                onClick={() => setIsCreateModalOpen(true)}
                                className='w-[315px] h-[50px] font-semibold'
                                text='Create Lookup Dataset' />
                        </div>
                        <div className='flex items-center justify-between w-full'>
                            <div className='w-[75%] mr-[5%]'>
                                <Search
                                    setQueList={setLookupList}
                                    testId='searchBox'
                                    searchParams={searchParams}
                                    setSearchValue={setSearchValue}
                                    searchValue={searchValue}
                                    setSearchParams={setSearchParams}
                                    setLoading={setLoading}
                                    placeholder='Search by Name...'
                                />
                            </div>
                        </div>
                        {!loading && (isContentNotFound || (LookupList?.length === 0 || LookupList?.items?.length === 0)) ? (
                            <ContentNotFound
                                src={searchValue !== '' ? "/Images/empty-search.svg" : "/Images/Content-NotFound.svg"}
                                text={searchValue !== '' ? "We couldn't find any items matching your filter criteria." : 'No questionnaires available.'}
                                className={searchValue !== '' ? 'mt-[40px] font-medium text-xl w-[34%] mx-auto text-center' : 'ml-8'} />
                        ) : (
                            <div className='bg-white mt-12'>
                                <LookupTable
                                    loading={loading}
                                    LookupList={LookupList}
                                    lastElementRef={lastElementRef}
                                    handleView={handleView}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CreateModal
                isModalOpen={isCreateModalOpen}
                handleClose={handleClose}
                data={data}
                errors={errors}
                handleChange={handleChange}
                handleCreate={handleCreate}
                handleImport={handleImport}
                isCreateLoading={isCreateLoading}
                isImportLoading={isImportLoading}
                isView={isView}
            />
        </>
    )
}

export default LookupDataset