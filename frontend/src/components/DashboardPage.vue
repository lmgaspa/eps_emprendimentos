<template>
  <div class="dashboard-page d-flex flex-column justify-content-center align-items-center text-white vh-100">
    <div class="gradient-overlay"></div>

    <div class="content position-relative z-1 text-center">
      <h1 class="display-4 fw-bold mb-3">Bem-vindo ao Painel</h1>
      <p class="lead mb-4">Gerencie seus chamados técnicos com facilidade.</p>

      <div class="d-flex gap-3 justify-content-center">
        <button @click="goToChamados" class="btn btn-success fw-semibold px-4 rounded-pill">
          Ver Chamados
        </button>
        <button @click="logout" class="btn btn-outline-light fw-semibold px-4 rounded-pill">
          Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToChamados = () => {
  router.push('/tickets') // ajuste conforme sua rota real de chamados
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.dashboard-page {
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
</style>
