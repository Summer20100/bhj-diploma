/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;
    if (!element) {
      throw new Error ('Невалидное значение для TransactionsWidget');
    }
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const btns = document.querySelectorAll('.transactions-panel > button');
    btns.forEach( btn => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        switch(ev.target.closest('button').classList[3]) {
          case 'create-income-button':
            App.getModal('newIncome').open();
          break;
          case 'create-expense-button':
            App.getModal('newExpense').open();
        }
      })
    })
  }
}
