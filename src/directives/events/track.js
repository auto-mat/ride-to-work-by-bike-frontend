/*
 * Custom Vue.js click track event directive
 */
const clickTrackEvt = {
  mounted(el) {
    // Define a handler for custom click event
    const onClickTrack = (evt) => {
      // Dispatch a custom DOM event with optional data
      const cssClassLists = evt.currentTarget.classList;
      let targetElementName = evt.target.name;
      // Get checkbox widget name
      if (cssClassLists.contains('q-checkbox')) {
        targetElementName =
          evt.currentTarget.getElementsByTagName('input')[0].name;
      }
      if (!evt.target || !evt.target.name) {
        targetElementName = evt.currentTarget.name;
      }
      el.dispatchEvent(
        new CustomEvent('click-track', {
          detail: {
            timestamp: Date.now(),
            targetName: targetElementName,
          }, // Data to pass to the component
          bubbles: false, // Prevent bubbling to avoid conflicts
          cancelable: true,
        }),
      );
    };

    // Store the handler on the element to clean up later
    el._clickTrackHandler = onClickTrack;

    // Add the event listener to the document
    el.addEventListener('click', onClickTrack);
  },

  unmounted(el) {
    // Clean up remove the event listener when the element is unmounted
    document.removeEventListener('click', el._clickTrackHandler);
    delete el._clickTrackHandler; // Avoid memory leaks
  },
};

export { clickTrackEvt };
