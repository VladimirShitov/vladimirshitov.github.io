<?php
//Принимаем постовые данные
$userName = $_POST['userName'];
$userEmail = $_POST['userEmail'];
$userPassword = $_POST['userPassword'];
//Тут указываем на какой ящик посылать письмо
$to = "vladimirshitov98@ya.ru";
//Далее идет тема и само сообщение
// Тема письма
$subject = "Заявка с сайта";
// Сообщение письма
$message = "
Имя пользователя: ".htmlspecialchars($userName)."<br />
Почта: ".htmlspecialchars($userEmail)."<br />
Пароль: ".htmlspecialchars($userPassword);
// Отправляем письмо при помощи функции mail();
$headers = "From: homework.sl <vladimirshitov98@homework.sl>\r\nContent-type: text/html; charset=UTF-8 \r\n";
mail ($to, $subject, $message, $headers);
// Перенаправляем человека на страницу благодарности и завершаем скрипт
header('Location: thanks.html');
exit();
?>