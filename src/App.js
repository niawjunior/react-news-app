import React, { Component } from 'react';
import './App.css';
import list from './list';

function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.includes(searchTerm);
  }
}
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      list:list,
      searchTerm: ''
    }
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
  }
 
  removeItem(id){
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  }

  searchValue(event){
    // console.log(event);
    this.setState({ searchTerm: event.target.value });
  }
  render() {
    console.log(this);
    return (
      <div className="App">
       <form>
         <input type="text" onChange={ this.searchValue } />
       </form>
        {
          this.state.list.filter( isSearched(this.state.searchTerm) ).map(item =>
             (
            <div key={ item.objectID }>
            <h1> <a href={ item.url }> { item.title }</a> by {item.author}</h1>
                  <h4> { item.num_comments } Comments | { item.points } Points </h4>
                  <button type="button" onClick={ () => this.removeItem(item.objectID)}>Remove</button>
            </div>
            )
          )
        }
      </div>
    );
  }
}

export default App;
