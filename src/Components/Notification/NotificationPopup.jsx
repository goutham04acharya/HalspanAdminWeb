import React, { useRef } from 'react';
import { useOnClickOutside } from '../../CommonMethods/outsideClick';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatTimeAgo } from '../../CommonMethods/formatTimeAgo';
import { useNavigate } from 'react-router';

export default function NotificationPopup ({
    loading,
    page, setPage,
    setIsNotification, notificationData, fetchNotificationData, hasMore
}) {
    const NotificationRef = useRef();
    const navigate = useNavigate();
    useOnClickOutside(NotificationRef, () => {
        setIsNotification(false);
    });

    const handleScroll = debounce(() => {
        // Check if there is no loading and there is more data to fetch
        if (!loading && hasMore) {
            fetchNotificationData(page);
        }
    }, 200); // Adjust debounce delay as needed

    function debounce (func, delay) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, arguments);
            }, delay);
        };
    }
    const handleOnClick = (paymaartId, type) => {
        const subString = paymaartId.substring(0, 3);
        switch (type) {
        case 'kyc':
            switch (subString) {
            case 'AGT':
                navigate(`/verify/kyc-registration/agent-profile/${paymaartId}`);
                break;
            case 'CMR':
                navigate(`/verify/kyc-registration/customer-profile/${paymaartId}`);
                break;
            case 'MCT':
                navigate(`/verify/kyc-registration/merchant-profile/${paymaartId}`);
                break;
            default:
                break;
            }
            break;
        case 'delete':
            switch (subString) {
            case 'AGT':
                navigate(`/verify/delete-account-requests/agent-profile/${paymaartId}`);
                break;
            case 'CMR':
                navigate(`/verify/delete-account-requests/customer-profile/${paymaartId}`);
                break;
            case 'MCT':
                navigate(`/verify/delete-account-requests/merchant-profile/${paymaartId}`);
                break;
            default:
                break;
            }
        }
    };

    return (
        <div
            className='notification-tooltip absolute z-[11]'
            anchorSelect=".info-icon"
            place='right-start'
            effect="solid"
            arrowColor="transparent"
            ref={NotificationRef}
            data-testid="notification_list"
        >
            <p className='text-[#4F5962] font-bold text-[16px] pb-[6px] border-b borer-[#E5E9EB]'>Notifications</p>
            <div className='h-[480px] overflow-auto scrollBar' onScroll={handleScroll}>
                <InfiniteScroll
                    dataLength={notificationData.length}
                    next={() => setPage(page + 1)}
                    hasMore={hasMore}
                    loader={<p>Loading...</p>}
                    scrollableTarget="scrollBar"
                    scrollThreshold={0.9}
                >
                    {notificationData.map((notificationItem, notificationIndex) => (
                        <div className=' px-[10px] flex justify-between items-center' key={notificationIndex}
                            onClick={() => handleOnClick(notificationItem.user_id, notificationItem.type)}
                            data-testid={notificationItem.type === 'kyc'
                                ? 'view_kyc_notification'
                                : 'view_delete_request_notification'}
                        >
                            <div className='flex items-center w-[90%]'>
                                <div className='w-[15%]'>
                                    <img src="/images/notification-icon.svg" alt="notification" className='w-full' />
                                </div>
                                <div className='ml-2.5 w-[85%]'>
                                    <p className='font-normal text-sm text-[#4F5962]'>
                                        {notificationItem?.type === 'kyc'
                                            ? `Pending KYC Registration for ${notificationItem.user_id}`
                                            : `Pending Delete Account Request for ${notificationItem.user_id}`}</p>
                                    <p className='font-normal text-sm text-[#4F5962]'>{notificationItem.type === 'kyc'
                                        ? 'There are pending KYC Registrations requiring your attention.'
                                        : 'There are pending Delete Account Request requiring your attention.'}</p>
                                </div>
                            </div>
                            <div className='w-[12%] '>
                                <p className='text-xs text-[#A4A9AE] font-normal text-end'>
                                    {formatTimeAgo(notificationItem.created_at)}</p>
                            </div>
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    );
}
