import React, {useState} from 'react';

export default function SportPicker({userSports}) {
    const getInitialSport = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('sport') || '';
    };

    const [sport, setSport] = useState(getInitialSport);

    const handleSportChange = (selectedSport) => {
        const newSport = selectedSport === sport || selectedSport === '' ? '' : selectedSport;
        setSport(newSport);

        const url = new URL(window.location);
        if (newSport) {
            url.searchParams.set('sport', newSport);
        } else {
            url.searchParams.delete('sport');
        }
        window.location.href = url.toString();
    };

    return (
        <div className="filter">
            <input
                className="btn filter-reset"
                type="radio"
                name="sports"
                aria-label="All"
                checked={sport === ''}
                onChange={() => handleSportChange('')}
            />
            {userSports.map((userSport, index) => (
                <input
                    key={index}
                    className="btn"
                    type="radio"
                    name="sports"
                    aria-label={userSport}
                    checked={sport === userSport}
                    onChange={() => handleSportChange(userSport)}
                />
            ))}
        </div>
    );
}
