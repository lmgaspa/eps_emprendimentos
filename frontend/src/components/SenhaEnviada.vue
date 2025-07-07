<template>
  <div class="forgot-password-page d-flex align-items-center justify-content-center vh-100">
    <div class="card p-4 shadow-lg text-center" style="width: 100%; max-width: 400px;">
      <h2 class="text-white fw-bold mb-3">Senha redefinida</h2>

      <p class="text-white fs-5 mb-4">
        Sua nova senha foi enviada para o e-mail cadastrado com sucesso.
      </p>

      <router-link to="/login" class="btn btn-warning w-100 fw-semibold rounded-pill">
        Retornar à área de login
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nenhuma lógica JS necessária
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

.card .text-success,
.card .text-danger {
  font-size: 1.3rem;
  font-weight: bold;
}
</style>
