// Substitua com seu config do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Adicionar produto
async function adicionarProduto() {
  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const imagem = document.getElementById('imagemUrl').value;
  const categoria = document.getElementById('categoria').value;

  if (nome && descricao && imagem && categoria) {
    await db.collection("produtos").add({ nome, descricao, imagem, categoria });
    alert("Produto adicionado!");
    document.getElementById('nome').value = "";
    document.getElementById('descricao').value = "";
    document.getElementById('imagemUrl').value = "";
    document.getElementById('preview').style.display = "none";
  }
}

// Mostrar preview
function atualizarPreview() {
  const url = document.getElementById('imagemUrl').value;
  const img = document.getElementById('preview');
  img.src = url;
  img.style.display = url ? "block" : "none";
}

// Trocar abas
function trocarAba(aba) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.tab[onclick*="${aba}"]`).classList.add('active');
  document.getElementById(aba).classList.add('active');
  if (aba === 'gerenciar') listarProdutos();
}

// Listar e gerenciar produtos
async function listarProdutos() {
  const lista = document.getElementById('listaProdutos');
  lista.innerHTML = "";
  const snapshot = await db.collection("produtos").get();
  snapshot.forEach(doc => {
    const p = doc.data();
    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = \`
      <img src="\${p.imagem}" /><h3>\${p.nome}</h3><p>\${p.descricao}</p><p>Categoria: \${p.categoria}</p>
      <button onclick="removerProduto('\${doc.id}')">Excluir</button>
    \`;
    lista.appendChild(div);
  });
}

// Remover produto
async function removerProduto(id) {
  await db.collection("produtos").doc(id).delete();
  listarProdutos();
}

// Exibir catálogo
if (document.getElementById('produtos')) {
  db.collection("produtos").onSnapshot(snapshot => {
    const container = document.getElementById("produtos");
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      const div = document.createElement("div");
      div.className = "produto";
      div.setAttribute("data-categoria", p.categoria);
      div.innerHTML = \`
        <img src="\${p.imagem}" />
        <h3>\${p.nome}</h3>
        <p>\${p.descricao}</p>
        <a class="whatsapp" href="https://wa.me/5565999999999?text=Olá! Tenho interesse em \${encodeURIComponent(p.nome)}" target="_blank">Chamar no WhatsApp</a>
      \`;
      container.appendChild(div);
    });
  });
}

// Filtro de categorias
function filtrarCategoria(categoria) {
  document.querySelectorAll(".produto").forEach(p => {
    if (categoria === "Todos" || p.getAttribute("data-categoria") === categoria) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });
}