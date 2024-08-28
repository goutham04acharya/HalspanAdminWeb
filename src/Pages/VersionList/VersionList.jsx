import React, { useEffect, useState } from 'react'
import useApi from '../../services/CustomHook/useApi';
import { useParams } from 'react-router-dom';
import Table from '../../Pages/VersionList/Components/Table.jsx'

function VersionList() {
    const { getAPI } = useApi();
    const { public_name } = useParams()
    console.log(public_name, 'public_name')

    const [versionList, setVersionList] = useState([])
    const [loading, setLoading] = useState(true);

    const handleVersionList = async () => {
        setLoading(true);
        const response = await getAPI(`questionnaires/versions/${public_name}`)
        console.log(response?.data?.data, 'jddjjdjdjdjdjjd')
        setVersionList(response?.data)
        setLoading(false);
    }


    useEffect(() => {
        handleVersionList();
    }, [])

    return (
        <div className='px-[34px] py-[38px] w-full flex items-center'>
            <div className='w-[70%]'>
                <p className='mt-2 text-[28px] font-medium text-[#2B333B]'>Inspection A</p>
                <p className='mt-8 text-[22px] font-medium text-[#2B333B] '>Choose a Version</p>
                <div className='mt-10'>
                    <Table setVersionList={setVersionList} versionList={versionList} setLoading={setLoading} loading={loading}/>
                </div>
            </div>
            <div className='w-[30%] ml-[88px]'>
                fffffffff
            </div>

        </div>
    )
}

export default VersionList