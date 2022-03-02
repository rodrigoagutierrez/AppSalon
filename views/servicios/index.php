<h1 class="nombre-pagina">Servicios</h1>
<p class="descripcion-pagina">Administración Servicios</p>

<?php
  include __DIR__ . '/../templates/barra.php';
?>

<ul class="servicios">
  <?php foreach($servicios as $servicio) { ?>
    <li>
      <p>Nombre: <span><?php echo $servicio->nombre;?></span></p>
      <p>Precio: <span>$<?php echo $servicio->precio;?></span></p>

      <div class="acciones">
        <a class="boton" href="/servicios/actualizar?id=<?php echo $servicio->id;?>">Actualizar</a>
      </div>
      <form action="/servicios/eliminar" method="POST">
        <input type="hidden" name="id" value="<?php echo $servicio->id; ?>">
        <input type="submit" value="borrar" class="boton-eliminar">
      </form>
    </li>


  <?php } ?>  
</ul>
