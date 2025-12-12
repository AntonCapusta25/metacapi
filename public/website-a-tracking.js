/**
 * Website A - Cross-domain tracking script
 * Place this on the page with the button that links to Website B
 */

// Get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const applyButton = document.getElementById('apply-button'); // Change to your button ID
  
  if (!applyButton) {
    console.error('Apply button not found');
    return;
  }

  applyButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get Meta cookies
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    
    // Get the target URL (change to your Website B URL)
    const targetUrl = new URL('https://your-website-b.com');
    
    // Pass tracking parameters
    if (fbp) targetUrl.searchParams.set('fbp', fbp);
    if (fbc) targetUrl.searchParams.set('fbc', fbc);
    
    // Optional: pass additional tracking data
    // targetUrl.searchParams.set('source', 'website-a');
    
    console.log('Redirecting with tracking params:', targetUrl.toString());
    
    // Redirect to Website B
    window.location.href = targetUrl.toString();
  });
});
