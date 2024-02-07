<template>
    <div class="card">
        <slot></slot>
    </div>
</template>


<style>
.card {
    border-radius: 13px;
    /* Define o raio da borda */
    box-shadow: 5px 3px 10px rgba(136, 105, 74, 0.5);
    /* Adiciona uma sombra suave ao redor do card */
    color: #474343;
    /* Define a cor do texto */
    border: 2px solid #8d5a53;
    width: fit-content;
    height: fit-content;
    /* Define a cor e espessura da borda */
    font-family: 'Dosis', sans-serif;
    /* Define a fonte do texto */
    font-size: large;
    /* Define o tamanho do texto */
    font-weight: 600;
    /* Define o peso da fonte */
}
</style>