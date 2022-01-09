// ==UserScript==
// @name For Forum
// @namespace https://forum.blackrussia.online
// @version 1.0.5.16
// @description try to take over the world!
// @author Danila_Fererra
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator 
// @icon https://openuserjs.org/meta/Intcaro/BR_Script_for_Forum.meta.js
// @downloadURL https://gist.github.com/FrostmenTV/d7f3890c0d2184d8804a9e63049de668.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // префикс отказано
const ACCEPT_PREFIX = 8; // префикс одобрено
const PIN_PREFIX = 2; //  префикс закрепить
const COMMAND_PREFIX = 10; // команде проекта
const WATCHED_PREFIX = 9; // префикс рассмотрено
const CLOSE_PREFIX = 7; // префикс закрыто
const SPECADM_PREFIX = 11; // специальному администратору
const DECIDED_PREFIX = 6; // префикс решено
const MAINADM_PREFIX = 12; // главному адамнистратору
const TECHADM_PREFIX = 13 // техническому администратору
const buttons = [
	{
	  title: 'Приветствие',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
		'[CENTER]  [/CENTER][/FONT][/SIZE]',
	},
{
	  title: 'Форма подачи жалобы',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомится с формой подачи жалобы на игроков:[URL=https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалобы-на-игрока-если-не-по-форме-—-отказ.193402/]*ТЫК*[/URL][/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
      title: 'Название жалобы составлено не по форме',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Название жалобы составлено не по форме. Внимательно прочитайте правила составления жалобы:[URL=https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалобы-на-игрока-если-не-по-форме-—-отказ.193402/]*ТЫК*[/URL][/CENTER]<br>" +
        "[CENTER] В названии темы необходимо написать: “Nick_Name | Суть жалобы“[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
},
{
        title: 'Отправить на рассмотрение',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Ожидайте ответа.[/ICODE][/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
},
{
title: 'Идите в технический раздел',
content: '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' +
	 "[CENTER]Обратитесь в технический раздел, сервера Lime - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел-lime.365/']клик[/URL] [/CENTER]<br><br>" +
	 '[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
	  title: 'Нет доказательств ',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]В вашей жалобе нет доказательств. [/CENTER]<br><br>" +
        '[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
                         prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	title: 'Нету нарушений',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER] В вашей жалобе нету конкретных нарушений. [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Не хватает /time',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]К сожалению вам отказано в жалобе. [/CENTER]<br><br>" +
		"[CENTER]На скриншоте отсутствует /time.<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Мало доказательств ',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]В вашей жалобе мало доказательств. [/CENTER]<br><br>" +
        '[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
               prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    title: 'Оффтоп',
	content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER] Ваша жалоба не несет смысловой нагрузки и является оффтопом в данном разделе, поэтому рассмотрена не будет. [/CENTER]<br><br>"+
		'[CENTER][ICODE] Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
},
{
	  title: 'Дублирование темы',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Дублирование темы. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'ДМ',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут. [/CENTER]<br><br>" +
        "[CENTER] Примечание: разрешен ответный DM в целях защиты, обязательно иметь видеодоказательство в случае наказания администрации.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'DB',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.13 [/CENTER]<br><br>" +
        "[CENTER]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 30 минут [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
               prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'TK',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок получит наказание по пункту 2.15 [/CENTER]<br><br>" +
        "[CENTER]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 30 минут / Warn (за два и более убийства) [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
              prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва в соц.сети',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Согласно пункту правил 3.6. при создании жалоб на игроков: [/CENTER]<br><br>" +
	"[CENTER]3.6. Прикрепление доказательств обязательно.[/CENTER]<br><br>" +
		"[CENTER]Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'МГ',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 2.18 [/CENTER]<br><br>" +
        "[CENTER]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
              prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'FLOOD',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 3.05 [/CENTER]<br><br>" +
        "[CENTER]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
              prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Caps',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 3.02 [/CENTER]<br><br>" +
        "[CENTER]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в чате | Mute 30 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
              prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Упоминание Родных',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок получит наказание по пункту 3.04. [/CENTER]<br><br>" +
        "[CENTER]3.04. Запрещено оскорбление или косвенное упоминание кровных родных вне зависимости от чата (IC или OOC)| Mute 120 минут / Ban 7 - 15 дней. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP Развод',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок получит наказание по пункту 2.05. [/CENTER]<br><br>" +
        "[CENTER]2.05. Запрещены любые OOC обманы, а также любые IC обманы с нарушением Role Play правил и логики | PermBan [/CENTER]<br><br>" +
        "[CENTER] Примечание: после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же договорившись через OOC чат (/n) точно также [/CENTER]<br><br>" +
        "[CENTER] получить денежные средства и сразу же выйти из игры, а также тому подобные ситуации. [/CENTER]<br><br>" +
        "[CENTER] Примечание: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого [/CENTER]<br><br>" +
        "[CENTER]имущества, которое было украденого (по решению обманутой стороны). [/CENTER]<br>" +
		'[CENTER][ICODE]Одоберно, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
		title: 'Реклама промокода',
        content:
		'[SIZE=4] [FONT=Courier New] [CENTER] {{ greeting }}, уважаемый {{ user.mention}} [/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 3.21 [/CENTER]<br><br>" +
		"[CENTER]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней <br>" +
		"[CENTER]Примечание: чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее. [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
     prefix: ACCEPT_PREFIX,
	 status: false,
},
{
	  title: 'Оск игроков',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 3.03 [/CENTER]<br><br>" +
		"[CENTER]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут. [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
              prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Слив склада, для теха',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Жалоба передана Техническому Специалисту, ожидайте и не создавайте копий этой жалобы. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Закрыто, на рассмотрение[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: TECHADM_PREFIX,
	status: false,
},
{
	  title: 'Жалоба от 3-го лица',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба составлена от третьего лица, что запрещено. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'MASS DM',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.20 [/CENTER]<br><br>" +
        "[CENTER]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 7 - 15 дней [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Реклама, Пиар',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.31 [/CENTER]<br><br>" +
        "[CENTER]Запрещено рекламировать на сервере любые проекты, сервера, сайты, сторонние Discord-сервера, YouTube каналы и так далее | PermBan [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
              prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Выдача себя за Администратора',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 3.10 [/CENTER]<br><br>" +
        "[CENTER]Запрещена выдача себя за администратора, если таковым не являетесь | Ban 15 - 30 + ЧС администрации [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
               prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск проекта',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.40 [/CENTER]<br><br>" +
        "[CENTER]Запрещено пытаться навредить репутации проекта | PermBan + ЧС проекта [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
                 prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оскорбление Администрации',
	  content:
          '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
             "[CENTER]Данный игрок будет наказан по пункту 2.32 [/CENTER]<br><br>" +
             "[CENTER]Запрещен обман администрации, ее оскорбление, неуважительное отношение, неконструктивная критика, унижение чести и достоинства и так далее | Ban 15 - 30 дней / PermBan [/CENTER]<br><br>" +
            '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
                  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
      title: 'Рп био одобрено',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп биографией, было принято решение дать вашей биографии статут одобрено.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
      title: 'Рп био отказано',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп биографией, было принято решение дать вашей биографии статут отказано.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
        title: 'Рп био отказано название',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп биографией, было принято решение дать вашей биографии статут отказано.[/CENTER]<br><br>" +
        "[CENTER]Причина: Название рп биографии не по форме. Внимательно прочитайте правила составления жалобы:[URL=https://forum.blackrussia.online/index.php?threads/Правила-создания-и-форма-roleplay-биографии-lime.111129/]*ТЫК*[/URL][/CENTER]<br>" +
        "[CENTER]Заголовок создаваемой темы должен быть написан строго по данной форме: “RolePlay биография гражданина Имя Фамилия.“[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
        title: 'Рп био на расмотрении',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп биографией, было принято решение что бы вы доаполнили пункт .[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: PIN_PREFIX,
	  status: false,
}
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Отказано', 'unaccept');
addButton('Рассмотрено', 'watched');
addButton('Решено', 'decided');
addButton('Одобрено', 'accepted');
addButton('Закрыто', 'closed');
addButton('Специальному Администратору', 'specadm');
addButton('Главному Администратору', 'mainadm');
addButton('Техническому спецалисту', 'techspec');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
buttons.forEach((btn, id) => {
if (id > 0) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
}
else {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
}
});
});
});

function addButton(name, id) {
$('.button--icon--reply').before(
`<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
.map(
(btn, i) =>
`<button id="answers-${i}" class="button--primary button ` +
`rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
)
.join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
const template = Handlebars.compile(buttons[id].content);
if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

$('span.fr-placeholder').empty();
$('div.fr-element.fr-view p').append(template(data));
$('a.overlay-titleCloser').trigger('click');

if (send == true) {
editThreadData(buttons[id].prefix, buttons[id].status);
$('.button--icon.button--icon--reply.rippleButton').trigger('click');
}
}

function getThreadData() {
const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
const authorName = $('a.username').html();
const hours = new Date().getHours();
return {
user: {
id: authorID,
name: authorName,
mention: `[USER=${authorID}]${authorName}[/USER]`,
},
greeting: () =>
4 < hours && hours <= 11 ?
'Доброе утро' :
11 < hours && hours <= 15 ?
'Добрый день' :
15 < hours && hours <= 21 ?
'Добрый вечер' :
'Доброй ночи',
};
}

function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle = $('.p-title-value')[0].lastChild.textContent;

if (pin == false) {
fetch(`${document.URL}edit`, {
method: 'POST',
body: getFormData({
prefix_id: prefix,
title: threadTitle,
_xfToken: XF.config.csrf,
_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
_xfWithData: 1,
_xfResponseType: 'json',
}),
}).then(() => location.reload());
}
if (pin == true) {
fetch(`${document.URL}edit`, {
method: 'POST',
body: getFormData({
prefix_id: prefix,
title: threadTitle,
sticky: 1,
_xfToken: XF.config.csrf,
_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
_xfWithData: 1,
_xfResponseType: 'json',
}),
}).then(() => location.reload());
}
}

function getFormData(data) {
const formData = new FormData();
Object.entries(data).forEach(i => formData.append(i[0], i[1]));
return formData;
}
})();
