import React, { useState } from "react";
import ImageZoomPin from "../../../Components/PinOnTheFloor/PinOnTheFloor";
import GPSField from "./Fields/GPS/GPSField";

export default function PreviewSummary({ conditionalValues }) {
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
      {Object.keys(conditionalValues)?.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`}>
          <h1 className="text-xl font-bold text-[#2B333B] mb-4">
            {section.replaceAll("_", " ")}
          </h1>

          {Object.keys(conditionalValues[section])?.map((page, pageIndex) => (
            <div
              key={`page-${pageIndex}`}
              className="mt-3 mb-3 bg-white rounded-xl py-4 px-3 gap-1"
            >
              <label
                data-testid="label-name"
                className="font-medium pb-1 text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] h-auto"
              >
                {page.replaceAll("_", " ")}
              </label>
              {Object.keys(conditionalValues[section][page])?.map(
                (field, fieldIndex) => (
                  <div key={`field-${fieldIndex}`} className="pb-2">
                    <h1 className="text-sm text-[#000000] font-medium pb-1">
                      {field.replaceAll("_", " ")}
                    </h1>
                    {console.log("field", field)}
                    {field === "Photo" ? (
                      <div className="flex">
                        {Object.values(conditionalValues[section][page][field])
                          .length === 0
                          ? "-"
                          : Object.values(
                              conditionalValues[section][page][field]
                            ).map((img) => (
                              <img
                                src={URL.createObjectURL(img)}
                                alt="Selected Image"
                                className="w-[70px] h-[70px] rounded-lg mx-3"
                                onClick={() => handleImageClick(img)}
                              />
                            ))}
                      </div>
                    ) : field === 'GPS' ? <GPSField
                    preview
                /> : field === "Floorplan" ? (
                      <ImageZoomPin floorPlan/>
                    ) : field === "Video" ? (
                      <ul>
                        {Object.values(conditionalValues[section][page][field])
                          .length === 0
                          ? "-"
                          : Object.values(
                              conditionalValues[section][page][field]
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
                    ) : field === "File" ? (
                      <ul>
                        {Object.values(conditionalValues[section][page][field])
                          .length === 0
                          ? "-"
                          : Object.values(
                              conditionalValues[section][page][field]
                            ).map((file, index) => (
                              <li
                                key={index}
                                className="bg-[#DFE0E2] my-2 p-2 rounded flex justify-between"
                              >
                                <span className="truncate w-[300px]">
                                  {file}
                                </span>
                                <div className="flex gap-2"></div>
                              </li>
                            ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-700">
                        {conditionalValues[section][page][field]
                          ? (typeof conditionalValues[section][page][field] ===
                            "string" || typeof conditionalValues[section][page][field] ===
                            "number")
                            ? conditionalValues[section][page][field]?.includes('https://halspan-assets-') ? <ImageZoomPin imageSrc={conditionalValues[section][page][field]}/>: conditionalValues[section][page][field]
                            : conditionalValues[section][page][field].join(",")
                          : "-"}
                      </p>
                    )}
                  </div>
                )
              )}
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
