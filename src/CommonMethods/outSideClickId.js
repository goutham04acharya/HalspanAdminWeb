import { useEffect } from 'react';

/**
 * Custom hook to handle clicks outside a specific element identified by its ID.
 * @param {string} id - The ID of the element to detect clicks outside of.
 * @param {function} handler - The function to run when clicking outside the element.
 */
export default function useOnClickOutsideById(id, handler) {
    useEffect(() => {
        const listener = (event) => {
            // Get the target element by ID
            const element = document.getElementById(id);

            // If the element doesn't exist or contains the click target, do nothing
            if (!element || element.contains(event.target)) {
                return;
            }

            handler(event); // Trigger the handler function for clicks outside
        };

        // Attach event listeners
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        // Cleanup event listeners on unmount
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [id, handler]); // Re-run effect if `id` or `handler` changes
}
