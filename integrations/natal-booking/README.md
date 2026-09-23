# Agenda de Natal CASTA, sem Pixieset

A página do site já contém o espaço para esta agenda. Enquanto o endereço da aplicação Google estiver vazio em `pessoas/natal/booking-config.js`, mantém o pedido manual por WhatsApp. Isso evita mostrar vagas inventadas.

## Antes de publicar a agenda

1. Na conta Google `info@castastudio.pt`, abre o projeto **CASTA · Reservas Natal 2026** já criado no Apps Script.
2. Nas definições do projeto, escolhe o fuso `Europe/Lisbon`.
3. Se surgir a autorização antiga que menciona eliminar calendários, fecha a janela ou clica **Cancelar**. Substitui `Código.gs` pelo conteúdo deste `Code.gs`. O ficheiro `Booking.html` já existe no projeto e pode continuar como está.
4. Em **Definições do projeto**, ativa **Mostrar ficheiro de manifesto `appsscript.json` no editor**. Substitui o conteúdo do manifesto pelo `appsscript.json` desta pasta. Isto configura o fuso e pede apenas acesso aos eventos dos calendários que a conta possui, além de envio de email. Nas **Serviços**, confirma que **Google Calendar API** (versão v3) está ativado; o manifesto declara esse serviço avançado.
5. Confirma em `CONFIG` o ID da agenda e os horários. A proposta atual é 10h, 11h, 12h, pausa 13h–15h, 15h, 16h, 17h e 18h. Cada hora ocupa um bloco inteiro: até 45 minutos de sessão e 15 minutos livres. São sete vagas por dia, se não houver compromissos.
6. Executa `getAvailability` uma vez no editor e verifica que termina sem erro. A autorização deve mencionar eventos dos calendários que a conta possui e envio de email; já não deve mencionar eliminação dos calendários. Depois publica como **Web app**, executar como **a conta proprietária**, acesso **qualquer pessoa**. Autoriza as permissões de Google Calendar e envio de email dessa conta. A URL pública termina em `/exec`.
7. Coloca essa URL no ficheiro `pessoas/natal/booking-config.js`, publica o site e testa com uma pré-reserva tua. Confirma que o evento ocupa uma hora na agenda, que a vaga desaparece e que chegam os dois emails. Apaga essa pré-reserva de teste na agenda antes de anunciar a campanha.

## Funcionamento

- Os dias de 24 de outubro a 6 de dezembro de 2026 são sábados e domingos. Eventos Google marcados como **Ocupado** bloqueiam horas; os marcados **Disponível** não bloqueiam.
- Ao clicar em pré-reservar, o serviço volta a consultar a agenda dentro de um bloqueio para impedir duas reservas simultâneas da mesma hora.
- A pré-reserva cria um evento de uma hora e envia instruções para o sinal de 20 € por MB WAY. O pagamento é verificado manualmente pela CASTA.
- Uma pré-reserva vencida deixa de bloquear a vaga ao fim de 24 horas, mas o evento antigo continua na agenda com o título **PENDENTE** para poderes verificar o histórico e apagá-lo manualmente se quiseres. O sistema nunca apaga eventos da agenda.
- Depois de receberes e verificares o sinal de 20 €, abres o evento correspondente na agenda e alteras apenas o título de `[CASTA NATAL PENDENTE] Nome do pack` para `[CASTA NATAL CONFIRMADA] Nome do pack`. O evento confirmado mantém a hora bloqueada. A confirmação e o contacto posterior com o cliente ficam a teu cargo; o sistema não valida pagamentos nem envia uma segunda confirmação automática.
- O endereço do serviço não contém credenciais. A aplicação corre na conta Google da CASTA; o site e os visitantes não recebem acesso direto à agenda. Ainda assim, um endpoint público pode receber spam. Antes de lançar publicidade, monitoriza os pedidos e as quotas de email do Apps Script.

A autorização para eventos continua a incluir a capacidade técnica de alterar e apagar eventos nos calendários da conta; o Google não oferece, para esta agenda existente, uma permissão limitada à criação de eventos. O código só lê eventos e cria um evento novo por pré-reserva. Não tem chamadas de eliminação ou edição de eventos existentes. Sem a autorização e teste real, nenhuma página está autorizada a afirmar que uma hora está livre.
