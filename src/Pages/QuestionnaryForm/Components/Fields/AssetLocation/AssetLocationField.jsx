import React, { useEffect, useState } from "react";
import Image from "../../../../../Components/Image/Image";
import InfinateDropdown from "../../../../../Components/InputField/InfinateDropdown";
import useApi from "../../../../../services/CustomHook/useApi";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setQuestionValue } from "../../previewQuestionnaireValuesSlice";
import { findSectionAndPageName } from "../../../../../CommonMethods/SectionPageFinder";

const AssetLocationField = ({
  label,
  type,
  textId,
  HelpText,
  value,
  className,
  handleChange,
  fieldSettingParameters,
  conditionalValues,
  testId,
  preview,
  question,
  setConditionalValues,
  sections,
}) => {
  const { getAPI } = useApi();
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const questionValue = useSelector((state) => state.questionValues.questions);

  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const [optionsData, setOptionsData] = useState({
    sites: [],
    locations: [],
    levels: [],
  });

  const [isLoading, setIsLoading] = useState({
    sites: false,
    locations: false,
    levels: false,
  });

  // Helper function to update conditional values
  const updateConditionalValues = (fieldType, newValue) => {
    let prevValue = {...conditionalValues[question?.question_id.replace(/-/g, "_")], [fieldType]: newValue.label || null} 
    setConditionalValues((prevValues) => ({
      ...prevValues,
      [question?.question_id.replace(/-/g, "_")]: prevValue,
    }));
    // Update Redux store with the full location data
    if (fieldType === "site" && newValue) {
      dispatch(
        setQuestionValue({
          question_id: question?.question_id,
          value: {
            site:
              fieldType === "site"
                ? newValue?.label || null
                : questionValue[question?.question_id]?.site || null,
            location: null,
            level: null,
          },
        }),
      );
    } else if (fieldType === "location" && newValue) {
      dispatch(
        setQuestionValue({
          question_id: question?.question_id,
          value: {
            site:
              fieldType === "site"
                ? newValue?.label || null
                : questionValue[question?.question_id]?.site || null,
            location:
              fieldType === "location"
                ? newValue?.label || null
                : questionValue[question?.question_id]?.location || null,
            level: null,
          },
        }),
      );
    } else if (fieldType === "level" && newValue) {
      dispatch(
        setQuestionValue({
          question_id: question?.question_id,
          value: {
            site:
              fieldType === "site"
                ? newValue?.label || null
                : questionValue[question?.question_id]?.site || null,
            location:
              fieldType === "location"
                ? newValue?.label || null
                : questionValue[question?.question_id]?.location || null,
            level:
              fieldType === "level"
                ? newValue?.label || null
                : questionValue[question?.question_id]?.level || null,
          },
        }),
      );
    }
  };

  const fetchSiteOptionList = useCallback(async () => {
    try {
      setIsLoading((prev) => ({ ...prev, sites: true }));
      const response = await getAPI(
        `${import.meta.env.VITE_API_BASE_URL}sites`,
        null,
        true,
      );
      const responseItem = response?.data?.results || [];

      const newItems = responseItem.map((site) => ({
        label: site.name,
        value: site.id,
      }));

      setOptionsData((prev) => ({
        ...prev,
        sites: newItems,
      }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, site: error }));
      console.error("Error fetching SiteOptionList:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, sites: false }));
    }
  }, []);

  const fetchLocationOptionList = useCallback(
    async (siteId) => {
      try {
        setIsLoading((prev) => ({ ...prev, locations: true }));
        const response = await getAPI(
          `${import.meta.env.VITE_API_BASE_URL}locations?site=${siteId}`,
          null,
          true,
        );
        const responseItem = response?.data?.results || [];

        const newItems = responseItem.map((location) => ({
          label: location.name,
          value: location.id,
          site: location.id,
        }));

        setOptionsData((prev) => ({
          ...prev,
          locations: newItems,
        }));
      } catch (error) {
        console.error("Error fetching SiteOptionList:", error);
      } finally {
        setIsLoading((prev) => ({ ...prev, locations: false }));
      }
    },
    [selectedSite],
  );

  const fetchLevelOptionList = useCallback(
    async (locationId) => {
      try {
        setIsLoading((prev) => ({ ...prev, levels: true }));
        const response = await getAPI(
          `${import.meta.env.VITE_API_BASE_URL}levels?location=${locationId}`,
          null,
          true,
        );
        const responseItem = response?.data?.results || [];

        const newItems = responseItem.map((level) => ({
          label: level.name,
          value: level.id,
          location: level.id,
        }));

        setOptionsData((prev) => ({
          ...prev,
          levels: newItems,
        }));
      } catch (error) {
        console.error("Error fetching SiteOptionList:", error);
      } finally {
        setIsLoading((prev) => ({ ...prev, levels: false }));
      }
    },
    [selectedLocation],
  );

  useEffect(() => {
    fetchSiteOptionList();
  }, []);

  useEffect(() => {
    if (selectedSite) fetchLocationOptionList(selectedSite?.value);
  }, [selectedSite]);

  useEffect(() => {
    if (selectedLocation) {
      fetchLevelOptionList(selectedLocation?.value);
    }
  }, [selectedLocation]);

  const handleSiteChange = (siteId) => {
    const newSite = siteId === selectedSite ? null : siteId;
    setSelectedSite((prev) => {
      if (prev === siteId) {
        return null;
      } else {
        return siteId;
      }
    });
    setIsSiteDropdownOpen(false);
    setSelectedLocation(null);
    setSelectedLevel(null);

    updateConditionalValues("site", newSite);
  };
  const handleLocationChange = (locationId) => {
    const newLocation = locationId === selectedLocation ? null : locationId;
    setSelectedLocation((prev) => {
      if (prev === locationId) {
        return null;
      } else {
        return locationId;
      }
    });
    setIsLocationDropdownOpen(false);
    setSelectedLevel(null);

    updateConditionalValues("location", newLocation);
  };

  const handleLevelChange = (levelId) => {
    const newLevel = levelId === selectedLevel ? null : levelId;
    setSelectedLevel((prev) => {
      if (prev === levelId) {
        return null;
      } else {
        return levelId;
      }
    });
    setIsLevelDropdownOpen(false);

    updateConditionalValues("level", newLevel);
  };

  return (
    <div data-testid="asset-location">
      <label
        data-testid="label-name"
        htmlFor={textId}
        title={preview ? question?.label : fieldSettingParameters?.label}
        className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${(preview ? question?.label : fieldSettingParameters?.label) === "" ? "h-[20px]" : "h-auto"}`}
        maxLength={100}
      >
        {preview ? question?.label : fieldSettingParameters?.label}
      </label>
      {preview && (
        <div className={`relative mt-3 `}>
          {/* <label htmlFor={textId} className='font-medium text-base text-black'>Site</label> */}
          <InfinateDropdown
            assets
            label="Site"
            testID="site"
            type={type}
            labeltestID="site"
            id="Site"
            isDropdownOpen={isSiteDropdownOpen}
            setDropdownOpen={!isLoading.sites && setIsSiteDropdownOpen}
            selectedOption={
              questionValue[question?.question_id]?.site
                ? { label: questionValue[question?.question_id]?.site }
                : null
            }
            options={optionsData.sites}
            className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
            placeholder={isLoading.sites ? "Loading..." : "Site"}
            handleOptionClick={(siteId) => handleSiteChange(siteId)}
            assetLocation
            handleInputFieldClick={() => {
              setIsLocationDropdownOpen(false);
              setIsLevelDropdownOpen(false);
            }}
            disabled={isLoading.sites}
            cursor={isLoading.sites ? "cursor-not-allowed" : "cursor-pointer"}
          />
        </div>
      )}
      {preview && !selectedSite && (
        <div className={`relative ${preview ? "mt-5" : "mt-8"}`}>
          <label htmlFor={textId} className="font-medium text-base text-black">
            Building
          </label>
          <input
            data-testid="building"
            type={type}
            id={textId}
            value={value}
            disabled={!selectedSite}
            className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
            placeholder={"Select"}
            onClick={handleChange}
          />
          <div className="absolute right-4 top-[74%] -translate-y-1/2">
            <Image
              src="open-Filter"
              className={`${!selectedSite} && opacity-[50%]`}
            />
          </div>
        </div>
      )}
      {preview && selectedSite && (
        <div className={`relative ${preview ? "mt-5" : "mt-8"}`}>
          {/* <label htmlFor={textId} className='font-medium text-base text-black'>Location</label> */}
          <InfinateDropdown
            assets
            label={"Building"}
            testID="location"
            labeltestID="building"
            type={type}
            id="Location"
            isDropdownOpen={isLocationDropdownOpen}
            setDropdownOpen={!isLoading.locations && setIsLocationDropdownOpen}
            selectedOption={
              questionValue[question?.question_id]?.location
                ? { label: questionValue[question?.question_id]?.location }
                : null
            }
            options={optionsData.locations}
            className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
            placeholder={isLoading.locations ? "Loading..." : "Building"}
            handleOptionClick={(locationId) => handleLocationChange(locationId)}
            assetLocation
            handleInputFieldClick={() => {
              setIsSiteDropdownOpen(false);
              setIsLevelDropdownOpen(false);
            }}
            disabled={isLoading.locations}
            cursor={
              isLoading.locations ? "cursor-not-allowed" : "cursor-pointer"
            }
          />
        </div>
      )}
      {preview && !selectedLocation && (
        <div className={`relative ${preview ? "mt-5" : "mt-8"}`}>
          <label htmlFor={textId} className="font-medium text-base text-black">
            Floor
          </label>
          <input
            data-testid="floorplan"
            type={type}
            id={textId}
            value={value}
            className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
            placeholder={"Select"}
            disabled={!selectedLocation}
            onClick={handleChange}
          />
          <div className="absolute right-4 top-[74%] -translate-y-1/2">
            <Image
              src="open-Filter"
              className={`${!selectedSite} && opacity-[50%]`}
            />
          </div>
        </div>
      )}
      {preview && selectedLocation && (
        <div className={`relative ${preview ? "mt-4" : "mt-8"}`}>
          {/* <label htmlFor={textId} className='font-medium text-base text-black'>Level</label> */}
          <InfinateDropdown
            assets
            label="Floor"
            testID="level"
            labeltestID="floor"
            type={type}
            id="Level"
            isDropdownOpen={isLevelDropdownOpen}
            setDropdownOpen={!isLoading.levels && setIsLevelDropdownOpen}
            selectedOption={
              questionValue[question?.question_id]?.level
                ? { label: questionValue[question?.question_id]?.level }
                : null
            }
            options={optionsData.levels}
            className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
            placeholder={isLoading.levels ? "Loading..." : "Floor"}
            handleOptionClick={(levelId) => handleLevelChange(levelId)}
            assetLocation
            handleInputFieldClick={() => {
              setIsLocationDropdownOpen(false);
              setIsSiteDropdownOpen(false);
            }}
            disabled={isLoading.levels}
            cursor={isLoading.levels ? "cursor-not-allowed" : "cursor-pointer"}
          />
        </div>
      )}
      {!preview && (
        <>
          <div className={`relative ${preview ? "mt-3" : "mt-5"}`}>
            <label
              htmlFor={textId}
              className="font-medium text-base text-black"
            >
              Site
            </label>
            <input
              data-testid="site"
              type={type}
              id={textId}
              value={value}
              className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
              placeholder="Select"
              onClick={handleChange}
            />
            <div className="absolute right-4 top-[74%] -translate-y-1/2">
              <Image src="down" />
            </div>
          </div>
          <div className={`relative ${preview ? "mt-5" : "mt-8"}`}>
            <label
              htmlFor={textId}
              className="font-medium text-base text-black"
            >
              Building
            </label>
            <input
              data-testid="building"
              type={type}
              id={textId}
              value={value}
              className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
              placeholder="Select"
              onClick={handleChange}
            />
            <div className="absolute right-4 top-[74%] -translate-y-1/2">
              <Image src="down" />
            </div>
          </div>
          <div className={`relative ${preview ? "mt-4" : "mt-8"}`}>
            <label
              htmlFor={textId}
              className="font-medium text-base text-black"
            >
              Floor
            </label>
            <input
              data-testid="floorplan"
              type={type}
              id={textId}
              value={value}
              className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
              placeholder="Select"
              onClick={handleChange}
            />
            <div className="absolute right-4 top-[74%] -translate-y-1/2">
              <Image src="down" />
            </div>
          </div>
        </>
      )}
      <p
        data-testid="help-text"
        className="italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]"
        title={preview ? question?.help_text : fieldSettingParameters?.helptext}
      >
        {preview ? question?.help_text : fieldSettingParameters?.helptext}
      </p>
    </div>
  );
};

export default AssetLocationField;
