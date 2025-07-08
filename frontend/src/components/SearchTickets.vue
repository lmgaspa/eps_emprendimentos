<!-- SearchTickets.vue -->
<template>
  <div class="full-height d-flex flex-column align-items-center p-4">
    <div class="gradient-overlay"></div>

    <div class="w-100 mb-3" style="max-width: 600px;">
      <RouterLink to="/dashboard" class="btn btn-success w-100 fw-bold rounded-pill">
        ⬅️ Voltar ao menu anterior
      </RouterLink>
    </div>

    <div class="card p-4 w-100" style="max-width: 600px;">
      <h2 class="mb-4 text-center text-white">Buscar Ticket</h2>

      <div class="form-group mb-3">
        <label class="form-label text-white">Buscar por:</label>
        <select v-model="searchType" class="form-select">
          <option disabled value="">Selecione</option>
          <option value="cliente">Nome do Cliente</option>
          <option value="empresa">Empresa</option>
          <option value="cpf">CPF</option>
          <option value="cnpj">CNPJ</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="telefone">Telefone</option>
          <option value="email">E-mail</option>
          <option value="nota">Nota de Serviço</option>
          <option value="all">Todos os Tickets</option>
        </select>
      </div>

      <div class="form-group mb-3" v-if="searchType !== '' && searchType !== 'all'">
        <label class="form-label text-white">{{ labelForType }}</label>
        <input v-model="searchValue" class="form-control" :type="searchType === 'email' ? 'email' : 'text'" :placeholder="labelForType" required />
      </div>

      <button class="btn btn-warning w-100" @click="searchTicket">Buscar</button>

      <p class="text-danger text-center mt-3 fw-bold" v-if="notFound">{{ notFoundMessage }}</p>
    </div>

    <div v-if="paginatedTickets.length > 0" class="card p-4 w-100 mt-4" style="max-width: 600px;">
      <h4 class="text-white mb-3">Resultado</h4>

      <div v-for="ticket in paginatedTickets" :key="ticket.notaServico" class="mb-4 p-3 bg-dark text-white rounded">
        <p><strong>Nota de Serviço:</strong> {{ ticket.notaServico }}</p>
        <p><strong>Cliente:</strong> {{ ticket.cliente }}</p>
        <p><strong>Empresa:</strong> {{ ticket.empresa }}</p>
        <p><strong>CPF:</strong> {{ ticket.cpf }}</p>
        <p><strong>CNPJ:</strong> {{ ticket.cnpj }}</p>
        <p><strong>WhatsApp:</strong> {{ ticket.whatsapp }}</p>
        <p><strong>Telefone:</strong> {{ ticket.telefone }}</p>
        <p><strong>Email:</strong> {{ ticket.emailEmpresa }}</p>
        <p><strong>Descrição:</strong> {{ ticket.descricaoServico }}</p>

        <button class="btn btn-primary btn-sm mt-2" @click="goToEdit(ticket)">Editar</button>
      </div>

      <div class="d-flex justify-content-between mt-3" v-if="totalPages > 1">
        <button class="btn btn-outline-light" :disabled="page === 1" @click="page--">⬅️ Anterior</button>
        <button class="btn btn-outline-light" :disabled="page === totalPages" @click="page++">Próxima ➔</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToEdit = (ticket: any) => {
  router.push(`/editar-ticket/${ticket.notaServico}`)
}

const searchType = ref('')
const searchValue = ref('')
const tickets = ref<any[]>([])
const page = ref(1)
const perPage = 20
const notFound = ref(false)

watch(searchValue, (val) => {
  if (searchType.value === 'cpf') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  if (searchType.value === 'cnpj') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4').replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }

  if (searchType.value === 'whatsapp') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1)$2').replace(/(\d{5})(\d{4})$/, '$1-$2')
  }

  if (searchType.value === 'telefone') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 10).replace(/^(\d{2})(\d)/, '($1)$2').replace(/(\d{4})(\d{4})$/, '$1-$2')
  }
})

watch(searchType, () => {
  searchValue.value = ''
})

const paginatedTickets = computed(() => {
  const start = (page.value - 1) * perPage
  const end = page.value * perPage
  return tickets.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(tickets.value.length / perPage))

const labelForType = computed(() => {
  switch (searchType.value) {
    case 'cliente': return 'Nome do Cliente'
    case 'empresa': return 'Empresa'
    case 'cpf': return 'CPF'
    case 'cnpj': return 'CNPJ'
    case 'whatsapp': return 'WhatsApp'
    case 'telefone': return 'Telefone'
    case 'email': return 'E-mail'
    case 'nota': return 'Nota de Serviço'
    default: return 'Buscar'
  }
})

const notFoundMessage = computed(() => {
  return 'Nenhum registro encontrado.'
})

const searchTicket = async () => {
  if (!searchType.value) return

  if (searchType.value === 'email' && !/^\S+@\S+\.\S+$/.test(searchValue.value)) {
    alert('E-mail inválido')
    return
  }

  let url = ''
  if (searchType.value === 'all') {
    url = `https://eps-emprendimentos.onrender.com/api/tickets/all`
  } else {
    const encoded = encodeURIComponent(searchValue.value)
    switch (searchType.value) {
      case 'cliente': url = `https://eps-emprendimentos.onrender.com/api/tickets/cliente/${encoded}`; break
      case 'empresa': url = `https://eps-emprendimentos.onrender.com/api/tickets/empresa/${encoded}`; break
      case 'cpf': url = `https://eps-emprendimentos.onrender.com/api/tickets/cpf/${encoded}`; break
      case 'cnpj': url = `https://eps-emprendimentos.onrender.com/api/tickets/cnpj/${encoded}`; break
      case 'whatsapp': url = `https://eps-emprendimentos.onrender.com/api/tickets/whatsapp/${encoded}`; break
      case 'telefone': url = `https://eps-emprendimentos.onrender.com/api/tickets/telefone/${encoded}`; break
      case 'email': url = `https://eps-emprendimentos.onrender.com/api/tickets/email/${encoded}`; break
      case 'nota': url = `https://eps-emprendimentos.onrender.com/api/tickets/nota/${encoded}`; break
    }
  }

  try {
    const token = localStorage.getItem('token')
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const result = await response.json()

    if (!Array.isArray(result)) {
      if (result && result.notaServico) {
        tickets.value = [result]
        notFound.value = false
        page.value = 1
        return
      }
      tickets.value = []
      notFound.value = true
      return
    }

    tickets.value = result
    page.value = 1
    notFound.value = result.length === 0
  } catch (err) {
    console.error('Erro ao buscar tickets:', err)
    notFound.value = true
  }
}
</script>

<style scoped>
.full-height {
  position: relative;
  min-height: 100vh;
  background-color: #0f0f1b;
  overflow: hidden;
  width: 100%;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top center, #00dc82 0%, #0f0f1b 60%, #000 100%);
  opacity: 0.3;
  filter: blur(120px);
  z-index: -1;
  pointer-events: none;
}

.card {
  background-color: #1a1a2e;
  border: none;
  border-radius: 1rem;
  color: white;
}
</style>
