import React, { useState, useCallback, useMemo } from "react";
import ImageZoomPin from "../../../Components/PinOnTheFloor/PinOnTheFloor";
import GPSField from "./Fields/GPS/GPSField";
import { formatDate } from "../../../CommonMethods/FormatDate";

// Utility functions moved outside component
const formatName = (name) => name?.replaceAll("_", " ") || "";
const formatQuestionId = (id) => id?.replaceAll("-", "_") || "";

// Separate component for image preview to avoid re-renders
const ImagePreview = React.memo(({ images, onImageClick }) => {
  if (!images || images.length === 0) return "-";

  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(images).map((img, index) => (
        <img
          key={index}
          src={URL.createObjectURL(img)}
          alt="Selected Image"
          className="w-16 h-16 rounded-lg cursor-pointer"
          onClick={() => onImageClick(img)}
        />
      ))}
    </div>
  );
});

// Separate component for file preview
const FilePreview = React.memo(({ files }) => {
  if (!files || Object.values(files).length === 0) return "-";

  return (
    <ul className="w-full">
      {Object.values(files).map((file, index) => (
        <li
          key={index}
          className="bg-gray-200 my-2 p-2 rounded flex justify-between"
        >
          <span className="truncate w-full max-w-xs">{file.name || file}</span>
        </li>
      ))}
    </ul>
  );
});

// Display field component
const DisplayFieldPreview = React.memo(({ display_type }) => {
  if (display_type.text) {
    return <p className="text-sm text-gray-700">{display_type.text}</p>;
  }
  if (display_type.heading) {
    return <p className="text-sm text-black font-medium">{display_type.heading}</p>;
  }
  if (display_type.image) {
    return <ImageZoomPin imageSrc={display_type.image} />;
  }
  if (display_type.url) {
    return <p className="text-sm text-gray-700">{display_type.url.value}</p>;
  }
  return "-";
});

// Asset location component
const AssetLocationPreview = React.memo(({ value }) => (
  <div className="text-sm text-gray-700">
    <p>{`Site: ${value?.site || "-"}`}</p>
    <p>{`Building: ${value?.building || "-"}`}</p>
    <p>{`Floor: ${value?.floor || "-"}`}</p>
  </div>
));

// Standard field component
const StandardFieldPreview = React.memo(({ value, component_type, type }) => {
  if (!value) return "-";
  
  if (type === "date") return formatDate(value);
  
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  
  if (typeof value === "object" && value !== null && component_type === "dateTimefield") {
    const timeMatch = JSON.stringify(value).match(/\d{2}:\d{2}:\d{2}/);
    return timeMatch ? timeMatch[0] : "-";
  }
  
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  
  return "-";
});

// Field preview component with memoization
const FieldPreview = React.memo(({ field, conditionalValues, onImageClick }) => {
  const questionId = formatQuestionId(field.question_id);
  const value = conditionalValues[questionId];

  const renderFieldContent = () => {
    switch (field.component_type) {
      case "photofield":
        return <ImagePreview images={value} onImageClick={onImageClick} />;
      case "gpsfield":
        return <GPSField preview />;
      case "floorPlanfield":
        return <ImageZoomPin floorPlan />;
      case "videofield":
      case "filefield":
        return <FilePreview files={value} />;
      case "displayfield":
        return <DisplayFieldPreview display_type={field.display_type} />;
      case "signaturefield":
        return value ? <ImageZoomPin imageSrc={value} /> : "-";
      case "assetLocationfield":
        return <AssetLocationPreview value={value} />;
      default:
        return (
          <p className="text-sm text-gray-700">
            <StandardFieldPreview
              value={value}
              component_type={field.component_type}
              type={field.type}
            />
          </p>
        );
    }
  };

  return (
    <div className="pb-2">
      {field.component_type !== "displayfield" && (
        <h1 className="text-sm text-black font-medium pb-1">
          {formatName(field.question_name)}
        </h1>
      )}
      {renderFieldContent()}
    </div>
  );
});

// Image modal component
const ImageModal = React.memo(({ image, onClose }) => {
  if (!image) return null;
  
  return (
    <div className="modal-overlay absolute rounded-[50px] top-0 flex-col z-20 left-0 w-[356px] h-full bg-white flex justify-center items-center">
      <button
        className="close-icon delay-300 z-[2] items-end text-[20px] ml-auto mr-4 -mt-64 hover:bg-slate-700 transition-transform bg-slate-800 px-1.5 rounded-lg text-white cursor-pointer"
        onClick={onClose}
        aria-label="Close"
      >
        &#10005;
      </button>

      <div className="z-[1]">
        <img
          src={URL.createObjectURL(image)}
          className="w-[374px] h-[600px] bg-white p-2 rounded-lg object-contain"
          alt="Enlarged"
        />
      </div>
    </div>
  );
});

// Main component
export default function PreviewSummary({ conditionalValues, sections }) {
  const [currentImage, setCurrentImage] = useState(null);

  const handleImageClick = useCallback((image) => {
    setCurrentImage(image);
  }, []);

  const handleModalClose = useCallback(() => {
    setCurrentImage(null);
  }, []);

  // Safer evaluation function
  const evaluateCondition = useCallback((condition) => {
    if (!condition) return true;
    try {
      // Using Function instead of eval for better security and performance
      return new Function('return ' + condition)() !== false;
    } catch (e) {
      console.error("Error evaluating condition:", e);
      return true;
    }
  }, []);
  const setXDate = (conditional_logic) => {
      function formatDateWithOffset(formatteDate, value, question_name) {
        let [day, month, year] = formatteDate.split(`'`)[1].split('/').map(Number);
        let date = new Date(year, month - 1, day + 1 + Number(value)).toISOString().split('T')[0]; // Use Date(year, monthIndex, day)
        return conditionalValues[question_name.trim()] === date;
      }
      const spitedValue = conditional_logic.split('(')[1].split(')')[0].split(',');
      return formatDateWithOffset(spitedValue[0], spitedValue[1], spitedValue[2])
  }

  // Memoized section filtering
  const filteredSections = useMemo(() => {
    if (!sections) return [];
    
    return sections.map(section => ({
      ...section,
      shouldRender: evaluateCondition(section.section_conditional_logic),
      pages: section.pages?.map(page => ({
        ...page,
        shouldRender: evaluateCondition(page.page_conditional_logic),
        questions: page.questions?.filter(field => 
          field.options.visible &&field.conditional_logic.includes('formatDateWithOffset') ? setXDate(field.conditional_logic) : evaluateCondition(field.conditional_logic)
        )
      })).filter(page => page.shouldRender && page.questions?.length > 0)
    })).filter(section => section.shouldRender && section.pages?.length > 0);
  }, [sections, evaluateCondition]);

  return (
    <>
      <h2
        className="text-2xl font-bold text-[#2B333B] items-center w-full flex justify-center mb-4"
        data-testid="preview-summary"
      >
        Summary
      </h2>

      {filteredSections.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`}>
          <h1 className="text-xl font-bold text-[#2B333B] mb-4">
            {formatName(section.section_name)}
          </h1>
          
          {section.pages?.map((page, pageIndex) => (
            <div
              key={`page-${pageIndex}`}
              className="mt-3 mb-3 bg-white rounded-xl py-4 px-3 gap-1"
            >
              <label
                data-testid="label-name"
                className="font-medium pb-1 text-base text-black overflow-hidden break-all block w-full max-w-[85%]"
              >
                {formatName(page.page_name)}
              </label>
              
              {page.questions?.map((field, fieldIndex) => (
                <FieldPreview
                  key={`field-${fieldIndex}`}
                  field={field}
                  conditionalValues={conditionalValues}
                  onImageClick={handleImageClick}
                />
              ))}
            </div>
          ))}
        </div>
      ))}

      {currentImage && (
        <ImageModal image={currentImage} onClose={handleModalClose} />
      )}
    </>
  );
}