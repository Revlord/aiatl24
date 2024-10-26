const CLAUDE_API_KEY = 'your-api-key-here';

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {action: 'extractAndAnalyze'});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeText') {
    analyzeWithClaude(request.text)
      .then(analysis => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'updateAnalysis',
          analysis: analysis
        });
      })
      .catch(error => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'error',
          message: 'Failed to analyze text'
        });
      });
  }
});

async function analyzeWithClaude(text) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Analyze this privacy policy/terms of service and return a JSON object with the following structure:
        {
          "high_risk": [{"title": "string", "description": "string"}],
          "medium_risk": [{"title": "string", "description": "string"}],
          "low_risk": [{"title": "string", "description": "string"}],
          "summary": "string"
        }
        
        Text to analyze: ${text}`
      }]
    })
  });
  
  const data = await response.json();
  return JSON.parse(data.content[0].text);
}