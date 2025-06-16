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
        const documentType = ref('cpf');
        const contactType = ref('telefone');
        const isFormValid = ref(false);
        const isEmailValid = ref(true);
        const isCpfValid = ref(false);
        const isCnpjValid = ref(false);
        const isCpfOrCnpjValid = ref(false);
        const isTelefoneOuWhatsappValid = ref(false);
        const maskCpf = (value) => {
            const digits = value.replace(/\D/g, '');
            return digits
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                .slice(0, 14);
        };
        const maskCnpj = (value) => {
            const digits = value.replace(/\D/g, '');
            return digits
                .replace(/^(\d{2})(\d)/, '$1.$2')
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/, '.$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .slice(0, 18);
        };
        const maskTelefone = (value) => {
            const digits = value.replace(/\D/g, '');
            return digits
                .replace(/^(\d{2})(\d)/, '($1)$2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .slice(0, 14);
        };
        const maskWhatsapp = (value) => {
            const digits = value.replace(/\D/g, '');
            return digits
                .replace(/^(\d{2})(\d)/, '($1)$2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .slice(0, 15);
        };
        const onCpfInput = (e) => {
            const input = e.target;
            ticket.value.cpf = maskCpf(input.value);
            isCpfValid.value = ticket.value.cpf.length === 14;
            validateForm();
        };
        const onCnpjInput = (e) => {
            const input = e.target;
            ticket.value.cnpj = maskCnpj(input.value);
            isCnpjValid.value = ticket.value.cnpj.length === 18;
            validateForm();
        };
        const onTelefoneInput = (e) => {
            const input = e.target;
            const raw = input.value.replace(/\D/g, '').slice(0, 10); // 10 dígitos para fixo
            ticket.value.telefone = raw
                .replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1)$2-$3')
                .slice(0, 14); // inclui os parênteses e traço
            validateForm();
        };
        const onWhatsappInput = (e) => {
            const input = e.target;
            const raw = input.value.replace(/\D/g, '').slice(0, 11); // 11 dígitos para celular
            ticket.value.whatsapp = raw
                .replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1)$2-$3')
                .slice(0, 15); // inclui os parênteses e traço
            validateForm();
        };
        const validateEmail = (email) => {
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
                    const response = await fetch('https://ticketsupport-97c66f2a0810.herokuapp.com/tickets', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(ticket.value),
                    });
                    if (response.ok) {
                        alert('Chamado enviado com sucesso!');
                    }
                    else {
                        alert('Erro ao enviar chamado!');
                    }
                }
                catch (error) {
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
;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    __VLS_styleScopedClasses['custom-btn'];
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("d-flex justify-content-center align-items-center bg-gradient-custom full-height") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({ ...{ onSubmit: (__VLS_ctx.handleSubmit) }, ...{ class: ("p-4 border rounded bg-white shadow-sm w-100") }, ...{ style: ({}) }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({ ...{ class: ("mb-4 text-center text-primary") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-3") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("form-label") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("me-3") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onChange: (__VLS_ctx.validateForm) }, type: ("radio"), value: ("cpf"), });
    (__VLS_ctx.documentType);
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onChange: (__VLS_ctx.validateForm) }, type: ("radio"), value: ("cnpj"), });
    (__VLS_ctx.documentType);
    if (__VLS_ctx.documentType === 'cpf') {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-3") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ for: ("cpf"), ...{ class: ("form-label") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onInput: (__VLS_ctx.onCpfInput) }, type: ("text"), ...{ class: ("form-control") }, id: ("cpf"), value: ((__VLS_ctx.ticket.cpf)), maxlength: ("14"), });
        if (__VLS_ctx.ticket.cpf && !__VLS_ctx.isCpfValid) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({ ...{ class: ("text-danger") }, });
        }
    }
    if (__VLS_ctx.documentType === 'cnpj') {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-3") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ for: ("cnpj"), ...{ class: ("form-label") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onInput: (__VLS_ctx.onCnpjInput) }, type: ("text"), ...{ class: ("form-control") }, id: ("cnpj"), value: ((__VLS_ctx.ticket.cnpj)), maxlength: ("18"), });
        if (__VLS_ctx.ticket.cnpj && !__VLS_ctx.isCnpjValid) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({ ...{ class: ("text-danger") }, });
        }
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-3") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ for: ("cliente"), ...{ class: ("form-label") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onInput: (__VLS_ctx.validateForm) }, type: ("text"), ...{ class: ("form-control") }, id: ("cliente"), value: ((__VLS_ctx.ticket.cliente)), required: (true), });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-3") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ for: ("empresa"), ...{ class: ("form-label") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onInput: (__VLS_ctx.validateForm) }, type: ("text"), ...{ class: ("form-control") }, id: ("empresa"), value: ((__VLS_ctx.ticket.empresa)), required: (true), });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-3") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ for: ("emailEmpresa"), ...{ class: ("form-label") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onInput: (__VLS_ctx.validateForm) }, type: ("email"), ...{ class: ("form-control") }, id: ("emailEmpresa"), });
    (__VLS_ctx.ticket.emailEmpresa);
    if (__VLS_ctx.ticket.emailEmpresa && !__VLS_ctx.isEmailValid) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({ ...{ class: ("text-danger") }, });
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-3") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("form-label") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("me-3") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onChange: (__VLS_ctx.validateForm) }, type: ("radio"), value: ("telefone"), });
    (__VLS_ctx.contactType);
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onChange: (__VLS_ctx.validateForm) }, type: ("radio"), value: ("whatsapp"), });
    (__VLS_ctx.contactType);
    if (__VLS_ctx.contactType === 'telefone') {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-3") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ for: ("telefone"), ...{ class: ("form-label") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onInput: (__VLS_ctx.onTelefoneInput) }, type: ("tel"), ...{ class: ("form-control") }, id: ("telefone"), maxlength: ("14"), });
        (__VLS_ctx.ticket.telefone);
    }
    if (__VLS_ctx.contactType === 'whatsapp') {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-3") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ for: ("whatsapp"), ...{ class: ("form-label") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ...{ onInput: (__VLS_ctx.onWhatsappInput) }, type: ("tel"), ...{ class: ("form-control") }, id: ("whatsapp"), maxlength: ("15"), });
        (__VLS_ctx.ticket.whatsapp);
    }
    if (!__VLS_ctx.isTelefoneOuWhatsappValid) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-2") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({ ...{ class: ("text-danger") }, });
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("form-group mb-4") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ for: ("descricaoServico"), ...{ class: ("form-label") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({ ...{ onInput: (__VLS_ctx.validateForm) }, ...{ class: ("form-control") }, id: ("descricaoServico"), value: ((__VLS_ctx.ticket.descricaoServico)), rows: ("3"), required: (true), });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ type: ("submit"), ...{ class: ("btn btn-primary btn-lg w-100 custom-btn") }, disabled: ((!__VLS_ctx.isFormValid)), });
    __VLS_styleScopedClasses['d-flex'];
    __VLS_styleScopedClasses['justify-content-center'];
    __VLS_styleScopedClasses['align-items-center'];
    __VLS_styleScopedClasses['bg-gradient-custom'];
    __VLS_styleScopedClasses['full-height'];
    __VLS_styleScopedClasses['p-4'];
    __VLS_styleScopedClasses['border'];
    __VLS_styleScopedClasses['rounded'];
    __VLS_styleScopedClasses['bg-white'];
    __VLS_styleScopedClasses['shadow-sm'];
    __VLS_styleScopedClasses['w-100'];
    __VLS_styleScopedClasses['mb-4'];
    __VLS_styleScopedClasses['text-center'];
    __VLS_styleScopedClasses['text-primary'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-3'];
    __VLS_styleScopedClasses['form-label'];
    __VLS_styleScopedClasses['me-3'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-3'];
    __VLS_styleScopedClasses['form-label'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['text-danger'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-3'];
    __VLS_styleScopedClasses['form-label'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['text-danger'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-3'];
    __VLS_styleScopedClasses['form-label'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-3'];
    __VLS_styleScopedClasses['form-label'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-3'];
    __VLS_styleScopedClasses['form-label'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['text-danger'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-3'];
    __VLS_styleScopedClasses['form-label'];
    __VLS_styleScopedClasses['me-3'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-3'];
    __VLS_styleScopedClasses['form-label'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-3'];
    __VLS_styleScopedClasses['form-label'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-2'];
    __VLS_styleScopedClasses['text-danger'];
    __VLS_styleScopedClasses['form-group'];
    __VLS_styleScopedClasses['mb-4'];
    __VLS_styleScopedClasses['form-label'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['btn'];
    __VLS_styleScopedClasses['btn-primary'];
    __VLS_styleScopedClasses['btn-lg'];
    __VLS_styleScopedClasses['w-100'];
    __VLS_styleScopedClasses['custom-btn'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
    var $refs;
    return {
        slots: __VLS_slots,
        refs: $refs,
        attrs: {},
    };
}
;
let __VLS_self;
