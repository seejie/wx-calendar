Component({
  properties: {
    title: String,
    list: Array
  },
  methods: {
    onselected ({ target: { dataset } }) {
      const { id } = dataset
      this.triggerEvent('onselected', id)
    }
  }
})
