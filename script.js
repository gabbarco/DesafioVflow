//Função para adicionar Produto
document.getElementById('addProduto').addEventListener('click', function () {
    // Clonando a div produtosContainer
    const produtosContainer = document.getElementById('produtosContainer');
    const novoProdutosContainer = produtosContainer.cloneNode(true);

    // Atualizando o número do produto no título
    const panelTitle = novoProdutosContainer.querySelector('.panel-title');
    const produtoCount = document.querySelectorAll('.produto-container').length + 1;
    panelTitle.textContent = 'Produto ' + produtoCount;

    // Limpando os campos de texto nos novos campos clonados
    novoProdutosContainer.querySelectorAll('input').forEach(function (input) {
        input.value = '';
    });

    // Anexando o novo contêiner após o último contêiner de produtos
    produtosContainer.parentElement.appendChild(novoProdutosContainer);

    // Adicionando um ouvinte de evento de entrada (input) aos campos "Quantidade em Estoque" e "Valor Unitário" deste novo produto
    const qtdEstoqueInput = novoProdutosContainer.querySelector('input[name^="qtdEstoque"]');
    const valorUnitarioInput = novoProdutosContainer.querySelector('input[name^="valorUnitario"]');

    qtdEstoqueInput.addEventListener('input', calcularValorTotal);
    valorUnitarioInput.addEventListener('input', calcularValorTotal);
});


// Adicionando um ouvinte de evento de entrada (input) aos campos "Quantidade em Estoque" e "Valor Unitário" do produto
const qtdEstoqueInput = document.getElementById('qtdEstoque1');
const valorUnitarioInput = document.getElementById('valorUnitario1');

qtdEstoqueInput.addEventListener('input', calcularValorTotal);
valorUnitarioInput.addEventListener('input', calcularValorTotal);

// Função para calcular o valor total com base na quantidade em estoque e no valor unitário
function calcularValorTotal() {
    const container = this.closest('.produto-container')
    const qtdEstoqueInput = container.querySelector('input[name^="qtdEstoque"]');
    const valorUnitarioInput = container.querySelector('input[name^="valorUnitario"]');
    const valorTotalInput = container.querySelector('input[name^="valorTotal"]');

    const qtdEstoque = parseFloat(qtdEstoqueInput.value);
    const valorUnitario = parseFloat(valorUnitarioInput.value);

    // Verifique se ambos os campos têm valores válidos
    if (!isNaN(qtdEstoque) && !isNaN(valorUnitario)) {
        const valorTotal = qtdEstoque * valorUnitario;
        valorTotalInput.value = valorTotal.toFixed(2); // Define o valor total com 2 casas decimais
    } else {
        valorTotalInput.value = ''; // Limpa o campo de valor total se houver valores inválidos
    }
}

//Função para excluir os produtos
document.addEventListener('click', function (e) {
    // Adicionando um ouvinte de evento de clique aos botões "🗑️" dentro do panel-body
        if (e.target && e.target.id === 'botaoRemoverProduto') {
            if (document.querySelectorAll('.produto-container').length > 1) {
                // Encontrando o contêiner de produto ao qual o botão de remover pertence
                let container = e.target.parentElement
                // Removendo o contêiner de produto correspondente
                container.remove();
            } else {
                alert('Obrigatória a existência de pelo menos 1 produto');
            }
        }
});

const anexos = []

document.getElementById('addAnexo').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');
    fileInput.value = null; // Limpa o valor do campo de entrada de arquivo
    fileInput.click(); // Abre o diálogo de seleção de arquivo
});

document.getElementById('fileInput').addEventListener('change', function (e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
        // Armazenando o arquivo em sessão (usando Session Storage) para posterior visualização
        sessionStorage.setItem('anexo', selectedFile.name);
        anexos.push(selectedFile);

        // Criando um novo elemento de anexo na lista
        const anexosContainer = document.getElementById('corpoAnexo')

        const novoAnexo = document.createElement('div');
        novoAnexo.id = "anexosContainer"
        novoAnexo.style.marginTop = '2vh'

        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn btn-danger';
        btnRemover.innerHTML = '🗑️';

        const btnVisualizar = document.createElement('button');
        btnVisualizar.className = 'btn btn-info';
        btnVisualizar.style.marginLeft = '1.8vh';
        btnVisualizar.innerHTML = '👁️';

        const textoAnexo = document.createElement('text');
        textoAnexo.style.marginLeft = '3vh';
        const anexoCount = document.getElementById('corpoAnexo').children.length + 1;
        textoAnexo.textContent = "Documento Anexo " + anexoCount;

        // Adicionando as propriedades do anexo ao container novo Anexo
        novoAnexo.appendChild(btnRemover);
        novoAnexo.appendChild(btnVisualizar);
        novoAnexo.appendChild(textoAnexo);

        anexosContainer.appendChild(novoAnexo)
        
        // Ouvinte de evento de clique para remover o anexo adicionado
        btnRemover.addEventListener('click', function () {
            //Acha o index anexo correspondente ao botão e o remove
            const index = anexosContainer.children.length - 1;
            if (index === 0) {
                alert('Obrigatória a existência de pelo menos 1 anexo');
            } else {
                anexos.splice(index, 1);
                anexosContainer.removeChild(novoAnexo);
            }
        });

        // Ouvinte de evento de clique para vizualizar o anexo adicionado
        btnVisualizar.addEventListener('click', function () {
            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const base64Data = event.target.result;
                    if (base64Data) {
                        const win = window.open('visualizacao.html', '_blank');
                        win.document.write('<img src="' + base64Data + '">');
                    }
                };
                reader.readAsDataURL(selectedFile);
            }
        });
    }
});

//Função para remover o documento Anexo Padrão
document.getElementById('botaoRemoverAnexo').addEventListener('click', function (e) {
    const anexosContainer = document.getElementById('corpoAnexo')
    if (e.target.id=='botaoRemoverAnexo') {
        if (anexosContainer.children.length  > 1) {
            //Acha o anexo correspondente ao botão e o remove
            const anexo = e.target.parentElement;
            anexo.remove();
        } else {
            alert('Obrigatória a existência de pelo menos 1 anexo');
        }
    }
});

//Função para vizualizar o documento Anexo Padrão
document.getElementById('botaoVizualizarAnexo').addEventListener('click', function (e) {
    // Nome do arquivo a ser visualizado
    const selectedFile = 'documento-modelo.png';

    if (e.target.id == 'botaoVizualizarAnexo') {
        if (selectedFile) {
            // Usa a API fetch para carregar o arquivo
            fetch(selectedFile)
                .then(response => response.blob())
                .then(blob => {
                    const base64Data = URL.createObjectURL(blob);

                    // Abre uma nova guia e exibe a imagem com base64
                    const win = window.open('visualizacao.html', '_blank');
                    win.document.write('<img src="' + base64Data + '">');
                })
                .catch(error => {
                    console.error('Erro ao carregar o arquivo:', error);
                });
        }
    }
});

//Função para preencher o endereço automaticamente com o CEP
document.getElementById('cep').addEventListener('blur', function () {
    const cep = this.value.replace('-', '').replace(/\D/g, '');

    if (cep.length === 8) {
        // Requisição à API ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    // Preenche os campos do endereço com os dados obtidos
                    document.getElementById('endereco').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('municipio').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                } else {
                    alert('CEP não encontrado. Verifique se o CEP digitado está correto.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
            });
    }
});

//Função para salvar os dados do fornecedor em JSON
document.getElementById('salvarFornecedor').addEventListener('click', function () {
    // Exibe o modal de loading
    document.getElementById('loadingModal').style.display = 'block';

    setTimeout(function () {
        // Fecha o modal de loading após 1 segundo
        document.getElementById('loadingModal').style.display = 'none';
    }, 1000);
    // Função para verificar se um campo obrigatório está vazio
    function isRequiredFieldEmpty(fieldId) {
        const field = document.getElementById(fieldId);
        return field.hasAttribute('required') && !field.value;
    }

    // Verifica se algum campo obrigatório está vazio
    if (
        isRequiredFieldEmpty('razaoSocial') ||
        isRequiredFieldEmpty('nomeFantasia') ||
        isRequiredFieldEmpty('cnpj') ||
        isRequiredFieldEmpty('insEstadual') ||
        isRequiredFieldEmpty('insMunicipal') ||
        isRequiredFieldEmpty('cep') ||
        isRequiredFieldEmpty('endereco') ||
        isRequiredFieldEmpty('num') ||
        isRequiredFieldEmpty('complemento') ||
        isRequiredFieldEmpty('bairro') ||
        isRequiredFieldEmpty('municipio') ||
        isRequiredFieldEmpty('estado') ||
        isRequiredFieldEmpty('pessoaContato') ||
        isRequiredFieldEmpty('tel') ||
        isRequiredFieldEmpty('email')
    ) {
        // Se algum campo obrigatório estiver vazio, não continua
        document.getElementById('loadingModal').style.display = 'none';
        return;
    }

    // Formatação dos dados em um objeto JSON
    const fornecedorData = {
        razaoSocial: document.getElementById('razaoSocial').value,
        nomeFantasia: document.getElementById('nomeFantasia').value,
        cnpj: document.getElementById('cnpj').value,
        inscricaoEstadual: document.getElementById('insEstadual').value,
        inscricaoMunicipal: document.getElementById('insMunicipal').value,
        nomeContato: document.getElementById('cep').value,
        nomeContato: document.getElementById('endereco').value,
        nomeContato: document.getElementById('num').value,
        nomeContato: document.getElementById('complemento').value,
        nomeContato: document.getElementById('bairro').value,
        nomeContato: document.getElementById('municipio').value,
        nomeContato: document.getElementById('estado').value,
        nomeContato: document.getElementById('pessoaContato').value,
        telefoneContato: document.getElementById('tel').value,
        emailContato: document.getElementById('email').value,
        produtos: [], // Dados dos produtos
        anexos: [] // Dados dos anexos
    };

    const produtosContainer = document.getElementById('produtosContainer').parentElement;
    const produtoDivs = produtosContainer.querySelectorAll('.produto-container');

    // Preenchimento do array de produtos
    produtoDivs.forEach((produtoDiv, indice) => {
        const descricao = produtoDiv.querySelector(`#descricao1`).value;
        const undMedida = produtoDiv.querySelector(`#undMedida1`).value;
        const qtdEstoque = produtoDiv.querySelector(`#qtdEstoque1`).value;
        const valorUnitario = produtoDiv.querySelector(`#valorUnitario1`).value;
        const valorTotal = produtoDiv.querySelector(`#valorTotal1`).value;
    
        fornecedorData.produtos.push({
            indice: indice + 1,
            descricaoProduto: descricao,
            unidadeMedida: undMedida,
            qtdeEstoque: qtdEstoque,
            valorUnitario: valorUnitario,
            valorTotal: valorTotal
        });
    });

    const anexosContainer = document.getElementById('corpoAnexo');
    const anexoDivs = anexosContainer.querySelectorAll('#anexosContainer');

    //Preenchimento do array de anexos
    anexoDivs.forEach((anexoDiv, indice) => {
        const nomeArquivo = anexoDiv.querySelector('text').textContent;
        const selectedAnexo = anexos[indice-1];
        if (selectedAnexo) {
            const reader = new FileReader();   
            reader.onload = function (e) {
                const binaryData = e.target.result;
                // Criação de um Blob a partir dos dados binários
                fornecedorData.anexos.push({
                    indice: indice + 1,
                    nomeArquivo: nomeArquivo,
                    blobArquivo: binaryData
                });
            };
            reader.readAsDataURL(selectedAnexo);
        } else {
            const selectedFile = 'documento-modelo.png';
            if (selectedFile) {
                // Uso da API fetch para carregar o arquivo padrão
                fetch(selectedFile)
                    .then(response => response.blob())
                    .then(blob => {
                        const base64Data = URL.createObjectURL(blob);
                        fornecedorData.anexos.push({
                            indice: indice + 1,
                            nomeArquivo: nomeArquivo,
                            blobArquivo: base64Data
                        });
                    })
            }
        }
    });

    // Exibição do JSON no console do navegador
    console.log(fornecedorData);

    // Converte o objeto fornecedorData em uma string JSON
    const jsonData = JSON.stringify(fornecedorData);
    console.log(jsonData)

    // Cria um elemento 'a' para fazer o download
    const jsonLink = document.createElement('a');
    jsonLink.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonData);
    jsonLink.download = 'fornecedorData.json';
    jsonLink.click();
    event.preventDefault()
});
