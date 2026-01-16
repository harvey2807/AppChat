// File type detection and icon helpers
export const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'flac'];
    const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
    
    if (imageTypes.includes(extension)) return 'image';
    if (videoTypes.includes(extension)) return 'video';
    if (audioTypes.includes(extension)) return 'audio';
    if (documentTypes.includes(extension)) return 'document';
    return 'file';
};

export const getFileName = (url) => {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const fileNameWithTimestamp = pathParts[pathParts.length - 1];
        // Remove timestamp prefix (e.g., "1234567890_filename.pdf" -> "filename.pdf")
        const match = fileNameWithTimestamp.match(/_(.+)$/);
        return match ? decodeURIComponent(match[1]) : decodeURIComponent(fileNameWithTimestamp);
    } catch {
        return 'file';
    }
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const isValidFileType = (file, allowedTypes = []) => {
    if (allowedTypes.length === 0) return true;
    return allowedTypes.some(type => file.type.startsWith(type));
};

export const validateFileSize = (file, maxSizeMB = 10) => {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    return file.size <= maxSize;
};
