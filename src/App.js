import React from 'react';
import './App.css';
import Search from './Search';
import List from './List';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: <Search onClickSearch={this.changeToList} handleInputChange={this.handleInputChange} />,
      query: ""
    }
  }

  changeToList = () => {
    if (this.state.query.length > 0)
      this.setState({ currentPage: <List query={this.state.query} onClickBack={this.changeToSearch} sendInputToParent={this.handleInputChange} /> })
    else
      alert("Please input search query")
  }

  changeToSearch = () => {
    this.setState({
      query: "",
      currentPage: <Search onClickSearch={this.changeToList} handleInputChange={this.handleInputChange} />
    })
  }

  handleInputChange = (e) => {
    this.setState({
      query: e.target.value
    })
  }

  render() {
    return (
      <div>
        {this.state.currentPage}
      </div >
    );
  }
}

export default App;
