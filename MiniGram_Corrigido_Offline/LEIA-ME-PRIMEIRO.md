# MiniGram — versão corrigida, offline

## Mudanças

- **A tela inicial é a única timeline.** Não existe mais uma segunda tela de publicações.
- O cabeçalho foi reduzido para **62 dp**, com foto, nome e indicação para editar.
- Toque no cabeçalho para abrir a **tela de perfil** (foto, apelido e biografia).
- A tela de perfil utiliza a **mesma identidade visual escura e roxa** da tela inicial.
- Os posts de texto e imagens são publicados diretamente na timeline inicial.
- Curtir, comentar e excluir as próprias publicações são ações funcionais.
- Perfil, publicações, curtidas e comentários são salvos **localmente neste aparelho**.
- Três publicações fictícias aparecem na primeira utilização, identificadas como **Exemplo**.
- Sem Firebase, API, internet ou sincronização entre aparelhos.

## Como abrir no Android Studio

1. Extraia o ZIP. **Não abra o ZIP como se fosse um projeto.**
2. Android Studio → File → Open.
3. Selecione a pasta `MiniGram_Corrigido_Offline`, que contém `settings.gradle.kts`.
4. Aguarde a sincronização do Gradle.
5. Selecione um emulador ou celular e clique em Run.

## Arquivos principais

- `app/src/main/java/com/example/minigram/MainActivity.java` — timeline única.
- `app/src/main/java/com/example/minigram/ProfileActivity.java` — perfil separado.
- `app/src/main/java/com/example/minigram/MiniGramData.java` — dados e imagens locais.
- `app/src/main/res/layout/activity_main.xml` — tela inicial compacta.
- `app/src/main/res/layout/activity_profile.xml` — edição de perfil escura.
- `app/src/main/AndroidManifest.xml` — declara as duas atividades.

## Observações

A instalação não precisa de internet para o funcionamento, mas o Android Studio pode precisar baixar dependências do Gradle na primeira compilação.

Os posts e curtidas ficam salvos apenas neste dispositivo e podem desaparecer ao **desinstalar** o aplicativo. Posts da versão original antiga que existiam apenas em memória não podem ser recuperados após a reinicialização.

A estrutura do projeto, as referências aos recursos e os arquivos XML foram verificados. **Não foi possível compilar nem rodar em emulador nesta máquina.** Valide a primeira execução pelo Android Studio.
