/**
 * Wallet Bridge Script
 * 
 * This script provides a bridge between the main site's wallet system
 * and the slots application. It ensures that balance updates are properly
 * synchronized between the two.
 */

(function() {
  console.log('🔄 Wallet Bridge: Initializing');
  
  // Function to trigger balance update from main site
  function triggerBalanceUpdate() {
    if (window.updateSimpBalance) {
      console.log('🔄 Wallet Bridge: Triggering balance update');
      window.updateSimpBalance();
    } else {
      console.warn('⚠️ Wallet Bridge: updateSimpBalance function not found');
    }
  }
  
  // Initial balance update
  setTimeout(function() {
    triggerBalanceUpdate();
  }, 1000);
  
  // Set up periodic updates (every 3 seconds)
  setInterval(function() {
    triggerBalanceUpdate();
  }, 3000);
  
  // When a wallet connects, trigger an update
  window.addEventListener('walletConnected', function() {
    console.log('🔄 Wallet Bridge: Wallet connected event detected');
    setTimeout(function() {
      triggerBalanceUpdate();
    }, 500);
  });
  
  // Expose utility functions
  window.walletBridge = {
    triggerBalanceUpdate: triggerBalanceUpdate
  };
  
  console.log('✅ Wallet Bridge: Initialized successfully');
})();