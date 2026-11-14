# Ideias

Nesse arquivo escreverei todas as ideias que tive para esse projeto, explicando as motivações, dificuldades e estratégias utilizadas em cada decisão do projeto.

# Tratamento de Erros

A execução de um programa pode ser encerrada por alguns motivos:

- **Envio de signals manualmente ou por outros programas**: Um CTRL+C em um terminal que está executando o programa ou um `kill pid` no processo geram signals, como SIGTERM e SIGKILL, que encerram ou pausam o programa.

- **Erros de lógica que causam falha em execução**: Dois exemplos clássicos são o NullPointerException e o ArrayOutOfBounds do Java, sendo o primeiro causado pela tentativa de acessar atributos ou métodos de um objeto Null, e o segundo pela tentativa de acessar um índice fora do array.

- _**Throws**_ não gerenciados**: Um throw não gerenciado (não envolvido por um try/catch) em Typescript promove o encerramento do programa na hora que é lançado.

O término de execução por signals é desejado na maioria dos casos, normalmente sendo tratado com um _Graceful Shutdown_ que, como indicado no documento do Express, impossibilita novas requisições ao servidor e aguarda o término do último processo para finalizar o programa. Contudo, os encerramentos por erros de lógica em execução e _throws_ não gerenciados são encerramentos extremamente indesejáveis.

Para evitar erros de lógica que quebrem o programa em execução, os mais variados testes podem ser utilizados em possíveis _edge cases_ para garantir que esses casos se comportem de maneira adequada. Esse método, em conjunto com um editor de texto ou IDE, permite a descoberta e o tratamento desses erros.

Embora os _throws_ não gerenciados possam ser evitados da mesma forma que os erros de lógica, esse projeto adota outra abordagem para o problema.

## O Problema do _Throw_

Uma coisa que sempre me incomodou nos meus projetos passados foi a maneira utilizada para o tratamento de erros que
ainda era feita de maneira exaustiva (e de certa forma rudimentar).

Apesar de ser amplamente utilizada, a utilização de _throw_ pode gerar diversas complicações, principalmente quando é utilizada em Typescript, onde qualquer tipo pode ser lançado.

```Typescript
function errorFunction(){
    throw "anything";
}

```

Essa característica é algo que torna o código imprevisível na atribuição de tipagem ao erro capturado pelo _catch_, visto que esse não está restrito ao tipo `Error` e, portanto, deve ser tipado como `unknown` ou `any`.

```Typescript
try {
    errorFunction();
} catch (error: unknown) { }

```

Devido a isso, uma tratativa exaustiva deve ser feita no catch, utilizando o `instanceof` para verificar a instância do erro capturado, fazendo esse tratamento rapidamente sair do controle de um _controller_.

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

## Uso de _Monads_

Com a intenção de promover uma nova abordagem para o tratamento de erros, esse projeto utiliza _monads_ de _Success_ e _Failure_ que implementam a interface de _Result<T,E>_, onde T é o tipo de dados gerenciado pela _Success_ e E o tipo de dado gerenciado pela _Failure_. Essas _monads_ encapsulam o valor obtido por uma operação e concatenam esse valor com novas operações por meio de uma função `bind`. Ao final do processamento, o resultado final pode ser obtido da _monad_ por meio da função `unwrap`.

Esse comportamento, além de controlar o retorno em casos de sucesso ou falha, provê uma estrutura de código muito mais legível, onde o passo a passo do processo pode ser facilmente encontrado por meio da corrente de _binds_.

```Typescript

function functionBind1(data: number): Result<number, string>{
    if(data == 0) return new Success(data + 1);
    return new Failure("First bind fail!");
}

function functionBind2(data: number): Result<number, string>{
    if(data == 1) return new Success(data + 1);
    return new Failure("Second bind fail!");
}

const result = new Success(initialNumber).bind(functionBind1).bind(functionBind2);

unwrap(result, {
    onSuccess: (data) => {functionInCaseOfSuccess()},
    onFailure: (error) => {functionInCaseOfFailure()},
});
```

No caso acima, dependendo do valor de `initialNumber`, podemos ter um caso de sucesso ou de falha,
onde a primeira falha deve se propagar por toda a extensão da corrente, sendo atribuída ao valor do
parâmetro `error` da função passada como `onFailure` para o `unwrap`. Em outras palavras, recebemos o erro tipado, diferente do que acontece no uso do _throw_.

## Problemas Assíncronos

O principal problema da abordagem com _monads_ é que o _bind_ nem sempre deve funcionar de maneira síncrona,
podendo aceitar funções assíncronas durante a corrente. Infelizmente, isso não pode ser resolvido apenas
adicionando outra função `bind` à _monad_ para gerenciar esses casos, já que a avaliação de uma função
assíncrona gera uma _Promise_ que deve ser resolvida com `then` ou `await`.

Devido à falta de sobrecarga (_overload_) de funções no Typescript por causa de sua natureza, a função `bindAsync`
foi implementada. Isso pode quebrar um pouco o ritmo de escrita, mas é legível e melhor que lidar com condicionais para a verificação de tipos.

```Typescript
new Success(data).bindAsync(fnAsync).bindAsync(fnAsync); //❌ Promise.bindAsync é undefined

new Success(data).bindAsync(fnAsync).then((data) => bindAsync(fnAsync);) //✔️ Retorna uma Promise, mas exige um boilerplate.

const firstResult = await new Success(data).bindAsync(fnAsync);
const finalResult = firstResult.bindAsync(fnAsync); //✔️ Retorna uma Promise, mas quebra a corrente com awaits.
```

A utilização do `then`, embora exija um boilerplate para a passagem do parâmetro, ainda mantém a corrente,
algo muito desejável para a legibilidade. Para resolver esse problema, uma função auxiliar pode ser utilizada, garantindo o mínimo de boilerplate possível.

```Typescript
function bindWith<T, U, D>(fn: (data: T) => Promise<Result<D, U>>): (obj: Result<T, U>) => Promise<Result<D, U>>{
    return (obj: Result<T, U>) => obj.bindAsync(fn);
}

new Success(data)
    .bindAsync(asyncFunctionBind1)
    .then(bindWith(asyncFunctionBind2));
```

## Uma monad para uma monad

Outra forma de resolver esse problema é criar uma outra _monad_ que envolve as _monads_ de _Result_ dadas como _Promises_. Para isso, a _monad_ _ResultAsync_ foi criada com uma função `bind` semelhante à função `bindWith`, mas que utiliza o `then` internamente e retorna um outro objeto _ResultAsync_, permitindo a concatenação direta.

Além disso, as classes que implementam _Result_ devem também implementar uma função capaz de tornar o atual objeto _Result_ em objeto _ResultAsync_, o que, além de permitir o uso do _ResultAsync_, ainda discrimina o atual momento onde o processo se tornou assíncrono, visto que uma vez assíncrono, é impossível voltar atrás.

```Typescript
new Success(data)
      .bind(syncFunctionBind)
      .asynchronous()
      .bind(asyncFunctionBind1)
      .bind(asyncFunctionBind2)
```

Tal método devolve a legibilidade e a consistência dos métodos assíncronos após o primeiro _bind_ assíncrono, mas tem um grande potencial de interromper o fluxo dado pelas _monads_. Isso ocorre porque a função retornada
agora não é um _Result_ com um `unwrap`, mas um _ResultAsync_.

Além disso, essa mudança retira a flexibilidade da abordagem, já que funções que retornem _ResultAsync_ não são bem aceitas no sistema, já que nenhum método implementado gerencia esse tipo de parâmetro. Embora seja possível modificar todos métodos para aceitarem tal característica, isso impõe algo muito incômodo: **É necessário que toda função assíncrona tenha seu resultado envelopado por um objeto _ResultAsync_**.

Como esse comportamento é algo indesejável para esse projeto, a solução simples foi obter a _Promise Result_ diretamente do objeto _ResultAsync_ por meio de uma função da própria classe (como uma função `finish`, ou `getPromise`), o que torna o código muito mais gerenciável.

```Typescript
new Success(data)
      .bind(syncFunctionBind)
      .asynchronous()
      .bind(asyncFunctionBind1)
      .bind(asyncFunctionBind2)
      .finish()
```

Para resolver o problema do `unwrap`, uma nova função `unwrapAsync` pode ser chamada, mas aceitando um _ResultAsync_ como parâmetro de entrada.

## Síncrono dentro de um Contexto Assíncrono

Um exemplo de código desejável é escrito abaixo:

```Typescript
async function getResult(){
    const syncResult = syncFunction1();

    const asyncResult = await asyncFunction(syncResult);

    const finalResult = syncFunction2(asyncResult);
}
```

Uma função assíncrona pode ser seguida por uma função síncrona, embora o contexto ainda permaneça assíncrono. _ResultAsync_ não permite tal sequência, visto que lida exclusivamente com funções assíncronas. Novamente, devido à falta de sobrecarga de funções, uma função `bindSync` deve ser criada para a implantação dessa característica na abordagem.

Com uma implementação semelhante ao `bind` normal do _ResultAsync_, a função `getResult` pode ser escrita nessa abordagem da seguinte forma:

```Typescript
async function getResult(){
    new Success(syncFunctio1)
        .asynchronous()
        .bind(asyncFunction)
        .bindSync(syncFunction2)
        .finish()
}
```

## Resultado

Com essa abordagem é possível a tipagem do erro, desinchar o _controller_ que agora não precisa verificar a instância do erro exaustivamente e gerar uma maior legibilidade enquanto mantém a flexibilidade permitida pelas demais abordagens por meio de uma abstração que possui praticamente custo zero.
