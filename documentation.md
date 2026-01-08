# Grammar Flow - Documentação de Funcionalidades

Este documento detalha todas as funcionalidades implementadas no aplicativo **Grammar Flow**, uma plataforma interativa para estudo de gramática inglesa.

## 1. Modos de Estudo

### 1.1. Modo de Blocos (Padrão)
*   **Funcionamento**: O usuário constrói frases clicando nas palavras disponíveis (Word Bank). As palavras movem-se para a área de resposta.
*   **Interação**: Clicar em uma palavra na área de resposta a devolve para o banco.
*   **Objetivo**: Facilitar a estruturação de frases para iniciantes, focando na ordem das palavras.

### 1.2. Type Mode (Digitação)
*   **Ativação**: Alternado através do switch "Type Mode" no topo da interface.
*   **Funcionamento**: Substitui os blocos por uma caixa de texto livre, permitindo que o usuário digite a resposta completa.
*   **Persistência Inteligente**: O aplicativo **memoriza** qual modo (Blocos ou Digitação) foi utilizado para responder cada questão específica.

## 2. Sistema de Persistência (Auto-Save 2.0)

O aplicativo utiliza o `localStorage` do navegador para salvar **todos** os dados em tempo real. Não há botão de salvar manual; tudo é automático.

*   **Sessão Centralizada**: O estado atual (Nível, Tópico, Dificuldade, Índice do Exercício) é salvo na chave `grammar_flow_session` a cada navegação. Ao reabrir o app, você volta exatamente para onde parou.
*   **Progresso**: Salva quais exercícios foram concluídos.
*   **Respostas**: Salva o texto ou blocos da resposta atual.
*   **Notas**: Salva anotações pessoais em tempo real (`grammar_flow_notes_<topicID>`).

## 3. Estrutura do Projeto

O projeto segue uma arquitetura web padrão organizada em pastas:

*   📂 **`/` (Raiz)**: Contém `index.html` (Aplicação Principal) e `lessons/` (Banco de Dados JSON).
*   📂 **`/css`**: Contém `style.css` (Estilos Globais e Temas).
*   📂 **`/js`**: Contém toda a lógica JavaScript:
    *   `script.js`: Lógica core da aplicação principal.
    *   `verbs.js`, `expressions.js`, etc.: Lógica das páginas de suporte.
*   📂 **`/pages`**: Contém as páginas adicionais:
    *   `verbs.html`, `expressions.html`, `false_friends.html`, `linking_words.html`, `collocations.html`.

## 4. Funcionalidades e Conteúdo

### 4.1. Gramática (Lessons)
*   **Níveis**: A1 (Iniciante) a B2 (Intermediário Superior).
*   **Temas**: Cores distintas para cada nível (Verde, Azul, Roxo, Âmbar) para melhor orientação visual.
*   **Dificuldade**: Sub-níveis (Explorer, Traveler, etc.) dentro de cada tópico.

### 4.2. Páginas de Suporte (Ferramentas)
*   **Verbs**: Lista dinâmica de verbos regulares e irregulares.
*   **Expressions**: Flashcards interativos para Phrasal Verbs, Idioms e Slang.
*   **False Friends**: Cards alertando sobre "falsos cognatos" comuns.
*   **Linking Words**: Guia de conectivos categorizados (Adição, Contraste, etc.).
*   **Collocations**: Combinações naturais de palavras (Make vs Do, etc.).

## 5. Dashboard e Métricas

Localizado entre o título e a área de exercícios:
*   **Barra de Progresso**: Visualização gráfica do percentual concluído no tópico.
*   **Contador**: `Exercícios Completados / Total`.

## 6. Stack Tecnológica

*   **HTML5/CSS3 (Vanilla)**: Sem frameworks pesados (React/Angular), garantindo carregamento instantâneo.
*   **JavaScript (ES6+)**: Modular e focado em performance.
*   **JSON Database**: Todo o conteúdo é gerenciado em arquivos JSON simples na pasta `lessons/`, permitindo fácil edição e expansão sem tocar no código.

---

## 7. Próximos Passos (Sugestões)

*   **Audio Support**: Adicionar TTS (Text-to-Speech) para ouvir as frases.
*   **Dark Mode**: Implementar tema escuro global.
*   **Gamification**: Sistema de pontos e ofensiva (streaks).
