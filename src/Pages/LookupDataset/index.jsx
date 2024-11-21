import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Button2 from '../../Components/Button2/ButtonLight'
import Search from '../../Search/Search'
import ContentNotFound from '../../Components/Content-NotFound/ContentNotFound'
import Table from '../QuestionnariesList/Components/Table'
import useApi from '../../services/CustomHook/useApi'
import { useLocation, useSearchParams } from 'react-router-dom'
import CreateModal from '../../Components/CustomModal/CreateModal'
import { data } from 'autoprefixer'
import useObjects from '../../customHooks/useObjects'
import isNotEmptyValidation from '../../CommonMethods/emptyValidation'
import GlobalContext from '../../Components/Context/GlobalContext'
import Papa from 'papaparse';
import objectToQueryString from '../../CommonMethods/ObjectToQueryString'
import LookupTable from './components/LookupTable'
import ConfirmModal from '../../Components/CustomModal/ConfirmModal'
import ConfirmationModal from '../../Components/Modals/ConfirmationModal/ConfirmationModal'


const LookupDataset = () => {
    const { getAPI, PostAPI, DeleteAPI, PatchAPI } = useApi();
    const [isContentNotFound, setContentNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [LookupList, setLookupList] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get('search') !== null ?
        encodeURIComponent(searchParams.get('search')) : '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState();
    const initialState = {
        name: '',
        choices: []
    }
    const initialImportState = {
        name: '',
        choices: ''
    }
    const initialErrorState = {
        name: '',
        choices: ''
    }
    const [data, setData] = useObjects(initialState)
    const [errors, setErrors] = useObjects(initialErrorState)
    const [isCreateLoading, setIsCreateLoading] = useState(false);
    const [isImportLoading, setIsImportLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isView, setIsView] = useState({
        open: false,
        id: ''
    });
    const [deleteModal, setDeleteModal] = useObjects({
        open: false,
        id: ''
    });
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const lastEvaluatedKeyRef = useRef(null);
    const observer = useRef();

    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const [showlookupReplaceModal, setShowLookupReplaceModal] = useState(false);
    const [activeInputs, setActiveInputs] = useState({});
    console.log(data, 'datadtadt')
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

    const handleRemoveChoice = (uuidToRemove) => {
        setData("choices", data.choices.filter(choice => choice.uuid !== uuidToRemove));
    };

    // Create Functions
    const handleChange = (e, id, type) => {
        setErrors(id, '');
        const value = e.target.value;
        console.log(e, 'eaaef')
        if (type === 'value') {
            const updatedChoices = data.choices.map(choice =>
                choice.uuid === id
                    ? { ...choice, value: value }
                    : choice
            );
            setData("choices", updatedChoices);
        } else if (type === 'Name' || type === 'New Choice') {
            // For other fields like name
            setData(id, value);
        } else {
            // For other fields like name
            setData(id, value);
        }
    };
    // const handleChange = (e, id, type) => {
    //     // debugger
    //     setErrors(id, '');
    //     const value = e.target.value;

    //     if (type === 'value') {
    //         // Update a specific choice's value in the array
    //         setData(prevData => ({
    //             ...prevData,
    //             choices: prevData.choices.map(choice => {
    //                 if (choice.uuid === id) {
    //                     // Split the input by commas and clean up the values
    //                     const values = value.split(',').map(v => v.trim()).filter(v => v);
    //                     return {
    //                         ...choice,
    //                         value: values.join(', ') // Join back with comma and space for display
    //                     };
    //                 }
    //                 return choice;
    //             })
    //         }));
    //     } else {
    //         // Handle regular field updates (like name)
    //         setData(id, value);
    //     }


    // };

    const handleClose = () => {
        setIsCreateModalOpen(false);
        setActiveInputs('')
        setTimeout(() => {
            setErrors(initialErrorState);
            setData(initialState);
            setIsCreateLoading(false);
            setIsImportLoading(false);
            setShowLookupReplaceModal(false);
            setIsView({
                open: false,
                id: ''
            });
        }, 200);
    }

    const handleSubmit = async (file) => {
        // debugger
        const isUpdate = isView?.open;
        setErrors(initialErrorState);

        if (!file && !isNotEmptyValidation(data, setErrors)) {
            return;
        }
        
        let choicesArray;
        if (file) {
            setIsImportLoading(true)
            // Handle file import case
            choicesArray = file.choices.map(choice => ({ value: choice }));
            
        } else if (isUpdate) {
            // debugger
            setIsCreateLoading(true)
            try {
                // Ensure data.choices is an array
                choicesArray = Array.isArray(data.choices) ? [...data.choices] : [];

                // Map choices with additional values, then flatten
                choicesArray = choicesArray.map((choice, index) => {
                    const additionalValues = data[`additional-value-${index}`];
                    let additionalChoices = [];

                    // Split additional values if they exist
                    if (additionalValues) {
                        additionalChoices = additionalValues.split(',').map(val => ({ value: val.trim() }));
                    }

                    // Return array of choice and additional choices
                    return [choice, ...additionalChoices];
                }).flat();
            } catch (error) {
                console.error('Error processing choices:', error);
                choicesArray = [];
            }
        } else {
            // Handle create case with comma-separated string
            choicesArray = data.choices.split(',').map(choice => ({ value: choice.trim() }));
        }
        let payload = {};
        // Prepare data for API
        if(file){
            payload = {
                name: file.name,
                choices: choicesArray,
                // Add any additional fields to the payload as needed
            };
        }else{
            payload = {
                name: data.name,
                choices: choicesArray,
                // Add any additional fields to the payload as needed
            };
        }
        console.log(payload, 'dddddd')
        // Determine which API function to call based on update/create scenario
        const apiFunction = isUpdate ? PatchAPI : PostAPI;
        const endpoint = isUpdate ? `lookup-data/${isView?.id}` : "lookup-data";

        try {
            const response = await apiFunction(endpoint, payload);

            if (!response?.error) {
                setLookupList([]); // Clear lookup list
                fetchLookupList(); // Refetch the lookup list after success

                const successMessage = isUpdate
                    ? `Updated lookup dataset ID ${isView?.id} successfully.`
                    : 'Created new lookup dataset successfully.';
                setToastSuccess(successMessage); // Display success toast
                handleClose(); // Close the modal or dialog
            } else if (response?.data?.status === 409) {
                const errorMessage = response?.data?.data?.message;
                if (!file) {
                    // debugger
                    setErrors('name', errorMessage); // Set error for name if there's a conflict
                    setIsCreateLoading(false);
                } else {
                    setToastError(errorMessage); // Show error toast if file import fails
                    handleClose();
                    setIsImportLoading(false);
                    setIsCreateLoading(false)
                }
            } else {
                setToastError(response?.data?.data?.message); // Show generic error toast
                handleClose();
            }
        } catch (error) {
            handleClose(); // Close modal in case of error
            setToastError('Something went wrong.'); // Show error toast if API call fails
        }
        
    };

    const handleImportConfirmationModal = () => {
        if (!data?.choices === '') {
            showlookupReplaceModal(true);
        }
    }

    const handleImport = (event) => {
        console.log('handleImport is called')
        // debugger
        if (data?.choices !== '' && isView.open) {
            setShowLookupReplaceModal(true);
            setIsCreateModalOpen(false);
            setData(initialImportState)
            return;
        }else{
            setShowLookupReplaceModal(false);
            setIsCreateModalOpen(true);
            setData(initialState)
            // return;
        }
        const file = event.target.files[0];
        console.log(file, 'fesfeieke')
        if (!file || !file.name.endsWith('.csv')) {
            handleClose();
            setToastError('Please upload a CSV file.');
            return;
        }
        setIsImportLoading(true);
        setIsCreateModalOpen(false);
        Papa.parse(file, {
            header: false,
            complete: (results) => {
                const flatData = results.data.flat().filter(value => value.trim() !== '');

                // console.log(flatData);

                console.log(flatData, 'flat data')
                if (flatData.length > 500) {
                    handleClose();
                    setIsImportLoading(false);
                    setShowLookupReplaceModal(false);
                    setToastError('Only 500 data entries are accepted.');
                } else {
                    const fileName = file.name.replace('.csv', '');
                    console.log(fileName, 'ddddeee')
                    const payload = {
                        name: fileName,
                        choices: flatData
                    }
                    
                    handleSubmit(payload);
                }
            },
            error: (error) => {
                setToastError('Something went wrong.');
                console.error('Error parsing CSV:', error);
            }
        });
        event.target.value = ''; // Reset the input to allow re-uploading the same file
    };

    // View Functions
    const handleView = (id, name, choices) => {
        // debugger
        setIsView({
            open: true,
            id: id
        });

        // Keep choices as an array of objects instead of converting to string
        setData({
            name,
            choices: choices // Keep as array of objects
        });
        setIsCreateModalOpen(true);
    };

    // Delete Functions
    const handleDelete = async () => {
        try {
            if (!deleteModal?.id) {
                throw 'error'
            }
            setIsDeleteLoading(true);
            const response = await DeleteAPI(`lookup-data/${deleteModal?.id}`);
            if (!response?.error) {
                setToastSuccess(`Deleted ID ${deleteModal?.id} successfully.`)
                setLookupList([])
                fetchLookupList();
            } else {
                setToastError('Something went wrong.')
            }
        } catch (error) {
            setToastError('Something went wrong.')
        } finally {
            setIsDeleteLoading(false);
            setDeleteModal('open', false);
        }
    }

    // Hooks
    const location = useLocation();  // Get the state from the navigation
    useEffect(() => {
        fetchLookupList();

        // Check if the create flag is set and open the modal
        if (location.state?.create) {
            setIsCreateModalOpen(true);
        }
    }, [fetchLookupList, location.state]);


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
                                    placeholder='Search by Name'
                                />
                            </div>
                        </div>
                        {!loading && (isContentNotFound || (LookupList?.length === 0 || LookupList?.items?.length === 0)) ? (
                            <ContentNotFound
                                src={searchValue !== '' ? "/Images/empty-search.svg" : "/Images/Content-NotFound.svg"}
                                text={searchValue !== '' ? "We're sorry, but we couldn't find any results matching your search query." : 'No lookup dataset available.'}
                                className={searchValue !== '' ? 'mt-[40px] font-medium text-xl w-[34%] mx-auto text-center' : 'ml-8'} />
                        ) : (
                            <div className='bg-white mt-12'>
                                <LookupTable
                                    loading={loading}
                                    LookupList={LookupList}
                                    lastElementRef={lastElementRef}
                                    handleView={handleView}
                                    setDeleteModal={setDeleteModal}
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
                handleCreate={handleSubmit}
                handleImport={handleImport}
                isCreateLoading={isCreateLoading}
                isImportLoading={isImportLoading}
                isView={isView?.open}
                title={isView?.open ? 'View Lookup Dataset' : 'Create Lookup Dataset'}
                createLookup={!isView?.open}
                // handleAddChoice={handleAddChoice}
                handleRemoveChoice={handleRemoveChoice}
                setData={setData}
                activeInputs={activeInputs}
                setActiveInputs={setActiveInputs}
            />
            <ConfirmModal
                text='Delete Lookup Dataset'
                subText={`Are you sure you want to delete the lookup dataset with ID ${deleteModal.id || '-'}?`}
                button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000] !w-[156px]'
                button2Style='!w-[162px]'
                Button1text='Delete'
                Button2text='Cancel'
                src='delete-gray'
                // className
                isModalOpen={deleteModal.open}
                handleButton1={handleDelete}
                handleButton2={() => setDeleteModal('open', false)}
                testIDBtn1='confirm'
                testIDBtn2='cancel'
                handleClose={() => setDeleteModal('open', false)}
                isLoading={isDeleteLoading}
            />
            {showlookupReplaceModal && (
                <ConfirmationModal
                    text='Replace Lookup Dataset'
                    subText='You are about to import new data into the lookup dataset. This action will replace the existing choices with the new ones.'
                    button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
                    Button1text='Confirm'
                    Button2text='Cancel'
                    src='replace'
                    testIDBtn1='confirm-delete'
                    testIDBtn2='cancel-delete'
                    isOpen={showlookupReplaceModal}
                    handleButton1={handleImport}
                    handleButton2={() => {
                        setShowLookupReplaceModal(false)
                    }}
                    isOpenFileUpload={true}
                    isImportLoading={isImportLoading}
                    setModalOpen={setShowLookupReplaceModal}
                    showLabel
                />
            )}
        </>
    )
}

export default LookupDataset