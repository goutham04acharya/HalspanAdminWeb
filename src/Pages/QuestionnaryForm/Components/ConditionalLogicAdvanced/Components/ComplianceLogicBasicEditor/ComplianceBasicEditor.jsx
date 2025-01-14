import React, { useContext, useEffect, useState } from 'react'
import InputField from '../../../../../../Components/InputField/InputField'
import Image from '../../../../../../Components/Image/Image'
import InputWithDropDown from '../../../../../../Components/InputField/Dropdown';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';
import GlobalContext from '../../../../../../Components/Context/GlobalContext';
import DatePicker from '../../../../../../Components/Datepicker/DatePicker';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { generateElseBlockString, generateThenActionString } from '../../../../../../CommonMethods/ComplianceBasicEditorLogicBuilder';

function ComplianceBasicEditor({ secDetailsForSearching, questions, conditions, setConditions, submitSelected, setSubmitSelected, setUserInput, combinedArray }) {
    const dispatch = useDispatch();
    const [dropdown, setDropdown] = useState(false)
    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const [isDropdownOpen, setDropdownOpen] = useState({});
    const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState({});
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState({});

    const fieldSettingParamsReason = useSelector(state => state.fieldSettingParams.conditions);
    const conditionObj = {
        'text': ['includes', 'does not include', 'equals', 'not equal to'],
        'numeric': ['equals', 'not equal to', 'smaller', 'larger', 'smaller or equal', 'larger or equal'],
        'file': ['has atleast one file', 'has no files', 'number of file is'],
        'date': ['date is before today', 'date is before or equal to today', 'date is after today', 'date is after or equal to today', 'date is “X” date of set date']
    }
    const fieldSettingsParams = useSelector(state => state.fieldSettingParams.currentData)
    const options = ['NO_ACCESS', 'MISSING', 'RECOMMEND_REPLACEMENT', 'RECOMMEND_REMEDIATION', 'FURTHER_INVESTIGATION', 'OTHER'];
    const status = ['PASS', 'FAIL'];
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


    const handleInputChange = (e, id, type, mainIndex, subIndex, isElseIf = false, elseIfIndex = null, questionIndex) => {

        setSubmitSelected(false)
        if (isElseIf) {
            const updated = conditions;

            setConditions(prevConditions => {
                const updatedConditions = JSON.parse(JSON.stringify(prevConditions)); // Create a deep copy of the state  
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
                        question_name: updatedConditions[mainIndex].elseIfBlocks[elseIfIndex].conditions[subIndex].question_name,
                        condition_logic: updatedConditions[mainIndex].elseIfBlocks[elseIfIndex].conditions[subIndex].condition_logic,
                        value: e.target.value,
                        questionIndex: questionIndex
                    };
                    return updatedInput;
                });

                return updatedConditions;
            });
        } else {
            setConditions(prevConditions => {
                const updatedConditions = JSON.parse(JSON.stringify(prevConditions)); // Create a deep copy of the state  
                const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

                conditionToUpdate.value = e.target.value;

                // Update the userInput state    
                setUserInput(prevInput => {
                    const updatedInput = { ...prevInput };
                    if (!updatedInput.ifStatements[mainIndex]) {
                        updatedInput.ifStatements[mainIndex] = {};
                    }
                    updatedInput.ifStatements[mainIndex][subIndex] = {
                        question_name: updatedConditions[mainIndex].conditions[subIndex].question_name,
                        condition_logic: updatedConditions[mainIndex].conditions[subIndex].condition_logic,
                        value: e.target.value,
                        questionIndex: questionIndex
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
                                            'isOr': isOr,
                                            'index': elseIfBlock.conditions.length // add index here  
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
                                'isOr': isOr,
                                'index': item.conditions.length // add index here  
                            }]
                        };
                    }
                    return item;
                })
            );
        }
    };



    const handleDeleteElseIf = (blockIndex, elseIfIndex) => {
        setSubmitSelected(false);
        setConditions(prevConditions => {
            const updatedConditions = [...prevConditions];
            if (updatedConditions[blockIndex].elseIfBlocks) {
                updatedConditions[blockIndex] = {
                    ...updatedConditions[blockIndex],
                    elseIfBlocks: updatedConditions[blockIndex].elseIfBlocks.filter((_, index) => index !== elseIfIndex)
                };
            }
            return updatedConditions;
        });
    };


    const addElseIf = (blockIndex) => {
        setSubmitSelected(false);
        const newElseIfBlock = {
            type: 'elseif',
            index: conditions[0]?.elseIfBlocks?.length,
            conditions: [{
                'question_name': '',
                'condition_logic': '',
                'value': '',
                'dropdown': false,
                'condition_dropdown': false,
                'condition_type': 'textboxfield',
                'index': blockIndex
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
    const handleClearElseIfConditionValues = (blockId, elseIfIndex) => {
        setConditions((prevConditions) =>
            prevConditions.map((conditionGroup, index) => {
                if (index === blockId) {
                    // Check if the elseIfBlock exists and has only one condition
                    if (
                        conditionGroup.elseIfBlocks &&
                        conditionGroup.elseIfBlocks[elseIfIndex] &&
                        conditionGroup.elseIfBlocks[elseIfIndex].conditions.length === 1
                    ) {
                        return {
                            ...conditionGroup,
                            elseIfBlocks: conditionGroup.elseIfBlocks.map((elseIfBlock, i) => {
                                if (i === elseIfIndex) {
                                    return {
                                        ...elseIfBlock,
                                        conditions: elseIfBlock.conditions.map((condition) => ({
                                            ...condition,
                                            question_name: "",
                                            condition_logic: "",
                                            value: "",
                                            dropdown: false,
                                            condition_dropdown: false,
                                            condition_type: condition.condition_type, // Preserve type
                                        })),
                                    };
                                }
                                return elseIfBlock;
                            }),
                        };
                    }
                }
                return conditionGroup;
            })
        );
    };

    useEffect(() => {
        const totalConditions = conditions.reduce((acc, curr) => acc + curr.conditions.length, 0);
        if (totalConditions === 10) {
            setToastError(
                `Oh no! To use the basic editor you'll have to use a simpler expression. Please go back to the advanced editor.`
            );
        }
    }, [conditions])
    const handleAdd = (type, blockId, innerIndex, isElseIf = false, elseIfIndex = null) => {
        setSubmitSelected(false);
        const totalConditions = conditions.reduce((acc, curr) => acc + curr.conditions.length, 0);
        const totalElseIfConditions = conditions[0]?.elseIfBlocks?.reduce((acc, curr) => acc + curr.conditions.length, 0);

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

        if (totalConditions === 10 || totalElseIfConditions === 10) {
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
                        // debugger
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
            updateDropdown('condition_dropdown', mainIndex, subIndex, isElseIf, elseIfIndex)
        } else if (type === 'value') {
            if (isElseIf) {
                setConditions(prevConditions => {
                    const updatedConditions = [...prevConditions];

                    const conditionToUpdate = updatedConditions[mainIndex].elseIfBlocks[elseIfIndex].conditions[subIndex];

                    conditionToUpdate.value = key;

                    return updatedConditions;
                });
            } else {
                setConditions(prevConditions => {
                    const updatedConditions = [...prevConditions];

                    const conditionToUpdate = updatedConditions[mainIndex].conditions[subIndex];

                    conditionToUpdate.value = key;

                    return updatedConditions;
                });
            }

            updateDropdown('value_dropdown', mainIndex, subIndex, isElseIf, elseIfIndex)
        } else {
            if (isElseIf) {
                setConditions(prevConditions => {
                    const updatedConditions = [...prevConditions];

                    const conditionToUpdate = updatedConditions[mainIndex]?.elseIfBlocks[elseIfIndex]?.conditions[subIndex];

                    conditionToUpdate.condition_logic = key;

                    return updatedConditions;
                });
            } else {
                setConditions(prevConditions => {
                    const updatedConditions = [...prevConditions];

                    const conditionToUpdate = updatedConditions[mainIndex]?.conditions[subIndex];

                    conditionToUpdate.condition_logic = key;

                    return updatedConditions;
                });
            }

            updateDropdown()
        }

        let selectedQuestion = getDetails(key, questions);
        if (isElseIf) {
            setConditions(prevConditions => {
                const updatedConditions = [...prevConditions];

                const conditionToUpdate = updatedConditions[mainIndex]?.elseIfBlocks[elseIfIndex]?.conditions[subIndex];

                conditionToUpdate.question_name = key;
                conditionToUpdate.condition_type = selectedQuestion?.component_type;
                conditionToUpdate.value = '';
                conditionToUpdate.condition_logic = '';

                if (selectedQuestion?.component_type === 'dateTimefield') {
                    conditionToUpdate['date'] = '';
                }

                return updatedConditions;
            });
        } else {
            setConditions(prevConditions => {
                const updatedConditions = [...prevConditions];

                const conditionToUpdate = updatedConditions[mainIndex]?.conditions[subIndex];

                conditionToUpdate.question_name = key;
                conditionToUpdate.condition_type = selectedQuestion?.component_type;
                conditionToUpdate.value = '';
                conditionToUpdate.condition_logic = '';

                if (selectedQuestion?.component_type === 'dateTimefield') {
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

    const showInputValue = (key, type, field) => {
        let arr = ['has no files', 'has atleast one file', 'date is before today', 'date is before or equal to today', 'date is after today', 'date is after or equal to today']
        if (arr.includes(key)) {
            return false;
        }
        if (type === 'choiceboxfield' && field === 'inputfield') {
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
                        const elseIfBlock = updatedElseIfBlocks[elseIfIndex];

                        // Check if it's the first condition
                        if (elseIfBlock.conditions.length === 1 && innerIndex === 0) {
                            // Reset the fields of the first condition
                            elseIfBlock.conditions[0] = {
                                ...elseIfBlock.conditions[0],
                                question_name: '',
                                condition_logic: '',
                                value: '',
                                dropdown: false,
                                condition_dropdown: false,
                                condition_type: 'textboxfield',
                                andClicked: false,
                                orClicked: false
                            };
                        } else {
                            // Remove the condition if it's not the first one
                            elseIfBlock.conditions = elseIfBlock.conditions.filter((_, i) => i !== innerIndex);
                            // Update the previous condition to reset the operator click
                            if (innerIndex > 0) {
                                elseIfBlock.conditions[innerIndex - 1] = {
                                    ...elseIfBlock.conditions[innerIndex - 1],
                                    andClicked: false,
                                    orClicked: false
                                };
                            }
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
    };

    const statusDropdownHandler = (option, index, subIndex, id, type) => {
        if (type == 'elseIfIndex') {
            dropdownHandler('elseIfBlock', subIndex)
            setConditions((prevState) => {
                const updatedState = [...prevState];

                if (index >= 0 && index < updatedState.length) {
                    const elseIfBlocks = updatedState[index]?.elseIfBlocks;

                    if (elseIfBlocks && subIndex >= 0 && subIndex < elseIfBlocks.length) {
                        const thenActions = elseIfBlocks[subIndex]?.thenActions;

                        if (thenActions && thenActions.length > 0) {
                            thenActions[0] = {
                                ...thenActions[0],
                                [id]: option,
                            };
                        } else {
                            console.error("No conditions found at specified subIndex.");
                        }
                    } else {
                        console.error("Invalid subIndex.");
                    }
                } else {
                    console.error("Invalid mainIndex.");
                }

                return updatedState;
            });
            dropdownHandler('elseIfBlock', subIndex, 'status');
        } else if (type === 'else') {
            dropdownHandler('else', index)
            setConditions((prevState) => {
                const updatedState = [...prevState];

                if (index >= 0 && index < updatedState.length) {
                    const currentItem = updatedState[index];

                    if (currentItem?.elseBlock) {
                        updatedState[index] = {
                            ...currentItem,
                            elseBlock: {
                                ...currentItem.elseBlock,
                                [id]: option,
                            },
                        };
                    } else {
                        updatedState[index] = {
                            ...currentItem,
                            elseBlock: {
                                [id]: option,
                            },
                        };
                    }
                } else {
                    console.error("Invalid mainIndex.");
                }

                return updatedState;
            });
            dropdownHandler('else', index, 'status');
        } else {
            dropdownHandler('if', index)
            setConditions((prevState) => {
                const updatedState = [...prevState];

                if (index >= 0 && index < updatedState.length) {
                    updatedState[index] = {
                        ...updatedState[index],
                        thenAction: {
                            ...updatedState[index].thenAction,
                            [id]: option,
                        },
                    };
                } else {
                    console.error("Invalid index");
                }

                return updatedState;
            });
            dropdownHandler('if', index, 'status');
        }
    };


    //this below code will set the dropdown value to the conditions state
    const reasonDropdownHandler = (option, index, subIndex, id, type) => {
        if (type == 'elseIfIndex') {
            dropdownHandler('elseIfBlock', subIndex)
            setConditions((prevState) => {
                // Create a deep copy of the state
                const updatedState = [...prevState];

                // Ensure the mainIndex is valid
                if (index >= 0 && index < updatedState.length) {
                    const elseIfBlocks = updatedState[index]?.elseIfBlocks;

                    // Ensure the subIndex is valid within elseIfBlocks
                    if (elseIfBlocks && subIndex >= 0 && subIndex < elseIfBlocks.length) {
                        const thenActions = elseIfBlocks[subIndex]?.thenActions;

                        // Ensure there are conditions to update
                        if (thenActions && thenActions.length > 0) {
                            // Update the value of the first condition (or modify logic as needed)
                            thenActions[0] = {
                                ...thenActions[0],
                                [id]: option,
                            };
                        } else {
                            console.error("No conditions found at specified subIndex.");
                        }
                    } else {
                        console.error("Invalid subIndex.");
                    }
                } else {
                    console.error("Invalid mainIndex.");
                }

                return updatedState;
            });
            dropdownHandler('elseIfBlock', subIndex, 'reason');
        } else if (type === 'else') {
            dropdownHandler('else', index)
            setConditions((prevState) => {
                const updatedState = [...prevState];

                // Ensure the mainIndex is valid
                if (index >= 0 && index < updatedState.length) {
                    const currentItem = updatedState[index];

                    // If elseBlock doesn't exist, create it, else update the 'value' key
                    if (currentItem?.elseBlock) {
                        // Update the value key inside the existing elseBlock
                        updatedState[index] = {
                            ...currentItem,
                            elseBlock: {
                                ...currentItem.elseBlock,
                                [id]: option,  // Update the value key with the new option
                            },
                        };
                    } else {
                        // If elseBlock doesn't exist, create it with the value key set to the option
                        updatedState[index] = {
                            ...currentItem,
                            elseBlock: {
                                [id]: option,  // Initialize value with the option
                            },
                        };
                    }
                } else {
                    console.error("Invalid mainIndex.");
                }

                return updatedState;
            });
            dropdownHandler('else', index, 'reason');
        }
        else {
            dropdownHandler('if', index)
            setConditions((prevState) => {
                // Create a deep copy of the state
                const updatedState = [...prevState];

                // Ensure the index is valid before updating
                if (index >= 0 && index < updatedState.length) {
                    updatedState[index] = {
                        ...updatedState[index],
                        thenAction: {
                            ...updatedState[index].thenAction,
                            [id]: option,
                        },
                    };
                } else {
                    console.error("Invalid index");
                }

                return updatedState;
            });
            dropdownHandler('if', index, 'reason');
        }
    };

    //function to handle opening and closing of the dropdown in complinace basic editor
    const dropdownHandler = (type, index, dropdownType) => {
        if (dropdownType === 'reason') {
            setIsReasonDropdownOpen((prevState) => {
                const newKey = `${type}-${index}`;
                const updatedState = Object.keys(prevState).reduce((acc, key) => {
                    acc[key] = key === newKey ? !prevState[newKey] : false;
                    return acc;
                }, {});

                if (!(newKey in updatedState)) {
                    updatedState[newKey] = true;
                }

                return updatedState;
            });
        } else if (dropdownType === 'status') {
            setIsStatusDropdownOpen((prevState) => {
                const newKey = `${type}-${index}`;
                const updatedState = Object.keys(prevState).reduce((acc, key) => {
                    acc[key] = key === newKey ? !prevState[newKey] : false;
                    return acc;
                }, {});

                if (!(newKey in updatedState)) {
                    updatedState[newKey] = true;
                }

                return updatedState;
            });
        }
    };

    return (
        <div className='w-full h-customh14'>
            <p className='font-semibold text-[22px]'>Compliance Logic</p>
            <div className='h-customh13 overflow-y-auto mb-6 scrollBar mt-5'>
                {conditions.map((condition, index) => (
                    <div key={index} className='mb-6 h-fit bg-[#EFF1F8] p-4'>
                        <div className='mb-4 flex flex-col gap-3 relative rounded'>
                            {/* If Statement */}
                            <div className='flex gap-3 w-[97%]'>
                                <div className='flex items-start gap-4 p-2 w-3/4 rounded-lg bg-white flex-1'>
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
                                                                        <p className='text-sm text-[#2B333B] font-medium'>Select</p>
                                                                        <InputWithDropDown
                                                                            label=''
                                                                            labelStyle='font-semibold text-[#2B333B] text-base'
                                                                            id='dropdown'
                                                                            top='30px'
                                                                            placeholder='Select'
                                                                            className='w-full cursor-pointer text-sm placeholder:text-[#9FACB9] h-[45px] mt-3'
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
                                                                            dropDownClassName={`text-sm`}
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
                                                                            className='w-full cursor-pointer placeholder:text-[#9FACB9] text-sm h-[45px] mt-3'
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
                                                                            dropDownClassName={`text-sm`}
                                                                        />
                                                                        {submitSelected && conditions[index]?.conditions[i]?.condition_logic === '' && <ErrorMessage error={'This field is mandatory'} />}
                                                                    </div>
                                                                </div>
                                                                {conditions[index]?.conditions[i]?.condition_logic === 'date is “X” date of set date' && <div className='w-1/3 px-2 '>
                                                                    <p className='text-sm text-[#2B333B] mb-3 font-semibold'>Set Date</p>
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
                                                                {showInputValue(conditions[index]?.conditions[i]?.condition_logic, conditions[index]?.conditions[i]?.condition_type, 'choicefield') && (
                                                                    <div className='w-1/3 px-2 '>
                                                                        <div className=''>
                                                                            <p className='text-sm text-[#2B333B] mb-3 font-medium'>Value</p>
                                                                            {conditions[index]?.conditions[i]?.condition_type === 'choiceboxfield' ? (
                                                                                <>
                                                                                    <InputWithDropDown
                                                                                        label=""
                                                                                        id="value"
                                                                                        top="20px"
                                                                                        placeholder="Select"
                                                                                        className="w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px]"
                                                                                        testID={`value-dropdown-${index}-${i}`}
                                                                                        labeltestID={`value-dropdown-${index}-${i}`}
                                                                                        selectedOption={conditions[index].conditions[i].value}
                                                                                        handleOptionClick={(key) => handleSelectDropdown(key, index, i, 'value', false, null)}
                                                                                        mainIndex={index}
                                                                                        subIndex={i}
                                                                                        isDropdownOpen={conditions[index].conditions[i].value_dropdown}
                                                                                        setDropdownOpen={(dropdown) => updateDropdown('value_dropdown', index, i, false, null)}
                                                                                        options={combinedArray.length > 0 ? combinedArray?.find((item) => item?.question_detail === conditions[index]?.conditions[i]?.question_name)?.choice_values.map((choice) => choice?.value) : []}
                                                                                        validationError={submitSelected && conditions[index]?.conditions[i]?.value === ''}
                                                                                    />
                                                                                    {submitSelected && conditions[index]?.conditions[i]?.condition_logic === '' && <ErrorMessage error={'This field is mandatory'} />}
                                                                                </>


                                                                            ) : (
                                                                                <InputField
                                                                                    autoComplete="off"
                                                                                    label=""
                                                                                    id="value"
                                                                                    type="text"
                                                                                    value={conditions[index].conditions[i].value}
                                                                                    className="w-full text-sm"
                                                                                    labelStyle=""
                                                                                    placeholder=""
                                                                                    testId={`value-input-${index}-${i}`}
                                                                                    htmlFor=""
                                                                                    maxLength={32}
                                                                                    mainIndex={index}
                                                                                    subIndex={i}
                                                                                    handleChange={(e) => handleInputChange(e, '', '', index, i, false, null, i)}
                                                                                    onInput={conditions[index].conditions[i].condition_type === 'dateTimefield' || conditions[index].conditions[i].condition_type === 'numberfield' || conditions[index].conditions[i].condition_type === 'photofield'}
                                                                                    validationError={submitSelected && conditions[index].conditions[i].value === '' && 'This field  is mandatory'}
                                                                                    basicEditor
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}


                                                            </div>

                                                            {condition['conditions'].length - 1 === i ? <div className='cursor-pointer' data-testid={`AND-${index}`} onClick={() => {
                                                                handleAddCondition(index, false, null, false, true)
                                                                handleAdd('AND')
                                                            }}>
                                                                <Image src="add" className="cursor-pointer -ml-1" data-testid="add" />
                                                                <p className='text-sm text-[#2B333B] -mt-2 font-semibold cursor-pointer'>AND</p>
                                                            </div> : <div className='w-[3%] flex flex-col items-center'>
                                                                {/* <Image src="add" className="" data-testid="add" /> */}
                                                                <p className='text-sm text-[#2B333B] -mt-2 font-semibold'>AND</p>
                                                            </div>}
                                                        </div>
                                                        <div className='w-[3%] flex justify-end'>
                                                            <div className='p-2 bg-[#ffffff] cursor-pointer rounded-lg w-fit hover:bg-[#EFF1F8]' onClick={() => {
                                                                if (conditions[0]?.conditions?.length === 1 && conditions[0]?.conditions?.length === 1) {
                                                                    handleClearConditionValues(); // Clear values for the single condition
                                                                } else {
                                                                    handleAdd("delete", index, i)
                                                                }
                                                            }}>
                                                                <Image src="trash-black" className="" testId={`delete-${i}`} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                            {conditions.length - 1 === index ? (
                                                <div className='cursor-pointer' data-testid={`OR`} onClick={() => {
                                                    handleAddCondition(index, false, null, true, false)
                                                    handleAdd('OR')
                                                }
                                                }>

                                                    <Image src="add" className="mx-auto w-8 h-8" data-testid="add" />
                                                    <p className='w-fit text-center mx-auto text-sm text-[#2B333B] -mt-2 font-semibold'>OR</p>
                                                </div>
                                            ) : (
                                                <div className="cursor-pointer ">
                                                    <p className="w-fit text-center mx-auto text-sm text-[#2B333B] pb-[10px] font-semibold">OR</p>
                                                </div>
                                            )}



                                        </div>
                                    </div>
                                </div>

                                <div className='pt-4 w-1/4 bg-white p-3 flex gap-4 rounded-lg'>
                                    <h3 className='text-[#2B333B] font-semibold mt-5 mb-4'>Then</h3>
                                    <div className={`flex flex-col ${condition.thenAction?.status === undefined ? '' : 'gap-4'} `}>
                                        <InputWithDropDown
                                            label='Status'
                                            labelStyle='font-semibold text-[#2B333B] text-base'
                                            id='status'
                                            top='30px'
                                            placeholder='Select'
                                            className='w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px]'
                                            testID={`status-dropdown-${index}`}
                                            labeltestID={`status-dropdown-label`}
                                            selectedOption={condition.thenAction?.status}
                                            handleOptionClick={(e) => statusDropdownHandler(e, index, null, 'status', '')}
                                            mainIndex={index}
                                            isDropdownOpen={isStatusDropdownOpen?.[`if-${index}`]}
                                            setDropdownOpen={() => dropdownHandler('if', index, 'status')}
                                            options={status}
                                            dropDownClassName={`text-sm`}
                                            validationError={submitSelected && condition.thenAction?.status === undefined}
                                            ifcompliance
                                        />

                                        {submitSelected && condition.thenAction?.status === undefined && <ErrorMessage error={'This field is mandatory'} />}
                                        {condition.thenAction?.status === 'PASS' && (
                                            <InputField
                                                label="Grade"
                                                className="w-full"
                                                testId={`grade-${index}`}
                                                placeholder="Enter grade"
                                                value={condition.thenAction?.grade || ''}
                                                handleChange={(e) => handleThenActionChange(index, 'grade', e.target.value)}
                                                basicEditor
                                            />
                                        )}
                                        {condition.thenAction?.status === 'FAIL' && (
                                            <>
                                                <InputWithDropDown
                                                    label='Reason'
                                                    labelStyle='font-semibold text-[#2B333B] text-base'
                                                    id='value'
                                                    top='30px'
                                                    placeholder='Select'
                                                    className='w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px]'
                                                    testID={`reason-dropdown-${index}`}
                                                    labeltestID={`reason-dropdown-label`}
                                                    selectedOption={condition.thenAction?.value}
                                                    handleOptionClick={(e) => reasonDropdownHandler(e, index, null, 'value', '')}
                                                    mainIndex={index}
                                                    isDropdownOpen={isReasonDropdownOpen?.[`if-${index}`]}
                                                    setDropdownOpen={() => dropdownHandler('if', index, 'reason')}
                                                    options={options}
                                                    dropDownClassName={`text-sm`}
                                                    ifcompliance
                                                />
                                                <InputField
                                                    label="Action"
                                                    className="w-full"
                                                    testId={`action-${index}`}
                                                    placeholder="Enter action"
                                                    value={condition.thenAction?.action || ''}
                                                    handleChange={(e) => handleThenActionChange(index, 'action', e.target.value)}
                                                    basicEditor
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                            </div>
                            {/* Else if statement */}

                            {
                                condition.elseIfBlocks?.map((elseIfBlock, elseIfIndex) => (
                                    <div key={`elseif-${elseIfIndex}`} className='flex gap-3'>
                                        <div className='flex items-start w-3/4 gap-2 p-2 rounded-lg bg-white flex-1'>
                                            <div className='items-center flex flex-col justify-center'>
                                                <h2 className='text-[#2B333B] font-semibold mt-2'>Else</h2>
                                                <h2 className='text-[#2B333B] font-semibold'>if</h2>
                                            </div>
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
                                                                                    labeltestID={`select-dropdown-${index}-${i}`}
                                                                                    placeholder='Select'
                                                                                    className='w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                                                                                    testID={`elseif-select-${elseIfIndex}-${index}-${i}`}
                                                                                    selectedOption={conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i]?.question_name}
                                                                                    handleOptionClick={(key) => handleSelectDropdown(key, index, i, 'dropdown', true, elseIfIndex)}
                                                                                    isDropdownOpen={conditions[index].elseIfBlocks[elseIfIndex].conditions[i].dropdown}
                                                                                    mainIndex={index}
                                                                                    subIndex={i}
                                                                                    setDropdownOpen={(dropdown) => updateDropdown(dropdown, index, i, true, elseIfIndex)}
                                                                                    options={secDetailsForSearching}
                                                                                    validationError={submitSelected && conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i]?.question_name === ''}
                                                                                    dropDownClassName={`text-sm`}
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
                                                                                    className='w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                                                                                    labeltestID={`condition-dropdown-${index}-${i}`}
                                                                                    testID={`elseif-condition-${elseIfIndex}-${index}-${i}`}
                                                                                    selectedOption={conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i]?.condition_logic}
                                                                                    handleOptionClick={(key) => handleSelectDropdown(key, index, i, 'condition_dropdown', true, elseIfIndex)}
                                                                                    mainIndex={index}
                                                                                    subIndex={i}
                                                                                    isDropdownOpen={conditions[index].elseIfBlocks[elseIfIndex].conditions[i].condition_dropdown}
                                                                                    setDropdownOpen={(dropdown) => updateDropdown(dropdown, index, i, true, elseIfIndex)}
                                                                                    options={getConditions(conditions[index].elseIfBlocks[elseIfIndex].conditions[i].condition_type)}
                                                                                    validationError={submitSelected && conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i]?.condition_logic === ''}
                                                                                    dropDownClassName={`text-sm`}
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

                                                                        {showInputValue(conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i].condition_logic, conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i].condition_type, 'choicefield') && (
                                                                            <div className='w-1/3 px-2 '>
                                                                                <div className=''>
                                                                                    <p className='text-sm text-[#2B333B] mb-3 font-semibold'>Value</p>
                                                                                    {conditions[index]?.elseIfBlocks[elseIfIndex].conditions[i].condition_type === 'choiceboxfield' ? (
                                                                                        <InputWithDropDown
                                                                                            label=""
                                                                                            id="value"
                                                                                            top="20px"
                                                                                            placeholder="Select"
                                                                                            className="w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px]"
                                                                                            labeltestID='value-dropdown'
                                                                                            testID={`elseif-value-dropdown-${elseIfIndex}-${index}-${i}`}
                                                                                            selectedOption={conditions[index].elseIfBlocks[elseIfIndex].conditions[i].value}
                                                                                            handleOptionClick={(key) => handleSelectDropdown(key, index, i, 'value', true, elseIfIndex)}
                                                                                            mainIndex={index}
                                                                                            subIndex={i}
                                                                                            isDropdownOpen={conditions[index].elseIfBlocks[elseIfIndex].conditions[i].value_dropdown}
                                                                                            setDropdownOpen={(dropdown) => updateDropdown('value_dropdown', index, i, true, elseIfIndex)}
                                                                                            options={combinedArray?.length > 0 ? combinedArray?.find((item) => item.question_detail === conditions[index]?.elseIfBlocks[elseIfIndex]?.conditions[i]?.question_name)?.choice_values?.map((choice) => choice?.value) : []}
                                                                                        />
                                                                                    ) : (
                                                                                        <InputField
                                                                                            autoComplete='off'
                                                                                            label=''
                                                                                            id='value'
                                                                                            type='text'
                                                                                            value={conditions[index].elseIfBlocks[elseIfIndex].conditions[i].value}
                                                                                            className='w-full'
                                                                                            labelStyle=''
                                                                                            placeholder=''
                                                                                            testId={`elseif-value-input-${elseIfIndex}-${index}-${i}`}
                                                                                            htmlFor=''
                                                                                            maxLength={32}
                                                                                            mainIndex={index}
                                                                                            subIndex={i}
                                                                                            handleChange={(e) => handleInputChange(e, '', '', index, i, true, elseIfIndex, i)}
                                                                                            onInput={conditions[index]?.elseIfBlocks[elseIfIndex]?.conditions[i]?.condition_type === 'dateTimefield' || conditions[index]?.elseIfBlocks[elseIfIndex]?.conditions[i]?.condition_type === 'numberfield' || conditions[index]?.elseIfBlocks[elseIfIndex]?.conditions[i]?.condition_type === 'photofield'}
                                                                                            validationError={submitSelected && conditions[index]?.elseIfBlocks[elseIfIndex]?.conditions[i]?.value === '' && 'This field  is mandatory'}
                                                                                            basicEditor
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                    </div>
                                                                    {elseIfBlock.conditions.length - 1 === i ? (
                                                                        <div className='w-[3%] flex flex-col items-center' data-testid={`AND-${index}`} onClick={() => {
                                                                            handleAddCondition(index, true, elseIfIndex, false, true)
                                                                            handleAdd('AND')
                                                                        }}>
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
                                                                    <div className='p-2 bg-[#ffffff] cursor-pointer rounded-lg w-fit hover:bg-[#EFF1F8]' onClick={() => {
                                                                         if (conditions[index]?.elseIfBlocks[elseIfIndex]?.conditions.length === 1) {
                                                                            handleClearElseIfConditionValues(index, elseIfIndex); // Reset fields if only one condition
                                                                        } else {
                                                                            handleDeleteCondition(index, i, true, elseIfIndex); // Delete condition otherwise
                                                                            handleAdd('OR')
                                                                        }
                                                                    }}>
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
                                        <div className='pt-4 bg-white w-[24.27%] p-3 flex gap-4 rounded-lg'>
                                            <h3 className='text-[#2B333B] font-semibold mt-5 mb-4'>Then</h3>
                                            <div className={`flex flex-col ${condition.elseIfBlocks[elseIfIndex].thenActions[0].status === '' ? '' : 'gap-4'}`}>
                                                <InputWithDropDown
                                                    label='Status'
                                                    labelStyle='font-semibold text-[#2B333B] text-base'
                                                    id='status'
                                                    top='30px'
                                                    placeholder='Select'
                                                    className='w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px]'
                                                    testID={`elseif-status-dropdown-${elseIfIndex}`}
                                                    labeltestID={`status-dropdown-label`}
                                                    selectedOption={condition.elseIfBlocks[elseIfIndex].thenActions[0].status}
                                                    handleOptionClick={(e) => statusDropdownHandler(e, index, elseIfIndex, 'status', 'elseIfIndex')}
                                                    mainIndex={index}
                                                    isDropdownOpen={isStatusDropdownOpen?.[`elseIfBlock-${elseIfIndex}`]}
                                                    setDropdownOpen={() => dropdownHandler('elseIfBlock', elseIfIndex, 'status')}
                                                    options={status}
                                                    dropDownClassName={`text-sm`}
                                                    validationError={submitSelected && condition.elseIfBlocks[elseIfIndex].thenActions[0].status === ''}
                                                    compliance
                                                />
                                                {submitSelected && condition.elseIfBlocks[elseIfIndex].thenActions[0].status === '' && <ErrorMessage error={'This field is mandatory'} />}
                                                {condition.elseIfBlocks[elseIfIndex].thenActions[0].status === 'PASS' && (
                                                    <InputField
                                                        label="Grade"
                                                        className="w-full"
                                                        placeholder="Enter grade"
                                                        value={condition.elseIfBlocks[elseIfIndex].thenActions[0].grade || ''}
                                                        handleChange={(e) => handleThenActionChange(index, 'grade', e.target.value, false, true, elseIfIndex)}
                                                        basicEditor
                                                    />
                                                )}
                                                {condition.elseIfBlocks[elseIfIndex].thenActions[0].status === 'FAIL' && (
                                                    <>
                                                        <InputWithDropDown
                                                            label='Reason'
                                                            labelStyle='font-semibold text-[#2B333B] text-base'
                                                            id='value'
                                                            top='30px'
                                                            placeholder='Select'
                                                            className='w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px]'
                                                            testID={`reason-dropdown`}
                                                            labeltestID={`reason-dropdown-label`}
                                                            selectedOption={condition.elseIfBlocks[elseIfIndex].thenActions[0].value}
                                                            handleOptionClick={(e) => reasonDropdownHandler(e, index, elseIfIndex, 'value', 'elseIfIndex')}
                                                            mainIndex={index}
                                                            isDropdownOpen={isReasonDropdownOpen?.[`elseIfBlock-${elseIfIndex}`]}
                                                            setDropdownOpen={() => dropdownHandler('elseIfBlock', elseIfIndex, 'reason')}
                                                            options={options}
                                                            dropDownClassName={`text-sm`}
                                                            compliance
                                                        />
                                                        <InputField
                                                            label="Action"
                                                            className="w-full"
                                                            testId="elseif-action"
                                                            placeholder="Enter action"
                                                            value={condition.elseIfBlocks[elseIfIndex].thenActions[0].action || ''}
                                                            handleChange={(e) => handleThenActionChange(index, 'action', e.target.value, false, true, elseIfIndex)}
                                                            basicEditor
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className=' items-start'>
                                            <button
                                                className='-right-2 bg-[#EFF1F8] -top-2 p-2 rounded-lg hover:bg-white'
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
                                data-testid="else-if"
                                onClick={() => addElseIf(index)}
                            >
                                + Add Else If
                            </button>
                            <div className='flex gap-3 w-fit'>
                                <div className='pt-4 bg-white p-3 flex flex-row gap-4 rounded-lg w-full'>
                                    <h3 className='text-[#2B333B] font-semibold mt-5 mb-4'>Else</h3>
                                    <div className='flex flex-row gap-4 flex-1'>
                                        <div className='w-full'>
                                            <InputWithDropDown
                                                label='Status'
                                                labelStyle='font-semibold text-[#2B333B] text-base'
                                                id='status'
                                                top='30px'
                                                placeholder='Select'
                                                className={`w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px]`}
                                                testID={`else-status-dropdown`}
                                                labeltestID={`else-status-dropdown-label`}
                                                selectedOption={condition.elseBlock?.status}
                                                handleOptionClick={(e) => statusDropdownHandler(e, index, null, 'status', 'else')}
                                                mainIndex={index}
                                                isDropdownOpen={isStatusDropdownOpen?.[`else-${index}`]}
                                                setDropdownOpen={() => dropdownHandler('else', index, 'status')}
                                                options={status}
                                                dropDownClassName={`text-sm`}
                                                validationError={submitSelected && condition.elseBlock?.status === undefined}
                                                compliance
                                                elseBlockDropdown
                                            />
                                            {submitSelected && condition.elseBlock?.status === undefined && <ErrorMessage error={'This field is mandatory'} />}
                                        </div>

                                        {condition.elseBlock?.status === 'PASS' && (
                                            <InputField
                                                label="Grade"
                                                className="w-full"
                                                testId='else-grade'
                                                placeholder="Enter grade"
                                                value={condition.elseBlock?.grade || ''}
                                                handleChange={(e) => handleThenActionChange(index, 'grade', e.target.value, true)}
                                                basicEditor
                                            />
                                        )}
                                        {condition.elseBlock?.status === 'FAIL' && (
                                            <>
                                                <InputWithDropDown
                                                    label='Reason'
                                                    labelStyle='font-semibold text-[#2B333B] text-base'
                                                    id='value'
                                                    top='30px'
                                                    placeholder='Select'
                                                    className='w-full text-sm cursor-pointer placeholder:text-[#9FACB9] h-[45px]'
                                                    testID={`else-reason-dropdown`}
                                                    labeltestID={`else-reason-dropdown-label`}
                                                    selectedOption={condition.elseBlock?.value}
                                                    handleOptionClick={(e) => reasonDropdownHandler(e, index, null, 'value', 'else')}
                                                    mainIndex={index}
                                                    isDropdownOpen={isReasonDropdownOpen?.[`else-${index}`]}
                                                    setDropdownOpen={() => dropdownHandler('else', index, 'reason')}
                                                    options={options}
                                                    dropDownClassName={`text-sm`}
                                                    compliance
                                                />
                                                <InputField
                                                    label="Action"
                                                    className="w-full"
                                                    testId='else-action'
                                                    placeholder="Enter action"
                                                    value={condition.elseBlock?.action || ''}
                                                    handleChange={(e) => handleThenActionChange(index, 'action', e.target.value, true)}
                                                    basicEditor
                                                />
                                            </>
                                        )}
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
