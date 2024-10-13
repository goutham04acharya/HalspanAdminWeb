export  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');  // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`
}

export function reverseFormat(dateString) {
    const [day, month, year] = dateString.split('/');
    // const formattedDate = `${year}-${month}-${day}`;  // Convert to yyyy-mm-dd format
    return new Date(year, month - 1, day);  // Ensure the ISO format with time
    //  date.toISOString();  // Convert to ISO string
  
}