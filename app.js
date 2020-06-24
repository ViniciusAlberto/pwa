'use strict';


var ajax = new XMLHttpRequest();

// Seta tipo de requisição e URL com os parâmetros
ajax.open("GET", "../pwa/dados.json", true);

// Envia a requisição
ajax.send();

// Cria um evento para receber o retorno.
ajax.onload = function () {

    // Caso o state seja 4 e o http.status for 200, é porque a requisiçõe deu certo.
    if (ajax.readyState == 4 && ajax.status == 200) {

        // Retorno do Ajax
        var data = ajax.responseText;

        var data_json = JSON.parse(data);


        if (data_json.length == 0) {
          //fazer
        } else {
          
            

            var list_extrato = $('.list-group');

            list_extrato[0].innerHTML = "";

            var html_extrato = "";
            for (var i = 0; i < data_json.length; i++) {

                html_extrato += template_extrato(data_json[i]['credito'], data_json[i]['data'], data_json[i]['url'], data_json[i]['restaurante'], data_json[i]['valor']);

            }

            list_extrato[0].innerHTML = html_extrato;

            cache_list(data_json);
        }
    }
}


var template_extrato = function (credito, data, url, restaurante, valor) {

    var classCredito = credito == true ? "credito": "";
 

    return '<li class="list-group-item">' +
    '           <div class="'+classCredito+ '">'+
    '                <p class=""><small class="text-muted">'+data+'</small></p>'+
    '                <img class="img-extrato" src="' +url +'">'+
    '                <span>'+restaurante+'</span>'+
    '                <span class="valor-extrato text-nowrap text-right">'+
                        valor+
    '                </span>'+
    '            </div>'+
    '       </li>';
}



var cache_list = function (data_json) {

    if ('caches' in window) {

        caches.delete('extrato-list').then(function () {

            console.log('Cache do Extrato deletado com sucesso!');


            if (data_json.length > 0) {

                var arquivos = ['dados.json'];

                for (var i = 0; i < data_json.length; i++) {

                    arquivos.push(data_json[i]['url']);

                }

                console.log("Arquivos a serem gravados em cache:");
                console.log(arquivos);

                caches.open('extrato-list').then(function (cache) {
                    cache.addAll(arquivos)
                        .then(function () {
                            console.log("Arquivos cacheados com sucesso!");
                        });
                });

            }

        });

    }
}

let deferredInstallPrompt = null;
const botaoInstalar = document.getElementById('instalar');

let initialiseUI = function(){ 
    botaoInstalar.removeAttribute('hidden');
    botaoInstalar.addEventListener('click', function(){
        deferredInstallPrompt.prompt();
   
    });

}

window.addEventListener('beforeinstallprompt', gravarEvento);

function gravarEvento(evt){

    deferredInstallPrompt = evt;
}

window.addEventListener('appinstalled', (evt) => {
    $('#successinstall').modal('show');
    $('#instalar').hide();
});

