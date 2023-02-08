/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
    this.element = element
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const modalAccList = this.element.querySelector('.accounts-select');
    const data = User.current();
    modalAccList.innerHTML = '';

    Account.list(data, (err, response) => {
      if (response.success) {
        modalAccList.innerHTML = response.data.reduce( (html, item) => {
          return html += `<option value="${item.id}">${item.name}</option>`
        })
      }
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success) {
        let modalName;
        let formName;
       
        data.type = 'expense' ? (modalName = 'newExpense', formName = 'createExpense') : (modalName = 'newIncome', formName = 'createIncome');

        App.getForm(formName).element.reset()
        App.getModal(modalName).close();
        App.update();
      }
    })
  }
}