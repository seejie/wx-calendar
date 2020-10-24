Component({
  properties: {
    title: String,
    list: Array
  },
  methods: {
    onselected ({ target: { dataset } }) {
      const { idx, selected } = dataset
      const arr = this.properties.list
      arr[idx].selected = !selected
      this.setData({ list: arr })
    }
  }
})
