const estados = [];
let municipio = "";
let municipioCifrado = "";
let erros = 0;

// -----------------------------------------------

const inicializa = () => {

  if (estados.length === 0) {
    
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
    .then(response => response.json())
    .then(dados => {
      dados.forEach(dado => {
        let estado = new Object();
        estado.id = dado.id;
        estado.nome = dado.nome;
        estados.push(estado);
      });
      montaTela();
    });
    
  } else {
    
    const divBotoes = document.getElementById("divBotoes");
    divBotoes.innerHTML = "";
    const forca = document.getElementById("forca");
    forca.src = "forca_0.png";
    montaTela();
    
  }
  
};

// -----------------------------------------------

const removeAcentos = text => {

  text = text.toUpperCase();
  text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'A');
  text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'E');
  text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'I');
  text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'O');
  text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'U');
  text = text.replace(new RegExp('[Ç]', 'gi'), 'C');
  
  return text;
  
};

// -----------------------------------------------

const cifrarPalavra = palavra => {
  
  let retorno = "";
  let contador = 0; // Loop needs an outside counter (because of conditions).

  for (let i = 0; i < palavra.length; i++) {

    let letra = palavra.charAt(i);

    if (contador <= 3) {

      let sorteio = Math.random();

      if (sorteio <= 0.5 && letra !== " ") {

        retorno += letra;
        contador++;
        
      } else if (letra === " ") {

        retorno += " ";
        
      } else {

        retorno += "_";
        
      }
      
    } else if (letra === " ") {
      
      retorno += " ";
      
    } else {
      
      retorno += "_";
      
    }
    
  }

  return retorno;
  
};

// -----------------------------------------------

const sorteiaMunicipio = estadoId => {

  let municipios = [];
  fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`)
  .then(response => response.json())
  .then(dados => {
    dados.forEach(dado => {
      let municipio = new Object();
      municipio.id = dado.id;
      municipio.nome = removeAcentos(dado.nome.toUpperCase());
      municipios.push(municipio);
    });
    let index = Math.floor(Math.random() * municipios.length);
    municipio = municipios[index].nome;
    municipioCifrado = cifrarPalavra(municipio);
    mostraLetra("");
  })
  
};

// -----------------------------------------------

const mostraLetra = letra => {

  let retorno = "";

  for (let i = 0; i < municipioCifrado.length; i++) {

    if (letra == municipio.charAt(i)) {
      
      retorno += letra;
      
    } else {

      retorno += municipioCifrado.charAt(i);
      
    }
    
  }

  const cifrada = document.getElementById("cifrada");
  municipioCifrado = retorno;
  cifrada.innerHTML = retorno;

  if (municipio === municipioCifrado) {
    reinicializa();
  }
  
};

// -----------------------------------------------

const mostraForca = () => {

  const forca = document.getElementById("forca");
  forca.src = "forca_" + erros + ".png";
  
};

// -----------------------------------------------

const reinicializa = () => {

  let reiniciar = confirm("Deseja reiniciar?");

  if (reiniciar) {

    erros = 0;
    inicializa();
    
  }
  
};

// -----------------------------------------------

const validaLetra = event => {

  if (erros < 6) {

    let letra = event.target.innerHTML;
    let certo = false;

    for (let i = 0; i < municipio.length; i++) {
      
      let letraMunicipio = municipio.charAt(i);
      let letraMunicipioCifrado = municipioCifrado.charAt(i);

      if (letra === letraMunicipio && letraMunicipioCifrado === "_") {

        certo = true;
        break;
        
      }
      
    }

    if (certo) {

      event.target.className = "botao_certo";
      mostraLetra(letra);
      
    } else {

      event.target.className = "botao_errado";
      erros++;
      mostraForca();
      
    }
    
  } else {

    alert("Você foi enforcado!\nE a palavra é " + municipio + "\n");
    reinicializa();
    
  }
  
};

// -----------------------------------------------

const montaTela = () => {

  const index = Math.floor(Math.random() * estados.length);
  const spanEstado = document.getElementById("estado");
  spanEstado.innerHTML = estados[index].nome;
  sorteiaMunicipio(estados[index].id);

  const divBotoes = document.getElementById("divBotoes");
  let letra = "A";

  while (letra >= "A" && letra <= "Z") {

    let button = document.createElement("button");
    button.type = "button";
    button.innerHTML = letra;
    button.className = "botao_neutro";
    button.onclick = event => validaLetra(event);
    divBotoes.appendChild(button);
    letra = String.fromCharCode(letra.charCodeAt(0) + 1);
    
  }
  
};

// -----------------------------------------------

inicializa();

// -----------------------------------------------