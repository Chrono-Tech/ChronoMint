import variables from 'styles/themes/variables'

export default {
  header: {
    route: {
      style: {
        color: variables.colorPrimary0,
        fontWeight: 'bold',
      },
      labelStyle: {
        textTransform: 'none',
        color: variables.colorPrimary0,
      }
    }
  },
  drawer: {
    item: {
      style: {
        color: variables.colorPrimary1
      },
      iconStyle: {
        color: variables.colorPrimary1
      }
    },
    itemActive: {
      style: {
        backgroundColor: variables.colorPrimary0,
        color: variables.colorWhite
      },
      iconStyle: {
        color: variables.colorWhite
      }
    },
  },
  content: {
    header: {
      link: {
        color: variables.colorWhite
      }
    },
    paper: {
      style: {
      }
    }
  },
  footer: {
    form: {
      inputStyle: {
        color: 'rgba(255, 255, 255, 1)'
      },
      hintStyle: {
        color: 'rgba(255, 255, 255, 0.6)'
        // opacity: 0.6
      }
    }
  }
}
