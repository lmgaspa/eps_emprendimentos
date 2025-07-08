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

      <div v-for="ticket in paginatedTickets" :key="ticket._id" class="mb-4 p-3 bg-dark text-white rounded">
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
const baseUrl = 'https://eps-6c85169e1d63.herokuapp.com/api/tickets'

const searchType = ref('')
const searchValue = ref('')
const tickets = ref<any[]>([])
const page = ref(1)
const perPage = 20
const notFound = ref(false)

const goToEdit = (ticket: any) => {
  router.push(`/editar-ticket/${ticket.notaServico}`)
}

watch(searchValue, (val) => {
  if (searchType.value === 'cpf') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else if (searchType.value === 'cnpj') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4').replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  } else if (searchType.value === 'whatsapp') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1)$2').replace(/(\d{5})(\d{4})$/, '$1-$2')
  } else if (searchType.value === 'telefone') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 10).replace(/^(\d{2})(\d)/, '($1)$2').replace(/(\d{4})(\d{4})$/, '$1-$2')
  }
})

watch(searchType, () => {
  searchValue.value = ''
})

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
    default: return ''
  }
})

const paginatedTickets = computed(() => {
  const start = (page.value - 1) * perPage
  return tickets.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(tickets.value.length / perPage))

const notFoundMessage = computed(() => 'Nenhum registro encontrado.')

const searchTicket = async () => {
  if (!searchType.value) return

  if (searchType.value === 'email' && !/^\S+@\S+\.\S+$/.test(searchValue.value)) {
    alert('E-mail inválido')
    return
  }

  let url = ''
  const token = localStorage.getItem('token')
  const encoded = encodeURIComponent(searchValue.value)

  if (searchType.value === 'all') {
    url = `${baseUrl}/all`
  } else {
    const routeMap: Record<string, string> = {
      cliente: 'cliente',
      empresa: 'empresa',
      cpf: 'cpf',
      cnpj: 'cnpj',
      whatsapp: 'whatsapp',
      telefone: 'telefone',
      email: 'email',
      nota: 'nota'
    }

    const endpoint = routeMap[searchType.value]
    url = `${baseUrl}/${endpoint}/${encoded}`
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const result = await response.json()

    if (!Array.isArray(result)) {
      if (result && result.notaServico) {
        tickets.value = [result]
        notFound.value = false
      } else {
        tickets.value = []
        notFound.value = true
      }
    } else {
      tickets.value = result
      notFound.value = result.length === 0
    }

    page.value = 1
  } catch (err) {
    console.error('Erro ao buscar tickets:', err)
    tickets.value = []
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
