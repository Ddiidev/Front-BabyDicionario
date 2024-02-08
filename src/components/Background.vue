<template>
    <div class="sectionbackground">
        <div class='air air1'></div>
        <div class='air air2'></div>
        <div class='air air3'></div>
        <div class='air air4'></div>
        <slot></slot>
    </div>
</template>

<style scoped>
.sectionbackground {
    width: 100%;
    height: 100%;
    background: #fee1d6;
}

.sectionbackground .air {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: url(https://1.bp.blogspot.com/-xQUc-TovqDk/XdxogmMqIRI/AAAAAAAACvI/AizpnE509UMGBcTiLJ58BC6iViPYGYQfQCLcBGAsYHQ/s1600/wave.png);
    background-size: 1000px 100px
}

.sectionbackground .air.air1 {
    animation: wave 25s linear infinite;
    z-index: 1000;
    opacity: 1;
    animation-delay: 0s;
    bottom: 0;
}

.sectionbackground .air.air2 {
    animation: wave2 15s linear infinite;
    z-index: 999;
    opacity: 0.5;
    animation-delay: -5s;
    bottom: 10px;
}

.sectionbackground .air.air3 {
    animation: wave 30s linear infinite;
    z-index: 998;
    opacity: 0.2;
    animation-delay: -2s;
    bottom: 15px;
}

.sectionbackground .air.air4 {
    animation: wave2 5s linear infinite;
    z-index: 997;
    opacity: 0.7;
    animation-delay: -5s;
    bottom: 20px;
}

@keyframes wave {
    0% {
        background-position-x: 0px;
    }

    100% {
        background-position-x: 1000px;
    }
}

@keyframes wave2 {
    0% {
        background-position-x: 0px;
    }

    100% {
        background-position-x: -1000px;
    }
}
</style>