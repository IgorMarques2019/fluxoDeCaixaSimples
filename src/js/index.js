let widthScreen450 = window.matchMedia('(max-width: 450px)').matches;
let widthScreen580 = window.matchMedia('(max-width: 580px)').matches;
let footerDoc = document.querySelector('footer')
let dataHoje = new Date()
footerDoc.innerHTML = `Fluxo de caixa ${dataHoje.getFullYear()} <strong><a href="https://github.com/IgorMarques2019" target="_blank">Github</a></strong> - All Rights Reserved.`
var lancamentos = JSON.parse(localStorage.getItem('@Lancamentos')) || []
if (widthScreen450) {
  mobileMenu()
}


if (widthScreen580) {
  modalButtons()
}

function mobileMenu() {
  let menuToggle = document.querySelector('header .container  > img')
  let btnLançamento = document.querySelector('header .container button')



  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open')
    btnLançamento.classList.toggle('open')
    if (btnLançamento.classList.contains('open')) {
      menuToggle.setAttribute('src', './src/img/icons/menu_open.svg')
    } else {
      menuToggle.setAttribute('src', './src/img/icons/menu_closed.svg')
    }
  })
}

function modalButtons() {
  let buttonsModal = document.querySelector('#header-buttons')
  let modalParent = document.querySelector('#modal_lancamento')
  modalParent.appendChild(buttonsModal)
}

function showModal() {



  let menuToggle = document.querySelector('header .container  > img')
  let btnLançamento = document.querySelector('header .container button')
  let SaveLancamento = document.querySelector('.container-modal #saveLancamento')
  let closeModal = document.querySelector('.container-modal #closeModal')
  let modalParent = document.querySelector('.container-modal ')







  SaveLancamento.addEventListener('click', () => {

    let modal = document.querySelector('.container-modal');
    let titleLancamento = document.querySelector('.container-modal #titleLancamento')
    let valueLancamento = document.querySelector('.container-modal #valorLancamento')
    let categoria = document.querySelector('.container-modal #categoria')

    function newLancamento(desc, precos, categ) {
      this.descricao = desc;
      this.preco = precos;
      this.categoria = categ;
    }
    if (titleLancamento.value != '' && valueLancamento.value != '' && categoria.value != '') {
      let novoFluxo = new newLancamento(titleLancamento.value, valueLancamento.value, categoria.value)
      lancamentos.push(novoFluxo)
    }

    titleLancamento.value = ''
    valueLancamento.value = ''
    categoria.value = ''
    //Envia pra memoria local do usuário
    localStorage.setItem('@Lancamentos', JSON.stringify(lancamentos))

    modal.classList.toggle('showModal')
    renderTable()
  })


  btnLançamento.addEventListener('click', () => {
    modalParent.classList.toggle('showModal')
  })

  closeModal.addEventListener('click', () => {
    btnLançamento.classList.toggle('open')
    modalParent.classList.toggle('showModal')
    if (btnLançamento.classList.contains('open')) {
      menuToggle.setAttribute('src', './src/img/icons/menu_open.svg')
    } else {
      menuToggle.setAttribute('src', './src/img/icons/menu_closed.svg')
    }
  })
}
showModal()

let btnClean = document.querySelector('#cleanBtn')

function cleanData() {
  let option = confirm('Deseja Limpar a tabela ?')

  if (option == true) {
    lancamentos = [];
    localStorage.setItem('@Lancamentos', JSON.stringify(lancamentos))
    renderTable();
    renderGraph()
  } else {
    renderTable();
    renderGraph()
    return false;
  }
}

function renderTable() {
  let table = document.querySelector('.container-table table tbody')
  table.innerHTML = ''
  let entrada = 0;
  let saida = 0;

  lancamentos.map((values) => {


    let pEntradaSaldo = document.querySelector('#entrada-saldo')
    let pSaidaSaldo = document.querySelector('#saida-saldo')
    let diferencaSaldo = document.querySelector('#diferenca-saldo')

    let table = document.querySelector('.container-table table tbody')
    let newTr = document.createElement('tr')
    let tdDesk = document.createElement('td')
    let tdPreco = document.createElement('td')
    let tdCat = document.createElement('td')

    tdDesk.innerHTML = values.descricao;
    tdPreco.innerHTML = formatCurrency(Number(values.preco), "BRL");
    tdCat.innerHTML = values.categoria;

    switch (tdCat.innerHTML) {
      case 'Entrada':
        tdCat.classList.add('entrada')
        entrada += Number(values.preco)
        break;

      case 'Saida':
        tdCat.classList.add('saida')
        saida += Number(values.preco)
        break;
    }
    pEntradaSaldo.innerHTML = formatCurrency(Number(entrada), "BRL");
    pSaidaSaldo.innerHTML = formatCurrency(Number(saida), "BRL");
    diferencaSaldo.innerHTML = formatCurrency(Number(entrada - saida), "BRL");

    newTr.append(tdDesk)
    newTr.append(tdPreco)
    newTr.append(tdCat)

    table.appendChild(newTr)

    function formatCurrency(amount, currency = "USD") {
      const options = {
        style: "currency",
        currency: currency,
      };

      return amount.toLocaleString(undefined, options);
    }




  })
  renderGraph(entrada, saida)


}
renderTable()

function renderGraph(a, b) {
  // Obtendo o contexto do canvas
  var ctx = document.getElementById('myChart').getContext('2d');

  // Criando o gráfico
  var myChart = new Chart(ctx, {
    type: 'bar', // Tipo de gráfico (pode ser 'bar', 'line', 'pie', etc.)
    data: {
      labels: ['Total'], // Rótulos dos dados
      datasets: [{
        label: 'Entrada',
        data: [a], // Valores dos dados
        backgroundColor: '#04d98c', // Cor de fundo das barras
        borderColor: 'rgba(0, 123, 255, 1)', // Cor da borda das barras
        borderWidth: 1 // Largura da borda das barras
      }, {
        label: 'Saida',
        data: [b], // Valores dos dados
        backgroundColor: '#d90444', // Cor de fundo das barras
        borderColor: 'rgba(0, 123, 255, 1)', // Cor da borda das barras
        borderWidth: 1 // Largura da borda das barras
      }]
    },
    options: {
      responsive: true, // Tornar o gráfico responsivo
      scales: {
        y: {
          beginAtZero: true // Começar o eixo Y a partir de zero
        }
      },
      indexAxis: 'x', // Define as barras no eixo Y
      elements: {
        bar: {
          barPercentage: 01 // Ajusta a largura das barras (valor entre 0 e 1)
        }
      }
    }
  });

}