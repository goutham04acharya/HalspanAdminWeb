import React, { useContext, useState } from 'react'
import InputField from '../../../../../../Components/InputField/InputField'
import Image from '../../../../../../Components/Image/Image'
import InputWithDropDown from '../../../../../../Components/InputField/Dropdown';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';
import GlobalContext from '../../../../../../Components/Context/GlobalContext';
import DatePicker from '../../../../../../Components/Datepicker/DatePicker';
import { useDispatch } from 'react-redux';
import { setConditionReason, setNewComponent } from '../../../Fields/fieldSettingParamsSlice';
import { useSelector } from 'react-redux';

function ComplianceBasicEditor({ secDetailsForSearching, questions, conditions, setConditions, submitSelected, setSubmitSelected }) {
    const dispatch = useDispatch();
    const [dropdown, setDropdown] = useState(false)
    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [userInput, setUserInput] = useState({
        ifStatements: [],
        elseIfStatements: [],
        elseStatement: {}
    });
    const fieldSettingParamsReason = useSelector(state => state.fieldSettingParams.conditions);

    const conditionObj = {
        'text': ['includes', 'does not include', 'equals', 'not equal to'],
        'numeric': ['equals', 'not equal to', 'smaller', 'larger', 'smaller or equal', 'larger or equal'],
        'file': ['has atleast one file', 'has no files', 'number of file is'],
        'date': ['date is before today', 'date is before or equal to today', 'date is after today', 'date is after or equal to today', 'date is “X” date of set date']
    }

    const options = [
        { value: 'No access to asset', label: 'NO ACCESS' },
        { value: 'Missing asset', label: 'MISSING' },
        { value: 'Recommend relacement', label: 'RECOMMEND_REPLACEMENT' },
        { value: 'Recommend remediation', label: 'RECOMMEND_REMEDIATION' },
        { value: 'Further investigation required', label: 'FURTHER_INVESTIGATION' },
        { value: 'Other', label: 'OTHER' },
    ];
    const handleOptionClick = (option, type) => {
        setDropdownOpen(false);
        if (type === 'if') {
            dispatch(setConditionReason({
                id: 'condition_1',
                conditionType: 'if',
                reason: option.label
            }));
        } else if (type === 'else_if') {
            // Adding a new 'else if'
            dispatch(setConditionReason({
                id: 'condition_1',
                conditionType: 'else_if',
                reason: 'Replacement_Recommended_true'
            }));
        } else if (type === 'else') {
            // Setting REASON for 'else'
            dispatch(setConditionReason({
                id: 'condition_1',
                conditionType: 'else',
                reason: 'Default_Reason'
            }));
        }
        // // Updating an existing 'else if' (e.g., at index 0)
        // dispatch(setConditionReason({
        //     id: 'condition_1',
        //     conditionType: 'else_if',
        //     reason: 'Updated_ElseIf_Reason',
        //     elseIfIndex: 0
        // }));


    };
    const updateDropdown = (dropdown, mainIndex, subIndex, isElseIf = false, elseIfIndex = null) => {
        setSubmitSelected(false)
        if (isElseIf) {
            setConditions(prevConditions =>
                prevConditions.map((conditionGroup, i) => ({
                    ...conditionGroup,
                    elseIfBlocks: conditionGroup.elseIfBlocks.map((elseIfBlock, j) => ({
                        ...elseIfBlock,
                        conditions: elseIfBlock.conditions.map((condition, k) => {
                            if (i === mainIndex && j === elseIfIndex && k === subIndex) {
                                return {
                                    ...condition,
                                    [dropdown]: !condition[dropdown]
                                };
                            }
                            return {
                                ...condition,
                                [dropdown]: false
                            };
                        })
                    }))
                }))
            );
        } else {
            setConditions(prevConditions =>
                prevConditions.map((conditionGroup, i) => ({
                    ...conditionGroup,
                    conditions: conditionGroup.conditions.map((condition, j) => {
                        if (i === mainIndex && j === subIndex) {
                            return {
                                ...condition,
                                [dropdown]: !condition[dropdown]
                            };
                        }
                        return {
                            ...condition,
                            [dropdown]: false
                        };
                    })
                }))
            );
        }
    };

    const handleDeleteIfBlock = (index) => {
        setSubmitSelected(false);
        setConditions(prevConditions => prevConditions.filter((_, i) => i !== index));
    };
    const handleInputChange = (e, id, type, mainIndex, subIndex, isElseIf = false, elseIfIndex = null) => {
        setSubmitSelected(false)
        if (isElseIf) {
            setConditions(prevConditions => {
                const updatedConditions = [...prevConditions];
                const conditionToUpdate = updatedConditions[mainIndex].elseIfBlocks[elseIfIndex].conditions[subIndex];

                conditionToUpdate.value = e.target.value;

                // Update the userInput state  
                setUserInput(prevInput => {
                    const updatedInput = { ...prevInput };
                    if (!updatedInput.elseIfStatements[mainIndex]) {
                        updatedInput.elseIfStatements[mainIndex] = [];
                    }
                    if (!updatedInput.elseIfStatements[mainIndex][elseIfIndex]) {
                        updatedInput.elseIfStatements[mainIndex][elseIfIndex] = {};
                    }
                    updatedInput.elseIfStatements[mainIndex][elseIfIndex][subIndex] = {
                        question_name: conditions[mainIndex].elseIfBlocks[elseIfIndex].conditions[subIndex].question_name,
                        condition_logic: conditions[mainIndex].elseIfBlocks[elseIfIndex].conditions[subIndex].condition_logic,
                        value: e.target.value
                    };
                    return updatedInput;
                });

                return updatedConditions;
            });
        } else {
            setConditions(prevConditions => {
                const updatedConditions = [...prevConditions];
                const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

                conditionToUpdate.value = e.target.value;

                // Update the userInput state  
                setUserInput(prevInput => {
                    const updatedInput = { ...prevInput };
                    if (!updatedInput.ifStatements[mainIndex]) {
                        updatedInput.ifStatements[mainIndex] = {};
                    }
                    updatedInput.ifStatements[mainIndex][subIndex] = {
                        question_name: conditions[mainIndex].conditions[subIndex].question_name,
                        condition_logic: conditions[mainIndex].conditions[subIndex].condition_logic,
                        value: e.target.value
                    };
                    return updatedInput;
                });

                return updatedConditions;
            });
        }
    }
    const handleAddCondition = (blockIndex, isElseIf = false, elseIfIndex = null, isOr = false, isAnd = false) => {
        setSubmitSelected(false);
        if (isElseIf) {
            setConditions(prevConditions =>
                prevConditions.map((item, index) => {
                    if (index === blockIndex) {
                        return {
                            ...item,
                            elseIfBlocks: item.elseIfBlocks.map((elseIfBlock, i) => {
                                if (i === elseIfIndex) {
                                    return {
                                        ...elseIfBlock,
                                        conditions: [...elseIfBlock.conditions, {
                                            'question_name': '',
                                            'condition_logic': '',
                                            'value': '',
                                            'dropdown': false,
                                            'condition_dropdown': false,
                                            'condition_type': 'textboxfield',
                                            'andClicked': isAnd,
                                            'orClicked': isOr,
                                            'isOr': isOr
                                        }]
                                    };
                                }
                                return elseIfBlock;
                            })
                        };
                    }
                    return item;
                })
            );
        } else {
            setConditions(prevConditions =>
                prevConditions.map((item, index) => {
                    if (index === blockIndex) {
                        return {
                            ...item,
                            conditions: [...item.conditions, {
                                'question_name': '',
                                'condition_logic': '',
                                'value': '',
                                'dropdown': false,
                                'condition_dropdown': false,
                                'condition_type': 'textboxfield',
                                'andClicked': isAnd,
                                'orClicked': isOr,
                                'isOr': isOr
                            }]
                        };
                    }
                    return item;
                })
            );
        }
    };



    const handleAddBlock = () => {
        setSubmitSelected(false);
        setConditions(prevConditions => [...prevConditions, {
            conditions: [{
                'question_name': '',
                'condition_logic': '',
                'value': '',
                'dropdown': false,
                'condition_dropdown': false,
                'condition_type': 'textboxfield',
                'andClicked': false,
                'orClicked': false
            }],
            thenAction: {
                action: '',
                value: '',
                status: '',
                grade: ''
            }
        }]);
    };


    const handleDeleteElseIf = (blockIndex, elseIfIndex) => {
        setSubmitSelected(false);
        setConditions(prevConditions => {
            const updatedConditions = [...prevConditions];
            if (updatedConditions[blockIndex].elseIfBlocks) {
                updatedConditions[blockIndex].elseIfBlocks = updatedConditions[blockIndex].elseIfBlocks.filter((_, index) => index !== elseIfIndex);
            }
            return updatedConditions;
        });
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
                'status': '',
                'value': '',
                'action': '',
                'grade': ''
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


    const handleAdd = (type, blockId, innerIndex, isElseIf = false, elseIfIndex = null) => {
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

        const newObj = {
            question_name: '',
            condition_logic: '',
            value: '',
            dropdown: false,
            condition_dropdown: false,
            condition_type: 'textboxfield',
            andClicked: false,
            orClicked: false
        };

        if (totalConditions === 10) {
            setToastError(
                `Oh no! To use the basic editor you'll have to use a simpler expression. Please go back to the advanced editor.`
            );
            return;
        }

        if (type === 'AND') {
            setConditions(prevConditions =>
                prevConditions.map((item, index) => {
                    if (index === blockId) {
                        return { ...item, conditions: [...item.conditions, newObj] };
                    }
                    return item;
                })
            );
        } else if (type === 'OR') {
            // Add a new condition to the existing block  
            setConditions(prevConditions =>
                prevConditions.map((item, index) => {
                    if (index === blockId) {
                        return { ...item, conditions: [...item.conditions, newObj] };
                    }
                    return item;
                })
            );
        }
    };

    const handleThenActionChange = (index, field, value, isElseBlock = false, isElseIf = false, elseIfIndex = null) => {
        setConditions(prevConditions =>
            prevConditions.map((condition, i) => {
                if (i === index) {
                    if (isElseIf) {
                        // Update the userInput state  
                        setUserInput(prevInput => {
                            const updatedInput = { ...prevInput };
                            if (!updatedInput.elseIfStatements[index]) {
                                updatedInput.elseIfStatements[index] = [];
                            }
                            if (!updatedInput.elseIfStatements[index][elseIfIndex]) {
                                updatedInput.elseIfStatements[index][elseIfIndex] = {};
                            }
                            if (!updatedInput.elseIfStatements[index][elseIfIndex].thenAction) {
                                updatedInput.elseIfStatements[index][elseIfIndex].thenAction = {};
                            }
                            updatedInput.elseIfStatements[index][elseIfIndex].thenAction[field] = value;
                            return updatedInput;
                        });

                        return {
                            ...condition,
                            elseIfBlocks: condition.elseIfBlocks.map((elseIfBlock, j) => {
                                if (j === elseIfIndex) {
                                    return {
                                        ...elseIfBlock,
                                        thenActions: elseIfBlock.thenActions.map((thenAction, k) => {
                                            return {
                                                ...thenAction,
                                                [field]: value
                                            };
                                        })
                                    };
                                }
                                return elseIfBlock;
                            })
                        };
                    } else if (isElseBlock) {
                        // Update the userInput state  
                        setUserInput(prevInput => {
                            const updatedInput = { ...prevInput };
                            if (!updatedInput.elseStatement) {
                                updatedInput.elseStatement = {};
                            }
                            updatedInput.elseStatement[field] = value;
                            return updatedInput;
                        });

                        return {
                            ...condition,
                            elseBlock: {
                                ...condition.elseBlock,
                                [field]: value
                            }
                        };
                    } else {
                        // Update the userInput state  
                        setUserInput(prevInput => {
                            const updatedInput = { ...prevInput };
                            if (!updatedInput.ifStatements[index]) {
                                updatedInput.ifStatements[index] = {};
                            }
                            if (!updatedInput.ifStatements[index].thenAction) {
                                updatedInput.ifStatements[index].thenAction = {};
                            }
                            updatedInput.ifStatements[index].thenAction[field] = value;
                            return updatedInput;
                        });

                        return {
                            ...condition,
                            thenAction: {
                                ...condition.thenAction,
                                [field]: value
                            }
                        };
                    }
                }
                return condition;
            })
        );
    };





    function getDetails(path, data) {
        const [sectionPart, pagePart, questionPart] = path.split('.');

        const sectionName = sectionPart.replace(/_/g, ' ');
        const pageName = pagePart.replace(/_/g, ' ');
        const questionName = questionPart.replace(/_/g, ' ');

        const matchingSection = data?.sections.find(section => section.section_name === sectionName);
        if (!matchingSection) {
            return null;
        }

        const matchingPage = matchingSection.pages.find(page => page.page_name === pageName);
        if (!matchingPage) {
            return null;
        }

        const matchingQuestion = matchingPage.questions.find(question => question.question_name === questionName);
        if (!matchingQuestion) {
            return null;
        }

        return matchingQuestion;
    }

    const handleSelectDropdown = (key, mainIndex, subIndex, type, isElseIf = false, elseIfIndex = null) => {
        setSubmitSelected(false)
        if (type === 'condition_dropdown') {
            if (isElseIf) {
                setConditions(prevConditions => {
                    const updatedConditions = [...prevConditions];

                    const conditionToUpdate = updatedConditions[mainIndex].elseIfBlocks[elseIfIndex].conditions[subIndex];

                    conditionToUpdate.condition_logic = key;

                    return updatedConditions;
                });
            } else {
                setConditions(prevConditions => {
                    const updatedConditions = [...prevConditions];

                    const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

                    conditionToUpdate.condition_logic = key;

                    return updatedConditions;
                });
            }
            updateDropdown(type, mainIndex, subIndex, isElseIf, elseIfIndex)
            return;
        }
        let selectedQuestion = getDetails(key, questions);
        if (isElseIf) {
            setConditions(prevConditions => {
                const updatedConditions = [...prevConditions];

                const conditionToUpdate = updatedConditions[mainIndex].elseIfBlocks[elseIfIndex].conditions[subIndex];

                conditionToUpdate.question_name = key;
                conditionToUpdate.condition_type = selectedQuestion.component_type;
                conditionToUpdate.value = '';
                conditionToUpdate.condition_logic = '';

                if (selectedQuestion.component_type === 'dateTimefield') {
                    conditionToUpdate['date'] = '';
                }

                return updatedConditions;
            });
        } else {
            setConditions(prevConditions => {
                const updatedConditions = [...prevConditions];

                const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

                conditionToUpdate.question_name = key;
                conditionToUpdate.condition_type = selectedQuestion.component_type;
                conditionToUpdate.value = '';
                conditionToUpdate.condition_logic = '';

                if (selectedQuestion.component_type === 'dateTimefield') {
                    conditionToUpdate['date'] = '';
                }

                return updatedConditions;
            });
        }
        updateDropdown(type, mainIndex, subIndex, isElseIf, elseIfIndex)
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
                    return true;
                }
            }
        }
        return false;
    };

    const showInputValue = (key) => {
        let arr = ['has no files', 'has atleast one file', 'date is before today', 'date is before or equal to today', 'date is after today', 'date is after or equal to today']
        if (arr.includes(key)) {
            return false;
        }
        return true;
    }

    const handleDatePicker = (dateString, mainIndex, subIndex, isElseIf = false, elseIfIndex = null) => {

        if (isElseIf) {
            setConditions(prevConditions => {
                const updatedConditions = [...prevConditions];

                const conditionToUpdate = updatedConditions[mainIndex].elseIfBlocks[elseIfIndex].conditions[subIndex];

                conditionToUpdate['date'] = dateString;
                return updatedConditions;
            });
        } else {
            setConditions(prevConditions => {
                const updatedConditions = [...prevConditions];

                const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

                conditionToUpdate['date'] = dateString;
                return updatedConditions;
            });
        }
    }

    const handleDeleteCondition = (blockId, innerIndex, isElseIf = false, elseIfIndex = null) => {
        setSubmitSelected(false);
        if (isElseIf) {
            setConditions(prevConditions =>
                prevConditions.map((item, index) => {
                    if (index === blockId) {
                        const updatedElseIfBlocks = [...item.elseIfBlocks];
                        updatedElseIfBlocks[elseIfIndex] = {
                            ...updatedElseIfBlocks[elseIfIndex],
                            conditions: updatedElseIfBlocks[elseIfIndex].conditions.filter((_, i) => i !== innerIndex)
                        };
                        // Update the previous condition to reset the operator click   
                        if (innerIndex > 0) {
                            updatedElseIfBlocks[elseIfIndex].conditions[innerIndex - 1] = {
                                ...updatedElseIfBlocks[elseIfIndex].conditions[innerIndex - 1],
                                andClicked: false,
                                orClicked: false
                            };
                        }
                        return {
                            ...item,
                            elseIfBlocks: updatedElseIfBlocks
                        };
                    }
                    return item;
                })
            );
        } else {
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
        }
    }

    console.log(conditions, 'structureUserInputstructureUserInputs')

    const getComplianceLogic = () => {
        let condition = conditions[0].conditions;

        // to get the value expression
        const getValue = (val, condtionType) => {
            let resultValue = '';
            switch (condtionType) {
                case "choiceboxfield": resultValue = `"${val}"`;
                    break;
                case "numberfield": resultValue = val;
                    break;
            }
            return resultValue
        }

        // to get the condition expression
        const getConditionValue = (item) => {
            let resultExpression = '';
            switch (item.condition_logic) {
                case "includes": resultExpression = `${item.question_name}.includes("${item.value}")`;
                    break;
                case "equals": resultExpression = `${item.question_name} == ${getValue(item.value, item.condition_type)}`;
                    break;
                case "not equal to": resultExpression = `${item.question_name} != ${getValue(item.value, item.condition_type)}`;
                    break;
                case "does not include": resultExpression = `!${item.question_name}.includes("${item.value}")`;
                    break;
            }
            return resultExpression
        }
        const formatExpression = (expr) => {
            // Split the expression into parts by "||"
            const orParts = expr.split("||").map((part) => part.trim());

            // Add parentheses around each "&&" group
            const formatted = orParts
                .map((part) => {
                    if (part.includes("&&")) {
                        return `(${part})`;
                    }
                    return part;
                })
                .join(" || ");

            return formatted;
        };

        let result = '';

        condition.map((item, index) => {

            // if(index - 1 !== 0 && (item.andClicked !== condition[index - 1]?.andClicked || item.orClicked !== condition[index - 1]?.orClicked)) {
            //     result += ')'
            // }
            if (item.orClicked && index !== 0) {
                result += '|| ';
            }

            if (item.andClicked && index !== 0) {
                result += ' && ';
            }

            // if (condition[index + 1]?.andClicked && !item.andClicked) {
            //     result += '(';
            // }

            result += `${getConditionValue(item)}`;
            // if (index === condition.length - 1) {
            //     result += ') ?'
            // }
        });

        console.log(formatExpression(result.toString()), 'get compliance');

    }

    return (
        <div className='w-full h-customh14'>
            <p className='font-semibold text-[22px]'>Conditional Fields</p>
            <button onClick={() => getComplianceLogic()}>Generate</button>
            <div className='h-customh13 overflow-y-auto mb-6 scrollBar mt-5'>
                {conditions.map((condition, index) => (
                    <div key={index} className='mb-6 bg-[#EFF1F8] p-4'>
                        <div className='mb-4 flex flex-col gap-3 relative rounded'>
                            {/* If Statement */}
                            <div className='flex gap-3 w-[97%]'>
                                <div className='flex items-start gap-4 p-2 rounded-lg bg-white flex-1'>
                                    <h2 className='text-[#2B333B] font-semibold mt-2'>If</h2>
                                    <div className='flex-1'>
                                        <div className='w-full'>
                                            {/* if statement */}
                                            {condition['conditions'].map((sub_cond, i) => (
                                                <React.Fragment key={i}>
                                                    {sub_cond.isOr && (
                                                        <div className='cursor-pointer' data-testid={`OR-${index}`}>
                                                            <p className='w-full text-center text-sm text-[#2B333B] -mt-2 font-semibold'>OR</p>
                                                        </div>
                                                    )}
                                                    <div className='flex gap-4 items-start justify-between mb-4 mt-2'>
                                                        <div className='w-[97%] flex items-end gap-6 bg-[#EFF1F8] p-2.5'>
                                                            <div className='w-[97%] -mx-2 flex'>
                                                                <div className='w-1/3 px-2 '>
                                                                    <div className=''>
                                                                        <p className='text-sm text-[#2B333B] font-semibold'>Select</p>
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
                                                                            setDropdownOpen={updateDropdown}
                                                                            options={secDetailsForSearching}
                                                                            validationError={submitSelected && conditions[index]?.conditions[i]?.question_name === ''}
                                                                        />
                                                                        {submitSelected && conditions[index]?.conditions[i]?.question_name === '' && <ErrorMessage error={'This field is mandatory'} />}
                                                                    </div>
                                                                </div>
                                                                <div className='w-1/3 px-2 '>
                                                                    <div className=''>
                                                                        <p className='text-sm text-[#2B333B] font-semibold'>Condition</p>
                                                                        <InputWithDropDown
                                                                            // label='Format'   
                                                                            labelStyle='font-semibold text-[#2B333B] text-base'
                                                                            id='condition_dropdown'
                                                                            top='30px'
                                                                            placeholder='Select'
                                                                            className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                                                                            testID={`condition-${index}-${i}`}
                                                                            labeltestID={`condition-dropdown-${index}-${i}`}
                                                                            selectedOption={conditions[index]?.conditions[i]?.condition_logic}
                                                                            handleOptionClick={handleSelectDropdown}
                                                                            mainIndex={index}
                                                                            subIndex={i}
                                                                            isDropdownOpen={conditions[index]['conditions'][i]['condition_dropdown']}
                                                                            setDropdownOpen={updateDropdown}
                                                                            options={getConditions(conditions[index].conditions[i].condition_type)}
                                                                            validationError={submitSelected && conditions[index]?.conditions[i]?.condition_logic === ''}
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
                                                                {showInputValue(conditions[index]?.conditions[i]?.condition_logic) && <div className='w-1/3 px-2 '>
                                                                    <div className=''>
                                                                        <p className='text-sm text-[#2B333B] mb-3 font-semibold'>Value</p>
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
                                                                    </div>

                                                                </div>}

                                                            </div>

                                                            {condition['conditions'].length - 1 === i ? <div className='cursor-pointer' data-testid={`AND-${index}`} onClick={() => handleAddCondition(index, false, null, false, true)}>
                                                                <Image src="add" className="cursor-pointer -ml-1" data-testid="add" />
                                                                <p className='text-sm text-[#2B333B] -mt-2 font-semibold cursor-pointer'>AND</p>
                                                            </div> : <div className='w-[3%] flex flex-col items-center'>
                                                                {/* <Image src="add" className="" data-testid="add" /> */}
                                                                <p className='text-sm text-[#2B333B] -mt-2 font-semibold'>AND</p>
                                                            </div>}
                                                        </div>
                                                        <div className='w-[3%] flex justify-end'>
                                                            <div className='p-2 bg-[#EFF1F8] cursor-pointer rounded w-fit' onClick={() => handleAdd("delete", index, i)}>
                                                                <Image src="trash-black" className="" data-testid="delete" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                            {conditions.length - 1 === index ? (
                                                <div className='cursor-pointer' data-testid={`OR-${index}`} onClick={() => handleAddCondition(index, false, null, true, false)}>
                                                    <Image src="add" className="mx-auto w-8 h-8" data-testid="add" />
                                                    <p className='w-full text-center text-sm text-[#2B333B] -mt-2 font-semibold'>OR</p>
                                                </div>
                                            ) : (
                                                <div className="cursor-pointer ">
                                                    <p className="w-full text-center text-sm text-[#2B333B] pb-[10px] font-semibold">OR</p>
                                                </div>
                                            )}



                                        </div>
                                    </div>
                                </div>

                                <div className='pt-4 bg-white p-3 flex gap-4 rounded-lg'>
                                    <h3 className='text-[#2B333B] font-semibold mt-5 mb-4'>Then</h3>
                                    <div className='flex flex-col gap-4'>
                                        <InputField
                                            label="Status"
                                            className="w-full"
                                            placeholder="Enter status"
                                            value={condition.thenAction?.status || ''}
                                            handleChange={(e) => handleThenActionChange(index, 'status', e.target.value)}
                                            basicEditor
                                        />
                                        {/* <InputWithDropDown
                                            label='Reason'
                                            labelStyle='font-semibold text-[#2B333B] text-base'
                                            id='condition_dropdown'
                                            top='30px'
                                            placeholder='Select'
                                            className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                                            testID={`reason-dropdown`}
                                            labeltestID={`reason-dropdown-label`}
                                            selectedOption={options.find(option => option.label === fieldSettingParamsReason?.reason)}
                                            handleOptionClick={(e)=>handleOptionClick(e.target.value, 'if')}
                                            mainIndex={index}
                                            // subIndex={i}
                                            isDropdownOpen={isDropdownOpen}
                                            setDropdownOpen={setDropdownOpen}
                                            options={options}
                                        // validationError={submitSelected && condition[index]?.condition_logic === ''}
                                        /> */}
                                        <InputField
                                            label="Reason"
                                            className="w-full"
                                            placeholder="Enter reason"
                                            value={condition.thenAction?.value || ''}
                                            handleChange={(e) => handleThenActionChange(index, 'value', e.target.value)}
                                            basicEditor
                                        />
                                        <InputField
                                            label="Action"
                                            className="w-full"
                                            placeholder="Enter action"
                                            value={condition.thenAction?.action || ''}
                                            handleChange={(e) => handleThenActionChange(index, 'action', e.target.value)}
                                            basicEditor
                                        />
                                        <InputField
                                            label="Grade"
                                            className="w-full"
                                            placeholder="Enter grade"
                                            value={condition.thenAction?.grade || ''}
                                            handleChange={(e) => handleThenActionChange(index, 'grade', e.target.value)}
                                            basicEditor
                                        />
                                    </div>
                                </div>

                            </div>
                            {/* Else if statement */}

                            {
                                condition.elseIfBlocks?.map((elseIfBlock, elseIfIndex) => (
                                    <div key={`elseif-${elseIfIndex}`} className='flex gap-3'>
                                        <div className='flex items-start gap-4 p-2 rounded-lg bg-white flex-1'>
                                            <h2 className='text-[#2B333B] font-semibold mt-2'>Else if</h2>
                                            <div className='flex-1'>
                                                <div className='w-full'>
                                                    {elseIfBlock.conditions.map((sub_cond, i) => (
                                                        <React.Fragment key={i}>
                                                            {sub_cond.isOr && (
                                                                <div className='cursor-pointer' data-testid={`OR-${index}`}>
                                                                    <p className='w-full text-center text-sm text-[#2B333B] -mt-2 font-semibold'>OR</p>
                                                                </div>
                                                            )}
                                                            <div className='flex gap-4 items-start justify-between mb-4 mt-2'>
                                                                <div className='w-[97%] flex items-end gap-6 bg-[#EFF1F8] p-2.5'>
                                                                    <div className='w-[97%] -mx-2 flex'>
                                                                        <div className='w-1/3 px-2 '>
                                                                            <div className=''>
                                                                                <p className='text-sm text-[#2B333B] font-semibold'>Select</p>
                                                                                <InputWithDropDown
                                                                                    label=''
                                                                                    id='dropdown'
                                                                                    top='30px'
                                                                                    placeholder='Select'
                                                                                    className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                                                                                    testID={`select-${index}-${i}`}
                                                                                    selectedOption={conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i]?.question_name}
                                                                                    handleOptionClick={(key) => handleSelectDropdown(key, index, i, 'dropdown', true, elseIfIndex)}
                                                                                    isDropdownOpen={conditions[index].elseIfBlocks[elseIfIndex].conditions[i].dropdown}
                                                                                    mainIndex={index}
                                                                                    subIndex={i}
                                                                                    setDropdownOpen={(dropdown) => updateDropdown(dropdown, index, i, true, elseIfIndex)}
                                                                                    options={secDetailsForSearching}
                                                                                    validationError={submitSelected && conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i]?.question_name === ''}
                                                                                />
                                                                                {submitSelected && conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i]?.question_name === '' &&
                                                                                    <ErrorMessage error={'This field is mandatory'} />}
                                                                            </div>
                                                                        </div>
                                                                        <div className='w-1/3 px-2 '>
                                                                            <div className=''>
                                                                                <p className='text-sm text-[#2B333B] font-semibold'>Condition</p>
                                                                                <InputWithDropDown
                                                                                    label=''
                                                                                    id='condition_dropdown'
                                                                                    top='30px'
                                                                                    placeholder='Select'
                                                                                    className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                                                                                    testID={`condition-${index}-${i}`}
                                                                                    selectedOption={conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i]?.condition_logic}
                                                                                    handleOptionClick={(key) => handleSelectDropdown(key, index, i, 'condition_dropdown', true, elseIfIndex)}
                                                                                    mainIndex={index}
                                                                                    subIndex={i}
                                                                                    isDropdownOpen={conditions[index].elseIfBlocks[elseIfIndex].conditions[i].condition_dropdown}
                                                                                    setDropdownOpen={(dropdown) => updateDropdown(dropdown, index, i, true, elseIfIndex)}
                                                                                    options={getConditions(conditions[index].elseIfBlocks[elseIfIndex].conditions[i].condition_type)}
                                                                                    validationError={submitSelected && conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i]?.condition_logic === ''}
                                                                                />
                                                                                {submitSelected && conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i]?.condition_logic === '' &&
                                                                                    <ErrorMessage error={'This field is mandatory'} />}
                                                                            </div>
                                                                        </div>
                                                                        {conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i].condition_logic === 'date is “X” date of set date' &&
                                                                            <div className='w-1/3 px-2 '>
                                                                                <p className='text-sm text-[#2B333B] mb-[11px]'>Set Date</p>
                                                                                <DatePicker
                                                                                    autoComplete='off'
                                                                                    label=''
                                                                                    id='value'
                                                                                    type='text'
                                                                                    value={conditions[index].elseIfBlocks[elseIfIndex].conditions[i].date || null}
                                                                                    className='w-full'
                                                                                    labelStyle=''
                                                                                    testId={`set-date-${index}-${i}`}
                                                                                    htmlFor=''
                                                                                    mainIndex={index}
                                                                                    subIndex={i}
                                                                                    handleChange={(dateString) => handleDatePicker(dateString, index, i, true, elseIfIndex)}
                                                                                    validationError={submitSelected && conditions[index].elseIfBlocks[elseIfIndex].conditions[i].date === '' && 'This field  is mandatory'}
                                                                                />
                                                                            </div>}
                                                                        {showInputValue(conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i].condition_logic) &&
                                                                            <div className='w-1/3 px-2 '>
                                                                                <div className=''>
                                                                                    <p className='text-sm text-[#2B333B] mb-3 font-semibold'>Value</p>
                                                                                    <InputField
                                                                                        autoComplete='off'
                                                                                        label=''
                                                                                        id='value'
                                                                                        type='text'
                                                                                        value={conditions[index].elseIfBlocks[elseIfIndex].conditions[i].value}
                                                                                        className='w-full'
                                                                                        labelStyle=''
                                                                                        placeholder=''
                                                                                        testId={`value-input-${index}-${i}`}
                                                                                        htmlFor=''
                                                                                        maxLength={32}
                                                                                        mainIndex={index}
                                                                                        subIndex={i}
                                                                                        handleChange={(e) => handleInputChange(e, '', '', index, i, true, elseIfIndex)}
                                                                                        onInput={conditions[index].elseIfBlocks[elseIfIndex].conditions[i].condition_type === 'dateTimefield' || conditions[index].elseIfBlocks[elseIfIndex].conditions[i].condition_type === 'numberfield' || conditions[index].elseIfBlocks[elseIfIndex].conditions[i].condition_type === 'photofield'}
                                                                                        validationError={submitSelected && conditions[index].elseIfBlocks[elseIfIndex].conditions[i].value === '' && 'This field  is mandatory'}
                                                                                        basicEditor
                                                                                    />
                                                                                </div>
                                                                            </div>}
                                                                    </div>
                                                                    {elseIfBlock.conditions.length - 1 === i ? (
                                                                        <div className='w-[3%] flex flex-col items-center' data-testid={`AND-${index}`} onClick={() => handleAddCondition(index, true, elseIfIndex, false, true)}>
                                                                            <Image src="add" className="cursor-pointer" data-testid="add" />
                                                                            <p className='text-sm text-[#2B333B] -mt-2 font-semibold cursor-pointer'>AND</p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className='w-[3%] flex flex-col items-center'>
                                                                            <p className='text-sm text-[#2B333B] -mt-2 font-semibold'>AND</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className='w-[3%] flex justify-end'>
                                                                    <div className='p-2 bg-[#EFF1F8] cursor-pointer rounded w-fit' onClick={() => handleDeleteCondition(index, i, true, elseIfIndex)}>
                                                                        <Image src="trash-black" className="" data-testid="delete" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    ))}
                                                    {conditions.length - 1 === index ? (
                                                        <div className='cursor-pointer' data-testid={`OR-${index}`} onClick={() => handleAddCondition(index, true, elseIfIndex, true, false)}>
                                                            <Image src="add" className="mx-auto w-8 h-8" data-testid="add" />
                                                            <p className='w-full text-center text-sm text-[#2B333B] -mt-2 font-semibold'>OR</p>
                                                        </div>
                                                    ) : (
                                                        <div className="cursor-pointer">
                                                            <p className="w-full text-center text-sm text-[#2B333B] -mt-2 pb-[10px] font-semibold">OR</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='pt-4 bg-white p-3 flex gap-4 rounded-lg'>
                                            <h3 className='text-[#2B333B] font-semibold mt-5 mb-4'>Then</h3>
                                            <div className='flex flex-col gap-4'>
                                                <InputField
                                                    label="Status"
                                                    className="w-full"
                                                    placeholder="Enter status"
                                                    value={condition.elseIfBlocks[elseIfIndex].thenActions[0].status || ''}
                                                    handleChange={(e) => handleThenActionChange(index, 'status', e.target.value, false, true, elseIfIndex)}
                                                    basicEditor
                                                />
                                                <InputField
                                                    label="Reason"
                                                    className="w-full"
                                                    placeholder="Enter reason"
                                                    value={condition.elseIfBlocks[elseIfIndex].thenActions[0].value || ''}
                                                    handleChange={(e) => handleThenActionChange(index, 'value', e.target.value, false, true, elseIfIndex)}
                                                    basicEditor
                                                />
                                                <InputField
                                                    label="Action"
                                                    className="w-full"
                                                    placeholder="Enter action"
                                                    value={condition.elseIfBlocks[elseIfIndex].thenActions[0].action || ''}
                                                    handleChange={(e) => handleThenActionChange(index, 'action', e.target.value, false, true, elseIfIndex)}
                                                    basicEditor
                                                />
                                                <InputField
                                                    label="Grade"
                                                    className="w-full"
                                                    placeholder="Enter grade"
                                                    value={condition.elseIfBlocks[elseIfIndex].thenActions[0].grade || ''}
                                                    handleChange={(e) => handleThenActionChange(index, 'grade', e.target.value, false, true, elseIfIndex)}
                                                    basicEditor
                                                />
                                            </div>
                                        </div>
                                        <div className=' items-start'>
                                            <button
                                                className='-right-2 bg-white -top-2 p-2 rounded-sm'
                                                onClick={() => handleDeleteElseIf(index, elseIfIndex)}
                                                data-testid={`delete-elseif-${index}-${elseIfIndex}`}
                                            >
                                                <Image src="trash-black" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }


                            <button
                                className='w-fit px-4 py-2 text-[#2B333B] font-semibold rounded-md'
                                onClick={() => addElseIf(index)}
                            >
                                + Add Else If
                            </button>
                            <div className='flex gap-3 w-[97%]'>
                                <div className='pt-4 bg-white p-3 flex flex-row gap-4 rounded-lg w-full'>
                                    <h3 className='text-[#2B333B] font-semibold mt-5 mb-4'>Else</h3>
                                    <div className='flex flex-row gap-4 flex-1'>
                                        <InputField
                                            label="Status"
                                            className="w-full"
                                            placeholder="Enter status"
                                            value={condition.elseBlock?.status || ''}
                                            handleChange={(e) => handleThenActionChange(index, 'status', e.target.value, true)}
                                            basicEditor
                                        />
                                        <InputField
                                            label="Reason"
                                            className="w-full"
                                            placeholder="Enter reason"
                                            value={condition.elseBlock?.value || ''}
                                            handleChange={(e) => handleThenActionChange(index, 'value', e.target.value, true)}
                                            basicEditor
                                        />
                                        <InputField
                                            label="Action"
                                            className="w-full"
                                            placeholder="Enter action"
                                            value={condition.elseBlock?.action || ''}
                                            handleChange={(e) => handleThenActionChange(index, 'action', e.target.value, true)}
                                            basicEditor
                                        />
                                        <InputField
                                            label="Grade"
                                            className="w-full"
                                            placeholder="Enter grade"
                                            value={condition.elseBlock?.grade || ''}
                                            handleChange={(e) => handleThenActionChange(index, 'grade', e.target.value, true)}
                                            basicEditor
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ComplianceBasicEditor;
