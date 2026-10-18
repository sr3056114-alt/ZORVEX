export let timeOffset = 0;
export let isTimeSynced = false;

export const syncServerTime = async () => {
    try {
        const start = Date.now();
        // Uses relative path, handles whatever host it is currently running on
        const response = await fetch('/api/time');
        if (response.ok) {
            const data = await response.json();
            const end = Date.now();
            const latency = (end - start) / 2;
            timeOffset = data.now - (start + latency);
            isTimeSynced = true;
            console.log(`[TimeSync] Server time synchronized. Offset: ${timeOffset}ms, Latency: ${latency}ms`);
        }
    } catch (e) {
        console.warn("[TimeSync] Failed to sync server time, falling back to local time", e);
    }
};

export const getServerTime = () => {
    return Date.now() + timeOffset;
};
