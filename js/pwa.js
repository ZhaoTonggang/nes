//Service worker
function changeModel() {
    console.log('Modle changed');
    }
    
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          window.location.reload();
        });
    
    
        window.addEventListener("load", function() {
          const sw = window.navigator.serviceWorker;
          const killSW = window.killSW || false;
          if (!sw) {
            return;
          }
    
          if (!!killSW) {
            sw.getRegistration("./sw.js").then(registration => {
              registration.unregister && registration.unregister();
              window.caches &&
                caches.keys &&
                caches.keys().then(function(keys) {
                  keys.forEach(function(key) {
                    caches.delete(key);
                  });
                });
            });
          } else {
            sw.register("./sw.js")
              .then(registration => {
    //            console.log("Registered events at scope: ", registration.scope);
                if (registration.waiting) {
                  changeModel();
                  return;
                }
                registration.onupdatefound = function() {
                  const installingWorker = registration.installing;
                  installingWorker.onstatechange = function() {
                    switch (installingWorker.state) {
                      case "installed":
                        if (navigator.serviceWorker.controller) {
                          changeModel();
                        }
                        break;
                    }
                  };
                };
              })
              .catch(err => {
                console.error(err);
              });
          }
        });