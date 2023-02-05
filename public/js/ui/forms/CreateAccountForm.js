/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (error, response) => {
      App.getModal('createAccount').close();
      if (response.sucssess) {
        App.getForm('createAccount').element.reset();
        App.update();
      }
    })
  }
}