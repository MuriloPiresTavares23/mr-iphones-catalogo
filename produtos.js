
// Troque abaixo pela sua config do Firebase:
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "ID_MENSAGEM",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();
const produtosRef = database.ref("produtos");

// Adicionar produto
async function adicionarProduto() {
  const nome = document.getElementById("nome").value;
  const file = document.getElementById("imagem").files[0];
  const categoria = document.getElementById("categoria").value;
  const mensagem = document.getElementById("mensagem").value;

  if (!file) {
    alert("Envie uma imagem!");
    return;
  }

  const storageRef = storage.ref("imagens/" + Date.now() + "-" + file.name);
  await storageRef.put(file);
  const imageUrl = await storageRef.getDownloadURL();

  const novoProduto = {
    nome,
    imagem: imageUrl,
    categoria,
    mensagem
  };

  produtosRef.push(novoProduto).then(() => {
    alert("Produto adicionado!");
    location.reload();
  });
}

// Listar produtos no painel
if (document.getElementById("lista-produtos")) {
  produtosRef.on("value", (snapshot) => {
    const lista = document.getElementById("lista-produtos");
    lista.innerHTML = "";
    snapshot.forEach((child) => {
      const p = child.val();
      const div = document.createElement("div");
      div.className = "prod-item";
      div.innerHTML = `
        <strong>${p.nome}</strong><br/>
        <img src="${p.imagem}" class="image-preview"/>
        <small>${p.categoria}</small><br/>
        <button onclick="removerProduto('${child.key}')">Excluir</button>
      `;
      lista.appendChild(div);
    });
  });
}

function removerProduto(id) {
  if (confirm("Deseja excluir?")) {
    produtosRef.child(id).remove();
  }
}

// Exibir produtos no catálogo
if (document.getElementById("produtos-container")) {
  produtosRef.on("value", (snapshot) => {
    const container = document.getElementById("produtos-container");
    container.innerHTML = "";
    snapshot.forEach((child) => {
      const p = child.val();
      const div = document.createElement("div");
      div.className = "produto";
      div.setAttribute("data-categoria", p.categoria);
      div.innerHTML = `
        <img src="${p.imagem}" alt="${p.nome}" />
        <h3>${p.nome}</h3>
        <a href="https://wa.me/55YOURDDDNUMERO?text=${encodeURIComponent(p.mensagem)}" target="_blank">Comprar no WhatsApp</a>
      `;
      container.appendChild(div);
    });
  });
}

function filtrar(categoria) {
  document.querySelectorAll(".produto").forEach((el) => {
    el.style.display = categoria === "Todos" || el.dataset.categoria === categoria ? "block" : "none";
  });
}
