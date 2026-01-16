export function formatTime(timestamp) {
    const now = new Date();
    const date = new Date(typeof timestamp === 'string' ? timestamp.replace(' ', 'T') : timestamp);
    const diff = Math.floor((now - date) / 1000); 

    if (diff < 60) {
        return `${diff}s ago`;
    }
    if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes}m ago`;
    }
    if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours}h ago`;
    }
    return `${Math.floor(diff / 86400)}d ago`;


}