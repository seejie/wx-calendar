Component({
  properties: {
    title: String,
    list: Array
  },
  methods: {
    onselected ({ target: { dataset: {id} } }) {
      this.triggerEvent('onselected', id)
    }
  }
})
