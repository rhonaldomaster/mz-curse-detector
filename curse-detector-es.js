// ==UserScript==
// @name             Curse detector (ES)
// @namespace        mz-curse-detector
// @description      Detect curses on MZ forum posts. Works winth spanish words only.
// @description:es   Detectar groserías en los mensajes de los foros de MZ. Solamente detecta palabras en español.
// @homepage         https://github.com/rhonaldomaster/mz-curse-detector
// @icon             https://www.managerzone.com/favicon.ico?v2
// @include          https://*managerzone.*p=forum&sub=topic*
// @grant            none
// @version          0.1
// @copyright        GNU/GPL v3
// @author           rhonaldomaster
// @license          GPL-3.0-or-later
// @compatible       chrome
// @compatible       firefox
// @compatible       opera
// @compatible       safari
// @compatible       edge
// ==/UserScript==

const curseDictionary = [
  'boba', 'bobo', 'boluda', 'bolu.da', 'boludo', 'bolu.do',
  'bosta', 'bostera', 'bostero', 'burrazo', 'burro',
  'cometrava', 'cometraba', 'concha', ' culo',
  'estupida', 'estúpida', 'estupido', 'estúpido',
  'gil', 'gilipolla', 'gonorrea',
  'hdp', 'hipocrita', 'hipócrita', 'hijo de puta', 'hitler',
  'idiota', 'imbecil', 'imbécil',
  'kkk', 'kuka',
  'lacra', 'la tenés adentro', 'la tenes adentro', 'la tenes bien adentro',
  'la tenés bien adentro', 'la tenéis bien adentro', ' lta',
  'malcogida', 'malcogido', 'mal cogida', 'mal cogido', 'malparida', 'malparido',
  'mal parida', 'mal parido', 'marica', 'mediocre', 'mierda',
  'miserable', 'mogolico', 'mogólico', 'montonero', 'mu ', 'muerde almohada', 'muerdealmohada',
  'negro cabeza',
  'patetico', 'patético', 'payasa', 'payaso', 'pelotuda', 'pelotudo', 'pene', 'perra', 'puta', 'putear', 'puto',
  'retrasada', 'retrasado', 'ridicula' , 'ridícula', 'ridiculo', 'ridículo',
  'salame', 'sorete', 'sucio', 'subnormal',
  'tarada', 'tarado', 'tonta', 'tontaza', 'tontazo', 'tonto', 'trampa', 'tramposa', 'tramposo',
  'vende ajo', 'vendo ajo', 'verduler',
];

function searchAndHighlightWord(word, textContainer) {
  const warningColor = '#ff4800';
  const originalText = textContainer.innerHTML;
  const regex = new RegExp(`(${word})`, 'gi');
  const highlightedText = originalText.replace(regex, `<span style="color: ${warningColor}; font-weight: bold; text-decoration: underline;">$1</span>`);

  if (highlightedText !== originalText) {
    textContainer.innerHTML = highlightedText;
    const editPostButton = textContainer.parentNode.querySelector('.fa-edit');
    if (editPostButton) {
      editPostButton.style.color = warningColor;
    }
  }
}

function detectCurses() {
  const messages = document.querySelectorAll('.forum-post-content');

  messages.forEach(message => {
    for (let i = 0; i < curseDictionary.length; i++) {
      searchAndHighlightWord(curseDictionary[i], message);
    }
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.classList.contains('forum-post-content')) {
          console.log('New post detected:', node);
          detectCurses(node);
        }
      });
    }
  });
});

const postsContainer = document.querySelector('.forum_content');
if (postsContainer) {
  const initialPosts = postsContainer.querySelectorAll('.forum-post-content');
  initialPosts.forEach(detectCurses);
}

if (postsContainer) {
  observer.observe(postsContainer, { childList: true, subtree: true });
} else {
  console.error('Posts container not found.');
}