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
    const btnIncome = document.querySelector('.create-income-button');
    const btnExpense = document.querySelector('.create-expense-button');

    btnIncome.addEventListener('click', (ev) => {
      ev.preventDefault();
      App.getModal('newIncome').open();
    });

    btnExpense.addEventListener('click', (ev) => {
      ev.preventDefault();
      App.getModal('newExpense').open();
    });
  }
}
