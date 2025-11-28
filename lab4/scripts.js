class UserData {
    constructor(username, password, agreement) {
        this.username = username;
        this.password = password;
        this.agreement = agreement;
    }

    logToConsole() {
        console.log("--- Данные пользователя ---");
        console.log(`Логин: ${this.username}`);
        console.log(`Пароль: [скрыто]`);
        console.log(`Согласие на обработку данных: ${this.agreement ? 'Да' : 'Нет'}`);
        console.log("--------------------------");
    }
}

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const agreementInput = document.getElementById('agreement').checked;

    const user = new UserData(usernameInput, passwordInput, agreementInput);

    user.logToConsole();
});