export const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();

    // Check if valid date
    if (isNaN(date.getTime())) return '';

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    // Format time (e.g., "10:30 AM")
    const time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    if (isToday) {
        return `Today, ${time}`;
    }

    if (isYesterday) {
        return `Yesterday, ${time}`;
    }

    // Format full date (e.g., "Dec 28, 2025")
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};