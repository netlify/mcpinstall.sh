/**
 * MCP Server Configuration Copy Buttons
 * Adds copy functionality to pre elements containing mcpServers configurations
 */

function addCopyButtons() {
  // Find all pre elements that contain "mcpServers"
  const preElements = document.querySelectorAll('pre');
  
  preElements.forEach(pre => {
    const content = pre.textContent || '';
    if (content.includes('mcpServers')) {
      try {
        const jsonData = JSON.parse(content);
        if (jsonData.mcpServers) {
          createCopyButtonsForPre(pre, jsonData);
        }
      } catch (e) {
        // Not valid JSON, skip
      }
    }
  });
}

function createCopyButtonsForPre(preElement, jsonData) {
  // Check if buttons already exist
  if (preElement.querySelector('.mcp-copy-buttons')) {
    return;
  }

  // Make the pre element position relative so we can position buttons absolutely within it
  preElement.style.position = 'relative';

  // Create button container positioned at bottom right
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'mcp-copy-buttons absolute bottom-2 right-2 flex gap-1 z-10';
  
  // Get the first server for named config copy
  const serverNames = Object.keys(jsonData.mcpServers);
  const firstServerName = serverNames[0];
  const firstServerConfig = jsonData.mcpServers[firstServerName];

  // Create buttons - all using the same style as "Copy Named Server Config"
  const buttons = [
    {
      text: 'Copy All',
      data: JSON.stringify(jsonData, null, 2)
    },
    {
      text: 'Copy Named Config',
      data: JSON.stringify({ [firstServerName]: firstServerConfig }, null, 2),
    },
    {
      text: 'Copy Config Only',
      data: JSON.stringify(firstServerConfig, null, 2)
    }
  ];

  buttons.forEach(buttonConfig => {
    const button = document.createElement('button');
    button.textContent = buttonConfig.text;
    button.className = `px-2 py-1 text-xs font-medium rounded transition-colors duration-200 bg-[#006f92] hover:bg-[#1d4f74] text-white cursor-pointer shadow-sm min-w-[120px]`;
    
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(buttonConfig.data);
        
        // Visual feedback
        const originalText = button.textContent;
        const originalClassName = button.className;
        button.textContent = 'Copied!';
        button.className = 'px-2 py-1 text-xs font-medium rounded transition-colors duration-200 bg-green-600 text-white shadow-sm min-w-[120px]';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.className = originalClassName;
        }, 1000);
      } catch (err) {
        console.error('Failed to copy:', err);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = buttonConfig.data;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          const originalText = button.textContent;
          const originalClassName = button.className;
          button.textContent = 'Copied!';
          button.className = 'px-2 py-1 text-xs font-medium rounded transition-colors duration-200 bg-green-600 text-white shadow-sm';
          setTimeout(() => {
            button.textContent = originalText;
            button.className = originalClassName;
          }, 1000);
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
          // Show error feedback
          const originalText = button.textContent;
          button.textContent = 'Copy failed';
          setTimeout(() => {
            button.textContent = originalText;
          }, 1000);
        }
        document.body.removeChild(textArea);
      }
    });
    
    buttonContainer.appendChild(button);
  });

  // Insert button container inside the pre element (floating over it)
  preElement.appendChild(buttonContainer);
}

// Initialize when DOM is ready
function initializeCopyButtons() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCopyButtons);
  } else {
    addCopyButtons();
  }
}

// Auto-initialize
initializeCopyButtons();
