<template>
  <div class="register-page d-flex align-items-center justify-content-center vh-100 text-white">
    <div class="card p-4 shadow-lg" style="width: 100%; max-width: 450px;">
      <div class="w-100 mb-3" style="max-width: 600px;">
      <RouterLink to="/dashboard" class="btn btn-primary w-100 fw-bold rounded-pill">
        ⬅️ Voltar ao menu anterior
      </RouterLink>
    </div>
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
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              id="password"
              class="form-control"
              placeholder="Crie uma senha"
              required
            />
            <button class="btn btn-outline-light" type="button" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label text-white">Confirmar Senha</label>
          <div class="input-group">
            <input
              :type="showConfirm ? 'text' : 'password'"
              v-model="confirmPassword"
              id="confirmPassword"
              class="form-control"
              placeholder="Repita sua senha"
              required
            />
            <button class="btn btn-outline-light" type="button" @click="showConfirm = !showConfirm">
              <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
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
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('employee')
const showPassword = ref(false)
const showConfirm = ref(false)
const router = useRouter()

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    alert('Preencha todos os campos.')
    return
  }

  if (password.value.length < 6) {
    alert('A senha deve ter no mínimo 6 caracteres.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('As senhas não coincidem.')
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    alert('Você precisa estar logado como administrador para registrar.')
    router.push('/login')
    return
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.role !== 'admin') {
      alert('Apenas administradores podem registrar novos usuários.')
      return
    }

    const response = await fetch('https://eps-emprendimentos.onrender.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        role: role.value
      })
    })

    if (!response.ok) {
      const err = await response.json()
      alert(err.message || 'Erro ao registrar usuário.')
      return
    }

    alert('Usuário registrado com sucesso!')
    router.push('/dashboard')
  } catch (error) {
    console.error(error)
    alert('Erro ao tentar registrar usuário.')
  }
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
