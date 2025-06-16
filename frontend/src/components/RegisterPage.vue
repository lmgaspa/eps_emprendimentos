<template>
  <div class="register-page d-flex align-items-center justify-content-center vh-100 text-white">
    <div class="card p-4 shadow-lg" style="width: 100%; max-width: 450px;">
      <h2 class="text-center fw-bold text-white mb-3">Criar Conta</h2>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="name" class="form-label text-white">Nome completo</label>
          <input v-model="name" type="text" id="name" class="form-control" placeholder="Seu nome" required />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label text-white">E-mail</label>
          <input v-model="email" type="email" id="email" class="form-control" placeholder="seuemail@exemplo.com" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label text-white">Senha</label>
          <input v-model="password" type="password" id="password" class="form-control" placeholder="Crie uma senha" required />
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label text-white">Confirmar Senha</label>
          <input v-model="confirmPassword" type="password" id="confirmPassword" class="form-control" placeholder="Repita sua senha" required />
        </div>

        <button type="submit" class="btn btn-success w-100 fw-semibold rounded-pill">
          Registrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('As senhas não coincidem.')
    return
  }

  console.log({ name: name.value, email: email.value, password: password.value })
}
</script>

<style scoped>
.register-page {
  background: radial-gradient(circle at top, #00dc82 5%, #0f0f1b 50%, #000 100%);
  padding: 1rem;
}
.card {
  background-color: #1a1a2e;
  border: none;
  border-radius: 1rem;
}
</style>
