import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiFolder, FiCheckSquare, FiAlertTriangle, FiTrash2, FiDollarSign } from 'react-icons/fi';
import { IoNotificationsOffOutline } from 'react-icons/io5';
import { RiTimeLine } from 'react-icons/ri';
import { FaChevronLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { getMyNotifications, deleteNotification } from '../../api/common/notification';
import ConfirmationDeleteNotification from '../../components/modals/ConfirmationDeleteNotification'; // 1. Import the modal

const getNotificationStyle = (type) => {
    // ... (This function remains unchanged)
    switch (type) {
        case 'task_assignment': return { icon: <FiCheckSquare size={20} />, color: 'bg-purple-500/20 text-purple-400' };
        case 'project_assignment': return { icon: <FiFolder size={20} />, color: 'bg-green-500/20 text-green-400' };
        case 'deadline_reminder': return { icon: <RiTimeLine size={20} />, color: 'bg-orange-500/20 text-orange-400' };
        case 'payment': return { icon: <FiDollarSign size={20} />, color: 'bg-emerald-500/20 text-emerald-400' };
        case 'system': return { icon: <FiAlertTriangle size={20} />, color: 'bg-yellow-500/20 text-yellow-400' };
        case 'general': return { icon: <FiMessageSquare size={20} />, color: 'bg-blue-500/20 text-blue-400' };
        default: return { icon: <FiMessageSquare size={20} />, color: 'bg-gray-500/20 text-gray-400' };
    }
};

const getTimeAgo = (date) => {
    // ... (This function remains unchanged)
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return 'Just now';
};

const Notification = ({ setActiveView }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [filterType, setFilterType] = useState('all');

    // 2. Add state for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState(null); // Stores ID or 'all'

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        // ... (This function remains unchanged)
        try {
            setLoading(true);
            const response = await getMyNotifications();
            let notificationsArray = [];
            if (Array.isArray(response)) notificationsArray = response;
            else if (Array.isArray(response?.data)) notificationsArray = response.data;
            else if (Array.isArray(response?.notifications)) notificationsArray = response.notifications;
            else if (Array.isArray(response?.data?.notifications)) notificationsArray = response.data.notifications;
            else if (Array.isArray(response?.data?.notifications?.rows)) notificationsArray = response.data.notifications.rows;
            setNotifications(notificationsArray);
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    // 3. Update handleDelete to *open* the modal
    const handleDelete = async (notificationId, e) => {
        e.stopPropagation();
        setNotificationToDelete(notificationId);
        setIsModalOpen(true);
    };

    // 4. Update clearAll to *open* the modal
    const clearAll = async () => {
        if (notifications.length === 0) return;
        setNotificationToDelete('all');
        setIsModalOpen(true);
    };

    // 5. Add function to handle the actual deletion on modal confirm
    const handleConfirmDelete = async () => {
        setIsDeleting(true);

        try {
            if (notificationToDelete === 'all') {
                // Handle Clear All
                await Promise.all(notifications.map(n => deleteNotification(n.id)));
                setNotifications([]);
                toast.success("All notifications cleared");
            } else {
                // Handle single delete
                await deleteNotification(notificationToDelete);
                setNotifications(notifications.filter(n => n.id !== notificationToDelete));
                toast.success("Notification deleted");
            }
        } catch (error) {
            console.error("Error:", error);
            const message = notificationToDelete === 'all' 
                ? "Failed to clear all notifications" 
                : "Failed to delete notification";
            toast.error(error.message || message);
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
            setNotificationToDelete(null);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNotificationToDelete(null);
    };

    const handleNotificationClick = (id) => {
        setExpandedId(currentId => (currentId === id ? null : id));
    };

    const filteredNotifications = filterType === 'all'
        ? notifications
        : notifications.filter(n => n.type === filterType);

    return (
        <> {/* 6. Wrap in Fragment */}
            <div className=" space-y-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="text-4xl font-bold">Notifications</h2>
                    <div className="flex gap-2 self-end md:self-auto">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors border  border-white/20 "
                        >
                            <option value="all" className=' bg-gray-900/80'>All Types</option>
                            <option value="task_assignment" className='bg-gray-900/80'>Task Assignment</option>
                            <option value="project_assignment" className='bg-gray-900/80'>Project Assignment</option>
                            <option value="deadline_reminder" className='bg-gray-900/80'>Deadline Reminder</option>
                            <option value="payment" className='bg-gray-900/80'>Payment</option>
                            <option value="system" className='bg-gray-900/80'>System</option>
                            <option value="general" className='bg-gray-900/80'>General</option>
                        </select>
                        <button
                            onClick={clearAll}
                            disabled={notifications.length === 0 || loading} // Also disable while loading
                            className="flex items-center gap-2 text-sm bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiTrash2 size={14} /> Clear all
                        </button>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
                    {loading ? (
                        <div className="space-y-4">
                            <SkeletonNotification />
                            <SkeletonNotification />
                            <SkeletonNotification />
                            <SkeletonNotification />
                            <SkeletonNotification />
                            <SkeletonNotification />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map((notification) => {
                                    const { icon, color } = getNotificationStyle(notification.type);
                                    const isExpanded = expandedId === notification.id;

                                    return (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification.id)}
                                            className="flex gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300 bg-black/20 hover:bg-black/30 group"
                                        >
                                            <div className={`relative w-10 h-10 flex items-center justify-center rounded-full shrink-0 ${color}`}>
                                                {icon}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="font-semibold text-white break-words">{notification.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs text-gray-500 shrink-0 whitespace-nowrap">
                                                            {getTimeAgo(notification.createdAt)}
                                                        </p>
                                                        <button
                                                            onClick={(e) => handleDelete(notification.id, e)}
                                                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1 hover:bg-red-500/20 rounded"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className={`text-sm text-gray-400 mt-1 break-words ${isExpanded ? '' : 'line-clamp-2'}`}>
                                                    {notification.message}
                                                </p>

                                                {notification.type && (
                                                    <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-white/5 text-gray-400 capitalize">
                                                        {notification.type.replace(/_/g, ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 px-4 text-gray-400">
                                    <IoNotificationsOffOutline size={60} className="text-gray-500 mb-4" />
                                    <p className="font-semibold text-lg text-white mb-2">No Notifications!</p>
                                    <p className="text-sm text-gray-400 text-center max-w-sm">
                                        {filterType === 'all'
                                            ? "Looks like you're all caught up. We'll let you know when something new pops up here."
                                            : "No notifications of this type. Try selecting a different filter."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 7. Render the modal */}
            <ConfirmationDeleteNotification
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title={notificationToDelete === 'all' 
                    ? "Clear All Notifications?" 
                    : "Delete Notification?"
                }
                message={notificationToDelete === 'all'
                    ? "Are you sure you want to delete all notifications? This action cannot be undone."
                    : "Are you sure you want to delete this notification? This action cannot be undone."
                }
            />
        </>
    );
};

const SkeletonNotification = () => (
    // ... (This component remains unchanged)
    <div className="flex gap-4 p-4 rounded-lg bg-black/20 animate-pulse">
        <div className="relative w-10 h-10 rounded-full shrink-0 bg-gray-700/50"></div>
        <div className="flex-1 min-w-0 space-y-2.5">
            <div className="flex justify-between items-start gap-2">
                <div className="h-5 rounded-md bg-gray-700/50 w-3/4"></div>
                <div className="h-4 rounded-md bg-gray-700/50 w-1/4"></div>
            </div>
            <div className="space-y-1.5">
                <div className="h-4 rounded-md bg-gray-700/50 w-full"></div>
                <div className="h-4 rounded-md bg-gray-700/50 w-5/6"></div>
            </div>
            <div className="h-5 rounded-full bg-gray-700/50 w-1/3"></div>
        </div>
    </div>
);

export default Notification;