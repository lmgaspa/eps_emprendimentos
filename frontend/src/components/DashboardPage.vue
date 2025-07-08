<template>
  <div class="dashboard-page d-flex flex-column justify-content-center align-items-center text-white vh-100">
    <div class="gradient-overlay"></div>

    <div class="content position-relative z-1 text-center">
      <h1 class="display-4 fw-bold mb-3">Bem-vindo, {{ userName }}</h1>
      <p class="lead mb-4">Gerencie seus chamados técnicos com facilidade.</p>

      <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
        <button @click="goToBuscarNota" class="btn btn-info fw-semibold px-4 rounded-pill">
          Buscar Nota de Serviço
        </button>
        <button @click="goToNovaNota" class="btn btn-warning fw-semibold px-4 rounded-pill">
          Registrar Nota de Serviço
        </button>
        <button
          v-if="isAdmin"
          @click="goToRegistrarFuncionario"
          class="btn btn-blue fw-semibold px-4 rounded-pill"
        >
          Registrar Funcionário
        </button>
        <button @click="logout" class="btn btn-danger fw-semibold px-4 rounded-pill">
          Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('')
const isAdmin = ref(false)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')

  try {
    const response = await fetch('https://eps-6c85169e1d63.herokuapp.com/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Erro')

    const user = await response.json()
    userName.value = user.name
    isAdmin.value = user.role === 'admin'
  } catch (e) {
    localStorage.removeItem('token')
    router.push('/login')
  }
})

const goToBuscarNota = () => router.push('/busca-nota-de-servico')
const goToNovaNota = () => router.push('/registrar-ticket')
const goToRegistrarFuncionario = () => router.push('/register')
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

.btn-blue {
  background-color: #0d6efd;
  color: #fff;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-blue:hover {
  background-color: #0b5ed7;
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
