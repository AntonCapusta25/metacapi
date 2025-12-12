/**
 * Website B - Conversion tracking script
 * Place this on the page with the "Finish" button
 */

// Configuration - UPDATE THESE
const CAPI_ENDPOINT = 'https://your-vercel-app.vercel.app/api/meta-capi';
const EVENT_NAME = 'SubmitApplication';

// Get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Get tracking parameters from URL or cookies
function getTrackingParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    fbp: urlParams.get('fbp') || getCookie('_fbp'),
    fbc: urlParams.get('fbc') || getCookie('_fbc'),
  };
}

// Generate unique event ID for deduplication
function generateEventId() {
  return EVENT_NAME.toLowerCase() + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Send event to CAPI
async function sendCapiEvent(eventId, additionalData = {}) {
  const trackingParams = getTrackingParams();
  
  const payload = {
    eventName: EVENT_NAME,
    eventSourceUrl: window.location.href,
    fbp: trackingParams.fbp,
    fbc: trackingParams.fbc,
    userAgent: navigator.userAgent,
    eventId: eventId,
    ...additionalData,
  };

  try {
    const response = await fetch(CAPI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('CAPI Response:', result);
    return result;
  } catch (error) {
    console.error('CAPI Error:', error);
    return null;
  }
}

// Track conversion
function trackConversion(additionalData = {}) {
  const eventId = generateEventId();
  
  // Fire browser pixel event (with deduplication ID)
  if (window.fbq) {
    fbq('track', EVENT_NAME, {}, { eventID: eventId });
    console.log('Pixel event fired:', EVENT_NAME, eventId);
  } else {
    console.warn('Meta Pixel not loaded');
  }
  
  // Fire CAPI event (with same deduplication ID)
  sendCapiEvent(eventId, additionalData);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const finishButton = document.getElementById('finish-button'); // Change to your button ID
  
  if (!finishButton) {
    console.error('Finish button not found');
    return;
  }

  finishButton.addEventListener('click', function(e) {
    console.log('Finish button clicked, tracking conversion...');
    
    // Optional: collect additional data
    const additionalData = {
      // email: document.getElementById('email')?.value,
      // phone: document.getElementById('phone')?.value,
    };
    
    trackConversion(additionalData);
  });
});
