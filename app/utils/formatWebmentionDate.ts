export const formatWebmentionDate = (dateString: string | number | Date) => {
    // is ISO string
    if (typeof dateString === 'string' && dateString.includes('T')) {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }           
    if (typeof dateString === 'number') {
        const date = new Date(dateString * 1000)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }
}