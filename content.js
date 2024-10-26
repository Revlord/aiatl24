function extractPageText() {
    // Target common privacy policy/terms of service content
    const mainContent = document.body.innerText;
    return mainContent;
  }
  
  function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'privacy-analyzer-sidebar';
    sidebar.innerHTML = `
      <div class="privacy-analyzer-header">
        <h2>Privacy Analysis</h2>
        <button id="privacy-analyzer-close">×</button>
      </div>
      <div class="privacy-analyzer-content">
        <div id="loading" style="display: none;">
          <p>Analyzing privacy policy...</p>
        </div>
        <div id="analysis-content"></div>
      </div>
    `;
    
    document.body.appendChild(sidebar);
    
    document.getElementById('privacy-analyzer-close').addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
    
    return sidebar;
  }
  
  function updateSidebarContent(analysis) {
    const content = document.getElementById('analysis-content');
    content.innerHTML = '';
  
    // High Risk Alerts
    analysis.high_risk.forEach(item => {
      content.innerHTML += `
        <div class="alert alert-danger">
          <div class="alert-icon">⚠️</div>
          <div class="alert-content">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        </div>
      `;
    });
  
    // Medium Risk Alerts
    analysis.medium_risk.forEach(item => {
      content.innerHTML += `
        <div class="alert alert-warning">
          <div class="alert-icon">⚠</div>
          <div class="alert-content">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        </div>
      `;
    });
  
    // Low Risk Alerts
    analysis.low_risk.forEach(item => {
      content.innerHTML += `
        <div class="alert alert-info">
          <div class="alert-icon">ℹ️</div>
          <div class="alert-content">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        </div>
      `;
    });
  
    // Summary
    content.innerHTML += `
      <div class="summary-box">
        <h3>Summary</h3>
        <p>${analysis.summary}</p>
      </div>
    `;
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractAndAnalyze') {
      const existingSidebar = document.getElementById('privacy-analyzer-sidebar');
      const sidebar = existingSidebar || createSidebar();
      
      if (!existingSidebar) {
        setTimeout(() => sidebar.classList.add('open'), 100);
      } else {
        sidebar.classList.add('open');
      }
  
      document.getElementById('loading').style.display = 'block';
      document.getElementById('analysis-content').style.display = 'none';
  
      const text = extractPageText();
      chrome.runtime.sendMessage({
        action: 'analyzeText',
        text: text
      });
    }
    
    if (request.action === 'updateAnalysis') {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('analysis-content').style.display = 'block';
      updateSidebarContent(request.analysis);
    }
  
    if (request.action === 'error') {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('analysis-content').innerHTML = `
        <div class="alert alert-danger">
          <div class="alert-icon">❌</div>
          <div class="alert-content">
            <h3>Error</h3>
            <p>${request.message}</p>
          </div>
        </div>
      `;
    }
  });