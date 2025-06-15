<template>
  <div class="d-flex justify-content-center align-items-center bg-gradient-custom full-height">
    <form @submit.prevent="handleSubmit" class="p-4 border rounded bg-white shadow-sm w-100" style="max-width: 600px;">
      <h2 class="mb-4 text-center text-primary">Cadastro de Chamado</h2>

      <!-- Opções CPF/CNPJ -->
      <div class="form-group mb-3">
        <label class="form-label">Tipo de Documento</label>
        <div>
          <label class="me-3">
            <input type="radio" value="cpf" v-model="documentType" @change="validateForm" /> CPF
          </label>
          <label>
            <input type="radio" value="cnpj" v-model="documentType" @change="validateForm" /> CNPJ
          </label>
        </div>
      </div>

      <div v-if="documentType === 'cpf'" class="form-group mb-3">
        <label for="cpf" class="form-label">CPF</label>
        <input
          type="text"
          class="form-control"
          id="cpf"
          v-model="ticket.cpf"
          @input="onCpfInput"
          maxlength="14"
        />
        <small v-if="ticket.cpf && !isCpfValid" class="text-danger">
          CPF inválido. Deve estar no formato 000.000.000-00
        </small>
      </div>

      <div v-if="documentType === 'cnpj'" class="form-group mb-3">
        <label for="cnpj" class="form-label">CNPJ</label>
        <input
          type="text"
          class="form-control"
          id="cnpj"
          v-model="ticket.cnpj"
          @input="onCnpjInput"
          maxlength="18"
        />
        <small v-if="ticket.cnpj && !isCnpjValid" class="text-danger">
          CNPJ inválido. Deve estar no formato 00.000.000/0000-00
        </small>
      </div>

      <!-- Campo Cliente -->
      <div class="form-group mb-3">
        <label for="cliente" class="form-label">Cliente</label>
        <input type="text" class="form-control" id="cliente" v-model="ticket.cliente" @input="validateForm" required />
      </div>

      <div class="form-group mb-3">
        <label for="empresa" class="form-label">Empresa</label>
        <input type="text" class="form-control" id="empresa" v-model="ticket.empresa" @input="validateForm" required />
      </div>

      <div class="form-group mb-3">
        <label for="emailEmpresa" class="form-label">Email da Empresa (opcional)</label>
        <input type="email" class="form-control" id="emailEmpresa" v-model="ticket.emailEmpresa" @input="validateForm" />
        <small v-if="ticket.emailEmpresa && !isEmailValid" class="text-danger">Email inválido</small>
      </div>

      <!-- Opções Telefone/WhatsApp -->
      <div class="form-group mb-3">
        <label class="form-label">Forma de Contato</label>
        <div>
          <label class="me-3">
            <input type="radio" value="telefone" v-model="contactType" @change="validateForm" /> Telefone
          </label>
          <label>
            <input type="radio" value="whatsapp" v-model="contactType" @change="validateForm" /> WhatsApp
          </label>
        </div>
      </div>

      <div v-if="contactType === 'telefone'" class="form-group mb-3">
        <label for="telefone" class="form-label">Telefone da Empresa (fixo)</label>
        <input
          type="tel"
          class="form-control"
          id="telefone"
          v-model="ticket.telefone"
          @input="onTelefoneInput"
          maxlength="14"
        />
      </div>

      <div v-if="contactType === 'whatsapp'" class="form-group mb-3">
        <label for="whatsapp" class="form-label">WhatsApp</label>
        <input
          type="tel"
          class="form-control"
          id="whatsapp"
          v-model="ticket.whatsapp"
          @input="onWhatsappInput"
          maxlength="15"
        />
      </div>

      <div v-if="!isTelefoneOuWhatsappValid" class="form-group mb-2">
        <small class="text-danger">
          É obrigatório preencher o telefone fixo ou o WhatsApp (com DDD).
        </small>
      </div>

      <div class="form-group mb-4">
        <label for="descricaoServico" class="form-label">Descrição do Serviço</label>
        <textarea class="form-control" id="descricaoServico" v-model="ticket.descricaoServico" @input="validateForm" rows="3" required></textarea>
      </div>

      <button
        type="submit"
        class="btn btn-primary btn-lg w-100 custom-btn"
        :disabled="!isFormValid"
      >
        Enviar Chamado
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TicketForm',
  setup() {
    const ticket = ref({
      cliente: '',
      empresa: '',
      cpf: '',
      cnpj: '',
      emailEmpresa: '',
      telefone: '',
      whatsapp: '',
      descricaoServico: '',
    });

    const documentType = ref<'cpf' | 'cnpj'>('cpf');
    const contactType = ref<'telefone' | 'whatsapp'>('telefone');

    const isFormValid = ref<boolean>(false);
    const isEmailValid = ref<boolean>(true);
    const isCpfValid = ref<boolean>(false);
    const isCnpjValid = ref<boolean>(false);
    const isCpfOrCnpjValid = ref<boolean>(false);
    const isTelefoneOuWhatsappValid = ref<boolean>(false);

    const maskCpf = (value: string): string => {
      const digits = value.replace(/\D/g, '');
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
    };

    const maskCnpj = (value: string): string => {
      const digits = value.replace(/\D/g, '');
      return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 18);
    };

    const maskTelefone = (value: string): string => {
      const digits = value.replace(/\D/g, '');
      return digits
        .replace(/^(\d{2})(\d)/, '($1)$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 14);
    };

    const maskWhatsapp = (value: string): string => {
      const digits = value.replace(/\D/g, '');
      return digits
        .replace(/^(\d{2})(\d)/, '($1)$2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    };

    const onCpfInput = (e: Event) => {
      const input = e.target as HTMLInputElement;
      ticket.value.cpf = maskCpf(input.value);
      isCpfValid.value = ticket.value.cpf.length === 14;
      validateForm();
    };

    const onCnpjInput = (e: Event) => {
      const input = e.target as HTMLInputElement;
      ticket.value.cnpj = maskCnpj(input.value);
      isCnpjValid.value = ticket.value.cnpj.length === 18;
      validateForm();
    };

    const onTelefoneInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const raw = input.value.replace(/\D/g, '').slice(0, 10); // 10 dígitos para fixo
  ticket.value.telefone = raw
    .replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1)$2-$3')
    .slice(0, 14); // inclui os parênteses e traço
  validateForm();
};

const onWhatsappInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const raw = input.value.replace(/\D/g, '').slice(0, 11); // 11 dígitos para celular
  ticket.value.whatsapp = raw
    .replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1)$2-$3')
    .slice(0, 15); // inclui os parênteses e traço
  validateForm();
};

    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validateForm = () => {
      isEmailValid.value = !ticket.value.emailEmpresa || !!validateEmail(ticket.value.emailEmpresa);

      isCpfOrCnpjValid.value =
        (documentType.value === 'cpf' && !!ticket.value.cpf && isCpfValid.value) ||
        (documentType.value === 'cnpj' && !!ticket.value.cnpj && isCnpjValid.value);

      isTelefoneOuWhatsappValid.value =
        (contactType.value === 'telefone' && ticket.value.telefone.length === 14) ||
        (contactType.value === 'whatsapp' && ticket.value.whatsapp.length === 15);

      isFormValid.value =
        ticket.value.cliente.trim() !== '' &&
        ticket.value.empresa.trim() !== '' &&
        isCpfOrCnpjValid.value &&
        isTelefoneOuWhatsappValid.value &&
        ticket.value.descricaoServico.trim() !== '' &&
        isEmailValid.value;
    };

    const handleSubmit = async () => {
      if (isFormValid.value) {
        try {
          const response = await fetch('https://ticketsupport-97c66f2a0810.herokuapp.com/send-ticket', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticket.value),
          });

          if (response.ok) {
            alert('Chamado enviado com sucesso!');
          } else {
            alert('Erro ao enviar chamado!');
          }
        } catch (error) {
          console.error('Erro:', error);
        }
      }
    };

    return {
      ticket,
      handleSubmit,
      validateForm,
      onCpfInput,
      onCnpjInput,
      onTelefoneInput,
      onWhatsappInput,
      isFormValid,
      isEmailValid,
      isCpfValid,
      isCnpjValid,
      isCpfOrCnpjValid,
      isTelefoneOuWhatsappValid,
      documentType,
      contactType,
    };
  },
});
</script>

<style scoped>
.full-height {
  height: 100vh;
  overflow: hidden;
}

.bg-gradient-custom {
  background: linear-gradient(135deg, #3f0d6d, #2f495e, #00c58e);
}

.custom-btn {
  background-color: #3b82f6;
  transition: background-color 0.3s ease;
}

.custom-btn:hover {
  background-color: #2563eb;
}
</style>
