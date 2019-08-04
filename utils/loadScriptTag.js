const loadScriptTag = (src, async = false, id) =>
  new Promise((resolve, reject) => {
    let resolved = false;
    let errored = false;
    const body = document.getElementsByTagName('body')[0];
    const tag = document.createElement('script');
    const [scripts] = document.getElementsByTagName('script');

    tag.type = 'text/javascript';
    if (id) {
      tag.id = id;
    }
    tag.async = async;

    const handleCallback = () => {
      if (resolved) return handleLoad();
      if (errored) return handleReject();
      const state = tag.readyState;
      if (state === 'complete') {
        return handleLoad();
      }
      return handleReject();
    };

    const handleLoad = () => {
      resolved = true;
      resolve(src);
    };
    const handleReject = () => {
      errored = true;
      reject(src);
    };

    tag.addEventListener('load', handleLoad);
    tag.onreadystatechange = handleCallback;
    tag.addEventListener('error', handleReject);
    tag.src = src;
    if (scripts) {
      scripts.parentNode.insertBefore(tag, scripts);
    } else {
      body.appendChild(tag);
    }
    return tag;
  });

export default loadScriptTag;
