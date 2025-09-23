// Client-safe DOM utility wrapper
let dom = null;

// Only load DOM utility on the client side
const getDom = () => {
  if (typeof window !== 'undefined' && !dom) {
    try {
      // Try dynamic import instead of require for browser compatibility
      import("@left4code/tw-starter/dist/js/dom").then(module => {
        dom = module.default;
      }).catch(() => {
        console.warn('Failed to load DOM utilities, using fallback');
        dom = createFallbackDom();
      });
      
      // Return fallback immediately while loading
      if (!dom) {
        dom = createFallbackDom();
      }
    } catch (error) {
      console.warn('Failed to load DOM utilities:', error);
      dom = createFallbackDom();
    }
  }
  
  return dom || createFallbackDom();
};

// Create a fallback DOM utility object
const createFallbackDom = () => {
  return (element) => ({
    slideDown: (duration) => {
      if (element && element.style) {
        element.style.display = 'block';
      }
    },
    slideUp: (duration) => {
      if (element && element.style) {
        element.style.display = 'none';
      }
    },
    fadeIn: (duration) => {
      if (element && element.style) {
        element.style.opacity = '1';
      }
    },
    fadeOut: (duration) => {
      if (element && element.style) {
        element.style.opacity = '0';
      }
    },
    show: () => {
      if (element && element.style) {
        element.style.display = 'block';
      }
    },
    hide: () => {
      if (element && element.style) {
        element.style.display = 'none';
      }
    },
    each: (callback) => {
      if (element && Array.isArray(element)) {
        element.forEach(callback);
      } else if (element) {
        callback(element);
      }
    },
    find: (selector) => {
      if (element && element.querySelectorAll) {
        return element.querySelectorAll(selector);
      }
      return [];
    },
    attr: (name, value) => {
      if (element && element.getAttribute) {
        if (value !== undefined) {
          element.setAttribute(name, value);
        } else {
          return element.getAttribute(name);
        }
      }
    },
    html: (content) => {
      if (element) {
        if (content !== undefined) {
          element.innerHTML = content;
        } else {
          return element.innerHTML;
        }
      }
    },
    css: (property, value) => {
      if (element && element.style) {
        if (value !== undefined) {
          element.style[property] = value;
        } else {
          return window.getComputedStyle(element)[property];
        }
      }
    },
    val: (value) => {
      if (element) {
        if (value !== undefined) {
          element.value = value;
        } else {
          return element.value;
        }
      }
    }
  });
};

export default getDom;