/**
 * Animations helper
 * Adds the 'visible' class to elements with the 'fade-in' class
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with the fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Add a small delay to ensure elements are rendered
    setTimeout(function() {
        // Add the visible class to each element
        fadeElements.forEach(function(element) {
            element.classList.add('visible');
        });
    }, 100);
    
    // For future elements that might be added dynamically
    // Create a mutation observer to watch for new elements
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check for new fade-in elements
                mutation.addedNodes.forEach(function(node) {
                    if (node.classList && node.classList.contains('fade-in')) {
                        // Add the visible class after a short delay
                        setTimeout(function() {
                            node.classList.add('visible');
                        }, 10);
                    }
                    
                    // Also check children of the added node
                    if (node.querySelectorAll) {
                        const childFadeElements = node.querySelectorAll('.fade-in');
                        childFadeElements.forEach(function(element) {
                            // Add the visible class after a short delay
                            setTimeout(function() {
                                element.classList.add('visible');
                            }, 10);
                        });
                    }
                });
            }
        });
    });
    
    // Start observing the document body for DOM changes
    observer.observe(document.body, { 
        childList: true,
        subtree: true
    });
});
