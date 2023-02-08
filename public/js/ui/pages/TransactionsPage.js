/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error("Невалидное значение для TransactionsWidget"); 
    }
    this.element = element;
    this.registerEvents();
    this.lastOptions;
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions)
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const btnRemoveAccount = document.querySelector('.remove-account');
    const btnTransactionRemove = document.querySelector('.transaction__remove');

    btnTransactionRemove

    btnRemoveAccount.addEventListener('click', (ev) => {
      this.removeAccount();
    });

    btnTransactionRemove.addEventListener('click', (ev) => {
      this.removeTransaction(ev.target.dataset.id);
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (window.confirm('Вы действительно хотите удалить счёт?')) {
        TransactionsPage.clear();
        const id = document.querySelector('li.active').dataset.id;
        Account.remove( { id: id } , (error, response) => {
          App.updateWidgets();
          App.updateForms()
        })
      } 
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (window.confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({id: id}, (err, response) => {
        if (response.success) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, response) => {
        if (response.success) {
          this.renderTitle(response.data.name);
        }
      });
      Transaction.list(options, (err, response) => {
        if (response.success) {
          this.renderTransactions(response.data);
        }
      });  
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions();
    this.renderTitle('Название счёта');
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const contentTitle = document.querySelector('.content-title');
    contentTitle.innerHTML = '';
    contentTitle.insertAdjacentText('afterbegin', name);
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const time = Date.parse(date);
    const shortDateTime = new Intl.DateTimeFormat("ru", {dateStyle: "short", timeStyle: "short"}).format(time);
    return (shortDateTime.replace(',', ' в'));
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    let transactionType;
    item.type === 'income' ? trnzType = 'transaction_income' : trnzType = 'transaction_expense';

    return (
      `<div class="transaction ${transactionType} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <!-- в data-id нужно поместить id -->
            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
      </div>`
    )
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const transactionList = document.querySelector('.content');
    transactionList.innerHTML = '';
    if (data) {
      data.forEach(obj => transactionList.insertAdjacentHTML('beforeend', this.getTransactionHTML(obj)));   
    }
    else {
      for (let element of transactionList.children) {
        element.remove();
      }
    }
  }
}