# Wireframes Textuais - Sprint 1

## 1. Login

Publico: pacientes, fisioterapeutas, clinicas e administradores.

Layout:

- Logo KINETIX no topo.
- Campo de email.
- Campo de senha.
- Botao "Entrar".
- Link "Criar conta".
- Link "Esqueci minha senha" como melhoria futura.

Fluxo principal:

1. Usuario informa email e senha.
2. Sistema valida credenciais.
3. Sistema redireciona conforme perfil:
   - PACIENTE: Minha Reabilitacao.
   - FISIOTERAPEUTA: Dashboard profissional.
   - CLINICA: Agenda geral.
   - ADMIN: area administrativa futura.

Estados:

- Erro de credenciais invalidas.
- Conta inativa.
- Carregamento durante autenticacao.

## 2. Cadastro

Publico: pacientes, fisioterapeutas e clinicas.

Layout:

- Seletor de tipo de conta.
- Nome completo.
- Email.
- Senha.
- Confirmacao de senha.
- Campos especificos:
  - Paciente: telefone e data de nascimento.
  - Fisioterapeuta: CREFITO.
  - Clinica: nome, endereco e localizacao.
- Checkbox de aceite dos termos de uso e politica de privacidade.
- Botao "Cadastrar".

Fluxo principal:

1. Usuario seleciona o tipo de conta.
2. Sistema exibe campos obrigatorios.
3. Usuario aceita termos LGPD.
4. Sistema cria usuario, perfil e registro especifico.

Estados:

- Email ja cadastrado.
- Senha fraca.
- Termos nao aceitos.
- CREFITO ja cadastrado.

## 3. Dashboard

Publico: fisioterapeutas e clinicas.

Layout:

- Menu lateral com Dashboard, Pacientes, Prescritor, Agenda e Clinicas.
- Cards de indicadores:
  - Pacientes ativos.
  - Planos em andamento.
  - Alertas criticos.
  - Consultas do dia.
- Lista de pacientes com sinais de alerta.
- Secao de proximos agendamentos.

Fluxo principal:

1. Profissional acessa resumo operacional.
2. Visualiza alertas de dor critica.
3. Abre paciente ou agendamento para acao.

Estados:

- Sem alertas.
- Sem agendamentos.
- Erro ao carregar indicadores.

## 4. Agenda

Publico: fisioterapeutas e clinicas.

Layout:

- Filtros por data, profissional e clinica.
- Visualizacao diaria ou semanal.
- Lista de horarios.
- Botao para novo agendamento.
- Indicacao visual de horario ocupado.

Fluxo principal:

1. Usuario seleciona data e profissional.
2. Sistema lista horarios.
3. Usuario cria ou consulta agendamento.
4. Sistema impede conflito por profissional e clinica.

Estados:

- Horario indisponivel.
- Agendamento criado.
- Agendamento conflitante.

## 5. Prescritor Digital

Publico: fisioterapeutas.

Layout:

- Busca de paciente.
- Dados resumidos do paciente.
- Lista de exercicios por categoria.
- Formulario de prescricao:
  - series.
  - repeticoes.
  - tempo de execucao.
- Previa do plano.
- Botao "Salvar plano".

Fluxo principal:

1. Fisioterapeuta seleciona paciente.
2. Escolhe exercicios.
3. Define parametros.
4. Salva plano de reabilitacao.
5. Paciente visualiza o plano no mobile.

Estados:

- Paciente sem cadastro.
- Plano salvo com sucesso.
- Exercicio sem video.

## 6. Minha Reabilitacao

Publico: pacientes.

Layout:

- Resumo do plano atual.
- Lista de exercicios prescritos.
- Card de exercicio com nome, descricao, video e parametros.
- Timer de execucao como melhoria da Sprint 4.
- Botao para registrar dor.

Fluxo principal:

1. Paciente abre plano atual.
2. Assiste video explicativo.
3. Executa exercicio.
4. Registra dor e observacoes.

Estados:

- Nenhum plano ativo.
- Plano bloqueado por alerta critico.
- Conteudo premium bloqueado para usuario gratuito.

## 7. Clinicas

Publico: pacientes.

Layout:

- Campo de busca.
- Filtro por distancia.
- Lista de clinicas proximas.
- Card com nome, endereco, nota e distancia.
- Botao "Agendar".
- Mapa como melhoria visual.

Fluxo principal:

1. Paciente autoriza localizacao.
2. Sistema busca clinicas proximas.
3. Paciente seleciona clinica.
4. Paciente escolhe horario e agenda consulta.

Estados:

- Localizacao negada.
- Nenhuma clinica encontrada.
- Horario indisponivel.

## Boas Praticas de UX

- Priorizar clareza e baixa carga cognitiva para pacientes em recuperacao.
- Evitar excesso de informacao em telas mobile.
- Destacar alertas criticos sem alarmismo visual.
- Usar linguagem simples para orientacoes de exercicios.
- Garantir contraste adequado e campos grandes para acessibilidade.
