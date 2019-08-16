import React from 'react'
import ReactDOM from 'react-dom'

class Options extends React.Component {

	constructor(props) {
		super(props)
    this.handleRandomizationBlur = this.handleRandomizationBlur.bind(this)
    this.useSpreadsheet = this.useSpreadsheet.bind(this)
    this.useTable = this.useTable.bind(this)
    this.useLeftAlign = this.useLeftAlign.bind(this)
    this.useCenterAlign = this.useCenterAlign.bind(this)
    this.useHeader = this.useHeader.bind(this)
  }

  // Make sure the value for number of randomization is within bounds
	handleRandomizationBlur(event) {
		if (event.target.value <= 0) {
			this.props.qset.randomization = event.target.value = 0
		} else if (event.target.value > (this.props.qset.dimensions.x * this.props.qset.dimensions.y)) {
			this.props.qset.randomization = event.target.value = this.props.qset.dimensions.x * this.props.qset.dimensions.y
		} else {
			this.props.qset.randomization = event.target.value
		}
	}

  useSpreadsheet() {
    this.setState(Object.assign(this.props.qset,{spreadsheet:true}));
  }

  useTable() {
    this.setState(Object.assign(this.props.qset,{spreadsheet:false}));
  }

  useLeftAlign() {
    this.setState(Object.assign(this.props.qset,{left:true}));
  }

  useCenterAlign() {
    this.setState(Object.assign(this.props.qset,{left:false}));
  }

  useHeader() {
    this.setState(Object.assign(this.props.qset,{header:!this.props.qset.header}));
  }

  render() {
    return (
      <div>
        <div className="options-bar">
          <div className="options">
            <label>OPTIONS</label>
          </div>
          <div className="style">
            <label><strong>Style:</strong></label>

            <div onClick={this.useSpreadsheet} className={this.props.qset.spreadsheet ? "active" : ""}>
              {!this.props.qset.spreadsheet ?
                <svg id="spreadsheet-checkbox" viewBox="0 0 28 28" width="20px" height="20px" color="lightblue">
                  <path d="M0 0v28h28V0H0zm24 24H4V4h20v20z"></path>
                </svg>
              :
                <svg id="spreadsheet-checkbox-checked" viewBox="0 0 28 28" width="20px" height="20px">
                  <path d="M0 0v28h28V0H0zm24 24H4V4h20v20zm-2-13l-2.828-2.828-6.768 6.982-3.576-3.576L6 14.406l6.404 6.406L22 11z"></path>
                </svg>
              }
              <label>Spreadsheet</label>
            </div>

            <div onClick={this.useTable} className={!this.props.qset.spreadsheet ? "active" : ""}>
              {this.props.qset.spreadsheet ?
                <svg id="table-checkbox" viewBox="0 0 28 28" width="20px" height="20px">
                  <path d="M0 0v28h28V0H0zm24 24H4V4h20v20z"></path>
                </svg>
              :
                <svg id="table-checkbox-checked" viewBox="0 0 28 28" width="20px" height="20px">
                  <path d="M0 0v28h28V0H0zm24 24H4V4h20v20zm-2-13l-2.828-2.828-6.768 6.982-3.576-3.576L6 14.406l6.404 6.406L22 11z"></path>
                </svg>
              }
              <label>Table</label>
            </div>
          </div>
          <div className="text">
            <label><strong>Text:</strong></label>
            <div onClick={this.useLeftAlign} className={this.props.qset.left ? "active" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20px" height="20px" viewBox="0 0 344 344" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0,344) scale(0.1,-0.1)" fill="#000000" stroke="none">
                <path d="M130 3095 l0 -145 1590 0 1590 0 0 145 0 145 -1590 0 -1590 0 0 -145z"/>
                <path d="M130 2410 l0 -140 1105 0 1105 0 0 140 0 140 -1105 0 -1105 0 0 -140z"/>
                <path d="M130 1720 l0 -140 1590 0 1590 0 0 140 0 140 -1590 0 -1590 0 0 -140z"/>
                <path d="M130 1030 l0 -140 1105 0 1105 0 0 140 0 140 -1105 0 -1105 0 0 -140z"/>
                <path d="M130 345 l0 -145 1590 0 1590 0 0 145 0 145 -1590 0 -1590 0 0 -145z"/>
                </g>
              </svg>
            </div>
            <div onClick={this.useCenterAlign} className={!this.props.qset.left ? "active" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20px" height="20px" viewBox="0 0 344 344" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0,344) scale(0.1,-0.1)" fill="#000000" stroke="none">
                <path d="M130 3095 l0 -145 1590 0 1590 0 0 145 0 145 -1590 0 -1590 0 0 -145z"/>
                <path d="M610 2410 l0 -140 1110 0 1110 0 0 140 0 140 -1110 0 -1110 0 0 -140z"/>
                <path d="M130 1720 l0 -140 1590 0 1590 0 0 140 0 140 -1590 0 -1590 0 0 -140z"/>
                <path d="M610 1030 l0 -140 1110 0 1110 0 0 140 0 140 -1110 0 -1110 0 0 -140z"/>
                <path d="M130 345 l0 -145 1590 0 1590 0 0 145 0 145 -1590 0 -1590 0 0 -145z"/>
                </g>
              </svg>
            </div>

          </div>

          <div className="header">
            <label><strong>Header:</strong></label>
            <div onClick={this.useHeader} className={this.props.qset.header ? "active" : ""}>
              {!this.props.qset.header ?
                <svg id="header-checkbox" viewBox="0 0 28 28" width="20px" height="20px" color="lightblue">
                  <path d="M0 0v28h28V0H0zm24 24H4V4h20v20z"></path>
                </svg>
              :
                <svg id="header-checkbox-checked" viewBox="0 0 28 28" width="20px" height="20px">
                  <path d="M0 0v28h28V0H0zm24 24H4V4h20v20zm-2-13l-2.828-2.828-6.768 6.982-3.576-3.576L6 14.406l6.404 6.406L22 11z"></path>
                </svg>
              }
              <label>First row is a header row</label>
            </div>
          </div>

          <div className="randomize">
            <label><strong>Randomize:</strong></label>
            <div>
              <label>
                Randomly hide
                <input type="number" placeholder={0} defaultValue={this.props.qset.randomization} min="1" max={this.props.qset.dimensions.x * this.props.qset.dimensions.y} onBlur={this.handleRandomizationBlur}/>
                cells
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Options
