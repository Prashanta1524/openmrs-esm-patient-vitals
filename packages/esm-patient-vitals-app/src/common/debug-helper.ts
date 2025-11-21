// This file is just to help with debugging component registration
console.log('Debug helper file loaded');

// Add global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
  });
}

// Export a function to check if a component is registered
export function checkComponentRegistration() {
  console.log('Available exports from the module:');

  // This will run in the browser and print helpful debugging info
  if (typeof window !== 'undefined') {
    const appName = '@openmrs/esm-patient-vitals-app';
    console.log(`Looking for ${appName} in window.__webpack_modules__`);

    try {
      // @ts-ignore
      const modules = window.__webpack_modules__ || {};
      let found = false;

      Object.keys(modules).forEach((key) => {
        if (key.includes(appName)) {
          console.log(`Found module: ${key}`);
          found = true;

          try {
            // @ts-ignore
            const exports = window.__webpack_exports__?.[key];
            if (exports) {
              console.log('Module exports:', Object.keys(exports));
              if (exports.confDashboard) {
                console.log('confDashboard is exported!');
              } else {
                console.log('confDashboard is NOT found in exports');
              }
            }
          } catch (e) {
            console.error('Error inspecting exports:', e);
          }
        }
      });

      if (!found) {
        console.log(`No modules found for ${appName}`);
      }
    } catch (e) {
      console.error('Error in debug helper:', e);
    }
  }

  return true;
}

// Call this function automatically
setTimeout(() => {
  console.log('Running automatic component registration check...');
  checkComponentRegistration();
}, 2000);

// Run the check automatically
setTimeout(checkComponentRegistration, 2000);
