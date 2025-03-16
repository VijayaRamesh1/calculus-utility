/**
 * Derivatives Page Main JavaScript
 * Handles navigation, topic selection, and content loading
 */

document.addEventListener('DOMContentLoaded', function() {
  // Setup navigation
  setupNavigation();
  
  // Setup theme toggling
  setupThemeToggle();
  
  // Setup topic selection
  setupTopicSelection();
});

/**
 * Setup navigation functionality
 */
function setupNavigation() {
  // Handle active states in navigation
  const navItems = document.querySelectorAll('nav a');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Remove active class from all items
      navItems.forEach(navItem => navItem.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
    });
  });
}

/**
 * Setup theme toggle functionality
 */
function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  
  themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-theme');
    
    // Update the toggle icon
    if (body.classList.contains('dark-theme')) {
      this.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" 
                fill="none" stroke="#F0EBE1" stroke-width="1.5"/>
        </svg>
      `;
    } else {
      this.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M12 4V2M12 22v-2M4 12H2m20 0h-2m-2.5-5.5L18 5M6 19l1.5-1.5M6 5l1.5 1.5m11 11L18 19M12 17a5 5 0 100-10 5 5 0 000 10z" 
                stroke="#225B7D" stroke-width="1.5" fill="none"/>
        </svg>
      `;
    }
  });
}

/**
 * Setup topic selection and navigation
 */
function setupTopicSelection() {
  const topicCards = document.querySelectorAll('.topic-card');
  const topicView = document.getElementById('topic-view');
  
  topicCards.forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the topic URL
      const topicUrl = this.getAttribute('href');
      
      // Visually activate the selected card
      topicCards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      // Show topic view if it's hidden
      topicView.classList.add('active');
      
      // Scroll to topic view
      topicView.scrollIntoView({ behavior: 'smooth' });
      
      // Load the topic content (in a real implementation, this would fetch the content)
      loadTopicContent(topicUrl);
    });
  });
}

/**
 * Load topic content from URL
 * @param {string} url - URL of the topic to load
 */
function loadTopicContent(url) {
  // This is a simplified version for the prototype
  // In a full implementation, this would use fetch() to load the content
  
  // Extract topic name from URL
  const topicName = url.split('/').pop();
  
  // For the prototype, just redirect to the topic page
  window.location.href = `${topicName}.html`;
}