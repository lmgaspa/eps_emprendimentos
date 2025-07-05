<template>
  <div class="forgot-password-page d-flex align-items-center justify-content-center vh-100">
    <div class="card p-4 shadow-lg" style="width: 100%; max-width: 400px;">
      <h2 class="text-center text-white fw-bold mb-3">Esqueci minha senha</h2>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label for="email" class="form-label text-white">E-mail</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="form-control"
            placeholder="Digite seu e-mail"
            required
          />
        </div>

        <button type="submit" class="btn btn-warning w-100 fw-semibold rounded-pill">
          Enviar link de recuperação
        </button>
      </form>

      <p class="text-success mt-3 text-center" v-if="success">{{ success }}</p>
      <p class="text-danger mt-3 text-center" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const success = ref('')
const error = ref('')

const submit = async () => {
  success.value = ''
  error.value = ''

  try {
    const response = await fetch('https://eps-emprendimentos.onrender.com/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Erro ao enviar e-mail.')

    success.value = result.message || 'Link enviado com sucesso.'
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<style scoped>
.forgot-password-page {
  background: radial-gradient(circle at top, #00dc82 5%, #0f0f1b 50%, #000 100%);
  padding: 1rem;
}
.card {
  background-color: #1a1a2e;
  border: none;
  border-radius: 1rem;
}
</style>