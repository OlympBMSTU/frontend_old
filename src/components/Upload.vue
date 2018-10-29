<template>
  <div
    :class="[
      $style.dropzone,
      {[$style.dropzone_active]: dragActive && !uploading},
      {[$style.dropzone_entered]: dropZoneEntered && !uploading}
    ]"
    :style="loaderStyle"
  >
    <div :class="[
      $style.dropzone__wrapper,
      {[$style.dropzone__wrapper_err]: showError}
    ]">
      <div :class="[$style.dropzone__tip]">
        <template v-if="!uploading">
          <div>
            <template v-if="dropZoneEntered">
              Отпустите файл, чтобы загрузить
            </template>
            <template v-else-if="dragActive">
              Перетащите файл сюда
            </template>
            <template v-else>
              <div v-if="loadingSuccess" :class="[$style.success]">
                Файл успешно загружен
              </div>
              <template v-if="(error || loadingError)">
                {{ error || loadingError }}
              </template>
              <template v-else-if="!choosen">
                Перетащите файл сюда <br>
                или загрузите с компьютера
              </template>
              <template v-else>
                Выбран файл <b>{{ choosen }}</b>
              </template>
              <div :class="[
                $style.dropzone__link,
                {[$style.dropzone__link_hover]: hovered}
              ]">
                Загрузить 
                <template v-if="choosen || loadingSuccess">другой</template>
                файл
              </div>
            </template>
          </div>
        </template>
        <template v-else>
          <div :class="[$style.preloader]"></div>
        </template>
      </div>
      <input type="file" ref="fileopener" hidden />
    </div>
    <a
      v-if="!uploading"
      @mouseover="onHover(true)"
      @mouseout="onHover(false)"
      @click="openFileDialog"
      :class="[$style.dropzone__wrapper_link]"
      ref="dropzone"
    ></a>
  </div>
</template>

<script>
import FileAPI from 'fileapi'

export default {
  inject: ['$validator'],
  data () {
    return {
      hovered: false,
      dragActive: false,
      dropZoneEntered: false,
      dragCounter: 0,
      file: null,
      choosen: null
    }
  },
  props: {
    height: String,
    error: String,
    loadingError: String,
    uploading: Boolean,
    loadingSuccess: Boolean
  },
  computed: {
    loaderStyle () {
      return {
        height: this.height
      }
    },
    showError () {
      return (
        (this.error || this.loadingError) &&
        !this.dragActive && !this.uploading
      )
    }
  },
  methods: {
    openFileDialog (event) {
      event.preventDefault()
      this.$refs.fileopener.click()
    },
    onHover (hovered) {
      this.hovered = hovered
    },
    onDragEnter (event) {
      this.dragCounter++
      this.dragActive = true
      this.dropZoneEntered = event.target === this.$refs.dropzone
    },
    onDragLeave () {
      this.dragCounter--
      if (!this.dragCounter) {
        this.dragActive = false
        this.dropZoneEntered = false
      }
    },
    onDropped (files) {
      if (this.dropZoneEntered) {
        this.validateInputFile(files)
      }
      this.dropZoneEntered = false
      this.dragActive = false
      this.dragCounter = 0
    },
    fileSelected (event) {
      this.validateInputFile(event.target.files[0])
    },
    validateInputFile (files) {
      // validator expects array of files
      // but event.target.files returns FileList
      files = Array.isArray(files) ? files : [files]
      this.$emit('upload', files)
      this.choosen = files[0].name
    }
  },
  mounted () {
    document.addEventListener('dragenter', this.onDragEnter, false)
    document.addEventListener('dragleave', this.onDragLeave, false)
    this.$refs.fileopener.addEventListener('change', this.fileSelected, false)
    FileAPI.event.dnd(document, function () {}, this.onDropped)
  },
  beforeDestroy () {
    document.removeEventListener('dragenter', this.onDragEnter)
    document.removeEventListener('dragleave', this.onDragLeave)
    this.$refs.fileopener.removeEventListener('change', this.fileSelected)
    FileAPI.event.dnd.off(document, function () {}, this.onDropped)
  }
}
</script>

<style lang="scss" scoped module>
@import "../styles/base.scss";

.preloader {
  width: 40px;
  height: 40px;
  background: $color-preloader;
  background-size: contain;
  animation: Spinner 1.5s linear infinite;
}

@keyframes Spinner {
  0% {
    transform: rotate(0deg)
  }

  100% {
    transform: rotate(360deg)
  }
}

.dropzone {
  width: 100%;
  position: relative;
  background: $color-bg-secondary;
  padding: $x15 $padding-base * 2;
  box-sizing: border-box;
  cursor: pointer;

  &_active {
    background: $color-bg-secondary-disabled;
    color: $color-text-disabled;
    fill: $color-text-disabled;
  }

  &__wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: space-between;
    align-items: center;
    flex-direction: column;
    text-align: center;

    &_err {
      border: $x05 dashed $color-error;
      color: $color-error;
    }

    &_link {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  &__icon {
    &_upload {
      height: $x20;
      width: $x20;
      padding-bottom: $padding-base;
    }
  }

  &__tip {
    /* restrict area for nice errors display (no such style in theme.scss) */
    max-width: 500px;
  }

  &__link {
    color: $color-link;
    padding-top: $x2;

    &_hover {
      color: $color-link-hover;
      text-decoration: underline;
    }
  }
}

.success {
  color: #2c772c;
}
</style>