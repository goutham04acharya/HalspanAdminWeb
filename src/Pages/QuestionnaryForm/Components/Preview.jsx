import React, { useRef, useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import DIsplayContentField from "./Fields/DisplayContent/DIsplayContentField.jsx";
import FloorPlanField from "./Fields/FloorPlan/FloorPlanField.jsx";
import TextBoxField from "./Fields/TextBox/TextBoxField.jsx";
import DateTimeField from "./Fields/DateTime/DateTimeField.jsx";
import GPSField from "./Fields/GPS/GPSField.jsx";
import SignatureField from "./Fields/Signature/SignatureField.jsx";
import FileField from "./Fields/File/FileFIeld.jsx";
import ChoiceBoxField from "./Fields/ChoiceBox/ChoiceBoxField.jsx";
import NumberField from "./Fields/Number/NumberField.jsx";
import AssetLocationField from "./Fields/AssetLocation/AssetLocationField.jsx";
import PhotoField from "./Fields/PhotoField/PhotoFIeld.jsx";
import VideoField from "./Fields/VideoField/VideoField.jsx";
import TagScanField from "./Fields/TagScan/TagScanField.jsx";
import { produce } from "immer";
import { resetFields } from "./defaultContentPreviewSlice.js";
import { useSelector } from "react-redux";
import {
  clearQuestions,
  setQuestionValue,
} from "./previewQuestionnaireValuesSlice.js";
import { clearAllSignatures } from "./Fields/Signature/signatureSlice.js";
import { findSectionAndPageName, getQuestionDataById } from "../../../CommonMethods/SectionPageFinder.js";
import PreviewSummary from "./PreviewSummary.jsx";
import { getFilteredQuestions } from "../../../CommonMethods/filteredQuestions.js";
import { convertTo12Hour, convertTo24Hour } from "../../../CommonMethods/convertHour.js";

function PreviewModal({
  text,
  subText,
  setModalOpen,
  Button1text,
  Button2text,
  src,
  className,
  handleButton1,
  handleButton2,
  button1Style,
  testIDBtn1,
  testIDBtn2,
  isImportLoading,
  showLabel,
  questionnaire_id,
  version_number,
  setValidationErrors,
  validationErrors,
  formDefaultInfo,
  fieldSettingParameters,
  sectionsData,
  sectionDetails,
  questionnaireComplianceLogic,
}) {
  const modalRef = useRef();
  const dispatch = useDispatch();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [value, setValue] = useState({});
  const [isFormatError, setIsFormatError] = useState(false);
  const [totalPagesNavigated, setTotalPagesNavigated] = useState(0);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false); // Add a loading state
  const [conditionalValues, setConditionalValues] = useState({});
  const [complianceLogic, setComplianceLogic] = useState([]);
  const [showComplianceScreen, setShowComplianceScreen] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const previousSectionsRef = useRef();
  const fieldStatus = useSelector(
    (state) => state?.defaultContent?.fieldStatus,
  );
  const questionValue = useSelector(
    (state) => state?.questionValues?.questions,
  );
  // const fieldValues = useSelector(state => state?.fields?.fieldValues);
  const [precomputedNavigation, setPrecomputedNavigation] = useState({
    nextPage: 0,
    nextSection: 0,
    isLastPageInSection: false,
    isLastSection: false,
  });
  const [previewNavigation, setPreviewNavigation] = useState({
    current_page: 1,
    current_section: 1,
    total_pages: 0,
  });
  const handleConditionalLogic = async (data) => {
    let result = {};
    data.forEach((section) => {
      section.pages.forEach((page) => {
        page.questions.forEach((question) => {
          result[question.question_id.replace(/-/g, '_')] = ""; // Assign empty string as value
        });
      });
    });
    return result;
  };

  const updateConditionalValues = async (data) => {
    const result = await handleConditionalLogic(data);
    setConditionalValues(result);
  };
  function formatDateWithOffset(formatteDate, value, question_name) {
    let [day, month, year] = formatteDate.split(`'`)[1].split('/').map(Number);
    let date = new Date(year, month - 1, day + 1 + Number(value)).toISOString().split('T')[0];
    return conditionalValues[question_name.trim()].split(' ')[0] === date;
  }
  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        // Store compliance logic
        setComplianceLogic(questionnaireComplianceLogic || []);
        setSections(sectionDetails?.sections);

        setPreviewNavigation((prev) => ({
          ...prev,
          total_pages: sectionDetails?.sections.reduce(
            (total, section) => total + section.pages.length,
            0,
          ),
        }));
        updateConditionalValues(sectionDetails?.sections);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, [questionnaire_id, version_number, sectionDetails]);
  const evaluateComplianceLogic = () => {

    let results = [];

    function transformTernaryExpression(input) {
      // Regex to match the patterns (handles dynamic values)
      const pattern =
        /\(STATUS\s*=\s*'([^']+)',\s*(?:REASON\s*=\s*'([^']+)',\s*ACTIONS\.push\('([^']+)'\)|GRADE\s*=\s*'([^']+)')\)/g;

      // Replacement function to handle both cases
      return input.replace(pattern, (match, status, reason, action, grade) => {
        if (grade) {
          // Case for PASS with GRADE
          return `{STATUS: '${status}', GRADE: '${grade}'}`;
        } else {
          // Case for FAIL with REASON and ACTIONS
          return `{STATUS: '${status}', REASON: '${reason}', ACTIONS: ['${action}']}`;
        }
      });
    }
    const preprocessLogic = (logic) => {
      if (logic?.includes("if")) {
        logic = logic?.replace("if", "");
      }

      // Replace occurrences of getDay() comparisons with string days
      if (logic?.includes("getDay()")) {
        const daysMap = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };

        logic = logic?.replace(
          /getDay\(\)\s*(===|!==)\s*"(.*?)"/g,
          (match, operator, day) => {
            return `getDay() ${operator} ${daysMap[day] ?? `"${day}"`}`;
          },
        );
      }

      // Wrap new Date() for any necessary processing (can be extended if required)
      if (logic?.includes('new Date()')) {
        try {
          // Replace 'new Date()' with epoch value in seconds
          let updatedLogic = logic?.replace(
            /new Date\(\)/g,
            `(new Date().toISOString().split('T')[0])`
          );
          logic = updatedLogic
        } catch (error) {
          console.error("Error evaluating new Date logic:", error);
          throw error; // Re-throw the error for handling
        }
      }

      //handle Multi-choice
      const arrayMultiChoiceId = [];
      // Loop through all properties in questionValue
      Object.entries(questionValue).forEach(([key, value]) => {
        // Check if the value is an array
        if (Array.isArray(value)) {
          if (logic?.includes(key.replace(/-/g, "_"))) {
            arrayMultiChoiceId.push(key.replace(/-/g, "_"));
          }
        }
      });

      //handle Multi-choice
      if ((logic?.includes("===") || logic?.includes("!==")) && arrayMultiChoiceId.length > 0) {

        logic = logic.replace(
          /([a-zA-Z_][\w.?]*(?:\.(?:toUpperCase|toLowerCase|trim)\(\))*)\s*(===|!==)\s*['"]([^'"]*)['"]/g,
          (match, path, operator, value) => {
            if (arrayMultiChoiceId.includes(path.replace(/\..*/, ""))) {
              // Handle method calls separately
              let methodCall = "";
              if (path.match(/(\.(toUpperCase|toLowerCase|trim)\(\))+$/)) {
                methodCall = path.match(
                  /(\.(toUpperCase|toLowerCase|trim)\(\))+$/,
                )[0];
                path = path.replace(
                  /(\.(toUpperCase|toLowerCase|trim)\(\))+$/,
                  "",
                );
              }
              try {
                let questionArray = eval(path);
                if (Array.isArray(questionArray) && questionArray.length === 1) {
                  // Add back method call if it existed
                  return `${path}[0]${methodCall} ${operator} "${value}"`;
                } else {
                  return `${path}[-1] ${operator} "${value}"`;
                }
              } catch (e) {
                return match;
              }
            } else {
              return match;
            }
          }
        );
      }

      const regex = /(\w+)\.(getFullYear|getMonth|getDate|getDay|getHours|getMinutes|getSeconds|getMilliseconds|getTime)\(\)/g;

      logic = logic.replace(regex, (match, variable, functionName) => {
        const evaluatedVariable = eval(variable)

        if (evaluatedVariable.includes(':') && (evaluatedVariable.includes('-') || evaluatedVariable.includes('/'))) {
          if (["getHours", "getMinutes", "getSeconds", "getMilliseconds", "getTime"].includes(functionName)) {
            if (evaluatedVariable.includes("AM") || evaluatedVariable.includes("PM")) {
              if (functionName === "getTime") {
                return `(new Date("1970-01-01 " + ${variable}.replace(/^([\\d/.-]+)\\s+/, ''))).toTimeString().slice(0,8)`
              }
              return `new Date("1970-01-01 " + ${variable}.replace(/^([\\d/.-]+)\\s+/, '')).${functionName}()`;
            } else {
              if (functionName === "getTime") {
                return `(new Date("1970-01-01T" + ${variable}.replace(/^([\\d/.-]+)\\s+/, ''))).toTimeString().slice(0,8)`
              }
              return `new Date("1970-01-01T" + ${variable}.replace(/^([\\d/.-]+)\\s+/, '')).${functionName}()`;
            }
          } else {
            return `new Date(${variable}.replace(/\\s+[\\d:]+\\s*[APM]*$/, '').replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).${functionName}()`;
          }
        } else {
          if (["getHours", "getMinutes", "getSeconds", "getMilliseconds", "getTime"].includes(functionName)) {
            if (evaluatedVariable.includes("AM") || evaluatedVariable.includes("PM")) {
              if (functionName === "getTime") {
                return `new Date("1970-01-01 " + ${variable}).toTimeString().slice(0,8)`
              }
              return `new Date("1970-01-01 " + ${variable}).${functionName}()`;
            } else {
              if (functionName === "getTime") {
                return `new Date("1970-01-01T" + ${variable}).toTimeString().slice(0,8)`
              }
              return `new Date("1970-01-01T" + ${variable}).${functionName}()`;
            }
          } else {
            return `new Date(${variable}.replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).${functionName}()`;
          }
        }
      });

      logic = logic.replace(/\.getMonth\(\)/g, ".getMonth()+1");

      // Replace `AddDays` with the new Date handling for addition and format as dd/mm/yyyy
      logic = logic.replaceAll(
        /(\w+)\.AddDays\((\d+)\)/g,
        (match, p1, p2) => {
          const evaluatedVariable = eval(p1)
          if (evaluatedVariable.includes(':') && (evaluatedVariable.includes('-') || evaluatedVariable.includes('/'))) {
            return `(new Date(new Date(${p1}.replace(/\\s+[\\d:]+\\s*[APM]*$/, '').replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$3-$2-$1')).getTime() + (${p2} * 86400000))).toLocaleDateString("en-GB")`;
          } else {
            return `(new Date(new Date(${p1}.replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).getTime() + (${p2} * 86400000))).toLocaleDateString("en-GB")`;
          }
        }
      );


      // Replace `SubtractDays` with the new Date handling for subtraction and format as dd/mm/yyyy
      logic = logic.replaceAll(
        /(\w+)\.SubtractDays\((\d+)\)/g,
        (match, p1, p2) => {
          const evaluatedVariable = eval(p1)
          if (evaluatedVariable.includes(':') && (evaluatedVariable.includes('-') || evaluatedVariable.includes('/'))) {
            return `(new Date(new Date(${p1}.replace(/\\s+[\\d:]+\\s*[APM]*$/, '').replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$3-$2-$1')).getTime() - (${p2} * 86400000))).toLocaleDateString("en-GB")`;
          } else {
            return `(new Date(new Date(${p1}.replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).getTime() - (${p2} * 86400000))).toLocaleDateString("en-GB")`;
          }
        }
      );
      return logic;
    };
    results = complianceLogic.map((rule) => {
      let evaluationResult = {
        STATUS: "",
        REASON: "",
        ACTIONS: [],
        GRADE: "",
      };

      try {
        // Preprocess the rule's default_content
        let processedContent = preprocessLogic(rule?.default_content);
        processedContent = processedContent?.replace("if", "");
        // Define variables that will be set in eval
        let STATUS = "";
        let REASON = "";
        let ACTIONS = [];
        let GRADE = "";
        if (processedContent.includes('formatDateWithOffset(')) {
          let match = processedContent.match(/formatDateWithOffset\(([^)]+)\)/);
          if (match) {
            let args = match[1].split(',');
            let formattedDate = formatDateWithOffset(args[0].trim(), args[1].trim(), args[2].trim());
            // Replace only the function call with its result
            processedContent = processedContent.replace(match[0], formattedDate);
          }
        }

        while (processedContent.includes('formatDateWithOffset(')) {
          let match = processedContent.match(/formatDateWithOffset\(([^)]+)\)/);
          if (!match) break; // Exit if no more matches
          
          let args = match[1].split(',');
          let formattedDate = formatDateWithOffset(args[0].trim(), args[1].trim(), args[2].trim());
          
          // Replace only the current function call with its result
          processedContent = processedContent.replace(match[0], formattedDate);
        }

        // Evaluate the processed logic
        eval(processedContent);

        // Store the results
        evaluationResult = { STATUS, REASON, ACTIONS, GRADE };

        return {
          label: rule?.label,
          ...evaluationResult,
          conditionMet: STATUS === "Pass",
        };
      } catch (error) {
        console.error("Error while evaluating:", error);
        return {
          label: rule?.label,
          STATUS: "Error",
          REASON: error.message,
          ACTIONS: [],
          GRADE: "",
          conditionMet: false,
        };
      }
    });
    return results;
  };

  // Initial State: Exclude sections with non-empty `section_conditional_logic`
  const initialAllPages = sections
    .filter(
      (section) =>
        !section?.section_conditional_logic ||
        section?.section_conditional_logic.trim() === "",
    )
    .filter((section) => {
      if (section?.section_conditional_logic) {
        try {
          // Evaluate the section's conditional logic
          return eval(section?.section_conditional_logic);
        } catch (err) {
          console.error("Error evaluating section conditional logic:", err);
          return false; // Exclude the section if evaluation fails
        }
      }
      return true; // Include sections without conditional logic
    })
    .flatMap((section) =>
      section.pages.map((page) => ({
        page_name: page?.page_name,
        page_id: page?.page_id,
      })),
    );

  // Dynamically evaluate `section_conditional_logic` and update pages
  const getEvaluatedAllPages = () => {
    // Filter sections based on conditional logic
    const filteredSections = sections.filter((section) => {
      if (!section?.section_conditional_logic) {
        return true; // Include sections without conditional logic
      }
      try {
        // Evaluate the section's conditional logic
        return eval(section.section_conditional_logic);
      } catch (err) {
        console.error("Error evaluating section conditional logic:", err);
        return false; // Exclude the section if evaluation fails
      }
    });

    return filteredSections.flatMap((section) =>
      (section?.pages || [])
        .filter((page) => page?.questions && page.questions.length > 0)
        .map((page) => ({
          page_name: page?.page_name,
          page_id: page?.page_id,
        }))
    );
  };

  // Simulate user interaction or dynamic evaluation
  const allPages = getEvaluatedAllPages();

  const validateFormat = (value, format, regex) => {
    const formatValidators = {
      "Alpha": /^[a-zA-Z]+$/,
      "Alphanumeric": /^[a-zA-Z0-9]+$/,
      "Numeric": /^[0-9]+$/,
      "Custom Regular Expression": new RegExp(regex)
    };
    return formatValidators[format]
      ? formatValidators[format].test(value)
      : true;
  };

  const evaluateLogic = (logic) => {
    try {
      if (logic?.includes("new Date(")) {
        return eval(logic);
      } else if (logic?.includes("getMonth(")) {
        const replacedLogic = logic?.replace("getMonth()", "getMonth() + 1");
        return eval(replacedLogic);
      } else if (logic?.includes("getDay()")) {
        const daysMap = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };
        const replacedLogic = logic?.replace(
          /getDay\(\)\s*(===|!==)\s*"(.*?)"/g,
          (match, operator, day) =>
            `getDay() ${operator} ${daysMap[day] ?? '"${day}"'}`,
        );
        return eval(replacedLogic);
      } else if (logic.includes('formatDateWithOffset')) {
        const spitedValue = logic.split('(')[1].split(')')[0].split(',');
        return formatDateWithOffset(spitedValue[0], spitedValue[1], spitedValue[2])
      } else {
        return eval(logic);
      }
    } catch (error) {
      console.error("Error evaluating conditional logic:", error);
      return false;
    }
  };

  const isPageVisible = (sectionIndex, pageIndex) => {
    const pageData = sections[sectionIndex]?.pages[pageIndex];
    const pageConditionalLogic = pageData?.page_conditional_logic;

    if (pageConditionalLogic) {
      return evaluateLogic(pageConditionalLogic);
    }
    return true; // Default to true if no conditional logic exists
  };

  const isSectionVisible = (sectionIndex) => {
    const sectionData = sections?.[sectionIndex];
    const sectionConditionalLogic = sectionData?.section_conditional_logic;

    if (sectionConditionalLogic) {
      return evaluateLogic(sectionConditionalLogic);
    }
    return true; // Default to true if no conditional logic exists
  };
  const handleDisplayField = (selectedQuestion, selectedSections) => {
    // Early return if selectedQuestion is undefined or null
    if (!selectedQuestion) return;

    const { question_id } = selectedQuestion;
    const { section_name, page_name, label } = findSectionAndPageName(
      selectedSections,
      question_id
    );

    if (!section_name || !page_name || !label) {
      console.error("Missing section_name, page_name, or label");
      return;
    }

    // Use object lookup instead of switch statement
    const displayTypeMap = {
      heading: 'heading',
      text: 'text',
      image: 'image',
      url: 'url.value'
    };

    const typePath = displayTypeMap[selectedQuestion.type];

    // If type is not in the map, use empty string
    let newValue = '';

    if (typePath) {
      // Handle nested path for url.value
      const displayType = selectedQuestion.display_type || {};
      if (typePath.includes('.')) {
        const [obj, prop] = typePath.split('.');
        newValue = displayType[obj]?.[prop] || '';
      } else {
        newValue = displayType[typePath] || '';
      }
    }

    // Update state with normalized question_id
    const normalizedId = question_id.replace(/-/g, '_');
    setConditionalValues(prevValues => ({
      ...prevValues,
      [normalizedId]: newValue
    }));
  };
  const computeNextNavigation = () => {
    let nextPage = currentPage + 1;
    let nextSection = currentSection;
    let isLastPageInSection = false;
    let isLastSection = false;

    // Find the next visible page in the current section
    while (
      nextPage < sections?.[currentSection]?.pages.length &&
      !isPageVisible(currentSection, nextPage)
    ) {
      nextPage++;
    }

    // If no visible pages in current section, move to the next section
    if (nextPage >= sections?.[currentSection]?.pages.length) {
      nextPage = 0; // Reset page index
      nextSection++; // Move to the next section

      // Skip over any invisible sections
      while (nextSection < sections?.length && !isSectionVisible(nextSection)) {
        nextSection++;
      }

      // Check if we've exhausted all sections
      if (nextSection > sections?.length) {
        // No more sections available
        isLastSection = true;
        nextSection = currentSection;
        nextPage = currentPage;
      } else {
        // Find first visible page in the next visible section
        while (
          nextPage < sections?.[nextSection]?.pages.length &&
          !isPageVisible(nextSection, nextPage)
        ) {
          nextPage++;
        }

        // If no visible pages in the next section
        if (nextPage >= sections?.[nextSection]?.pages.length) {
          // Continue searching for the next valid section and page
          const findNextValidNavigation = () => {
            let searchSection = nextSection + 1;

            // Continue searching through remaining sections
            while (searchSection < sections.length) {
              // Skip invisible sections
              if (!isSectionVisible(searchSection)) {
                searchSection++;
                continue;
              }

              // Find first visible page in this section
              let searchPage = 0;
              while (
                searchPage < sections?.[searchSection]?.pages.length &&
                !isPageVisible(searchSection, searchPage)
              ) {
                searchPage++;
              }

              // If found a valid page, return it
              if (searchPage < sections?.[searchSection]?.pages.length) {
                return {
                  nextSection: searchSection,
                  nextPage: searchPage,
                  isLastSection: false,
                };
              }

              // Move to next section
              searchSection++;
            }

            // No more valid sections found
            return {
              nextSection: currentSection,
              nextPage: currentPage,
              isLastSection: true,
            };
          };

          // Update navigation with found valid section/page
          const validNavigation = findNextValidNavigation();
          nextSection = validNavigation?.nextSection;
          nextPage = validNavigation?.nextPage;
          isLastSection = validNavigation?.isLastSection;
        }
      }
    } else {
      // Still within the current section
      isLastPageInSection =
        nextPage === sections?.[currentSection]?.pages.length - 1;
    }

    if (!sections[nextSection]) {
      isLastSection = true;
    }

    // Update state with precomputed navigation
    setPrecomputedNavigation({
      nextPage,
      nextSection,
      isLastPageInSection,
      isLastSection,
    });
  };
  // useEffect to evaluate conditional logic dynamically
  useEffect(() => {
    // Call the computeNextNavigation only if the page is validated
    computeNextNavigation();
  }, [sections, currentSection, currentPage, value]);
  const handleNextClick = () => {
    // Reset previous validation errors before proceeding
    setValidationErrors({});

    // Function to validate mandatory fields
    const validateMandatoryFields = () => {
      const errors = sections[currentSection]?.pages[
        currentPage
      ]?.questions.reduce((acc, question) => {
        const isVisible = isPageVisible(currentSection, currentPage); // Check if the page is visible
        if (isVisible) {
          // Check if the question is visible
          if (
            question?.conditional_logic &&
            !evaluateLogic(question?.conditional_logic)
          ) {
            return acc; // Skip hidden questions
          }

          if (question?.options?.read_only) {
            return acc;
          }

          if (!question?.options?.visible) {
            return acc;
          }

          // Initialize the field error accumulator for each component type
          if (!acc[`preview_${question?.component_type}`]) {
            acc[`preview_${question?.component_type}`] = {}; // Create an empty object for each component type
          }

          // Validate based on component type
          switch (question?.component_type) {
            case "textboxfield":
              if (!question?.options?.optional) {
                if (
                  value[question?.question_id] === "" ||
                  value[question?.question_id] === undefined
                ) {
                  acc.preview_textboxfield[question.question_id] =
                    "This is a mandatory field";
                } else if (
                  question.format_error &&
                  !validateFormat(
                    value[question.question_id],
                    question.format,
                    question.regular_expression,
                  )
                ) {
                  acc.preview_textboxfield[question.question_id] =
                    question.format_error;
                }
              }
              break;
            case "displayfield":
              handleDisplayField(question, sections[currentSection]);
              break;
            case "choiceboxfield":
              if (!question?.options?.optional) {
                if (
                  value[question?.question_id] === "" ||
                  value[question?.question_id] === undefined
                ) {
                  acc.preview_choiceboxfield[question.question_id] =
                    "This is a mandatory field";
                }
              }
              break;

            case "numberfield":
              if (!question?.options?.optional) {
                if (
                  questionValue?.[question?.question_id] === "" ||
                  questionValue?.[question?.question_id] === undefined
                ) {
                  acc.preview_numberfield[question.question_id] =
                    "This is a mandatory field";
                }
              }
              break;

            case "dateTimefield":
              if (!question?.options?.optional) {
                if (question?.type === "datetime") {
                  if (
                    questionValue?.[question?.question_id] === "" ||
                    questionValue?.[question?.question_id] === undefined ||
                    questionValue?.[question?.question_id]?.split(" ")
                      ?.length === 1
                  ) {
                    acc.preview_datetimefield = acc.preview_datetimefield || {};
                    acc.preview_datetimefield[question?.question_id] =
                      "This is a mandatory field";
                  }
                } else {
                  if (
                    questionValue?.[question?.question_id] === "" ||
                    questionValue?.[question?.question_id] === undefined
                  ) {
                    acc.preview_datetimefield = acc.preview_datetimefield || {};
                    acc.preview_datetimefield[question?.question_id] =
                      "This is a mandatory field";
                  }
                }
              }
              break;

            case "photofield":
              if (!question?.options?.optional) {
                if (
                  value[question?.question_id] === false ||
                  value[question?.question_id] === undefined ||
                  questionValue[question?.question_id].length === 0
                ) {
                  acc.preview_photofield[question?.question_id] =
                    "This is a mandatory field";
                } else if (
                  questionValue[question?.question_id].length <
                  question?.field_range?.min
                ) {
                  acc.preview_photofield[question.question_id] =
                    `Upload minimum of ${question?.field_range?.min} images`;
                }
              }
              break;

            case "filefield":
              if (!question?.options?.optional) {
                if (
                  questionValue?.[question?.question_id]?.length === 0 ||
                  !questionValue?.[question?.question_id]
                ) {
                  acc.preview_filefield[question.question_id] =
                    "This is a mandatory field";
                } else if (
                  questionValue[question?.question_id].length <
                  question?.field_range?.min
                ) {
                  acc.preview_filefield[question.question_id] =
                    `Upload minimum of ${question?.field_range?.min} files`;
                }
              }
              break;

            case "videofield":
              if (!question?.options?.optional) {
                if (
                  questionValue?.[question?.question_id]?.length === 0 ||
                  !questionValue?.[question?.question_id]
                ) {
                  acc.preview_videofield[question.question_id] =
                    "This is a mandatory field";
                } else if (
                  questionValue[question?.question_id].length <
                  question?.field_range?.min
                ) {
                  acc.preview_videofield[question.question_id] =
                    `Upload minimum of ${question?.field_range?.min} videos`;
                }
              }
              break;

            case "gpsfield":
              if (
                !question?.options?.optional &&
                (questionValue[question?.question_id] === false ||
                  questionValue[question?.question_id] === undefined)
              ) {
                acc.preview_gpsfield[question.question_id] =
                  "This is a mandatory field";
              }
              break;

            default:
              break;
          }
        }
        return acc;
      }, {});

      return errors;
    };

    // Get the errors after validating
    const errors = validateMandatoryFields();

    // If there are validation errors, update the state and return early
    if (Object.keys(errors).length > 0) {
      const filteredErrors = {};

      // Loop through errors and keep only those with actual error messages (non-empty objects)
      Object.keys(errors).forEach((key) => {
        if (Object.keys(errors[key]).length > 0) {
          filteredErrors[key] = errors[key];
        }
      });

      // If there are any filtered errors (i.e., non-empty error objects), set validation errors
      if (Object.keys(filteredErrors).length > 0) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          ...filteredErrors, // Merge the filtered errors into the existing validation errors
        }));
        return; // Don't proceed to next page or section if there are errors
      }
    }

    // Get precomputed navigation details for next page/section
    const { nextPage, nextSection, isLastPageInSection, isLastSection } =
      precomputedNavigation;
    if (isLastSection)
      if (isLastSection) {
        setShowComplianceScreen(true); // Show compliance screen if it's the last section
        return;
      }

    // Move to the next section or page
    if (nextSection !== currentSection) {
      setCurrentSection(nextSection);
      setCurrentPage(nextPage);
    } else {
      setCurrentPage(nextPage);
    }
    setPreviewNavigation((prev) => ({
      ...prev,
      current_page: previewNavigation?.current_page + 1,
    }));
    setTotalPagesNavigated(totalPagesNavigated + nextSection);
  };
  const handleBackClick = () => {
    // If on compliance screen, return to last page
    if (showComplianceScreen) {
      setShowComplianceScreen(false);
      setIsLastPage(false);
      return;
    }

    const evaluateLogic = (logic) => {
      try {
        if (logic?.includes("new Date(")) {
          return eval(logic);
        } else if (logic?.includes("getMonth(")) {
          const replacedLogic = logic?.replace("getMonth()", "getMonth() + 1");
          return eval(replacedLogic);
        } else if (logic?.includes("getDay()")) {
          const daysMap = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
          };
          const replacedLogic = logic?.replace(
            /getDay\(\)\s*(===|!==)\s*"(.*?)"/g,
            (match, operator, day) =>
              `getDay() ${operator} ${daysMap[day] ?? `"${day}"`}`,
          );
          return eval(replacedLogic);
        } else {
          return eval(logic);
        }
      } catch (error) {
        console.error("Error evaluating conditional logic:", error);
        return false;
      }
    };

    const isPageVisible = (sectionIndex, pageIndex) => {
      const pageData = sections?.[sectionIndex]?.pages[pageIndex];
      const pageConditionalLogic = pageData?.page_conditional_logic;

      if (pageConditionalLogic) {
        return evaluateLogic(pageConditionalLogic);
      }
      return true; // Default to true if no conditional logic exists
    };

    const isSectionVisible = (sectionIndex) => {
      const sectionData = sections?.[sectionIndex];
      const sectionConditionalLogic = sectionData?.section_conditional_logic;

      if (sectionConditionalLogic) {
        return evaluateLogic(sectionConditionalLogic);
      }
      return true; // Default to true if no conditional logic exists
    };

    const computeBackNavigation = () => {
      let previousPage = currentPage - 1;
      let previousSection = currentSection;

      // First, try to find a visible page in the current section
      while (
        previousPage >= 0 &&
        !isPageVisible(currentSection, previousPage)
      ) {
        previousPage--;
      }

      // If no visible pages in current section, move to previous section
      if (previousPage < 0) {
        previousSection--;

        // Skip invisible sections
        while (previousSection >= 0 && !isSectionVisible(previousSection)) {
          previousSection--;
        }

        // If a valid previous section is found
        if (previousSection >= 0) {
          // Find the last visible page in the previous section
          previousPage = sections?.[previousSection]?.pages.length - 1;
          while (
            previousPage >= 0 &&
            !isPageVisible(previousSection, previousPage)
          ) {
            previousPage--;
          }

          // If no visible pages found in the previous section
          if (previousPage < 0) {
            // Continue searching backwards through sections
            while (previousSection >= 0) {
              previousSection--;
              if (previousSection >= 0 && isSectionVisible(previousSection)) {
                previousPage = sections?.[previousSection]?.pages.length - 1;
                while (
                  previousPage >= 0 &&
                  !isPageVisible(previousSection, previousPage)
                ) {
                  previousPage--;
                }

                if (previousPage >= 0) {
                  break;
                }
              }
            }
          }
        }
      }

      // Determine if this is the first section and page
      const isFirstSection = previousSection === 0;
      const isFirstPageInSection = previousPage === 0;

      return {
        previousSection: previousSection >= 0 ? previousSection : 0,
        previousPage: previousPage >= 0 ? previousPage : 0,
        isFirstSection,
        isFirstPageInSection,
      };
    };

    // Compute back navigation
    const {
      previousSection,
      previousPage,
      isFirstSection,
      isFirstPageInSection,
    } = computeBackNavigation();

    // Decrement total pages navigated
    setTotalPagesNavigated(totalPagesNavigated - currentSection);

    // Update current section and page
    if (previousSection !== currentSection) {
      setCurrentSection(previousSection);
      setCurrentPage(previousPage);
    } else {
      setCurrentPage(previousPage);
    }
    setPreviewNavigation((prev) => ({
      ...prev,
      current_page: previewNavigation.current_page - 1,
    }));

    // Reset any section or page-specific states if needed
    // For example, clearing validation errors for the previous page
    setValidationErrors({});
  };

  const renderQuestion = (question) => {
    switch (question?.component_type) {
      case "textboxfield":
        return (
          <TextBoxField
            sections={sections[currentSection]}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            question={question}
            preview
            setConditionalValues={setConditionalValues}
            conditionalValues={setConditionalValues}
            setIsFormatError={setIsFormatError}
            question_id={question?.question_id}
            testId="preview"
            setValue={setValue}
            values={value[question?.question_id]}
            setIsModified={setIsModified}
            isModified={isModified}
            handleChange={""}
          />
        );
      case "displayfield":
        return (
          <DIsplayContentField
            preview
            setValidationErrors={setValidationErrors}
            question={question}
            validationErrors={validationErrors}
          />
        );
      case "gpsfield":
        return (
          <GPSField
            preview
            setValidationErrors={setValidationErrors}
            setValue={setValue}
            question={question}
            validationErrors={validationErrors}
          />
        );
      case "signaturefield":
        return (
          <SignatureField
            preview
            choiceValue={value[question?.question_id]}
            setValue={setValue}
            setValidationErrors={setValidationErrors}
            question={question}
            validationErrors={validationErrors}
            setConditionalValues={setConditionalValues}
            question_id={question?.question_id}

          />
        );
      case "filefield":
        return (
          <FileField
            preview
            sections={sections[currentSection]}
            setConditionalValues={setConditionalValues}
            conditionalValues={conditionalValues}
            setValue={setValue}
            value={value}
            setValidationErrors={setValidationErrors}
            question={question}
            validationErrors={validationErrors}
            setIsModified={setIsModified}
            isModified={isModified}
          />
        );
      case "choiceboxfield":
        return (
          <ChoiceBoxField
            sections={sections[currentSection]}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            question={question}
            preview
            setConditionalValues={setConditionalValues}
            conditionalValues={conditionalValues}
            setIsFormatError={setIsFormatError}
            question_id={question?.question_id}
            testId="preview"
            setValue={setValue}
            choiceValue={value[question?.question_id]}
            fieldSettingParameters={question}
            setIsModified={setIsModified}
            isModified={isModified}
          />
        );
      case "dateTimefield":
        return (
          <DateTimeField
            preview
            sections={sections[currentSection]}
            setConditionalValues={setConditionalValues}
            conditionalValues={conditionalValues}
            setValue={setValue}
            dateValue={value}
            setValidationErrors={setValidationErrors}
            validationErrors={validationErrors}
            helpText={question?.help_text}
            question={question}
            fieldSettingParameters={question}
            label={question?.label}
            place
            type={question?.type}
            handleChange={""}
            setIsModified={setIsModified}
            isModified={isModified}
          />
        );
      case "numberfield":
        return (
          <NumberField
            preview
            sections={sections[currentSection]}
            setConditionalValues={setConditionalValues}
            conditionalValues={conditionalValues}
            setValue={setValue}
            setValidationErrors={setValidationErrors}
            fieldValue={value[question?.question_id]}
            question={question}
            validationErrors={validationErrors}
            setIsModified={setIsModified}
            isModified={isModified}
          />
        );
      case "assetLocationfield":
        return (
          <AssetLocationField
            preview
            sections={sections[currentSection]}
            setConditionalValues={setConditionalValues}
            conditionalValues={conditionalValues}
            setValidationErrors={setValidationErrors}
            question={question}
            validationErrors={validationErrors}
          />
        );
      case "floorPlanfield":
        return (
          <FloorPlanField
            preview
            setValidationErrors={setValidationErrors}
            setValue={setValue}
            question={question}
            validationErrors={validationErrors}
          />
        );
      case "photofield":
        return (
          <PhotoField
            preview
            sections={sections[currentSection]}
            setConditionalValues={setConditionalValues}
            conditionalValues={conditionalValues}
            setValue={setValue}
            photoValue={value}
            setValidationErrors={setValidationErrors}
            question={question}
            validationErrors={validationErrors}
            setIsModified={setIsModified}
            isModified={isModified}
          />
        );
      case "videofield":
        return (
          <VideoField
            preview
            sections={sections[currentSection]}
            setConditionalValues={setConditionalValues}
            conditionalValues={conditionalValues}
            setValue={setValue}
            photoValue={value}
            setValidationErrors={setValidationErrors}
            question={question}
            validationErrors={validationErrors}
            isModified={isModified}
          />
        );
      case "tagScanfield":
        return (
          <TagScanField
            preview
            setValue={setValue}
            photoValue={value}
            setValidationErrors={setValidationErrors}
            question={question}
            validationErrors={validationErrors}
          />
        );
      default:
        return <p>Unknown Field</p>;
    }
  };

  Object.entries(conditionalValues).forEach(([key, value]) => {
    window[key] = value;
  });

  useEffect(() => {
    sections.forEach((section) => {
      section?.pages?.forEach((page) => {
        page?.questions?.forEach((question) => {
          let { default_conditional_logic, default_content, component_type } =
            question;
          // Check if default_conditional_logic is not empty
          if (!fieldStatus?.[question?.question_id]) {
            if (default_conditional_logic) {
              try {
                default_conditional_logic = default_conditional_logic.replaceAll(
                  /(\w+)\.AddDays\((\d+)\)/g,
                  (match, p1, p2) => {
                    const evaluatedVariable = eval(p1)
                    if (evaluatedVariable.includes(':') && (evaluatedVariable.includes('-') || evaluatedVariable.includes('/'))) {
                      return `(new Date(new Date(${p1}.replace(/\\s+[\\d:]+\\s*[APM]*$/, '').replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$3-$2-$1')).getTime() + (${p2} * 86400000))).toLocaleDateString("en-GB")`;
                    } else {
                      return `(new Date(new Date(${p1}.replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).getTime() + (${p2} * 86400000))).toLocaleDateString("en-GB")`;
                    }
                  }
                );

                // Replace `SubtractDays` with the new Date handling for subtraction and format as dd/mm/yyyy
                default_conditional_logic = default_conditional_logic.replaceAll(
                  /(\w+)\.SubtractDays\((\d+)\)/g,
                  (match, p1, p2) => {
                    const evaluatedVariable = eval(p1)
                    if (evaluatedVariable.includes(':') && (evaluatedVariable.includes('-') || evaluatedVariable.includes('/'))) {
                      return `(new Date(new Date(${p1}.replace(/\\s+[\\d:]+\\s*[APM]*$/, '').replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$3-$2-$1')).getTime() - (${p2} * 86400000))).toLocaleDateString("en-GB")`;
                    } else {
                      return `(new Date(new Date(${p1}.replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).getTime() - (${p2} * 86400000))).toLocaleDateString("en-GB")`;
                    }
                  }
                );

                if (default_conditional_logic.includes('getDay()')) {
                  const daysMap = {
                    Sunday: 0,
                    Monday: 1,
                    Tuesday: 2,
                    Wednesday: 3,
                    Thursday: 4,
                    Friday: 5,
                    Saturday: 6,
                  };
                  // Replace day names with corresponding numeric values
                  const replacedLogic = default_conditional_logic.replace(
                    /getDay\(\)\s*(===|!==)\s*"(.*?)"/g,
                    (match, operator, day) => {
                      return `getDay() ${operator} ${daysMap[day] ?? `"${day}"`
                        }`;
                    },
                  );

                  // Remove parentheses from around the entire string, if they exist
                  default_conditional_logic = replacedLogic?.replace(
                    /^\((.*)\)$/,
                    "$1",
                  );
                }

                if (['getFullYear', 'getMonth', 'getDate', 'getDay', 'getHours', 'getMinutes', 'getSeconds', 'getMilliseconds', 'getTime']
                  .some(fn => default_conditional_logic?.includes(fn))) {

                  const regex = /(\w+)\.(getFullYear|getMonth|getDate|getDay|getHours|getMinutes|getSeconds|getMilliseconds|getTime)\(\)/g;

                  default_conditional_logic = default_conditional_logic.replace(regex, (match, variable, functionName) => {
                    const evaluatedVariable = eval(variable)

                    if (evaluatedVariable.includes(':') && (evaluatedVariable.includes('-') || evaluatedVariable.includes('/'))) {
                      if (["getHours", "getMinutes", "getSeconds", "getMilliseconds", "getTime"].includes(functionName)) {
                        if (evaluatedVariable.includes("AM") || evaluatedVariable.includes("PM")) {
                          if (functionName === "getTime") {
                            return `(new Date("1970-01-01 " + ${variable}.replace(/^([\\d/.-]+)\\s+/, ''))).toTimeString().slice(0,8)`
                          }
                          return `new Date("1970-01-01 " + ${variable}.replace(/^([\\d/.-]+)\\s+/, '')).${functionName}()`;
                        } else {
                          if (functionName === "getTime") {
                            return `(new Date("1970-01-01T" + ${variable}.replace(/^([\\d/.-]+)\\s+/, ''))).toTimeString().slice(0,8)`
                          }
                          return `new Date("1970-01-01T" + ${variable}.replace(/^([\\d/.-]+)\\s+/, '')).${functionName}()`;
                        }
                      } else {
                        return `new Date(${variable}.replace(/\\s+[\\d:]+\\s*[APM]*$/, '').replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).${functionName}()`;
                      }
                    } else {
                      if (["getHours", "getMinutes", "getSeconds", "getMilliseconds", "getTime"].includes(functionName)) {
                        if (evaluatedVariable.includes("AM") || evaluatedVariable.includes("PM")) {
                          if (functionName === "getTime") {
                            return `new Date("1970-01-01 " + ${variable}).toTimeString().slice(0,8)`
                          }
                          return `new Date("1970-01-01 " + ${variable}).${functionName}()`;
                        } else {
                          if (functionName === "getTime") {
                            return `new Date("1970-01-01T" + ${variable}).toTimeString().slice(0,8)`
                          }
                          return `new Date("1970-01-01T" + ${variable}).${functionName}()`;
                        }
                      } else {
                        return `new Date(${variable}.replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).${functionName}()`;
                      }
                    }
                  });
                }

                default_conditional_logic = default_conditional_logic.replace(/\.getMonth\(\)/g, ".getMonth()+1");

                let logic = default_conditional_logic;
                const arrayMultiChoiceId = [];
                // Loop through all properties in questionValue
                Object.entries(questionValue).forEach(([key, value]) => {
                  // Check if the value is an array
                  if (Array.isArray(value)) {
                    if (logic?.includes(key.replace(/-/g, "_"))) {
                      arrayMultiChoiceId.push(key.replace(/-/g, "_"));
                    }
                  }
                });
                //handle Multi-choice
                if ((logic?.includes("===") || logic?.includes("!==") || logic?.includes("==") || logic?.includes("!=")) && arrayMultiChoiceId.length > 0) {
                  logic = logic.replace(
                    /([a-zA-Z_][\w.?]*(?:\.(?:toUpperCase|toLowerCase|trim)\(\))*)\s*(===|==|!=|!==)\s*['"]([^'"]*)['"]/g,
                    (match, path, operator, value) => {
                      if (arrayMultiChoiceId.includes(path.replace(/\..*/, ""))) {
                        // Handle method calls separately
                        let methodCall = "";
                        if (path.match(/(\.(toUpperCase|toLowerCase|trim)\(\))+$/)) {
                          methodCall = path.match(
                            /(\.(toUpperCase|toLowerCase|trim)\(\))+$/,
                          )[0];
                          path = path.replace(
                            /(\.(toUpperCase|toLowerCase|trim)\(\))+$/,
                            "",
                          );
                        }
                        try {
                          let questionArray = eval(path);
                          if (Array.isArray(questionArray) && questionArray.length === 1) {
                            // Add back method call if it existed
                            return `${path}[0]${methodCall} ${operator} "${value}"`;
                          } else {
                            return `${path}[-1] ${operator} "${value}"`;
                          }
                        } catch (e) {
                          return match;
                        }
                      } else {
                        return match;
                      }
                    }
                  );
                }

                const result = eval(logic);

                if (component_type === "dateTimefield") {
                  const splitDate = (dateStr) => {
                    if (!dateStr || typeof dateStr !== "string") {
                      return new Date().toISOString().split("T")[0];
                    }
                    const [day, month, year] = dateStr.split("/");
                    return `${year}-${month}-${day}`;
                  };
                  const dateTimeType = getQuestionDataById(sections, question?.question_id, "type");
                  const timeFormat = getQuestionDataById(sections, question?.question_id, "format");

                  // Add defensive null checking to regex matches to prevent undefined errors
                  if (dateTimeType === "date") {
                    const dateMatch = result.match(/^(\d{4}-\d{2}-\d{2})/);
                    const dateValue = dateMatch?.[1] || '';
                    
                    dispatch(
                      setQuestionValue({
                        question_id: question?.question_id,
                        value: dateValue,
                      }),
                    );
                    setConditionalValues(prevValues => ({
                      ...prevValues,
                      [question?.question_id.replace(/-/g, '_')]: dateValue
                    }));
                  } else if (dateTimeType === "time") {
                    if (timeFormat === "12") {
                      // Check if result is already in 12-hour format or needs conversion from 24-hour
                      let timeValue = '';
                      
                      if (result.includes(' AM') || result.includes(' PM')) {
                        const timeMatch = result.match(/(\d{2}:\d{2}:\d{2} [APM]{2})$/);
                        timeValue = timeMatch?.[1] || '';
                      } else {
                        const timeMatch = result.match(/(\d{2}:\d{2}:\d{2})$/);
                        timeValue = timeMatch?.[1] ? convertTo12Hour(timeMatch[1]) : '';
                      }
                      
                      dispatch(
                        setQuestionValue({
                          question_id: question?.question_id,
                          value: timeValue,
                        }),
                      );
                      setConditionalValues(prevValues => ({
                        ...prevValues,
                        [question?.question_id.replace(/-/g, '_')]: timeValue
                      }));
                    } else if (timeFormat === "24") {
                      // Check if result is already in 24-hour format or needs conversion from 12-hour
                      let timeValue = '';
                      
                      if (!result.includes(' AM') && !result.includes(' PM')) {
                        const timeMatch = result.match(/(\d{2}:\d{2}:\d{2})$/);
                        timeValue = timeMatch?.[1] || '';
                      } else {
                        const timeMatch = result.match(/(\d{2}:\d{2}:\d{2} [APM]{2})$/);
                        timeValue = timeMatch?.[1] ? convertTo24Hour(timeMatch[1]) : '';
                      }
                      
                      dispatch(
                        setQuestionValue({
                          question_id: question?.question_id,
                          value: timeValue,
                        }),
                      );
                      setConditionalValues(prevValues => ({
                        ...prevValues,
                        [question?.question_id.replace(/-/g, '_')]: timeValue
                      }));
                    }
                  } else if (dateTimeType === "datetime") {
                    // For datetime, extract the date part and the time part separately
                    const dateMatch = result.match(/^(\d{4}-\d{2}-\d{2})/);
                    const datePart = dateMatch?.[1] || '';
                  
                    // Handle time part based on format
                    let timePart = '';
                    
                    if (timeFormat === "12") {
                      // Check if time part is already in 12-hour format or needs conversion from 24-hour
                      if (result.includes(' AM') || result.includes(' PM')) {
                        const timeMatch = result.match(/(\d{2}:\d{2}:\d{2} [APM]{2})$/);
                        timePart = timeMatch?.[1] || '';
                      } else {
                        const timeMatch = result.match(/(\d{2}:\d{2}:\d{2})$/);
                        timePart = timeMatch?.[1] ? convertTo12Hour(timeMatch[1]) : '';
                      }
                    } else if (timeFormat === "24") {
                      // Check if time part is already in 24-hour format or needs conversion from 12-hour
                      if (!result.includes(' AM') && !result.includes(' PM')) {
                        const timeMatch = result.match(/(\d{2}:\d{2}:\d{2})$/);
                        timePart = timeMatch?.[1] || '';
                      } else {
                        const timeMatch = result.match(/(\d{2}:\d{2}:\d{2} [APM]{2})$/);
                        timePart = timeMatch?.[1] ? convertTo24Hour(timeMatch[1]) : '';
                      }
                    }
                    
                    // Combine date and time parts
                    const formattedDateTime = datePart && timePart ? `${datePart} ${timePart}` : datePart || (timePart && `${new Date().toISOString().split('T')[0]} ${timePart}`);

                    dispatch(
                      setQuestionValue({
                        question_id: question?.question_id,
                        value: formattedDateTime,
                      }),
                    );
                    setConditionalValues(prevValues => ({
                      ...prevValues,
                      [question?.question_id.replace(/-/g, '_')]: formattedDateTime
                    }));
                  }
                } else {
                  if (question?.lookup_id) {
                    // Find the matching lookup item by index instead of array position
                    const lookupItem = question.lookup_list.find(item => item.uuid === result.toString());

                    // Use the lookup value if found, otherwise use the result directly
                    const valueToSet = lookupItem?.value || '';

                    dispatch(
                      setQuestionValue({
                        question_id: question?.question_id,
                        value: valueToSet,
                      })
                    );
                    setConditionalValues(prevValues => ({
                      ...prevValues,
                      [question?.question_id.replace(/-/g, '_')]: valueToSet
                    }));
                  } else {
                    dispatch(
                      setQuestionValue({
                        question_id: question?.question_id,
                        value: result,
                      })
                    );
                    setConditionalValues(prevValues => ({
                      ...prevValues,
                      [question?.question_id.replace(/-/g, '_')]: result
                    }));
                  }
                }
                // Evaluate the string expression
                if (default_content === "advance") {
                  // dispatch(setQuestionValue({ question_id: question?.question_id, value: result }))
                  setValue((prev) => ({
                    ...prev,
                    [question.question_id]: result,
                  }));
                } else {
                  // dispatch(setQuestionValue({ question_id: question?.question_id, value: result }))
                  setValue((prev) => ({
                    ...prev,
                    [question.question_id]: result,
                  }));
                }
              } catch (error) {
                // Log the error if eval fails
                console.error(
                  `Failed to evaluate "${default_conditional_logic}":`,
                  error,
                );
              }
            }
          }
        });
      });
    });
  }, [sections, setValue, questionValue, setQuestionValue, dispatch]);
  useEffect(() => {
    if (sections) {
      const updateConditionalValues = () => {
        const newConditionalValues = produce(conditionalValues, (draft) => {
          sections.forEach((section) => {
            section.pages.forEach((page) => {
              page.questions.forEach((question) => {
                if (question?.conditional_logic) {
                  try {
                    const isVisible = evaluateLogic(
                      question?.conditional_logic,
                    );
                    if (!isVisible) {
                      draft[question?.question_id.replace(/-/g, '_')] = question.component_type === 'assetLocationfield' ? {} : "";
                      dispatch(
                        setQuestionValue({
                          question_id: question?.question_id,
                          value: "",
                        }),
                      );

                    }
                  } catch (error) {
                    console.error("Error evaluating conditional logic:", error);
                  }
                }
              });
            });
          });
        });

        setConditionalValues(newConditionalValues);
      };

      updateConditionalValues();
    }
  }, [sections, isModified]);

  const handleClose = () => {
    setModalOpen(false);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      preview_textboxfield: "",
      preview_choiceboxfield: "",
      preview_numberfield: "",
      preview_datetimefield: "",
      preview_photofield: "",
      preview_filefield: "",
      preview_videofield: "",
      preview_gpsfield: false,
    }));
    dispatch(clearQuestions());
    dispatch(resetFields());
    dispatch(clearAllSignatures());
  };

  return (
    <div
      className={`bg-[#0e0d0d71] pointer-events-auto w-full h-screen absolute top-0 flex flex-col z-[998]`}
    >
      <div className="flex justify-end p-2">
        <img
          src="/Images/close-preview.svg"
          data-testid="preview-close"
          className=" relative hover:bg-[#0e0d0d71] p-2 rounded-lg shadow-md hover:cursor-pointer"
          onClick={() => handleClose()}
        ></img>
      </div>
      <div
        ref={modalRef}
        data-testid="mobile-preview"
        className="h-[740px] flex justify-between mt-[50px] flex-col border-[5px] border-[#2B333B] w-[367px] mx-auto bg-slate-100 rounded-[55px] relative pb-6 "
      >
        <p className="text-center text-3xl text-[#2B333B] font-semibold mt-10 mb-3">
          {formDefaultInfo?.internal_name}
        </p>
        <div className="h-[calc(100vh-280px)] overflow-y-scroll overflow-x-hidden scrollHide w-full bg-slate-100 rounded-md">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <BeatLoader color="#2B333B" size="20px" />
            </div>
          ) : showComplianceScreen ? (
            <div className="p-4">
              <PreviewSummary conditionalValues={conditionalValues} sections={sections} />
              <h2 className="text-2xl font-bold text-[#2B333B] items-center w-full flex justify-center mb-4">
                Compliance Results
              </h2>
              {complianceLogic?.length === 0 && (
                <h3 className="font-semibold text-[#2B333B] text-center">
                  This Questionnaire doesn't contain compliance logic.
                </h3>
              )}
              {evaluateComplianceLogic().map((result, index) => (
                <>
                  {complianceLogic.length !== 0 && (
                    <div
                      key={index}
                      className={`mb-4 p-4 rounded-lg shadow transition-all duration-200 bg-white`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-[#2B333B]">
                          {result?.label}
                        </h3>
                        <span
                          className={` p-2 rounded-full gap-2 flex text-sm font-medium ${result?.STATUS === "PASS"
                            ? "bg-green-500"
                            : "bg-red-500 text-white"
                            }`}
                        >
                          <img
                            src={`${result?.STATUS === "PASS"
                              ? "/Images/compliant.svg"
                              : "/Images/non-compliant.svg"
                              }`}
                            width={12}
                            data-testid={
                              result?.STATUS === "PASS"
                                ? "compliant"
                                : "non-compliant"
                            }
                          />
                          {result?.STATUS === "PASS"
                            ? "Compliant"
                            : "Non-Compliant"}
                        </span>
                      </div>
                    </div>
                  )}
                  {result?.STATUS === "FAIL" &&
                    complianceLogic.length !== 0 && (
                      <div
                        key={index}
                        className={`mb-4 p-4 rounded-lg shadow transition-all duration-200 bg-white`}
                      >
                        <div className="flex flex-col gap-4">
                          {/* <h3 className="font-semibold text-[#2B333B]">STATUS: {result?.STATUS}</h3> */}
                          <div className=" flex items-center gap-2">
                            <h3 className="font-semibold text-[#2B333B]">
                              REASON:{" "}
                            </h3>
                            {/* 'NO_ACCESS', 'MISSING', 'RECOMMEND_REPLACEMENT', 'RECOMMEND_REMEDIATION', 'FURTHER_INVESTIGATION', 'OTHER' */}
                            <span className="text-sm">
                              {{
                                NO_ACCESS: "No Access",
                                MISSING: "Missing Asset",
                                RECOMMEND_REPLACEMENT: "Recommend Replacement",
                                RECOMMEND_REMEDIATION: "Recommend Remediation",
                                FURTHER_INVESTIGATION:
                                  "Further Investigation Required",
                              }[result?.REASON] || "Other"}
                            </span>
                          </div>
                          <div className=" flex items-center gap-2">
                            <h3 className="font-semibold text-[#2B333B]">
                              ACTION:{" "}
                            </h3>
                            <span className="text-sm">{result?.ACTIONS}</span>
                          </div>
                        </div>
                      </div>
                    )}
                </>
              ))}
            </div>
          ) : (
            <div>
              <div className="text-center text-2xl text-[#2B333B] mx-auto px-5 overflow-hidden text-ellipsis line-clamp-3 break-words font-[500] mt-3 mb-3">
                <p className="">{sections[currentSection]?.section_name}</p>
              </div>
              <div className="w-[305px] relative bg-gray-200 mx-auto rounded-full h-2.5 ">
                <div
                  className="bg-[#2B333B] absolute h-2.5 rounded-l"
                  style={{
                    width: `${(
                      ((previewNavigation.current_page - 1) / allPages.length) *
                      100
                    ).toFixed(0)}%`,
                  }}
                ></div>
                <div className="flex justify-between pt-5">
                  <p>
                    Step {previewNavigation.current_page} of {allPages.length}
                  </p>
                  <span className="text-sm text-gray-600">
                    {allPages.length > 0
                      ? (
                        ((previewNavigation?.current_page - 1) /
                          allPages.length) *
                        100
                      ).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              <div className="bg-white text-[#2B333B] py-[10px] px-[30px] mt-16">
                {sections[currentSection]?.pages[currentPage]?.page_name}
              </div>
              <div className="flex flex-col justify-between">
                {sections[currentSection]?.pages[currentPage]?.questions?.map(
                  (list, index) => {
                    if (!list?.options?.visible) {
                      return null;
                    }
                    if (list?.conditional_logic) {
                      if (list?.conditional_logic?.includes('"Today"')) {
                        try {
                          // Replace 'new Date()' with epoch value in seconds
                          let updatedLogic = list?.conditional_logic?.replace(
                            /"Today"/g,
                            "new Date().toISOString().split('T')[0]",
                          );
                          // Evaluate the updated logic
                          if (!eval(updatedLogic)) {
                            return null; // Skip rendering this question
                          }
                        } catch (error) {
                          console.error("Error evaluating expression:", error);
                          return null;
                        }
                      } else if (list?.conditional_logic.includes('formatDateWithOffset')) {
                        const spitedValue = list?.conditional_logic.split('(')[1].split(')')[0].split(',');
                        if (!formatDateWithOffset(spitedValue[0], spitedValue[1], spitedValue[2])) {
                          return null;
                        }
                      } else if (list?.conditional_logic.includes('AddDays') || list?.conditional_logic.includes('SubtractDays')) {

                        let replacedLogic = list?.conditional_logic

                        replacedLogic = replacedLogic.replaceAll(
                          /(\w+)\.AddDays\((\d+)\)/g,
                          (match, p1, p2) => {
                            const evaluatedVariable = eval(p1)
                            if (evaluatedVariable.includes(':') && (evaluatedVariable.includes('-') || evaluatedVariable.includes('/'))) {
                              return `(new Date(new Date(${p1}.replace(/\\s+[\\d:]+\\s*[APM]*$/, '').replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$3-$2-$1')).getTime() + (${p2} * 86400000))).toLocaleDateString("en-GB")`;
                            } else {
                              return `(new Date(new Date(${p1}.replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).getTime() + (${p2} * 86400000))).toLocaleDateString("en-GB")`;
                            }
                          }
                        );

                        // Replace `SubtractDays` with the new Date handling for subtraction and format as dd/mm/yyyy
                        replacedLogic = replacedLogic.replaceAll(
                          /(\w+)\.SubtractDays\((\d+)\)/g,
                          (match, p1, p2) => {
                            const evaluatedVariable = eval(p1)
                            if (evaluatedVariable.includes(':') && (evaluatedVariable.includes('-') || evaluatedVariable.includes('/'))) {
                              return `(new Date(new Date(${p1}.replace(/\\s+[\\d:]+\\s*[APM]*$/, '').replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$3-$2-$1')).getTime() - (${p2} * 86400000))).toLocaleDateString("en-GB")`;
                            } else {
                              return `(new Date(new Date(${p1}.replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).getTime() - (${p2} * 86400000))).toLocaleDateString("en-GB")`;
                            }
                          }
                        );

                        try {
                          let result = eval(replacedLogic); // Evaluate the modified logic
                          if (!result) {
                            return null; // Skip rendering this question
                          }
                        } catch (error) {
                          console.warn(
                            "Error evaluating conditional logic:",
                            error,
                          );
                          return null;
                        }
                      }
                      else if (['getFullYear', 'getMonth', 'getDate', 'getDay', 'getHours', 'getMinutes', 'getSeconds', 'getMilliseconds', 'getTime']
                        .some(fn => list?.conditional_logic?.includes(fn))) {

                        let updatedLogic = list?.conditional_logic;

                        if (updatedLogic.includes('getDay()')) {
                          const daysMap = {
                            Sunday: 0,
                            Monday: 1,
                            Tuesday: 2,
                            Wednesday: 3,
                            Thursday: 4,
                            Friday: 5,
                            Saturday: 6,
                          };
                          // Replace day names with corresponding numeric values
                          const replacedLogic = updatedLogic?.replace(
                            /getDay\(\)\s*(===|!==)\s*"(.*?)"/g,
                            (match, operator, day) => {
                              return `getDay() ${operator} ${daysMap[day] ?? `"${day}"`
                                }`;
                            },
                          );

                          // Remove parentheses from around the entire string, if they exist
                          updatedLogic = replacedLogic?.replace(
                            /^\((.*)\)$/,
                            "$1",
                          );
                        }

                        let logic = updatedLogic;
                        const regex = /(\w+)\.(getFullYear|getMonth|getDate|getDay|getHours|getMinutes|getSeconds|getMilliseconds|getTime)\(\)/g;
                        logic = logic.replace(regex, (match, variable, functionName) => {
                          const evaluatedVariable = eval(variable)

                          if (evaluatedVariable.includes(':') && (evaluatedVariable.includes('-') || evaluatedVariable.includes('/'))) {
                            if (["getHours", "getMinutes", "getSeconds", "getMilliseconds", "getTime"].includes(functionName)) {
                              if (evaluatedVariable.includes("AM") || evaluatedVariable.includes("PM")) {
                                if (functionName === "getTime") {
                                  return `(new Date("1970-01-01 " + ${variable}.replace(/^([\\d/.-]+)\\s+/, ''))).toTimeString().slice(0,8)`
                                }
                                return `new Date("1970-01-01 " + ${variable}.replace(/^([\\d/.-]+)\\s+/, '')).${functionName}()`;
                              } else {
                                if (functionName === "getTime") {
                                  return `(new Date("1970-01-01T" + ${variable}.replace(/^([\\d/.-]+)\\s+/, ''))).toTimeString().slice(0,8)`
                                }
                                return `new Date("1970-01-01T" + ${variable}.replace(/^([\\d/.-]+)\\s+/, '')).${functionName}()`;
                              }
                            } else {
                              return `new Date(${variable}.replace(/\\s+[\\d:]+\\s*[APM]*$/, '').replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).${functionName}()`;
                            }
                          } else {
                            if (["getHours", "getMinutes", "getSeconds", "getMilliseconds", "getTime"].includes(functionName)) {
                              if (evaluatedVariable.includes("AM") || evaluatedVariable.includes("PM")) {
                                if (functionName === "getTime") {
                                  return `new Date("1970-01-01 " + ${variable}).toTimeString().slice(0,8)`
                                }
                                return `new Date("1970-01-01 " + ${variable}).${functionName}()`;
                              } else {
                                if (functionName === "getTime") {
                                  return `new Date("1970-01-01T" + ${variable}).toTimeString().slice(0,8)`
                                }
                                return `new Date("1970-01-01T" + ${variable}).${functionName}()`;
                              }
                            } else {
                              return `new Date(${variable}.replace(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, '$2/$1/$3')).${functionName}()`;
                            }
                          }
                        });

                        logic = logic.replace(/\.getMonth\(\)/g, ".getMonth()+1");

                        try {
                          let result = eval(logic); // Evaluate the modified logic
                          if (!result) {
                            return null; // Skip rendering this question
                          }
                        } catch (error) {
                          console.warn(
                            "Error evaluating conditional logic:",
                            error,
                          );
                          return null;
                        }
                      } else {
                        let logic = list?.conditional_logic;
                        const arrayMultiChoiceId = [];
                        // Loop through all properties in questionValue
                        Object.entries(questionValue).forEach(([key, value]) => {
                          // Check if the value is an array
                          if (Array.isArray(value)) {
                            if (logic?.includes(key.replace(/-/g, "_"))) {
                              arrayMultiChoiceId.push(key.replace(/-/g, "_"));
                            }
                          }
                        });
                        try {
                          //handle Multi-choice
                          if ((logic?.includes("===") || logic?.includes("!==") || logic?.includes("==") || logic?.includes("!=")) && arrayMultiChoiceId.length > 0) {
                            logic = logic.replace(
                              /([a-zA-Z_][\w.?]*(?:\.(?:toUpperCase|toLowerCase|trim)\(\))*)\s*(===|==|!=|!==)\s*['"]([^'"]*)['"]/g,
                              (match, path, operator, value) => {
                                if (arrayMultiChoiceId.includes(path.replace(/\..*/, ""))) {
                                  // Handle method calls separately
                                  let methodCall = "";
                                  if (path.match(/(\.(toUpperCase|toLowerCase|trim)\(\))+$/)) {
                                    methodCall = path.match(
                                      /(\.(toUpperCase|toLowerCase|trim)\(\))+$/,
                                    )[0];
                                    path = path.replace(
                                      /(\.(toUpperCase|toLowerCase|trim)\(\))+$/,
                                      "",
                                    );
                                  }
                                  try {
                                    let questionArray = eval(path);
                                    if (Array.isArray(questionArray) && questionArray.length === 1) {
                                      // Add back method call if it existed
                                      return `${path}[0]${methodCall} ${operator} "${value}"`;
                                    } else {
                                      return `${path}[-1] ${operator} "${value}"`;
                                    }
                                  } catch (e) {
                                    return match;
                                  }
                                } else {
                                  return match;
                                }
                              }
                            );
                          }
                          if (!eval(logic)) {
                            return null; // Skip rendering this question
                          }
                        } catch (error) {
                          console.warn(
                            "Error evaluating conditional logic:",
                            error,
                          );
                          return null;
                        }
                      }
                    }
                    return (
                      <div
                        data-testid={`preview-section-${currentSection}-page-${currentPage}-question-${index}`}
                        className="mt-3 mb-3 bg-white mx-4 rounded-xl py-4 px-2"
                        key={index}
                      >
                        <div className="px-2">{renderQuestion(list)}</div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-5 flex items-center px-2 justify-between">
          {!showLabel ? (
            <button
              disabled={
                previewNavigation?.current_page === 1 && !showComplianceScreen
              }
              type="button"
              data-testid="back"
              className={`w-[100px] h-[45px] ${button1Style} disabled:opacity-40 text-white font-semibold text-sm rounded-full
                    `}
              onClick={handleBackClick}
            >
              Back
            </button>
          ) : (
            <>
              <input
                data-testid="import-file"
                type="file"
                accept=".csv"
                onChange={handleButton1}
                disabled={isImportLoading}
                id="file-upload"
                style={{ display: "none" }} // Hide the actual input field
              />
              <label
                htmlFor="file-upload"
                className={`w-[200px] h-[50px] ${button1Style} text-white font-semibold text-base rounded ${isImportLoading ? "cursor-not-allowed" : "cursor-pointer"
                  } flex justify-center items-center`}
              >
                {isImportLoading ? (
                  <BeatLoader color="#fff" size="10px" />
                ) : (
                  <>{Button1text}</>
                )}
              </label>
            </>
          )}
          {!showComplianceScreen && (
            <button
              type="button"
              data-testid="next"
              className={`w-[100px] h-[45px] ${button1Style} text-white font-semibold text-sm rounded-full`}
              onClick={() => handleNextClick()}
            >
              {precomputedNavigation?.isLastSection ? "Submit" : "Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
