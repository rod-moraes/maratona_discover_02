import ModalDelete from './modalDelete.js';
import ModalUp from './modalUp.js';
import ModalDown from './modalDown.js';

const modalUp = ModalUp({ animateClasses: ['animate-pop', 'back'] })
const modalDelete = ModalDelete({ animateClasses: ['animate-pop', 'back'] })
const modalDown = ModalDown({ animateClasses: ['animate-pop', 'back'] })
const cards = document.querySelectorAll('.cards .card')
const deleteForm = document.querySelector('#delete-job')
const upForm = document.querySelector('#up-job')
const downForm = document.querySelector('#down-job')

for (let card of cards) {
  const cardId = card.dataset.id
  const deleteButton = card.querySelector('button.delete')
  const downButton = card.querySelector('button.down')  
  const upButton = card.querySelector('button.up')
  deleteButton.onclick = () => {
    modalDelete.open()
    deleteForm.setAttribute('action', '/job/delete/' + cardId)
  }
  upButton.onclick = () =>{
    modalUp.open()
    upForm.setAttribute('action', '/job/up/' + cardId)
  }
  downButton.onclick = () =>{
    modalDown.open()
    downForm.setAttribute('action', '/job/down/' + cardId)
  }
}