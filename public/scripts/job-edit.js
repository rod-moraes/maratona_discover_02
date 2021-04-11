import Modal from './modalDelete.js';

const modal = Modal({ animateClasses: ['animate-pop', 'back'] })

document
  .querySelector('.open-modal')
  .addEventListener('click', modal.open)
