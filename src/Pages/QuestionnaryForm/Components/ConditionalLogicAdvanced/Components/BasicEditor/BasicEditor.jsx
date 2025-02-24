import React, { useContext, useEffect, useRef, useState } from 'react'
import InputField from '../../../../../../Components/InputField/InputField'
import Image from '../../../../../../Components/Image/Image'
import InputWithDropDown from '../../../../../../Components/InputField/Dropdown';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';
import GlobalContext from '../../../../../../Components/Context/GlobalContext';
import DatePicker from '../../../../../../Components/Datepicker/DatePicker';
import useOnClickOutside from '../../../../../../CommonMethods/outSideClick';
import useOnClickOutsideById from '../../../../../../CommonMethods/outSideClickId';

function BasicEditor({ secDetailsForSearching, questions, conditions, setConditions, submitSelected, setSubmitSelected, selectedQuestionId, conditionalLogicData, sectionConditionLogicId, pageConditionLogicId, combinedArray, render, setRender }) {
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    useEffect(() => {
        const result = {};

        questions?.sections?.forEach(section => {
            section?.pages?.forEach(page => {
                page?.questions?.forEach(question => {
                    const key = `${section?.section_name}.${page?.page_name}.${question?.question_name}`; // Replace spaces with underscores
                    result[key] = question?.component_type;
                });
            });
        });

        setRender(prev => prev + 1);
        if (!conditions || conditions[0]?.conditions[0]?.question_name === "") return; // Check for valid conditions and data before updating
        const updatedConditions = conditions?.map(conditionGroup => ({
            ...conditionGroup,
            conditions: conditionGroup?.conditions?.map(condition => {
                return {
                    ...condition,
                    condition_type: result ? result[condition?.question_name] : undefined
                };
            })
        }));
        if (render > 1) {
            setConditions(updatedConditions);
        }
    }, [questions, setConditions, conditions[0]?.conditions[0]?.question_name]);

    const dropdownRef = useRef();
    const dropdownRef2 = useRef();

    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const conditionObj = {
        'text': ['includes', 'does not include', 'equals', 'not equal to'],
        'numeric': ['equals', 'not equal to', 'smaller', 'larger', 'smaller or equal', 'larger or equal'],
        'file': ['has atleast one file', 'has no files', 'number of file is'],
        'date': ['date is before today', 'date is before or equal to today', 'date is after today', 'date is after or equal to today', 'date is “X” date of set date']
    }

    //function to handle dropdowns
    const updateDropdown = (dropdown, mainIndex, subIndex) => {
        setSubmitSelected(false)
        setConditions(prevConditions =>
            prevConditions.map((conditionGroup, i) => ({
                ...conditionGroup,
                conditions: conditionGroup.conditions.map((condition, j) => {
                    // Toggle dropdown if it's the matched index and is already true
                    if (i === mainIndex && j === subIndex) {
                        return {
                            ...condition,
                            [dropdown]: !condition[dropdown]
                        };
                    }
                    // Otherwise, set dropdown to false
                    return {
                        ...condition,
                        [dropdown]: false
                    };
                })
            }))
        );
    };
    //function for the adding and removing the 'AND' and 'OR' blocks dynamically
    const handleAdd = (type, blockId, innerIndex) => {
        setSubmitSelected(false)
        const totalConditions = conditions.reduce((acc, curr) => acc + curr.conditions.length, 0);

        if (type === "delete") {
            setConditions(prevConditions =>
                prevConditions
                    .map((item, index) => {
                        if (index === blockId) {
                            // Remove the element at innerIndex from the inner conditions array
                            const updatedConditions = item.conditions.filter((_, i) => i !== innerIndex);

                            // If the updated conditions array is empty, return null (mark for removal)
                            return updatedConditions.length > 0
                                ? { ...item, conditions: updatedConditions }
                                : null; // Return null to indicate the entire object should be removed
                        }
                        return item;
                    })
                    .filter(item => item !== null) // Remove objects where conditions array is empty
            );
            return;

        }
        let newObj = {
            'question_name': '',
            'condition_logic': '',
            'value': '',
            'dropdown': false,
            'condition_dropdown': false,
            'condition_type': 'textboxfield'
        };
        if (totalConditions === 10) {
            setToastError(`Oh no! To use the basic editor you'll have to use a simpler expression.Please go back to the advanced editor.`);
            return;
        }

        if (type === 'AND') {
            // Create a new copy of the conditions array
            setConditions(prevConditions =>
                prevConditions.map((item, index) => {
                    if (index === blockId) {
                        // Push the new object into the conditions array of the matching block
                        return {
                            ...item,
                            conditions: [...item.conditions, newObj]
                        };
                    }
                    return item;
                })
            );
        } else {
            let mainObj = {
                'conditions': [{
                    'question_name': '',
                    'condition_logic': '',
                    'value': '',
                    'dropdown': false,
                    'condition_dropdown': false,
                    'condition_type': 'textboxfield'
                }]
            }
            setConditions(prevConditions => [...prevConditions, mainObj]);
        }
    };
    function getDetails(path, data) {
        // Step 1: Split the path by '.' to get section, page, and question names
        // const path = "Section_1.Page_1.Question_1.";
        const [sectionPart, pagePart, questionPart] = path.split('.', 3);
        const fullQuestionPart = path.split('.').slice(2).join('.');  // To include everything after the second dot
        // Step 2: Replace underscores with spaces to match the actual names
        const sectionName = sectionPart;
        const pageName = pagePart;
        const questionName = fullQuestionPart;

        // Step 3: Search for the matching section in the data
        const matchingSection = data?.sections.find(section => section.section_name === sectionName);
        if (!matchingSection) {
            return null; // No matching section found
        }

        // Step 4: Search for the matching page in the section
        const matchingPage = matchingSection.pages.find(page => page.page_name === pageName);
        if (!matchingPage) {
            return null; // No matching page found
        }

        // Step 5: Search for the matching question in the page
        const matchingQuestion = matchingPage.questions.find(question => question.question_name === questionPart);
        if (!matchingQuestion) {
            return null; // No matching question found
        }
        // Step 6: Return the matching question details
        return matchingQuestion;
    }

    const handleInputChange = (e, id, type, mainIndex, subIndex) => {
        setSubmitSelected(false);

        setConditions(prevConditions => {
            // Create a new array from the current conditions
            const updatedConditions = [...prevConditions];
            // Access the specific condition using mainIndex and subIndex
            const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

            // Update the condition_logic key with the value sent to the function
            conditionToUpdate.value = e.target.value;
            return updatedConditions;
        });

    };

    //function to set the value from the selection dropdown for selecting the question
    const handleSelectDropdown = (key, mainIndex, subIndex, type) => {
        setSubmitSelected(false);
        setSelectedQuestion(key);
        let matcheQuestion = getDetails(key, questions);
        if (type === 'condition_dropdown') {
            setConditions(prevConditions => {
                // Create a new array from the current conditions
                const updatedConditions = [...prevConditions];

                // Access the specific condition using mainIndex and subIndex
                const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

                // Update the condition_logic key with the value sent to the function
                conditionToUpdate.condition_logic = key;

                // Return the updated array
                return updatedConditions;
            });
            updateDropdown(type, mainIndex, subIndex)
            return; // Exit the function if type is 'conditional_dropdown'

        } else if (type === 'value') {
            setConditions(prevConditions => {
                // Create a new array from the current conditions
                const updatedConditions = [...prevConditions];

                // Access the specific condition using mainIndex and subIndex
                const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

                // Update the condition_logic key with the value sent to the function
                conditionToUpdate.value = key;

                // Return the updated array
                return updatedConditions;
            });
            updateDropdown('value_dropdown', mainIndex, subIndex)
            return;
        }
        setConditions(prevConditions => {
            // Create a new array from the current conditions
            const updatedConditions = [...prevConditions];

            // Access the specific condition using mainIndex and subIndex
            const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];
            console.log(matcheQuestion?.component_type, 'matcheQuestion')
            // Update question_name and condition_type with the new values
            conditionToUpdate.question_name = key;
            conditionToUpdate.condition_type = matcheQuestion?.component_type;
            conditionToUpdate.value = '';
            conditionToUpdate.condition_logic = '';

            if (selectedQuestion?.component_type === 'dateTimefield') {
                conditionToUpdate['date'] = '';
            }

            // Return the updated array
            return updatedConditions;
        });
        updateDropdown(type, mainIndex, subIndex)
    }
    const getConditions = (key) => {
        let arr = ['No conditions available'];
        let timeArr = ["No conditions available for time field"];
        let isTime = false;
        const matchedQuestion = combinedArray.find(item => item.question_detail === selectedQuestion);
        if (matchedQuestion && matchedQuestion.type === 'time') {
            isTime = true;
        }
        if (secDetailsForSearching.length > 0) {
            switch (key) {
                case "textboxfield":
                case "choiceboxfield":
                case "assetLocationfield":
                case "signaturefield":
                case "gpsfield":
                case "displayfield":
                    return conditionObj['text'];
                case "numberfield":
                    return conditionObj['numeric'];
                case "photofield":
                case "videofield":
                case "filefield":
                case "floorPlanfield":
                    return conditionObj['file'];
                case "dateTimefield":
                    if(isTime) {
                        return timeArr;
                    }else{
                        return conditionObj['date'];
                    }
                default:
                    return arr; // This is the fallback if none of the cases match
            }
        } else {
            return arr;
        }
    }
    const validateConditions = () => {
        for (let i = 0; i < conditions.length; i++) {
            for (let j = 0; j < conditions[i].conditions.length; j++) {
                const condition = conditions[i].conditions[j];

                if (
                    condition.question_name === '' ||
                    condition.condition_logic === '' ||
                    condition.value === ''
                ) {
                    return true;  // Return true if any key is empty
                }
            }
        }
        return false;  // Return false if all keys have values
    };

    // function to render the input value field as it is not  there for some conditions 
    const showInputValue = (key, type, field) => {
        //this is the array of cndition where the input value  tap will not be  shown
        let arr = ['has no files', 'has atleast one file', 'date is before today', 'date is before or equal to today', 'date is after today', 'date is after or equal to today']
        // check whether the condition key  is there in array, if yes then return false because the input value should not be shown 
        if (arr.includes(key)) {
            return false;
        }
        if (type === 'choiceboxfield' && field === 'inputfield') {
            return false;
        }
        // if  its not there then return tru as the input box is required for  other condiitons 
        return true;
    }

    //handler for datepicker
    const handleDatePicker = (dateString, mainIndex, subIndex) => {
        setConditions(prevConditions => {
            // Create a new array from the current conditions
            const updatedConditions = [...prevConditions];

            // Access the specific condition using mainIndex and subIndex
            const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

            // Update question_name and condition_type with the new value
            conditionToUpdate['date'] = dateString;
            // Return the updated array
            return updatedConditions;
        });
    }

    const handleClearConditionValues = () => {
        setConditions((prevConditions) =>
            prevConditions.map((conditionGroup) => ({
                ...conditionGroup,
                conditions: conditionGroup.conditions.map((condition) => ({
                    ...condition,
                    question_name: "",
                    condition_logic: "",
                    value: "",
                    dropdown: false,
                    condition_dropdown: false,
                    condition_type: condition.condition_type, // Preserve type if needed
                })),
            }))
        );
    };


    // Custom handler function for clicks outside the dropdown
    const handleOutsideClick = () => {
        const updatedConditions = conditions.map(item => ({
            ...item,
            conditions: item.conditions.map(condition => ({
                ...condition,
                dropdown: false,
            })),
        }));
        setConditions(updatedConditions); // Close the dropdown
    };

    const handleOutsideClick2 = () => {
        const updatedConditions = conditions.map(item => ({
            ...item,
            conditions: item.conditions.map(condition => ({
                ...condition,
                condition_dropdown: false,
            })),
        }));
        setConditions(updatedConditions); // Close the dropdown
    };

    const handleOutsideClick3 = () => {
        const updatedConditions = conditions.map(item => ({
            ...item,
            conditions: item.conditions.map(condition => ({
                ...condition,
                value_dropdown: false,
            })),
        }));
        setConditions(updatedConditions); // Close the dropdown
    };

    // Use the hook with the dropdown ID
    useOnClickOutsideById('condition_dropdown_inner', handleOutsideClick2);
    useOnClickOutsideById('dropdown_inner', handleOutsideClick);
    useOnClickOutsideById('value_inner', handleOutsideClick3);
    return (
        <div className='w-full h-customh14'>
            {sectionConditionLogicId || pageConditionLogicId ? (
                <p className='font-semibold text-[22px]'>Shows when ...</p>) : (
                <p className='font-semibold text-[22px]'>Conditional Fields</p>
            )}
            <div className='h-customh13 overflow-y-auto mb-6 scrollBar mt-5'>
                {conditions?.map((condition, index) => (
                    <div key={index} className='mb-6'>
                        {condition['conditions']?.map((sub_cond, i) => (
                            <div className='flex gap-4 items-start justify-between mb-6'>
                                <div className='w-[97%] flex items-end gap-6 bg-[#EFF1F8] p-2.5'>
                                    <div className='w-[97%] -mx-2 flex'>
                                        <div className='w-1/3 px-2 '>
                                            <div className=''>
                                                <p className='text-sm text-[#2B333B] font-medium'>Select</p>
                                                <InputWithDropDown
                                                    label=''
                                                    labelStyle='font-semibold text-[#2B333B] text-base'
                                                    id='dropdown'
                                                    top='30px'
                                                    placeholder='Select'
                                                    className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                                                    testID={`select-${index}-${i}`}
                                                    labeltestID={`select-dropdown-${index}-${i}`}
                                                    selectedOption={conditions[index]?.conditions[i]?.question_name}
                                                    handleOptionClick={handleSelectDropdown}
                                                    isDropdownOpen={conditions[index]['conditions'][i]['dropdown']}
                                                    mainIndex={index}
                                                    subIndex={i}
                                                    dropdownRef={dropdownRef}
                                                    setDropdownOpen={updateDropdown}
                                                    options={secDetailsForSearching}
                                                    validationError={submitSelected && conditions[index]?.conditions[i]?.question_name === ''}
                                                />
                                                {submitSelected && conditions[index]?.conditions[i]?.question_name === '' && <ErrorMessage error={'This field is mandatory'} />}
                                            </div>
                                        </div>
                                        <div className='w-1/3 px-2 '>
                                            <div className=''>
                                                <p className='text-sm text-[#2B333B] font-medium'>Condition</p>
                                                <InputWithDropDown
                                                    // label='Format'
                                                    labelStyle='font-semibold text-[#2B333B] text-base'
                                                    id='condition_dropdown'
                                                    top='30px'
                                                    placeholder='Select'
                                                    className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                                                    testID={`condition-${index}-${i}`}
                                                    labeltestID={`condition-dropdown-${index}-${i}`}
                                                    selectedOption={secDetailsForSearching.length > 0 ? conditions[index]?.conditions[i]?.condition_logic : ''}
                                                    handleOptionClick={handleSelectDropdown}
                                                    mainIndex={index}
                                                    subIndex={i}
                                                    dropdownRef={dropdownRef2}
                                                    isDropdownOpen={conditions[index]['conditions'][i]['condition_dropdown']}
                                                    setDropdownOpen={updateDropdown}
                                                    options={getConditions(conditions[index].conditions[i].condition_type)}
                                                    validationError={submitSelected && conditions[index]?.conditions[i]?.condition_logic === ''}
                                                    disableDropdownClick={secDetailsForSearching.length === 0}
                                                />
                                                {submitSelected && conditions[index]?.conditions[i]?.condition_logic === '' && <ErrorMessage error={'This field is mandatory'} />}
                                            </div>
                                        </div>
                                        {conditions[index]?.conditions[i]?.condition_logic === 'date is “X” date of set date' && <div className='w-1/3 px-2 '>
                                            <p className='text-sm text-[#2B333B] mb-[11px]'>Set Date</p>
                                            <DatePicker
                                                autoComplete='off'
                                                label=''
                                                id='value'
                                                type='text'
                                                value={conditions[index].conditions[i]?.date || null}
                                                className='w-full'
                                                labelStyle=''
                                                testId={`set-date-${index}-${i}`}
                                                htmlFor=''
                                                mainIndex={index}
                                                subIndex={i}
                                                handleChange={handleDatePicker}
                                                validationError={submitSelected && conditions[index]?.conditions[i]?.date === '' && 'This field  is mandatory'}
                                            />
                                        </div>}
                                        {showInputValue(conditions[index]?.conditions[i]?.condition_logic, conditions[index]?.conditions[i]?.condition_type, 'choicefield') && <div className='w-1/3 px-2 '>
                                            <div className=''>
                                                <p className='text-sm text-[#2B333B] mb-3 font-medium'>Value</p>
                                                {conditions[index]?.conditions[i]?.condition_type === 'choiceboxfield' ?
                                                    <>
                                                        <InputWithDropDown
                                                            label=""
                                                            id="value"
                                                            top="20px"
                                                            dropdownRef={dropdownRef}
                                                            placeholder="Select"
                                                            className="w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px]"
                                                            testID={`value-dropdown-${index}-${i}`}
                                                            selectedOption={conditions[index].conditions[i].value}
                                                            handleOptionClick={(key) => {
                                                                handleSelectDropdown(key, index, i, 'value', false, null)
                                                            }}
                                                            mainIndex={index}
                                                            subIndex={i}
                                                            isDropdownOpen={conditions[index].conditions[i].value_dropdown}
                                                            setDropdownOpen={(dropdown) => updateDropdown('value_dropdown', index, i, false, null)}
                                                            options={combinedArray.length > 0 ? combinedArray?.find((item) => item?.question_detail === conditions[index]?.conditions[i]?.question_name)?.choice_values.map((choice) => choice?.value) : []}
                                                            validationError={submitSelected && conditions[index]?.conditions[i]?.value === ''}
                                                        />
                                                        {submitSelected && conditions[index]?.conditions[i]?.value === '' && <ErrorMessage error={'This field is mandatory'} />}
                                                    </>
                                                    :
                                                    <InputField
                                                        autoComplete='off'
                                                        label=''
                                                        id='value'
                                                        type='text'
                                                        value={conditions[index].conditions[i].value}
                                                        className='w-full'
                                                        labelStyle=''
                                                        placeholder=''
                                                        testId={`value-input-${index}-${i}`}
                                                        htmlFor=''
                                                        maxLength={32}
                                                        mainIndex={index}
                                                        subIndex={i}
                                                        handleChange={handleInputChange}
                                                        onInput={conditions[index].conditions[i].condition_type === 'dateTimefield' || conditions[index].conditions[i].condition_type === 'numberfield' || conditions[index].conditions[i].condition_type === 'photofield'}
                                                        validationError={submitSelected && conditions[index].conditions[i].value === '' && 'This field  is mandatory'}
                                                        basicEditor
                                                    />
                                                }
                                            </div>
                                        </div>}
                                    </div>
                                    {condition['conditions'].length - 1 === i ? <div className='w-[3%] flex flex-col items-center' data-testid={`AND-${index}`} onClick={() => handleAdd('AND', index)}>
                                        <Image src="add" className="cursor-pointer" data-testid="add" />
                                        <p className='text-sm text-[#2B333B] -mt-2 font-semibold cursor-pointer'>AND</p>
                                    </div> : <div className='w-[3%] flex flex-col items-center'>
                                        {/* <Image src="add" className="" data-testid="add" /> */}
                                        <p className='text-sm text-[#2B333B] -mt-2 font-semibold'>AND</p>
                                    </div>}
                                </div>
                                <div className='w-[3%] flex justify-end'>
                                    <div className='p-2 bg-[#EFF1F8] cursor-pointer rounded w-fit'
                                        // onClick={() =>{conditions?.length !== 1 ? handleAdd("delete", index, i) : ''}}>
                                        onClick={() => {
                                            if (conditions?.length === 1 && conditions[0]?.conditions?.length === 1) {
                                                handleClearConditionValues(); // Clear values for the single condition
                                            } else {
                                                handleAdd("delete", index, i); // Handle deletion for other cases
                                            }
                                        }}>
                                        <Image src="trash-black" className="" data-testid="delete" />
                                    </div>
                                </div>

                            </div>
                        ))}
                        {conditions.length - 1 === index ? <div className='cursor-pointer' data-testid={`OR-${index}`} onClick={() => handleAdd('OR')}>
                            <Image src="add" className="mx-auto w-8 h-8" data-testid="add" />
                            <p className='w-fit text-center mx-auto text-sm text-[#2B333B] -mt-2 font-semibold'>OR</p>
                        </div> :
                            <div className='cursor-pointer'>
                                <p className='w-fit  mx-auto text-center text-sm text-[#2B333B] -mt-2 font-semibold'>OR</p>
                            </div>
                        }

                    </div>
                ))}
            </div>
        </div>
    )
}

export default BasicEditor