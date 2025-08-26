/**
 * MCP Server Configuration Copy Buttons
 * Adds copy functionality to pre elements containing MCP server configurations
 * Supports various configuration formats including mcpServers, servers, amp.mcpServers, etc.
 */

/**
 * Highlights the copied text within the pre element using CSS-based highlighting
 * @param {HTMLElement} preElement - The pre element containing the text
 * @param {string} copiedData - The data that was copied to clipboard
 */
function highlightCopiedText(preElement, copiedData) {
  // Clear any existing highlights
  clearTextHighlight(preElement);
  
  // Parse the copied JSON to normalize it
  let copiedJson;
  try {
    copiedJson = JSON.parse(copiedData);
  } catch (e) {
    console.warn('Copied data is not valid JSON, falling back to text matching');
    highlightEntireElement(preElement);
    return;
  }
  
  // Find the DOM range that matches the copied JSON structure
  const range = findJsonRange(preElement, copiedJson);
  
  if (range) {
    try {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Add visual styling to the selection
      addSelectionHighlight();
      
      // Clear the highlight after 1 second
      setTimeout(() => {
        clearTextHighlight(preElement);
      }, 1000);
    } catch (error) {
      console.warn('Failed to highlight text using Selection API:', error);
      highlightEntireElement(preElement);
    }
  } else {
    // Fallback to highlighting the entire element
    highlightEntireElement(preElement);
  }
}

/**
 * Finds the DOM range that contains the JSON structure matching the copied data
 * @param {HTMLElement} element - The pre element containing the JSON
 * @param {Object} targetJson - The parsed JSON object we're looking for
 * @returns {Range|null} - DOM Range that contains the matching JSON, or null if not found
 */
function findJsonRange(element, targetJson) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const allTextNodes = [];
  let node;
  while (node = walker.nextNode()) {
    allTextNodes.push(node);
  }
  
  // Try to find a range that when stringified matches our target JSON
  for (let startIdx = 0; startIdx < allTextNodes.length; startIdx++) {
    for (let endIdx = startIdx; endIdx < allTextNodes.length; endIdx++) {
      const range = document.createRange();
      
      try {
        // Set range from start of startIdx node to end of endIdx node
        range.setStart(allTextNodes[startIdx], 0);
        range.setEnd(allTextNodes[endIdx], allTextNodes[endIdx].textContent.length);
        
        const rangeText = range.toString();
        
        // Try to parse the range text as JSON
        let rangeJson;
        try {
          // Trim whitespace to avoid matching whitespace-padded JSON
          const trimmedRangeText = rangeText.trim();
          rangeJson = JSON.parse(trimmedRangeText);
          
          // If we successfully parsed, check if this JSON matches our target
          if (jsonMatches(rangeJson, targetJson)) {
            // Create a new range that excludes leading/trailing whitespace
            const trimmedRange = createTrimmedRange(range, rangeText, trimmedRangeText);
            return trimmedRange || range;
          }
        } catch (e) {
          // Not valid JSON yet, continue expanding
          continue;
        }
        
        // If we have a valid JSON but it doesn't match, try to find the exact subset
        const subsetRange = findJsonSubset(range, targetJson, allTextNodes, startIdx, endIdx);
        if (subsetRange) {
          return subsetRange;
        }
        
      } catch (e) {
        // Range creation failed, continue
        continue;
      }
    }
  }
  
  return null;
}

/**
 * Creates a trimmed range that excludes leading and trailing whitespace
 * @param {Range} originalRange - The original range
 * @param {string} originalText - The original text from the range
 * @param {string} trimmedText - The trimmed text
 * @returns {Range|null}
 */
function createTrimmedRange(originalRange, originalText, trimmedText) {
  try {
    // Find the start and end positions of the trimmed text within the original text
    const leadingWhitespaceLength = originalText.indexOf(trimmedText);
    const trailingWhitespaceStart = leadingWhitespaceLength + trimmedText.length;
    
    if (leadingWhitespaceLength === -1) {
      return null;
    }
    
    // Get all text nodes in the original range
    const walker = document.createTreeWalker(
      originalRange.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      node => originalRange.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
      false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    // Build character position map
    let currentPos = 0;
    const nodePositions = [];
    
    for (const textNode of textNodes) {
      nodePositions.push({
        node: textNode,
        startPos: currentPos,
        endPos: currentPos + textNode.textContent.length
      });
      currentPos += textNode.textContent.length;
    }
    
    // Find start and end positions for the trimmed content
    let startContainer = null;
    let startOffset = 0;
    let endContainer = null;
    let endOffset = 0;
    
    for (const nodePos of nodePositions) {
      // Find start position (after leading whitespace)
      if (!startContainer && nodePos.startPos <= leadingWhitespaceLength && nodePos.endPos > leadingWhitespaceLength) {
        startContainer = nodePos.node;
        startOffset = leadingWhitespaceLength - nodePos.startPos;
      }
      
      // Find end position (before trailing whitespace)
      if (!endContainer && nodePos.startPos <= trailingWhitespaceStart && nodePos.endPos >= trailingWhitespaceStart) {
        endContainer = nodePos.node;
        endOffset = trailingWhitespaceStart - nodePos.startPos;
        break;
      }
    }
    
    if (startContainer && endContainer) {
      const trimmedRange = document.createRange();
      trimmedRange.setStart(startContainer, startOffset);
      trimmedRange.setEnd(endContainer, endOffset);
      return trimmedRange;
    }
    
  } catch (e) {
    console.warn('Failed to create trimmed range:', e);
  }
  
  return null;
}

/**
 * Tries to find a more precise range within a larger JSON structure
 * @param {Range} parentRange - The range containing valid JSON
 * @param {Object} targetJson - The JSON we're looking for
 * @param {Text[]} textNodes - All text nodes
 * @param {number} startIdx - Starting node index
 * @param {number} endIdx - Ending node index
 * @returns {Range|null}
 */
function findJsonSubset(parentRange, targetJson, textNodes, startIdx, endIdx) {
  const parentText = parentRange.toString();
  
  // Use character-by-character expansion to find the exact match
  for (let charStart = 0; charStart < parentText.length; charStart++) {
    for (let charEnd = charStart + 1; charEnd <= parentText.length; charEnd++) {
      const substring = parentText.substring(charStart, charEnd);
      try {
        // Trim whitespace to avoid matching whitespace-padded JSON
        const trimmedSubstring = substring.trim();
        const substringJson = JSON.parse(trimmedSubstring);
        if (jsonMatches(substringJson, targetJson)) {
          // Find the actual start and end of the trimmed content
          const trimmedStart = charStart + substring.indexOf(trimmedSubstring);
          const trimmedEnd = trimmedStart + trimmedSubstring.length;
          
          // Convert character positions back to DOM range
          return createRangeFromCharPositions(parentRange, trimmedStart, trimmedEnd);
        }
      } catch (e) {
        // Not valid JSON, continue
        continue;
      }
    }
  }
  
  return null;
}

/**
 * Creates a DOM range from character positions within a parent range
 * @param {Range} parentRange - The parent range
 * @param {number} charStart - Start character position
 * @param {number} charEnd - End character position
 * @returns {Range|null}
 */
function createRangeFromCharPositions(parentRange, charStart, charEnd) {
  try {
    // Get the text content of the parent range to work with
    const parentText = parentRange.toString();
    const targetText = parentText.substring(charStart, charEnd);
    
    // Now find this target text within the original pre element
    const preElement = parentRange.commonAncestorContainer.nodeType === Node.ELEMENT_NODE ? 
      parentRange.commonAncestorContainer : 
      parentRange.commonAncestorContainer.parentElement;
    
    // Find the pre element if we're not already in it
    const actualPreElement = preElement.closest('pre') || preElement;
    
    // Get all text nodes in the pre element
    const walker = document.createTreeWalker(
      actualPreElement,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    // Build up text and find where our target substring appears
    let fullText = '';
    const nodePositions = [];
    
    for (const textNode of textNodes) {
      nodePositions.push({
        node: textNode,
        startPos: fullText.length,
        endPos: fullText.length + textNode.textContent.length
      });
      fullText += textNode.textContent;
    }
    
    // Find the target text in the full text
    const targetStartIndex = fullText.indexOf(targetText);
    if (targetStartIndex === -1) {
      console.warn('Could not find target text in pre element');
      return null;
    }
    
    const targetEndIndex = targetStartIndex + targetText.length;
    
    // Find which nodes contain the start and end positions
    let startContainer = null;
    let startOffset = 0;
    let endContainer = null;
    let endOffset = 0;
    
    for (const nodePos of nodePositions) {
      // Check if start position is in this node
      if (!startContainer && nodePos.startPos <= targetStartIndex && nodePos.endPos > targetStartIndex) {
        startContainer = nodePos.node;
        startOffset = targetStartIndex - nodePos.startPos;
      }
      
      // Check if end position is in this node
      if (!endContainer && nodePos.startPos <= targetEndIndex && nodePos.endPos >= targetEndIndex) {
        endContainer = nodePos.node;
        endOffset = targetEndIndex - nodePos.startPos;
        break;
      }
    }
    
    if (startContainer && endContainer) {
      const range = document.createRange();
      range.setStart(startContainer, startOffset);
      range.setEnd(endContainer, endOffset);
      return range;
    }
    
  } catch (e) {
    console.warn('Failed to create range from character positions:', e);
  }
  
  return null;
}

/**
 * Checks if two JSON objects are equivalent
 * @param {*} json1 
 * @param {*} json2 
 * @returns {boolean}
 */
function jsonMatches(json1, json2) {
  return JSON.stringify(json1) === JSON.stringify(json2);
}

/**
 * Adds CSS styling to make the selection more visible
 */
function addSelectionHighlight() {
  // Add a temporary style to make selections more visible
  let style = document.getElementById('mcp-selection-highlight');
  if (!style) {
    style = document.createElement('style');
    style.id = 'mcp-selection-highlight';
    document.head.appendChild(style);
  }
  
  style.textContent = `
    ::selection {
      background-color: #007092ab !important;
      color: white !important;
    }
    ::-moz-selection {
      background-color: #006f92 !important;
      color: white !important;
    }
  `;
}

/**
 * Highlights the entire pre element as a fallback
 * @param {HTMLElement} preElement 
 */
function highlightEntireElement(preElement) {
  // Add a temporary visual highlight to the entire element
  const originalBorder = preElement.style.border;
  const originalBoxShadow = preElement.style.boxShadow;
  
  preElement.style.border = '2px solid #006f92';
  preElement.style.boxShadow = '0 0 10px rgba(0, 111, 146, 0.3)';
  
  setTimeout(() => {
    preElement.style.border = originalBorder;
    preElement.style.boxShadow = originalBoxShadow;
  }, 1000);
}

/**
 * Clears any text highlighting
 * @param {HTMLElement} preElement 
 */
function clearTextHighlight(preElement) {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
  }
  
  // Remove the selection highlight style
  const style = document.getElementById('mcp-selection-highlight');
  if (style) {
    style.remove();
  }
}

/**
 * Finds the first object that contains a key with "mcpservers" substring (case-insensitive)
 * @param {Object} obj - The object to search
 * @returns {Object|null} - The servers object or null if not found
 */
function findMcpServersObject(obj) {
  if (!obj || typeof obj !== 'object') return null;
  
  // Check direct properties for mcpservers substring (case-insensitive)
  for (const [key, value] of Object.entries(obj)) {
    if (key.toLowerCase().includes('mcpservers') || key.toLowerCase().includes('servers')) {
      if (value && typeof value === 'object') {
        return value;
      }
    }
  }
  
  return null;
}

/**
 * Finds the key name that contains the mcpservers configuration
 * @param {Object} obj - The object to search
 * @returns {string|null} - The key name or null if not found
 */
function findMcpServersKey(obj) {
  if (!obj || typeof obj !== 'object') return null;
  
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase().includes('mcpservers') || key.toLowerCase().includes('servers')) {
      if (obj[key] && typeof obj[key] === 'object') {
        return key;
      }
    }
  }
  
  return null;
}

function addCopyButtons() {
  // Find all pre elements that contain "mcpServers" or "servers" (case-insensitive)
  const preElements = document.querySelectorAll('pre');
  
  preElements.forEach(pre => {
    const content = pre.textContent || '';
    // Check for mcpservers or servers substring (case-insensitive)
    if (content.toLowerCase().includes('mcpservers') || content.toLowerCase().includes('servers')) {
      try {
        const jsonData = JSON.parse(content);
        const serversObject = findMcpServersObject(jsonData);
        if (serversObject) {
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
  const servers = findMcpServersObject(jsonData) || {};
  const serversKey = findMcpServersKey(jsonData);
  const serverNames = Object.keys(servers);
  const firstServerName = serverNames[0];
  const firstServerConfig = servers[firstServerName];

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
        
        // Highlight the copied text in the pre element
        highlightCopiedText(preElement, buttonConfig.data);
        
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
          
          // Highlight the copied text in the pre element
          highlightCopiedText(preElement, buttonConfig.data);
          
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
