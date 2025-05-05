import {useEffect, useRef, useState} from "react";

const responseCache = {};

export default function AiBubble({url}) {
    const [loading, setLoading] = useState(true);
    const [responseData, setResponseData] = useState(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        if (responseCache[url]) {
            setResponseData(responseCache[url]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        setLoading(true);

        async function getData() {
            try {
                const response = await fetch(url, {signal});
                if (!response.ok) {
                    throw new Error('Request failed with status ' + response.status);
                }
                const data = await response.json();

                responseCache[url] = data;

                if (isMounted.current) {
                    setResponseData(data);
                    setLoading(false);
                }
            } catch (error) {
                if (error.name !== 'AbortError' && isMounted.current) {
                    console.error("Errors:", error);
                    setLoading(false);
                }
            }
        }

        getData();

        return () => {
            isMounted.current = false;
            controller.abort();
        };
    }, [url]);

    return (
        <>
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            src="/img/bot.png"
                            alt={"Chat bubble"}/>
                    </div>
                </div>
                <div className="chat-bubble">
                    {loading ? (
                        <span className="loading loading-dots loading-xs"></span>
                    ) : (
                        <div>{responseData}</div>
                    )}
                </div>
            </div>
        </>
    );
}
