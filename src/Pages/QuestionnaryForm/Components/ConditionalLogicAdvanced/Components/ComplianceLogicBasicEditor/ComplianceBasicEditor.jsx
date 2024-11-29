import React, { useContext, useState } from 'react'
import InputField from '../../../../../../Components/InputField/InputField'
import Image from '../../../../../../Components/Image/Image'
import InputWithDropDown from '../../../../../../Components/InputField/Dropdown';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';
import GlobalContext from '../../../../../../Components/Context/GlobalContext';
import DatePicker from '../../../../../../Components/Datepicker/DatePicker';

function ComplianceBasicEditor({ secDetailsForSearching, questions, conditions, setConditions, submitSelected, setSubmitSelected }) {
    const [dropdown, setDropdown] = useState(false)
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
    const addElseIf = (blockIndex) => {
        setSubmitSelected(false);
        const newElseIfBlock = {
            type: 'elseif',
            conditions: [{
                'question_name': '',
                'condition_logic': '',
                'value': '',
                'dropdown': false,
                'condition_dropdown': false,
                'condition_type': 'textboxfield'
            }],
            thenActions: [{
                'action_type': '',
                'value': ''
            }]
        };

        setConditions(prevConditions => {
            const updatedConditions = [...prevConditions];
            updatedConditions[blockIndex] = {
                ...updatedConditions[blockIndex],
                elseIfBlocks: [...(updatedConditions[blockIndex].elseIfBlocks || []), newElseIfBlock]
            };
            return updatedConditions;
        });
    };
    //function for the adding and removing the 'AND' and 'OR' blocks dynamically
    const handleAdd = (type, blockId, innerIndex) => {
        setSubmitSelected(false);
        const totalConditions = conditions.reduce((acc, curr) => acc + curr.conditions.length, 0);

        if (type === "delete") {
            setConditions(prevConditions =>
                prevConditions
                    .map((item, index) => {
                        if (index === blockId) {
                            const updatedConditions = item.conditions.filter((_, i) => i !== innerIndex);
                            return updatedConditions.length > 0
                                ? { ...item, conditions: updatedConditions }
                                : null;
                        }
                        return item;
                    })
                    .filter(item => item !== null)
            );
            return;
        }

        if (totalConditions === 10) {
            setToastError(`Oh no! To use the basic editor you'll have to use a simpler expression. Please go back to the advanced editor.`);
            return;
        }

        if (type === 'AND') {
            setConditions(prevConditions =>
                prevConditions.map((item, index) => {
                    if (index === blockId) {
                        return {
                            ...item,
                            conditions: [...item.conditions, {
                                'question_name': '',
                                'condition_logic': '',
                                'value': '',
                                'dropdown': false,
                                'condition_dropdown': false,
                                'condition_type': 'textboxfield'
                            }]
                        };
                    }
                    return item;
                })
            );
        } else if (type === 'OR') {
            const newConditionBlock = {
                conditions: [{
                    'question_name': '',
                    'condition_logic': '',
                    'value': '',
                    'dropdown': false,
                    'condition_dropdown': false,
                    'condition_type': 'textboxfield'
                }],
                thenAction: {
                    action: '',
                    value: ''
                }
            };
            setConditions(prevConditions => [...prevConditions, newConditionBlock]);
        }
    };
    const handleThenActionChange = (index, field, value) => {
        setConditions(prevConditions =>
            prevConditions.map((condition, i) => {
                if (i === index) {
                    return {
                        ...condition,
                        thenAction: {
                            ...condition.thenAction,
                            [field]: value
                        }
                    };
                }
                return condition;
            })
        );
    };
    function getDetails(path, data) {
        // Step 1: Split the path by '.' to get section, page, and question names
        const [sectionPart, pagePart, questionPart] = path.split('.');

        // Step 2: Replace underscores with spaces to match the actual names
        const sectionName = sectionPart.replace(/_/g, ' ');
        const pageName = pagePart.replace(/_/g, ' ');
        const questionName = questionPart.replace(/_/g, ' ');

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
        const matchingQuestion = matchingPage.questions.find(question => question.question_name === questionName);
        if (!matchingQuestion) {
            return null; // No matching question found
        }

        // Step 6: Return the matching question details
        return matchingQuestion;
    }

    const handleInputChange = (e, id, type, mainIndex, subIndex) => {
        setSubmitSelected(false)
        setConditions(prevConditions => {
            // Create a new array from the current conditions
            const updatedConditions = [...prevConditions];
            // Access the specific condition using mainIndex and subIndex
            const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

            // Update the condition_logic key with the value sent to the function
            conditionToUpdate.value = e.target.value;

            // Return the updated array
            return updatedConditions;
        });
    }
    //function to set the value from the selection dropdown for selecting the question
    const handleSelectDropdown = (key, mainIndex, subIndex, type) => {
        setSubmitSelected(false)
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
        }
        let selectedQuestion = getDetails(key, questions);
        setConditions(prevConditions => {
            // Create a new array from the current conditions
            const updatedConditions = [...prevConditions];

            // Access the specific condition using mainIndex and subIndex
            const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

            // Update question_name and condition_type with the new values
            conditionToUpdate.question_name = key;
            conditionToUpdate.condition_type = selectedQuestion.component_type;
            conditionToUpdate.value = '';
            conditionToUpdate.condition_logic = '';

            if (selectedQuestion.component_type === 'dateTimefield') {
                conditionToUpdate['date'] = '';
            }


            // Return the updated array
            return updatedConditions;
        });
        updateDropdown(type, mainIndex, subIndex)
    }
    const getConditions = (key) => {
        let arr = []
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
                return conditionObj['date'];
            default:
                return arr; // This is the fallback if none of the cases match
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
    const showInputValue = (key) => {
        //this is the array of cndition where the input value  tap will not be  shown
        let arr = ['has no files', 'has atleast one file', 'date is before today', 'date is before or equal to today', 'date is after today', 'date is after or equal to today']
        // check whether the condition key  is there in array, if yes then return false because the input value should not be shown 
        if (arr.includes(key)) {
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
    return (
        <div className='w-full h-customh14'>
            <p className='font-semibold text-[22px]'>Conditional Fields</p>
            <div className='h-customh13 overflow-y-auto mb-6 scrollBar mt-5'>
                {conditions.map((condition, index) => (
                    <div key={index} className='mb-6 bg-[#EFF1F8] p-4'>
                        {/* IF Block */}
                        <div className='mb-4 flex gap-10  rounded'>
                            <div className='flex items-start gap-4 p-2 rounded-lg bg-white'>
                                <h2 className='text-[#2B333B] font-semibold mt-2'>if</h2>
                                <div className='flex-1'>
                                    {/* Conditions Section */}
                                    <div className='w-full'>
                                        {condition.conditions.map((sub_cond, i) => (
                                            <div key={i} className='flex gap-4 items-start mb-4'>
                                                <div className='flex-1 flex items-start gap-4'>
                                                    {/* Question Selection */}
                                                    <div className='w-1/3'>
                                                        <p className='text-sm text-[#2B333B] font-semibold'>Select</p>
                                                        <InputWithDropDown
                                                            label=''
                                                            id='dropdown'
                                                            top='30px'
                                                            placeholder='Select'
                                                            className='w-full cursor-pointer placeholder:text-[#9FACB9] text-[14px] h-[45px] mt-3'
                                                            testID={`select-${index}-${i}`}
                                                            selectedOption={conditions[index]?.conditions[i]?.question_name}
                                                            handleOptionClick={handleSelectDropdown}
                                                            isDropdownOpen={conditions[index].conditions[i].dropdown}
                                                            mainIndex={index}
                                                            subIndex={i}
                                                            setDropdownOpen={updateDropdown}
                                                            options={secDetailsForSearching}
                                                            validationError={submitSelected && conditions[index]?.conditions[i]?.question_name === ''}
                                                        />
                                                        {submitSelected && conditions[index]?.conditions[i]?.question_name === '' &&
                                                            <ErrorMessage error={'This field is mandatory'} />}
                                                    </div>

                                                    {/* Condition Selection */}
                                                    <div className='w-1/3'>
                                                        <p className='text-sm text-[#2B333B] font-semibold'>Condition</p>
                                                        <InputWithDropDown
                                                            label=''
                                                            id='condition_dropdown'
                                                            top='30px'
                                                            placeholder='Select'
                                                            className='w-full cursor-pointer placeholder:text-[#9FACB9] text-[14px] h-[45px] mt-3'
                                                            testID={`condition-${index}-${i}`}
                                                            selectedOption={conditions[index]?.conditions[i]?.condition_logic}
                                                            handleOptionClick={handleSelectDropdown}
                                                            mainIndex={index}
                                                            subIndex={i}
                                                            isDropdownOpen={conditions[index].conditions[i].condition_dropdown}
                                                            setDropdownOpen={updateDropdown}
                                                            options={getConditions(conditions[index].conditions[i].condition_type)}
                                                            validationError={submitSelected && conditions[index]?.conditions[i]?.condition_logic === ''}
                                                        />
                                                        {submitSelected && conditions[index]?.conditions[i]?.condition_logic === '' &&
                                                            <ErrorMessage error={'This field is mandatory'} />}
                                                    </div>

                                                    {/* Value Input */}
                                                    {showInputValue(conditions[index]?.conditions[i]?.condition_logic) && (
                                                        <div className='w-1/3'>
                                                            <p className='text-sm text-[#2B333B] font-semibold'>Value</p>
                                                            <InputField
                                                                autoComplete='off'
                                                                label=''
                                                                id='value'
                                                                type='text'
                                                                value={conditions[index].conditions[i].value}
                                                                className='w-full mt-3'
                                                                placeholder='Enter value'
                                                                testId={`value-input-${index}-${i}`}
                                                                mainIndex={index}
                                                                subIndex={i}
                                                                handleChange={handleInputChange}
                                                                validationError={submitSelected && conditions[index].conditions[i].value === ''}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Delete Button */}
                                                <div className=' flex gap-5 items-center'>
                                                    <div className='mt-4'>
                                                        <button
                                                            className='flex items-center gap-2 text-sm text-[#2B333B] font-semibold'
                                                            onClick={() => handleAdd('AND', index)}
                                                            data-testid={`AND-${index}`}
                                                        >
                                                            <Image src="add" className="w-5 h-5" />
                                                            <span>AND</span>
                                                        </button>
                                                    </div>
                                                    <div className='p-2 cursor-pointer rounded'
                                                        onClick={() => handleAdd("delete", index, i)}>
                                                        <Image src="trash-black" data-testid="delete" />
                                                    </div>
                                                </div>
                                            </div>

                                        ))}

                                        {/* Add AND Button */}

                                    </div>
                                </div>
                            </div>

                            {/* Single Then Section per IF block */}
                            <div className=' pt-4 bg-white p-3  rounded-lg'>
                                <h3 className='text-[#2B333B] font-semibold mb-4'>Then</h3>
                                <div className='flex flex-col gap-4'>
                                    <InputField
                                        label="Action"
                                        className="w-full"
                                        placeholder="Enter action"
                                        value={condition.thenAction?.action || ''}
                                        onChange={(e) => handleThenActionChange(index, 'action', e.target.value)}
                                    />
                                    <InputField
                                        label="Value"
                                        className="w-full"
                                        placeholder="Enter value"
                                        value={condition.thenAction?.value || ''}
                                        onChange={(e) => handleThenActionChange(index, 'value', e.target.value)}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* OR Section */}
                        {conditions.length - 1 === index && (
                            <div className='mt-4 cursor-pointer' data-testid={`OR-${index}`} onClick={() => handleAdd('OR')}>
                                <Image src="add" className="mx-auto w-8 h-8" />
                                <p className='w-full text-center text-sm text-[#2B333B] -mt-2 font-semibold'>OR</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ComplianceBasicEditor