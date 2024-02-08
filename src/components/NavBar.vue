<script setup lang="ts">
import ToolButton from '@/components/ToolButton.vue';
</script>

<template>
    <header style="height: 100px; border-bottom: 2px solid #b19d95;" class="pico-background-pumpkin-100 pico-color-pumpkin-100 nav">
        <div class="container">
            <nav>
                <ul>
                    <li>
                        <img alt="logo" style="margin-left: 50%;" src="@/assets/logo.png" width="48"
                            height="48" />
                    </li>
                    <li style="margin-left: 30px;">
                        <h4>DBaby</h4>
                    </li>
                </ul>
                <ul>
                    <li>
                        <ToolButton>Criar conta</ToolButton>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
</template>

<style scoped>
.nav {
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
}

.nav a {
  float: left;
  display: block;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}
</style>