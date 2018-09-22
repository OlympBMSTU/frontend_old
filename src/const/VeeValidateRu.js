import VeeValidateRu from 'vee-validate/dist/locale/ru'

const messages = {
  ext: () => 'Задания должны быть представлены в виде файла с расширением .pdf'
}
const attributes = {}
const dictionary = {
  name: 'ru',
  messages: Object.assign({}, VeeValidateRu.messages, messages),
  attributes: Object.assign({}, VeeValidateRu.attributes, attributes)
}

export default dictionary