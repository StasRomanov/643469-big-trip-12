const CACHE_PREFIX = `big_trip_web`;
const CACHE_VER = `v12`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;
const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = `basic`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `/`,
          `/fonts/Montserrat/Montserrat-Black.ttf`,
          `/fonts/Montserrat/Montserrat-BlackItalic.ttf`,
          `/fonts/Montserrat/Montserrat-Bold.ttf`,
          `/fonts/Montserrat/Montserrat-BoldItalic.ttf`,
          `/fonts/Montserrat/Montserrat-ExtraBold.ttf`,
          `/fonts/Montserrat/Montserrat-ExtraBoldItalic.ttf`,
          `/fonts/Montserrat/Montserrat-ExtraLight.ttf`,
          `/fonts/Montserrat/Montserrat-ExtraLightItalic.ttf`,
          `/fonts/Montserrat/Montserrat-Italic.ttf`,
          `/fonts/Montserrat/Montserrat-Light.ttf`,
          `/fonts/Montserrat/Montserrat-LightItalic.ttf`,
          `/fonts/Montserrat/Montserrat-Medium.ttf`,
          `/fonts/Montserrat/Montserrat-MediumItalic.ttf`,
          `/fonts/Montserrat/Montserrat-Regular.ttf`,
          `/fonts/Montserrat/Montserrat-SemiBold.ttf`,
          `/fonts/Montserrat/Montserrat-SemiBoldItalic.ttf`,
          `/fonts/Montserrat/Montserrat-Thin.ttf`,
          `/fonts/Montserrat/Montserrat-ThinItalic.ttf`,
          `/index.html`,
          `/bundle.js`,
          `/css/style.css`,
          `/img/icons/bus.png`,
          `/img/icons/check-in.png`,
          `/img/icons/drive.png`,
          `/img/icons/flight.png`,
          `/img/icons/restaurant.png`,
          `/img/icons/ship.png`,
          `/img/icons/sightseeing.png`,
          `/img/icons/taxi.png`,
          `/img/icons/train.png`,
          `/img/icons/transport.png`,
          `/img/photos/1.jpg`,
          `/img/photos/2.jpg`,
          `/img/photos/3.jpg`,
          `/img/photos/4.jpg`,
          `/img/photos/5.jpg`,
          `/img/header-bg.png`,
          `/img/header-bg@2x.png`,
          `/img/logo.png`,
        ]);
      })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
      .then(
          (keys) => Promise.all(
              keys.map(
                  (key) => {
                    if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                      return caches.delete(key);
                    }
                    return null;
                  })
            .filter((key) => key !== null)
          )
      )
  );
});

const handleFetch = (evt) => {
  const {request} = evt;
  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }
          return fetch(request)
            .then((response) => {
              if (!response || response.status !== HTTP_STATUS_OK || response.type !== RESPONSE_SAFE_TYPE) {
                return response;
              }
              const clonedResponse = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, clonedResponse));
              return response;
            });
        })
  );
};

self.addEventListener(`fetch`, handleFetch);
