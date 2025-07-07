<template>
  <div class="login-page d-flex align-items-center justify-content-center vh-100 text-white">
    <div class="card p-4 shadow-lg" style="width: 100%; max-width: 400px;">
      <h2 class="text-center fw-bold text-white mb-3">Entrar</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label text-white">E-mail</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="form-control"
            placeholder="seuemail@exemplo.com"
            required
          />
        </div>

        <div class="mb-3 position-relative">
          <label for="password" class="form-label text-white">Senha</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-control"
            placeholder="Digite sua senha"
            required
          />
          <i
            :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
            class="toggle-password-icon"
            @click="showPassword = !showPassword"
          ></i>
        </div>

        <div class="text-end mb-3">
          <RouterLink to="/esqueci-senha" class="text-light small">Esqueceu sua senha?</RouterLink>
        </div>

        <button type="submit" class="btn btn-success w-100 fw-semibold rounded-pill">
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '../router'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  const response = await fetch('https://eps-emprendimentos.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, password: password.value })
  })

  if (!response.ok) {
    alert('Login inválido')
    return
  }

  const data = await response.json()
  localStorage.setItem('token', data.token)
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  background: radial-gradient(circle at top, #00dc82 5%, #0f0f1b 50%, #000 100%);
  padding: 1rem;
}
.card {
  background-color: #1a1a2e;
  border: none;
  border-radius: 1rem;
}
.toggle-password-icon {
  position: absolute;
  top: 38px;
  right: 12px;
  cursor: pointer;
  color: #ccc;
  font-size: 1.2rem;
}
</style>