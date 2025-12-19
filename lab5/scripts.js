document.addEventListener('DOMContentLoaded', () => {
    
    const SERVER_URL = 'http://localhost:8000';


    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const agreementInput = document.getElementById('agreement');
        const formStatus = document.getElementById('form-status');

        const toggleError = (input, errorId, isError) => {
            const errorElement = document.getElementById(errorId);
            if (isError) {
                input.classList.add('input-error');
                errorElement.classList.add('active');
            } else {
                input.classList.remove('input-error');
                errorElement.classList.remove('active');
            }
        };

        usernameInput.addEventListener('input', () => {
            const isValid = usernameInput.value.trim().length >= 4;
            toggleError(usernameInput, 'username-error', !isValid);
        });

        passwordInput.addEventListener('input', () => {
            const isValid = passwordInput.value.length >= 8;
            toggleError(passwordInput, 'password-error', !isValid);
        });

        agreementInput.addEventListener('change', () => {
            toggleError(agreementInput, 'agreement-error', !agreementInput.checked);
        });

        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const isUserValid = usernameInput.value.trim().length >= 4;
            const isPassValid = passwordInput.value.length >= 8;
            const isAgreeValid = agreementInput.checked;

            toggleError(usernameInput, 'username-error', !isUserValid);
            toggleError(passwordInput, 'password-error', !isPassValid);
            toggleError(agreementInput, 'agreement-error', !isAgreeValid);

            if (isUserValid && isPassValid && isAgreeValid) {
                const userData = {
                    username: usernameInput.value,
                    password: passwordInput.value,
                    agreement: agreementInput.checked
                };

                formStatus.innerText = "Отправка данных на сервер...";
                formStatus.style.color = "blue";

                try {
                    const response = await fetch(`${SERVER_URL}/login-attempts`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });

                    if (!response.ok) throw new Error('Ошибка сети');

                    const result = await response.json();
                    console.log("Ответ сервера:", result);

                    formStatus.innerText = `Успешно! Сервер ответил: ${result.message}`;
                    formStatus.style.color = "green";
                    loginForm.reset(); 

                } catch (error) {
                    console.error(error);
                    formStatus.innerText = "Ошибка отправки данных. Убедитесь, что сервер запущен.";
                    formStatus.style.color = "red";
                }
            }
        });
    }


    const cartBody = document.getElementById('cart-body');

    if (cartBody) {
        const totalPriceEl = document.getElementById('total-price');
        const lastUpdateEl = document.getElementById('last-update');

        async function loadCartData() {
            try {
                const response = await fetch(`${SERVER_URL}/cart`);
                
                if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

                const data = await response.json();
                
                renderCart(data);

                const now = new Date();
                lastUpdateEl.innerText = `Обновлено: ${now.toLocaleTimeString()}`;

            } catch (error) {
                console.error("Ошибка загрузки:", error);
                cartBody.innerHTML = `<tr><td colspan="4" class="error-text">Не удалось загрузить корзину.</td></tr>`;
                totalPriceEl.innerText = "---";
            }
        }

        function renderCart(items) {
            cartBody.innerHTML = '';
            let total = 0;

            if (!items || items.length === 0) {
                cartBody.innerHTML = '<tr><td colspan="4" class="align-center">Корзина пуста</td></tr>';
                totalPriceEl.innerText = '0 руб.';
                return;
            }

            items.forEach(item => {
                const itemTotal = item.count * item.price;
                total += itemTotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="align-left">${item.name}</td>
                    <td class="align-center">${item.count}</td>
                    <td class="align-right">${item.price} руб.</td>
                    <td class="align-right">${itemTotal} руб.</td>
                `;
                cartBody.appendChild(row);
            });

            totalPriceEl.innerText = `${total} руб.`;
        }

        loadCartData();

        setInterval(loadCartData, 300000); 
    }
});