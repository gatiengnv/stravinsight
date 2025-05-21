import React, {useEffect, useState} from 'react';

export default function DateRangePicker() {
    const getInitialParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            startDate: urlParams.get('startDate') || '',
            endDate: urlParams.get('endDate') || ''
        };
    };

    const [dateRange, setDateRange] = useState(getInitialParams);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDateChange = (e) => {
        const {name, value} = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMonthChange = (e) => {
        const value = e.target.value;
        setSelectedMonth(value);

        if (value) {
            const [year, month] = value.split('-');
            const startDate = `${value}-01`;

            const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
            const endDate = `${value}-${lastDay}`;

            setDateRange({
                startDate: startDate,
                endDate: endDate
            });
        }
    };

    const applyDateFilter = () => {
        const url = new URL(window.location);

        if (dateRange.startDate) {
            url.searchParams.set('startDate', dateRange.startDate);
        } else {
            url.searchParams.delete('startDate');
        }

        if (dateRange.endDate) {
            url.searchParams.set('endDate', dateRange.endDate);
        } else {
            url.searchParams.delete('endDate');
        }

        window.location.href = url.toString();
    };

    const handleReset = () => {
        setDateRange({startDate: '', endDate: ''});
        setSelectedMonth('');
        const url = new URL(window.location);
        url.searchParams.delete('startDate');
        url.searchParams.delete('endDate');
        window.location.href = url.toString();
    };

    return (
        <div className={`dropdown dropdown-bottom ${isMobile ? 'dropdown-center' : 'dropdown-end'}`}>
            <label tabIndex={0} className="btn btn-outline m-1">
                {dateRange.startDate || dateRange.endDate
                    ? `${dateRange.startDate || 'Any'} to ${dateRange.endDate || 'Any'}`
                    : 'Select Date Range'}
            </label>
            <div tabIndex={0}
                 className="dropdown-content z-[1] p-4 shadow bg-base-200 rounded-box w-full md:w-96 max-w-[95vw]">
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Select a month</span>
                    </label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="input input-bordered"
                    />
                </div>

                <div className="divider">OR</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Start Date</span>
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                            className="input input-bordered"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">End Date</span>
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                            className="input input-bordered"
                        />
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        className="btn btn-sm btn-outline mr-2"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={applyDateFilter}
                        disabled={!dateRange.startDate && !dateRange.endDate}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
