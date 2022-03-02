<?php

namespace Controllers;

use Model\Servicio;
use MVC\Router;


class ServicioController {
  public static function index(Router $router) {
    
    if(!isset($_SESSION)) {//evitar error de 'ignorar session'
      session_start();//se inicia sesion y se puede acceder a $_SESSION
    };

    $router->render('servicios/index', [
      'nombre'=>$_SESSION['nombre']

    ]);
  } 
  public static function crear(Router $router) {

    if(!isset($_SESSION)) {//evitar error de 'ignorar session'
      session_start();//se inicia sesion y se puede acceder a $_SESSION
    };

    $alertas = [];
    $servicio = new Servicio;

    if($_SERVER['REQUEST_METHOD'] === 'POST') {
      $servicio -> sincronizar($_POST); 

      $alertas = $servicio->validar();

      if(empty($alertas)) {
        $servicio->guardar();
        header('Location: /servicios');
      }
    }

    $router->render('servicios/crear', [
      'nombre'=>$_SESSION['nombre'],
      'servicio' => $servicio,
      'alertas' => $alertas,

    ]);
  } 
  public static function actualizar(Router $router) {

    if(!isset($_SESSION)) {//evitar error de 'ignorar session'
      session_start();//se inicia sesion y se puede acceder a $_SESSION
    };

    if($_SERVER['REQUEST_METHOD'] === 'POST') {

    };

    $router->render('servicios/actualizar', [
      'nombre'=>$_SESSION['nombre']

    ]);
  } 
  public static function eliminar(Router $router) {

    if(!isset($_SESSION)) {//evitar error de 'ignorar session'
      session_start();//se inicia sesion y se puede acceder a $_SESSION
    };

    if($_SERVER['REQUEST_METHOD'] === 'POST') {
      
    };

    $router->render('servicios/eliminar', [
      'nombre'=>$_SESSION['nombre']

    ]);
  } 
  
}