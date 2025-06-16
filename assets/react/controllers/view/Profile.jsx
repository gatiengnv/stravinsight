import Drawer from "../components/Drawer";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendarAlt, faCreditCard, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function Profile({subscription, nextInvoiceDate, userProfileMedium, userProfile, firstname, lastname}) {
    const [showCancelModal, setShowCancelModal] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
    };

    return (
        <Drawer title="Profile" userProfileMedium={userProfileMedium}>
            <div className="p-4 md:p-6 max-w-3xl mx-auto">
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                            <div className="avatar">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={userProfile} alt="Profile" />
                                </div>
                            </div>
                            <div>
                                <h2 className="card-title text-2xl mb-2">{firstname + ' ' + lastname}</h2>
                                <div className="badge badge-primary">Premium</div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="mb-6 hidden">
                            <h3 className="font-bold text-lg mb-2 flex items-center">
                                <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                                Subscription Information
                            </h3>

                            <div className="bg-base-100 p-4 rounded-lg">
                                {subscription && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-primary" />
                                            {subscription.cancel_at_period_end ? (
                                                <span>Your subscription will end on <span className="font-semibold">{formatDate(nextInvoiceDate)}</span></span>
                                            ) : (
                                                <span>Next billing on <span className="font-semibold">{formatDate(nextInvoiceDate)}</span></span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card-actions justify-end">
                            {subscription && subscription.cancel_at_period_end ? (
                                <a href="/premium/reactivate" className="btn btn-primary" data-turbo="false">
                                    Reactivate subscription
                                </a>
                            ) : (
                                <button onClick={handleCancelClick} className="btn btn-outline btn-error">
                                    Cancel subscription
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
                    <div className="bg-base-100 p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-warning" />
                            Confirm Cancellation
                        </h3>
                        <p className="mb-6">
                            Are you sure you want to cancel your Premium subscription?
                            You will still have access to premium features until {formatDate(nextInvoiceDate)}.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={closeCancelModal} className="btn btn-ghost">
                                Back
                            </button>
                            <a href="/premium/cancel" className="btn btn-error" data-turbo="false">
                                Confirm Cancellation
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </Drawer>
    );
}
