import React, { useState } from "react";
import ImageZoomPin from "../../../Components/PinOnTheFloor/PinOnTheFloor";
import GPSField from "./Fields/GPS/GPSField";

export default function PreviewSummary({ conditionalValues, sections }) {
  const [currentImage, setCurrentImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const handleImageClick = (image) => {
    setCurrentImage(image);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
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
            {section.section_name.replaceAll("_", " ")}
          </h1>

          {section.pages?.map((page, pageIndex) => (
            <div
              key={`page-${pageIndex}`}
              className="mt-3 mb-3 bg-white rounded-xl py-4 px-3 gap-1"
            >
              <label
                data-testid="label-name"
                className="font-medium pb-1 text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] h-auto"
              >
                {page.page_name.replaceAll("_", " ")}
              </label>
              {page.questions?.map((field, fieldIndex) => (
                <div key={`field-${fieldIndex}`} className="pb-2">
                  <h1 className="text-sm text-[#000000] font-medium pb-1">
                    {field.question_name.replaceAll("_", " ")}
                  </h1>
                  {field.component_type === "photofield" ? (
                    <div className="flex">
                      {Object.values(
                        conditionalValues[
                          field?.question_id?.replaceAll("-", "_")
                        ]
                      ).length === 0
                        ? "-"
                        : Object.values(
                            conditionalValues[
                              field?.question_id?.replaceAll("-", "_")
                            ]
                          ).map((img) => (
                            <img
                              src={URL.createObjectURL(img)}
                              alt="Selected Image"
                              className="w-[70px] h-[70px] rounded-lg mx-3"
                              onClick={() => handleImageClick(img)}
                            />
                          ))}
                    </div>
                  ) : field.component_type === "gpsfield" ? (
                    <GPSField preview />
                  ) : field.component_type === "floorPlanfield" ? (
                    <ImageZoomPin floorPlan />
                  ) : field.component_type === "videofield" ? (
                    <ul>
                      {Object.values(
                        conditionalValues[
                          field?.question_id?.replaceAll("-", "_")
                        ]
                      ).length === 0
                        ? "-"
                        : Object.values(
                            conditionalValues[
                              field?.question_id?.replaceAll("-", "_")
                            ]
                          ).map((file, index) => (
                            <li
                              key={index}
                              className="bg-[#DFE0E2] my-2 p-2 rounded flex justify-between"
                            >
                              <span className="truncate w-[300px]">
                                {file.name}
                              </span>
                            </li>
                          ))}
                    </ul>
                  ) : field.component_type === "filefield" ? (
                    <ul>
                      {Object.values(
                        conditionalValues[
                          field?.question_id?.replaceAll("-", "_")
                        ]
                      ).length === 0
                        ? "-"
                        : Object.values(
                            conditionalValues[
                              field?.question_id?.replaceAll("-", "_")
                            ]
                          ).map((file, index) => (
                            <li
                              key={index}
                              className="bg-[#DFE0E2] my-2 p-2 rounded flex justify-between"
                            >
                              <span className="truncate w-[300px]">{file}</span>
                              <div className="flex gap-2"></div>
                            </li>
                          ))}
                    </ul>
                  ) : field.component_type === "displayfield" ? (
                    <>
                      {field.display_type.text ? (
                        <p className="text-sm text-gray-700">
                          {field.display_type.text}
                        </p>
                      ) : field.display_type.heading ? (
                        <p className="text-sm text-gray-700">
                          {field.display_type.heading}
                        </p>
                      ) : field.display_type.image ? (
                        <ImageZoomPin imageSrc={field.display_type.image} />
                      ) : field.display_type.url ? (
                        <p className="text-sm text-gray-700">
                          {field.display_type.url.value}
                        </p>
                      ) : (
                        "-"
                      )}
                    </>
                  ) : field.component_type === "signaturefield" ? (
                    <>
                      {conditionalValues[
                        field?.question_id?.replaceAll("-", "_")
                      ] ? (
                        <ImageZoomPin
                          imageSrc={
                            conditionalValues[
                              field?.question_id?.replaceAll("-", "_")
                            ]
                          }
                        />
                      ) : (
                        "-"
                      )}
                    </>
                  ) : field.component_type === "assetLocationfield" ? (
                    <div className="text-sm text-gray-700">
                      <p>{`Site: ${
                        conditionalValues[
                          field?.question_id?.replaceAll("-", "_")
                        ].site || "-"
                      }`}</p>
                      <p>{`Building: ${
                        conditionalValues[
                          field?.question_id?.replaceAll("-", "_")
                        ].building || "-"
                      }`}</p>
                      <p>{`Floor: ${
                        conditionalValues[
                          field?.question_id?.replaceAll("-", "_")
                        ].floor || "-"
                      }`}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">
                      {(() => {
                        const key = field?.question_id?.replaceAll("-", "_");
                        const value = conditionalValues[key];
                        if (!value) return "-"; // Handle empty values

                        if (
                          typeof value === "string" ||
                          typeof value === "number"
                        ) {
                          return value;
                        }
                        if (
                          typeof value === "object" &&
                          value !== null &&
                          field.component_type === "dateTimefield"
                        ) {
                          const timeMatch =
                            JSON.stringify(value).match(/\d{2}:\d{2}:\d{2}/);
                          if (timeMatch) return timeMatch[0]; // Return only the time
                        }
                        if (Array.isArray(value)) {
                          return value.join(", ");
                        }

                        return "-";
                      })()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      {modalOpen && (
        <div className="modal-overlay absolute rounded-[50px] top-0 flex-col z-20 left-0 w-[356px] h-full bg-white flex justify-center items-center">
          <span
            className="close-icon delay-300 z-[2] items-end text-[20px] ml-[325px] top-10 relative hover:bg-slate-700 transition-transform bg-slate-800 px-1.5 rounded-lg text-white cursor-pointer"
            onClick={handleModalClose}
          >
            &#10005;
          </span>

          <div className="z-[1]">
            <img
              src={URL.createObjectURL(currentImage)}
              className="w-[374px] h-[600px] bg-white p-2 rounded-lg object-contain"
              alt=""
            />
          </div>
        </div>
      )}
    </>
  );
}
