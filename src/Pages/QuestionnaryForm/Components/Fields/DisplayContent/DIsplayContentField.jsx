import React from 'react'
import MyImageMarker from '../../../../../Components/ImageMarker/ImageMarker'
import ImageZoomPin from '../../../../../Components/PinOnTheFloor/PinOnTheFloor'

function DIsplayContentField({
    label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    testId,
    preview,
    question
}) {
    return (
        <div>
            {(preview ? question?.type === 'heading' :fieldSettingParameters?.type === 'heading') &&
                <p data-testid="heading" className='font-normal text-xl text-[#2B333B] max-w-[90%] break-words py-3'>{preview ? question?.display_type?.heading :fieldSettingParameters?.heading}</p>
            }
            {(preview ? question?.type === 'text' :fieldSettingParameters?.type === 'text') &&
                <p data-testid="text" className='font-normal text-base text-[#2B333B] max-w-[90%] break-words py-3'>{preview ? question?.display_type?.text : fieldSettingParameters?.text}</p>
            }
            {(!preview && fieldSettingParameters?.type === 'image') && 
                <img
                    src={preview ? question?.display_type?.image : fieldSettingParameters?.image} // assuming 'fieldSettingParameters.image' holds the S3 URL of the uploaded image
                    className="mt-8"
                    data-testid="uploaded-image"
                />
            }
            {(preview && (question?.type === 'image')) &&<div>
                {/* <MyImageMarker imageSrc={question?.display_type?.image} /> */}
                <ImageZoomPin imageSrc={question?.display_type?.image}  />
                
            </div>}
            {(preview ? question?.type === 'url' : fieldSettingParameters?.type === 'url' )&&
                <p data-testid="url" className='font-normal text-base text-[#2B333B] max-w-[90%] break-words py-3 cursor-pointer'><a href={preview ? question?.display_type?.url?.value : '#'} className=''>{preview ? question?.display_type?.url?.value : fieldSettingParameters?.urlValue}</a></p>
            }
        </div>
    )
}


export default DIsplayContentField