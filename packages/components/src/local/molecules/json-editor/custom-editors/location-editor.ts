import JSONEditor from '@json-editor/json-editor'

export const initLocationEditor = (editCallback: () => void): void => {
  JSONEditor.defaults.editors.location = JSONEditor.AbstractEditor.extend({
    build: function () {
      this.group = document.createElement('div')
      this.group.classList.add('form-group')
      this.container.appendChild(this.group)

      this.label = document.createElement('label')
      this.label.classList.add('control-label')
      this.label.innerText = this.schema.title ? this.schema.title : ''
      this.group.appendChild(this.label)

      this.textArea = document.createElement('textarea')
      this.textArea.name = this.formname
      this.textArea.classList.add('form-control')
      this.textArea.addEventListener('change', (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        this.onChange(e.currentTarget.value)
        if (e.currentTarget.value) {
          this.addEditButton()
        } else {
          console.log('xx> remove edit button')
          this.removeEditButton()
        }
      })

      this.groupTextArea = document.createElement('div')
      this.groupTextArea.classList.add('location-editor')
      this.groupTextArea.appendChild(this.textArea)

      if (this.schema.readOnly || this.schema.readonly || this.schema.template) {
        this.disable(true)
        this.textArea.setAttribute('readonly', 'true')
      }
      this.group.appendChild(this.groupTextArea)
    },

    addEditButton: function () {
      if (this.groupTextArea.childNodes.length < 2) {
        this.editButton = document.createElement('button')
        this.editButton.innerText = 'Edit'
        this.editButton.classList.add('btn', 'btn-secondary', 'json-editor-btn-add', 'json-editor-btntype-add')
        this.editButton.addEventListener('click', () => editCallback())
        this.groupTextArea.appendChild(this.editButton)
      }
    },

    removeEditButton: function () {
      if (this.groupTextArea.childNodes.length === 2) {
        this.groupTextArea.removeChild(this.editButton)
      }
    },

    setValue: function (value: string) {
      this.textArea.value = value
      if (value) {
        this.addEditButton()
      }
    },

    getValue: function () {
      return this.textArea.value
    }
  })

  JSONEditor.defaults.resolvers.unshift((schema: any) => {
    if (schema.format === 'location' && schema.type === 'string') {
      return 'location'
    }
    return schema
  })
}
