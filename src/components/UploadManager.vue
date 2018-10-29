<template>
  <div>
    <div :class="[$style.header]">
      Система проведения олимпиад. Загрузка заданий.
    </div>
    <input
      :class="[$style.textinput]"
      v-model="answer"
      placeholder="Введите ответ на задание"
    />
    <input
      :class="[$style.textinput]"
      v-model="tags"
      placeholder="Введите тэги через запятую"
    />
    <input
      :class="[$style.textinput]"
      v-model="subject"
      placeholder="Введите предмет"
    />
    <input
      :class="[$style.textinput, {[$style.err]: errors.first('lvl')}]"
      v-model="lvl"
      placeholder="Введите слоджность задания"
      v-validate="'numeric'"
      name="lvl"
    />
    <template v-if="errors.first('lvl')">
      <small style="color: #f51000">{{ errors.first('lvl') }}</small>
    </template>
    <UploadForm
      height="200px"
      v-model="loader"
      :loadingError="loadingError"
      :loadingSuccess="loadingSuccess"
      :uploading="uploading"
      v-validate="'ext:pdf'"
      name="task_loader"
      :error="errors.first('task_loader')"
      @upload="updateFiles"
    />
    <button :class="[{[$style.disabled]: !ready}, $style.btn]" @click="onFilesLoading">Загрузить</button>
  </div>
</template>

<script>
import fileapi from 'fileapi'

import UploadForm from './Upload'

export default {
  inject: ['$validator'],
  data () {
    return {
      loader: null,
      answer: '',
      tags: '',
      subject: '',
      lvl: '',
      loadingError: '',
      loadingSuccess: null,
      uploading: false
    }
  },
  components: {
    UploadForm
  },
  computed: {
    ready () {
      return this.loader && this.answer.length && this.tags.length && this.lvl.length && this.subject.length
    }
  },
  methods: {
    updateFiles (files) {
      this.loader = files
    },
    onFilesLoading () {
      this.loadingError = null
      this.loadingSuccess = null
      const files = this.loader
      if (this.ready) {
        this.$validator
          .validate('*', undefined, {
            silent: true
          })
          .then((valid) => {
            this.uploading = valid
            this.uploadedImage = ''
            if (valid) {
              this.load(files)
            }
          })
      }
    },
    load (files) {
      this.err = ''
      FileAPI.upload({
        url: 'http://localhost:5469/api/exercises/upload_exercise',
        headers: {
          'Access-Controll-Request-Method': 'POST'
        },
        data: {
          answer: this.answer,
          level: this.lvl,
          tags: JSON.stringify(this.tags.split(',')),
          subject: this.subject
        },
        files: {
          files
        },
        complete: (statuserr, xhr, file) => {
          if (xhr.status !== 201) {
            this.loadingError = 'Не удалось загрузить файлы. Пожалуйста, попробуйте еще раз.'
            this.uploading = false
            this.loadingSuccess = false
          } else {
            // const response = JSON.parse(xhr.response)
            this.uploading = false
            this.loadingSuccess = true
          }
        }
      })
    }
  }
}
</script>

<style scoped module lang="scss">
@import "../styles/base.scss";

.header {
  text-align: center;
  padding: $x2;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.textinput {
  display: block;
  width: 100%;
  border-radius: 2px;
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid #333;
  outline: none;
  box-sizing: border-box;
  font-size: 18px;
}

.btn {
  display: block;
  background: rgb(105, 147, 187);
  padding: 10px;
  font-size: 18px;
  color: #fff;
  margin-top: 10px;
  cursor: pointer;
}

.err {
  border-color: $color-error;
  color: $color-error; 
}
</style>
