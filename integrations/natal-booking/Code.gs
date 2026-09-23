/** CASTA Natal 2026. Deploy as a Google Apps Script web app from the Google
 * account that owns the studio calendar. Time zone in project settings: Europe/Lisbon.
 * This app never exposes calendar event titles or customer data to visitors.
 */
const CONFIG = Object.freeze({
  calendarId: 'info@castastudio.pt',
  studioEmail: 'info@castastudio.pt',
  seasonStart: '2026-10-24',
  seasonEnd: '2026-12-06',
  slotHours: [10, 11, 12, 15, 16, 17, 18], // Edit if opening hours differ.
  timeZone: 'Europe/Lisbon',
  holdHours: 24,
  prefix: 'CASTA_NATAL_2026:'
});

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Booking')
    .setTitle('Mini-sessões de Natal | CASTA Studio')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function studioCalendar_() {
  const calendar = CalendarApp.getCalendarById(CONFIG.calendarId);
  if (!calendar) throw new Error('A agenda CASTA não está acessível a esta conta.');
  return calendar;
}
function localDate_(day, hour) {
  // Construct local time in the Apps Script project timezone (Europe/Lisbon).
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year, month - 1, date, hour, 0, 0);
}
function dayString_(date) { return Utilities.formatDate(date, CONFIG.timeZone, 'yyyy-MM-dd'); }
function validDay_(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < CONFIG.seasonStart || day > CONFIG.seasonEnd) return false;
  const date = localDate_(day, 12);
  return dayString_(date) === day && (date.getDay() === 0 || date.getDay() === 6);
}
function pending_(event) {
  if (!event.getTitle().startsWith('[CASTA NATAL PENDENTE]')) return null;
  const description = event.getDescription() || '';
  if (!description.startsWith(CONFIG.prefix)) return null;
  try { return JSON.parse(description.slice(CONFIG.prefix.length)); } catch (_) { return null; }
}
function seasonEvents_(calendar) {
  return calendar.getEvents(localDate_(CONFIG.seasonStart, 0), localDate_('2026-12-07', 0));
}
function activeEvents_(calendar) {
  const now = Date.now();
  const events = seasonEvents_(calendar);
  return events.filter(event => {
    const record = pending_(event);
    if (record && Number(record.expiresAt) <= now) return false;
    return event.getTransparency() !== CalendarApp.EventTransparency.TRANSPARENT;
  });
}
function overlaps_(event, start, end) {
  return event.getStartTime().getTime() < end.getTime() && event.getEndTime().getTime() > start.getTime();
}
function availableHours_(day, events) {
  return CONFIG.slotHours.filter(hour => {
    const start = localDate_(day, hour), end = localDate_(day, hour + 1);
    return start.getTime() > Date.now() && !events.some(event => overlaps_(event, start, end));
  });
}
function getAvailability() {
  const events = activeEvents_(studioCalendar_());
  const result = [];
  for (let day = localDate_(CONFIG.seasonStart, 12); day <= localDate_(CONFIG.seasonEnd, 12); day.setDate(day.getDate() + 1)) {
    const date = dayString_(day);
    if (validDay_(date)) {
      const hours = availableHours_(date, events);
      result.push({ date, remaining: hours.length, hours: hours.map(hour => `${String(hour).padStart(2,'0')}:00`) });
    }
  }
  return result;
}
function clean_(value, max) { return String(value || '').trim().slice(0, max); }
function email_(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function bookSession(input) {
  // Public endpoint. Honeypot and per-email pending limit reduce automated abuse.
  if (clean_(input.website, 100)) throw new Error('Pedido inválido.');
  const name = clean_(input.name, 100);
  const email = clean_(input.email, 180).toLowerCase();
  const phone = clean_(input.phone, 30);
  const note = clean_(input.note, 350);
  const day = clean_(input.date, 10);
  const time = clean_(input.time, 5);
  const pack = clean_(input.pack, 50);
  const allowedPacks = { 'Essencial': 60, 'Completo': 90, 'Memórias em Movimento': 145 };
  if (!name || !email_(email) || !validDay_(day) || !Object.prototype.hasOwnProperty.call(allowedPacks, pack) || !/^\d{2}:00$/.test(time)) throw new Error('Confirma os dados da marcação.');
  const hour = Number(time.slice(0,2));
  if (!CONFIG.slotHours.includes(hour)) throw new Error('Esta hora não está disponível.');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  let record;
  try {
    const calendar = studioCalendar_();
    const events = activeEvents_(calendar);
    if (!availableHours_(day, events).includes(hour)) throw new Error('Esta vaga acabou de ser ocupada. Escolhe outra hora.');
    const sameEmail = events.filter(event => { const pending = pending_(event); return pending && pending.email === email; });
    if (sameEmail.length >= 2) throw new Error('Já existem duas pré-reservas associadas a este email. Contacta-nos para alterar uma delas.');
    record = { id: Utilities.getUuid(), name, email, phone, note, day, time, pack, price: allowedPacks[pack], expiresAt: Date.now() + CONFIG.holdHours * 3600000 };
    const start = localDate_(day, hour);
    const event = calendar.createEvent('[CASTA NATAL PENDENTE] ' + pack, start, new Date(start.getTime() + 3600000), { description: CONFIG.prefix + JSON.stringify(record), location: 'Estúdio CASTA · Merceana, Alenquer' });
    event.setVisibility(CalendarApp.Visibility.PRIVATE);
  } finally { lock.releaseLock(); }
  const when = `${day} às ${time}`;
  try {
    MailApp.sendEmail({to: email, replyTo: CONFIG.studioEmail, subject: 'CASTA · Pré-reserva da sessão de Natal', body:
      `Olá ${name},\n\nA tua sessão ${pack} (${record.price} €) ficou pré-reservada para ${when}.\n\nPara confirmar, paga o sinal de 20 € por MB WAY para 919 592 819 no prazo de 24 horas. Após esse prazo, a vaga poderá voltar a ficar disponível. O sinal é verificado manualmente; esta mensagem não confirma o pagamento.\n\nDepois da confirmação, entramos em contacto por WhatsApp.\n\nNádia & Ruben · CASTA Studio\nID da pré-reserva: ${record.id}`});
    MailApp.sendEmail({to: CONFIG.studioEmail, subject: 'Nova pré-reserva CASTA Natal · ' + when, body:
      `ID: ${record.id}\n${name} · ${email} · ${phone}\nPack: ${pack} (${record.price} €)\nData: ${when}\nNotas: ${note}\nPendente do sinal de 20 € até ${new Date(record.expiresAt).toISOString()}.`});
  } catch (error) {
    // The calendar hold already exists; tell the visitor so they do not retry.
    return {ok: true, id: record.id, emailSent: false};
  }
  return {ok: true, id: record.id, emailSent: true};
}
