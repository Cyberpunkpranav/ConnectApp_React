import React, { useState, useEffect } from 'react'
const Timer = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        setInterval(() => {
            setTime(new Date());
        }, 1000);
    }, []);

    function tConvert(time) {

        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            time = time.slice(1);
            time[4] = +time[0] < 12 ? ' AM ' : ' PM ';
            time[0] = +time[0] % 12 || 12;
        }
        return time.join('');
    }
    return (
        <span className='text-charcoal'>
            {
                tConvert(time.toLocaleString("en-US", {
                    timeStyle: "medium",
                    hour12: false,
                }))
            }{" "}
        </span>
    );
}



export { Timer } 