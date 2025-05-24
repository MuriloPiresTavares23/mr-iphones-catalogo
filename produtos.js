// Funções para o painel e o catálogo
function autenticar() {
  const senha = document.getElementById('senha').value;
  if (senha === "1234") {
    document.getElementById('conteudo').style.display = 'block';
  } else {
    alert("Senha incorreta!");
  }
}
function trocarAba(aba) {
  document.querySelectorAll('.aba').forEach(div => div.style.display = 'none');
  document.getElementById(aba).style.display = 'block';
}

function adicionarProduto() {
  const nome = document.getElementById('nome').value;
  const categoria = document.getElementById('categoria').value;
  const descricao = document.getElementById('descricao').value;
  const imagem = document.getElementById('imagem').files[0];

  if (!nome || !categoria || !descricao || !imagem) return alert("Preencha todos os campos");

  const ref = storage.ref('produtos/' + imagem.name);
  ref.put(imagem).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      db.collection("produtos").add({ nome, categoria, descricao, imagem: url }).then(() => {
        alert("Produto adicionado!");
        document.getElementById('nome').value = "";
        document.getElementById('categoria').value = "";
        document.getElementById('descricao').value = "";
        document.getElementById('imagem').value = "";
      });
    });
  });
}

function carregarProdutos(filtro = "Todos") {
  const container = document.getElementById('produtos-container') || document.getElementById('lista-produtos');
  container.innerHTML = "";
  db.collection("produtos").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      if (filtro === "Todos" || data.categoria === filtro) {
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `<img src="${data.imagem}"><h3>${data.nome}</h3><p>${data.descricao}</p>`;
        container.appendChild(div);
      }
    });
  });
}
function filtrar(categoria) {
  carregarProdutos(categoria);
}

window.onload = () => carregarProdutos();
