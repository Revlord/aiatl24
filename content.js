function createSidebar() {
    // Create sidebar container
    const sidebar = document.createElement('div');
    sidebar.id = 'privacy-analyzer-sidebar';
    sidebar.innerHTML = `
      <div class="privacy-analyzer-header">
        <h2>Privacy Analysis</h2>
        <button id="privacy-analyzer-close">×</button>
      </div>
      <div class="privacy-analyzer-content">
        <div class="alert alert-danger">
          <div class="alert-icon">⚠️</div>
          <div class="alert-content">
            <h3>Location Tracking</h3>
            <p>Tracks location using GPS, WiFi, and cell towers - even when app is closed.</p>
          </div>
        </div>
        
        <div class="alert alert-warning">
          <div class="alert-icon">📸</div>
          <div class="alert-content">
            <h3>Camera & Environment</h3>
            <p>Collects camera data and builds 3D models of places you visit.</p>
          </div>
        </div>
        
        <div class="alert alert-warning">
          <div class="alert-icon">🔄</div>
          <div class="alert-content">
            <h3>Data Sharing</h3>
            <p>Shares data with unspecified service providers globally.</p>
          </div>
        </div>
        
        <div class="alert alert-info">
          <div class="alert-icon">🔗</div>
          <div class="alert-content">
            <h3>Cross-Platform Data</h3>
            <p>Syncs contacts, calendar, health data, and multiple accounts.</p>
          </div>
        </div>
        
        <div class="summary-box">
          <h3>Summary</h3>
          <p>This policy allows extensive data collection and tracking across multiple platforms and sensors.</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(sidebar);
    
    // Add close button functionality
    document.getElementById('privacy-analyzer-close').addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
    
    return sidebar;
  }
  
  // Listen for extension icon click
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleSidebar') {
      const existingSidebar = document.getElementById('privacy-analyzer-sidebar');
      if (existingSidebar) {
        existingSidebar.classList.toggle('open');
      } else {
        const sidebar = createSidebar();
        setTimeout(() => sidebar.classList.add('open'), 100);
      }
    }
  });