<?php 

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;


class Email {
  
  public $email;
  public $nombre;
  public $token;


  public function __construct($email, $nombre, $token) {
    $this->email = $email; 
    $this->nombre = $nombre;
    $this->token = $token;
  }

  public function enviarConfirmacion() {

    //Crear el objeto de email
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Host = 'smtp.mailtrap.io';
    $mail->SMTPAuth = true;
    $mail->Port = 2525;
    $mail->Username = 'd25adc0cf5cb17';
    $mail->Password = '9ac369469fb756';

    $mail->setFrom('cuentas@appsalon.com');
    $mail->addAddress('cuenta@appsalon.com', 'appsalon.com');
    $mail->Subject = 'Confirma tu cuenta';

    //Set HTML
    $mail->isHTML(TRUE);
    $mail->CharSet = 'UTF-8';

    
    $contenido = "<html>";
    $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has creado tu cuenta en la App Salon, solo debes confirmarla presionando el siguiente enlace</p>";
    $contenido .= "<p>Presiona aquí: <a href='http://". $_SERVER["HTTP_HOST"] . "/confirmar-cuenta?token=" . $this->token . "'> Confirmar cuenta </a>  </p>";
    $contenido .= "<p>Si tú no solicitaste esta cuenta, puedes ignorar el mensaje</p>";
    $contenido .= "</html>";

    $mail->Body = $contenido; 

    //Enviar el email
    $mail->send();
  }
  
  public function enviarInstrucciones(){
    //Crear el objeto de email
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Host = 'smtp.mailtrap.io';
    $mail->SMTPAuth = true;
    $mail->Port = 2525;
    $mail->Username = 'd25adc0cf5cb17';
    $mail->Password = '9ac369469fb756';

    $mail->setFrom('cuentas@appsalon.com');
    $mail->addAddress('cuenta@appsalon.com', 'appsalon.com');
    $mail->Subject = 'Reestablece tu password';

    //Set HTML
    $mail->isHTML(TRUE);
    $mail->CharSet = 'UTF-8';

    
    $contenido = "<html>";
    $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has solicitado reestablecer tu password, sigue el siguiente en lace para hacerlo</p>";
    $contenido .= "<p>Presiona aquí: <a href='http://". $_SERVER["HTTP_HOST"] . "/recuperar?token=" . $this->token . "'> Reestablecer Password </a>  </p>";
    $contenido .= "<p>Si tú no solicitaste esta cuenta, puedes ignorar el mensaje</p>";
    $contenido .= "</html>";

    $mail->Body = $contenido; 

    //Enviar el email
    $mail->send();    
  }
}