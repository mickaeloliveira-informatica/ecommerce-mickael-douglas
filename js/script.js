document.addEventListener("DOMContentLoaded", function () {
  /* ===== 1. Menu que abre e fecha ===== */
  var menuBtn = document.getElementById("menuBtn");
  var menu = document.getElementById("menu");

  function alternarMenu() {
    var aberto = menu.classList.toggle("aberto");
    menuBtn.setAttribute("aria-expanded", aberto);
    menuBtn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  }
  menuBtn.addEventListener("click", alternarMenu);

  // Fecha o menu ao clicar em um link (mobile)
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (menu.classList.contains("aberto")) alternarMenu();
    });
  });

  /* ===== 2. Cálculo de frete (if/else) ===== */
  var formFrete = document.getElementById("formFrete");
  var resultadoFrete = document.getElementById("resultadoFrete");

  formFrete.addEventListener("submit", function (e) {
    e.preventDefault();
    var cep = document.getElementById("cep").value.trim();
    var valor = parseFloat(document.getElementById("valor").value);

    if (!/^\d{8}$/.test(cep)) {
      resultadoFrete.textContent = "Digite um CEP com 8 números.";
      return;
    }
    if (isNaN(valor) || valor <= 0) {
      resultadoFrete.textContent = "Informe o valor da compra.";
      return;
    }

    var regiao = cep.charAt(0);
    var frete;
    var prazo;

    if (valor >= 1000) {
      frete = 0;
      prazo = "5 a 8 dias úteis";
    } else if (regiao === "6" || regiao === "5") {
      // Norte e Nordeste (CEPs iniciados em 5 e 6)
      frete = 19.9;
      prazo = "3 a 5 dias úteis";
    } else if (regiao === "0" || regiao === "1" || regiao === "2" || regiao === "3") {
      // Sudeste
      frete = 34.9;
      prazo = "5 a 7 dias úteis";
    } else {
      frete = 42.9;
      prazo = "7 a 10 dias úteis";
    }

    if (frete === 0) {
      resultadoFrete.textContent = "Frete grátis! Entrega em " + prazo + ".";
    } else {
      resultadoFrete.textContent =
        "Frete: R$ " + frete.toFixed(2).replace(".", ",") + ". Entrega em " + prazo + ".";
    }
  });

  /* ===== 3. Validação do formulário de contato ===== */
  var formContato = document.getElementById("formContato");
  var resultadoContato = document.getElementById("resultadoContato");
  var campos = ["nome", "email", "mensagem"];

  function mensagemDeErro(campo) {
    var v = campo.validity;
    if (v.valueMissing) return "Preencha este campo.";
    if (v.typeMismatch) return "Digite um e-mail válido, como nome@exemplo.com.";
    if (v.tooShort) return "Use pelo menos " + campo.minLength + " caracteres.";
    return "";
  }

  function validarCampo(campo) {
    var erro = document.getElementById("erro-" + campo.id);
    var texto = mensagemDeErro(campo);
    erro.textContent = texto;
    campo.classList.toggle("invalido", texto !== "");
    return texto === "";
  }

  campos.forEach(function (id) {
    var campo = document.getElementById(id);
    campo.addEventListener("blur", function () { validarCampo(campo); });
    campo.addEventListener("input", function () {
      if (campo.classList.contains("invalido")) validarCampo(campo);
    });
  });

  formContato.addEventListener("submit", function (e) {
    e.preventDefault();
    var valido = true;
    campos.forEach(function (id) {
      if (!validarCampo(document.getElementById(id))) valido = false;
    });

    if (valido) {
      resultadoContato.textContent = "Mensagem enviada. Responderemos em até 2 dias úteis.";
      formContato.reset();
    } else {
      resultadoContato.textContent = "";
      var primeiro = formContato.querySelector(".invalido");
      if (primeiro) primeiro.focus();
    }
  });
});

/* ===== 4. Carrinho, filtro de produtos e abas ===== */
document.addEventListener("DOMContentLoaded", function () {
  /* Carrinho */
  var total = 0;
  var contador = document.getElementById("contadorCarrinho");
  var botaoCarrinho = document.getElementById("botaoCarrinho");
  document.querySelectorAll(".btn-comprar").forEach(function (botao) {
    botao.addEventListener("click", function () {
      total++;
      contador.textContent = total;
      botaoCarrinho.setAttribute("aria-label", "Carrinho, " + total + (total === 1 ? " item" : " itens"));
      botao.classList.add("ok");
      setTimeout(function () { botao.classList.remove("ok"); }, 800);
    });
  });

  /* Filtro de produtos por categoria */
  var chips = document.querySelectorAll(".chip");
  var produtos = document.querySelectorAll(".produto");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filtro = chip.getAttribute("data-filtro");
      chips.forEach(function (c) {
        var ativo = c === chip;
        c.classList.toggle("ativo", ativo);
        c.setAttribute("aria-pressed", ativo);
      });
      produtos.forEach(function (p) {
        p.hidden = filtro !== "todos" && p.getAttribute("data-cat") !== filtro;
      });
    });
  });

  /* Abas "Para cada espaço" */
  var abas = document.querySelectorAll(".aba");
  var paineis = document.querySelectorAll(".painel");
  abas.forEach(function (aba) {
    aba.addEventListener("click", function () {
      abas.forEach(function (a) {
        var ativa = a === aba;
        a.classList.toggle("ativa", ativa);
        a.setAttribute("aria-selected", ativa);
      });
      paineis.forEach(function (p) {
        p.hidden = p.id !== aba.getAttribute("aria-controls");
      });
    });
  });
});
