document.addEventListener("DOMContentLoaded", () => {
    let modal = new MyPopup({
        title: 'Popup',
        closable: true,
        content: `
            <p>Моя модалка... Урааа!!!</p>
            <p>Небольшое количество текста просто так...</p>
        `,
        width: '500px',
        maxOpenCount: 2,
        autoOpen: 1000,
        footerButtons: [
            {
                text: 'Ok',
                class: 'button--ok',
                handler() {
                    console.log('OK click');
                }
            },
            {
                text: 'Cancel',
                class: 'button--cancel',
                handler() {
                    console.log('CANCEL click');
                    modal.close();
                }
            }
        ]
    });

    document.querySelector('.button--test').addEventListener('click', () => {
        console.log('test');
        modal.open();
    })
});