<template>
  <div class="landing-page d-flex align-items-center justify-content-center text-center text-white vh-100">
    <div class="gradient-overlay"></div>

    <div class="content position-relative z-1">
      <h1 class="display-4 fw-bold mb-3">EPS Empreendimentos</h1>
      <p class="lead mb-4">Sistema moderno de chamados técnicos. Acesse sua conta ou crie uma nova para começar.</p>
      <div class="d-flex justify-content-center gap-3">
        <button @click="goToLogin" class="btn btn-success px-4 py-2 fw-semibold rounded-pill">Login</button>
        <button @click="goToRegister" class="btn btn-success px-4 py-2 fw-semibold rounded-pill">Cadastrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.landing-page {
  position: relative;
  background-color: #0f0f1b;
  overflow: hidden;
}

.gradient-overlay {
  position: absolute;
  top: -30%;
  left: 50%;
  transform: translateX(-50%);
  width: 1200px;
  height: 1200px;
  background: radial-gradient(circle at top, #00dc82 60%, #0f0f1b 50%, #000 100%);
  opacity: 0.3;
  filter: blur(150px);
  z-index: 0;
}

.content {
  z-index: 1;
  max-width: 800px;
  padding: 0 1rem;
}

h1 {
  font-size: 2.5rem;
}

p.lead {
  font-size: 1.125rem;
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.75rem;
  }

  p.lead {
    font-size: 1rem;
  }

  .btn {
    padding: 0.5rem 1.2rem;
    font-size: 0.9rem;
  }

  .d-flex.gap-3 {
    flex-direction: column;
    gap: 1rem !important;
  }
}
</style scoped>