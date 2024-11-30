<!-- <template>
  <div>home</div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    
  }
}
</script> -->

<!-- /////////////////////////////// -->

<template>
  <section class="section">
    <div class="container">
      <!-- Encabezado Principal -->
      <h1 class="title has-text-centered">Bienvenido al Proyecto: Cambios en la Naturaleza</h1>
      <p class="subtitle has-text-centered">
        Un viaje por las transformaciones del medio ambiente desde 1980 hasta el presente.
      </p>

      <!-- Imagen destacada -->
      <div class="columns is-centered">
        <div class="column is-half">
          <figure class="image is-4by3">
            <img src="@/assets/fotoHome.jpg" alt="inicio">
          </figure>
        </div>
      </div>

      <!-- Contenido introductorio -->
      <div class="content">
        <p>
          Desde 1980, nuestro planeta ha sido testigo de profundos cambios en su equilibrio natural. 
          Factores como el cambio climático, la contaminación, y la actividad humana han transformado 
          la biodiversidad, los niveles del mar, las concentraciones de CO2 y la capa de ozono, entre otros. 
          Este proyecto documenta estos cambios y examina cómo la humanidad puede contribuir a la conservación 
          y restauración de los ecosistemas.
        </p>
        <p>
          En esta plataforma, exploraremos cómo la naturaleza ha evolucionado en intervalos de 7 años, desde 
          1987 hasta 2022, analizando los retos y logros en la protección del medio ambiente.
        </p>
      </div>

      <!-- Accesos rápidos a secciones -->
      <div class="columns is-multiline">
        <div class="column is-one-third">
          <div class="box">
            <h2 class="subtitle">Especies en Peligro</h2>
            <p>
              Descubre cómo la pérdida de hábitat y la actividad humana han afectado a la biodiversidad.
            </p>
            <router-link to="/Dashboard" class="button is-link">Explorar</router-link>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="box">
            <h2 class="subtitle">Cambio Climático</h2>
            <p>
              Examina los efectos del calentamiento global y el aumento del nivel del mar.
            </p>
            <router-link to="/Dashboard" class="button is-link">Explorar</router-link>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="box">
            <h2 class="subtitle">Capa de Ozono</h2>
            <p>
              Aprende sobre los esfuerzos internacionales para proteger esta capa vital.
            </p>
            <router-link to="/Dashboard" class="button is-link">Explorar</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.section {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.image img {
  border-radius: 8px;
}
.box {
  text-align: center;
}
</style>

