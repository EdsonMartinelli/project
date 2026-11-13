# Ideias

Nesse arquivo escreverei todas as ideias que tive para esse projeto, explicando as motivações, dificuldades e estratégias utilizadas em cada decisão do projeto.

## Tratamento de Erros

A execução de um programa pode ser encerrada por alguns motivos:

- **Envio de signals manualmente ou por outros programas**: Um CTRL+C em um terminal que está executando o programa ou um `kill pid` no processo geram signals, como SIGTERM e SIGKILL, que encerram ou pausam o programa.

- **Erros de lógica que causam falha em execução**: Dois exemplos clássicos são o NullPointerException e o ArrayOutOfBounds do Java, sendo o primeiro causado pela tentativa de acessar atributos ou métodos de um objeto Null, e o segundo pela tentiva de acessar um índice fora do array.

- _**Throws**_ não gerenciados**: Um throw não gerenciado (não envolvido por um try/catch) em Typescript promove o encerramento do programa na hora que é lançado.

O término de execução por signals é desejado na maioria dos casos, normalmente sendo tratado com um _Graceful Shutdown_ que, como indicado na documento do Express, impossibilita novas requisições ao servidor e aguarda o termino no último processo para finalizaro programa. Contudo, encerramento por erros de lógica em execução e _throws_ não gerenciados são encerramentos extremamente indesejável.

Para evitar erros de lógica que quebrem o programa em execução os mais variados testes podem ser utilizados em possíveis _edge cases_ para garantir que esses casos se comportem de maneira adquada. Esse método em conjunto com um editor de texto ou IDE configura permite a descoberta e o tratamento desses erros.

_Throws_ não gerenciados podem ser evitados da mesma forma que os erros de lógica. Contudo, esse projeto possui outra abordagem.

### O Problema do _Throw_

Uma coisa que sempre me incomodou nos meus projetos passados foi a maneira utilizada para o tratamento de erros que
ainda era feito de maneira exaustiva (e de certa forma rudimentar).

Apesar de ser amplamente utilizada, a utilização de _throw_ pode gerar diversas complicações principalmente quando é utilizada em Typescript, onde qualquer tipo pode ser lançado.

```Typescript
function errorFunction(){
    throw "anything";
}

```

Essa característica é algo que torna o código imprevisível na atribuição de tipagem ao erro capturado pelo _catch_ visto que esse não está restrito ao tipo `Error` e , portanto, deve ser tipado como `unknown` ou `any`.

```Typescript
try {
    errorFunction();
} catch (error: unknown) { }

```

Devido a isso, uma tratativa exaustiva deve ser feito no catch utilizando o `instanceof` para verificar a instância do erro capturado, fazendo esse tratamento rapidamente sair do controle de um _controller_.

```Typescript
function errorFunction(){
    throw new Error("error message");
}

try {
    errorFunction();
} catch (error: unknown) {
    if(error instanceof Error){
      console.log(error.message)
    } else {
      console.log("Not a Error instance.")
    }
}
```

Devido aos problemas citados, esse projeto visa a remoção completa de _throws_ nos serviços que implementam as regras de negócio, permitindo apenas o tratamento de bibliotecas externas por meio de _try/catch_ que devem ser encapsuladas em _repositories_.

### Uso de Monad

Com a intenção de promover uma nova abordagem para o tratamento de erros, esse projeto utiliza uma monad de _Result_ que encapsulam o valor obtido por uma operação e concatena esse valor com novas operações. Essa
