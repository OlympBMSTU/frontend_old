<template>
  <div>
    <UploadForm
      height="200px"
      v-model="loader"
      :loadingError="loadingError"
      :uploading="uploading"
      v-validate="'ext:pdf'"
      name="task_loader"
      :error="errors.first('task_loader')"
    />
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
      loadingError: '',
      uploading: false
    }
  },
  watch: {
    loader (files) {
      this.onFilesLoading(files)
    }
  },
  components: {
    UploadForm
  },
  methods: {
    onFilesLoading (files) {
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
    },
    load (files) {
      this.err = ''
      FileAPI.upload({
        url: '',
        files: {
          
        },
        complete: (statuserr, xhr, file) => {
          if (xhr.status !== 200) {
            this.loadingError = 'Не удалось загрузить файлы. Пожалуйста, попробуйте еще раз.'
            this.uploading = false
          } else {
            const response = JSON.parse(xhr.response)
          }
        }
      })
    }
  }
}
</script>

<style scoped module lang="scss">

</style>
