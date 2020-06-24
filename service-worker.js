'use strict';

const CACHE_NAME = 'saldo-refeicao-versao-1';

const FILES_TO_CACHE = [

    'img/icons/favicon.ico',
    'img/logo.png',
    'img/cifrao.png',
    'css/styles.css',
    'bootstrap/css/bootstrap.min.css',
    'bootstrap/css/bootstrap.min.css.map',
    'bootstrap/js/bootstrap.min.js',
    'bootstrap/js/bootstrap.min.js.map',
    'js/jquery-3.5.1.min.js',
    'js/popper.min.js',
    'js/popper.min.js.map',
    'offline.html',

];

self.addEventListener('install', (evt) => {

    console.log('[ServiceWorker] Instalando...');

    evt.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            console.log('[ServiceWorker] Fazendo cache dos arquivos da aplicação');
            return cache.addAll(FILES_TO_CACHE);
        })

    );
});

self.addEventListener('activate', (evt) => {

    console.log('[ServiceWorker] Ativando...');

    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) => {

                //console.log('[ServiceWorker] Removendo cache antigo...');
                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Recebendo', evt.request.url);

    if (evt.request.mode !== 'navigate') {

        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match('offline.html');
                    });
            })
    );

});