import React, { useState, useCallback } from "react";
import ImageZoomPin from "../../../Components/PinOnTheFloor/PinOnTheFloor";
import GPSField from "./Fields/GPS/GPSField";
import { formatDate } from "../../../CommonMethods/FormatDate";

const formatName = (name) => name.replaceAll("_", " ");
const formatQuestionId = (id) => id?.replaceAll("-", "_");

const ImagePreview = ({ images, onImageClick }) => {
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
};

const FilePreview = ({ files }) => {
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
};

const DisplayFieldPreview = ({ display_type }) => {
  switch (true) {
    case !!display_type.text:
      return <p className="text-sm text-gray-700">{display_type.text}</p>;
    case !!display_type.heading:
      return <p className="text-sm text-gray-700">{display_type.heading}</p>;
    case !!display_type.image:
      return <ImageZoomPin imageSrc={display_type.image} />;
    case !!display_type.url:
      return <p className="text-sm text-gray-700">{display_type.url.value}</p>;
    default:
      return "-";
  }
};

const AssetLocationPreview = ({ value }) => (
  <div className="text-sm text-gray-700">
    <p>{`Site: ${value?.site || "-"}`}</p>
    <p>{`Building: ${value?.building || "-"}`}</p>
    <p>{`Floor: ${value?.floor || "-"}`}</p>
  </div>
);

const StandardFieldPreview = ({ value, component_type, type }) => {
  if (!value) return "-";
  if(type === 'date') return formatDate(value)
  switch (true) {
    case typeof value === "string" || typeof value === "number":
      return value;
    case typeof value === "object" && value !== null && component_type === "dateTimefield":
      const timeMatch = JSON.stringify(value).match(/\d{2}:\d{2}:\d{2}/);
      return timeMatch ? timeMatch[0] : "-";
    case Array.isArray(value):
      return value.join(", ");
    default:
      return "-";
  }
};

const FieldPreview = ({ field, conditionalValues, onImageClick }) => {
  const questionId = formatQuestionId(field.question_id);
  const value = conditionalValues[questionId];

  return (
    <div className="pb-2">
      <h1 className="text-sm text-black font-medium pb-1">
        {formatName(field.question_name)}
      </h1>
      
      {renderFieldContent(field, value, onImageClick)}
    </div>
  );
};

const renderFieldContent = (field, value, onImageClick) => {
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
          <StandardFieldPreview value={value} component_type={field.component_type} type={field.type} />
        </p>
      );
  }
};

export default function PreviewSummary({ conditionalValues, sections }) {
  const [currentImage, setCurrentImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const handleImageClick = useCallback((image) => {
    setCurrentImage(image);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const shouldShowField = (field) => {
    return (
      field.options.visible &&
      (eval(field.conditional_logic) || eval(field.conditional_logic) === undefined)
    );
  };

  return (
    <>
      <h2
        className="text-2xl font-bold text-[#2B333B] items-center w-full flex justify-center mb-4"
        data-testid="preview-summary"
      >
        Summary
      </h2>
      
      {sections?.map((section, sectionIndex) => (
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
              
              {page.questions?.map(
                (field, fieldIndex) =>
                  shouldShowField(field) && (
                    <FieldPreview 
                      key={`field-${fieldIndex}`}
                      field={field}
                      conditionalValues={conditionalValues}
                      onImageClick={handleImageClick}
                    />
                  )
              )}
            </div>
          ))}
        </div>
      ))}
      
      {modalOpen && (
        <div className="modal-overlay absolute rounded-[50px] top-0 flex-col z-20 left-0 w-[356px] h-full bg-white flex justify-center items-center">
          <button
            className="close-icon delay-300 z-[2] items-end text-[20px] ml-auto mr-4 -mt-64 hover:bg-slate-700 transition-transform bg-slate-800 px-1.5 rounded-lg text-white cursor-pointer"
            onClick={handleModalClose}
            aria-label="Close"
          >
            &#10005;
          </button>

          <div className="z-[1]">
            <img
              src={URL.createObjectURL(currentImage)}
              className="w-[374px] h-[600px] bg-white p-2 rounded-lg object-contain"
              alt="Enlarged"
            />
          </div>
        </div>
      )}
    </>
  );
}