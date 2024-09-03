const Fieldsneeded = [
    {
        buttonName: "Textbox",
        buttonNumber: 1,
        buttonIcon: '/Images/TextField.svg',
        testId: 'textbox',
        onClick: 'handleTextboxClick',
        type: 'textbox',

    },
    {
        buttonName: "Choice",
        buttonNumber: 2,
        buttonIcon: '/Images/choiceField.svg',
        testId: 'choice',
        onClick: 'handleChoiceClick',
        type: 'choice',

    },
    {
        buttonName: "Date / Time",
        buttonNumber: 1,
        buttonIcon: '/Images/calendarField.svg',
        testId: 'date-/-time',
        onClick: 'handleDateTimeClick',
        type: 'datetime'
    },
    {
        buttonName: "Tag Scan",
        buttonNumber: 2,
        buttonIcon: '/Images/TagField.svg',
        testId: 'tag-scan',
        type: 'tagscan'
    },
    {
        buttonName: "Floorplan",
        buttonNumber: 1,
        buttonIcon: '/Images/FlorPrintField.svg',
        testId: 'floorplan',
        onClick: 'handleFloorPlanClick',
        type: 'floorplan',
    },
    {
        buttonName: "Photo",
        buttonNumber: 1,
        buttonIcon: '/Images/cameraField.svg',
        testId: 'photo',
        onClick: 'handlePhotoClick',
        type: 'photo'
    },
    {
        buttonName: "Video",
        buttonNumber: 2,
        buttonIcon: '/Images/videoField.svg',
        testId: 'video',
        onClick: 'handleVideoClick',
        type: 'video'
    },
    {
        buttonName: "File",
        buttonNumber: 1,
        buttonIcon: '/Images/fileField.svg',
        testId: 'file',
        onClick: 'handleFileClick',
        type: 'file'

    },
    {
        buttonName: "GPS",
        buttonNumber: 2,
        buttonIcon: '/Images/map-pinField.svg',
        testId: 'gps',
        type: 'gps'

    },
    {
        buttonName: "Number",
        buttonNumber: 1,
        buttonIcon: '/Images/NumberField.svg',
        testId: 'number',
        onClick: 'handleNumberClick',
        type: 'number'
    },
    {
        buttonName: "Display",
        buttonNumber: 2,
        buttonIcon: '/Images/DisplayField.svg',
        testId: 'display',
        type: 'display'
    },
    {
        buttonName: "Signature",
        buttonNumber: 1,
        buttonIcon: '/Images/signature.svg',
        testId: 'signature',
        type: 'signature'
    },
    {
        buttonName: "Asset Location",
        buttonNumber: 2,
        buttonIcon: '/Images/LocationField.svg',
        testId: 'asset-location',
        onClick: 'handleAssetLocationClick',
        type: 'assetlocation'
    },
    {
        buttonName: "Compliance",
        buttonNumber: 2,
        buttonIcon: '/Images/complianceField.svg',
        testId: 'compliance',
        type: 'compliance'
    },

]

export default Fieldsneeded