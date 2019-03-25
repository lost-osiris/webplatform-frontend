import React from 'react'

export default class AutocompleteResults extends React.Component {
  constructor(props) {
    super(props)
    this.style = {
      width: '0px',
      maxHeight: '200px',
      overflowY: 'auto'
    }

    if (props.width != null) {
      this.style.width = props.width + 'px'
    }

    this.state = {
      offset: 0,
    }
  }

  buildResults({results, onSelect, offset, ResultsComponent}) {
    return results.map((item, key) => {
      if (key >= offset) {
        return
      }
      let onSelection = () => onSelect({text: item.value, toggle: false})
      let result = []
      let count = 0

      for (let i in item.value) {
        let index = parseInt(i)
        let char = item.value[i]

        if (item.indexes[count] === index) {
          result.push(
            <strong key={ i } className="tt-highlight">{ char }</strong>
          )
          count++
        } else {
          result.push(char)
        }
      }

      if (ResultsComponent) {
        return (
          <div key={ key } className="tt-suggestion tt-selectable">
            <ResultsComponent {...item} onSelection={onSelect} />
          </div>
        )
      }

      return (
        <div key={ key } className="tt-suggestion tt-selectable" onMouseDown={ onSelection }>
          { result }
        </div>
      )
    })
  }

  onScroll = (element) => {
    let e = element.target

    let currentScroll = e.scrollTop + e.clientHeight
    this.setState({scrollTop: currentScroll})

    if (currentScroll >= e.scrollHeight - 100) {
      this.setState({offset: this.state.offset + this.props.limit})

      // if (this.state.scrollTop < currentScroll || this.state.scrollTop != currentScroll) {
      //   this.setState({ResultsComponent: })
      // }
    }
  }


  render() {
    let style = {...this.style}
    style.width = this.props.width

    console.log(this.props)
    const Results = (props) => this.buildResults(props)
    return (
      <div className={ this.props.className } style={ {position: 'fixed', 'zIndex': 100, width: style.width } }>
        <div className="tt-dataset tt-dataset-states" style={ style }>
          <Results
            onSelect={this.props.onSelect}
            results={this.props.results}
            ResultsComponent={this.props.resultsComponent}
            offset={this.state.offset}
          />
        </div>
      </div>
    )
  }
}
