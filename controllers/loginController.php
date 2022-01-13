<?php

namespace Controllers;

use Model\Usuario;
use MVC\Router;

class LoginController {
  public static function login(Router $router) {
    
    $router->render('auth/login'); 
  }
  public static function logout() {
    echo "Desde Logout";
  }
  public static function olvide(Router $router) {
    $router->render('auth/olvide-password', [
      
    ]);
  }
  public static function recuperar() {
    echo "Desde Reperar";
  }
  public static function crear(Router $router) {
    
    $usuario = new Usuario($_POST);

    //Alertas vacias
    $alertas = [];
    if($_SERVER['REQUEST_METHOD'] === 'POST') {

      $usuario->sincronizar($_POST);
      $alertas = $usuario->validarNuevaCuenta();

      //Revisar que alertas este vacío
      if(empty($alertas)) {
        //Verificar que el usario no este registrado
        $resultado = $usuario->existeUsuario();

        if($resultado->num_rows) {
          $alertas = Usuario::getAlertas();
        } else {
          //Hashear el password
          $usuario->hashPassword();

          //Generar un Token único
          $usuario->crearToken();

          debuguear('No esta registrado');
        }
      }
    }

    $router->render('auth/crear-cuenta', [
      'usuario' => $usuario,
      'alertas' => $alertas
    ]);
  }
}