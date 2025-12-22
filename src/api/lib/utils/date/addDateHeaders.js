export default function (rawMessages) {
    if (!rawMessages || !rawMessages.length) return [];

    const processedMessages = rawMessages.map(m => {
        const timestamp = new Date(m.date).getTime();
        return {
            ...m,
            _sortTimestamp: isNaN(timestamp) ? 0 : timestamp
        };
    });

    processedMessages.sort((a, b) => {
        const timeDiff = a._sortTimestamp - b._sortTimestamp;
        if (timeDiff !== 0) return timeDiff;

        const idA = (a._id || "").toString();
        const idB = (b._id || "").toString();
        return idA.localeCompare(idB);
    });

    const result = [];

    for (let i = 0; i < processedMessages.length; i++) {
        const current = processedMessages[i];
        const prev = processedMessages[i - 1];

        const isNewDay = !prev || !isSameDay(current.date, prev.date);

        if (isNewDay) {
            const labelText = getDayLabel(current.date);

            if (labelText) {
                const dateKey = current._sortTimestamp
                    ? new Date(current._sortTimestamp).toISOString().split('T')[0]
                    : `unknown_${i}`;

                result.push({
                    _id: `date_header_${dateKey}`,
                    type: 'date_header',
                    text: labelText,
                    date: current.date
                });
            }
        }

        const { _sortTimestamp, ...messageToRender } = current;
        result.push(messageToRender);
    }

    return result;
};