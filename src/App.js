import React, { Component } from 'react';
import { Grid, Row, FormGroup } from 'react-bootstrap';
const DEFAULT_QUERY = 'react';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 100;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}
             &${PARAM_PAGE}&${PARAM_HPP}&${DEFAULT_HPP}`;
console.log(url);
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY 
    }
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
 
  setTopStories(result){
    const { hits, page }  = result;
    const oldHits = page !==0 ? this.state.result.hits : [];
    const updateHits = [...oldHits, ...hits];
    this.setState({ result: { hits: updateHits, page}});
  }
  fetchTopStories(searchTerm, page){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
      &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);

  }
  componentDidMount() {
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
  }

  onSubmit(event){
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
    event.preventDefault();
  }
  removeItem(id){
    const {result } = this.state;
    const updatedList = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState({ result: {...result, hits: updatedList}})
  }

  searchValue(event){
    this.setState({ searchTerm: event.target.value });
  }
  render() {

    const { result, searchTerm } = this.state;
    const page = (result && result.page) || 0;
    console.log(this);

    return (
  <div>
  <Grid grid>
       <Row>
       <div className="jumbotron text-center">
        <Search
          onChange={ this.searchValue } 
          value= {searchTerm} 
          onSubmit={ this.onSubmit }
        >
        NEWS APP
        </Search>
        </div>
       </Row>
        </Grid> 
       { result &&
        <Table
        list= { result.hits } 
        searchTerm= { searchTerm }
        removeItem={ this.removeItem }
        /> 
      }
      <div className="text-center alert">
      <Button
      className="btn btn-primary btn-block"
      onClick={ () => this.fetchTopStories(searchTerm, page +1)} >
      <h4 style={{fontWeight:'bold'}}>Load More</h4>
      </Button>
      </div>
      </div>
    );
  }
}

const Search = ({ onChange, value, children, onSubmit }) => {
return(
      <form onSubmit={ onSubmit}>
        <FormGroup>
          <h1 style={{ fontWeight: 'bold',color:'white'}}> { children }</h1>
          <hr style={{ border: '2px solid white', width: '300px'}}/>
          <div className="input-group width100">
          <input
          className="form-control searchForm"
          type="text"
          onChange={ onChange} 
          value= {value} 
          />
          <span className="input-group-btn">
            <button
             className="btn btn-info searchBtn"
             type="submit"
            >
            <h4 style={{ fontWeight: 'bold'}}>Search</h4>
            </button>
          </span>
          </div>
        </FormGroup>
      </form>
    )
}

const Button = ({ onClick, children, className=''}) =>
  <button
    className={ className }
    onClick={ onClick } >
    { children }
  </button>

  const Table = ({ list, searchTerm, removeItem }) => {
    return(
      <div className="col-sm-12 col-sm-offset-0 ">
        {
          list.map(item =>
            <div key={ item.objectID }>
              <h1> <a href={ item.url }> { item.title }</a> by {item.author}</h1>
                <h4> { item.num_comments } | Comments | { item.points } Points 
               <Button
                 className="btn btn-danger btn-xs"
                 type="button" 
                 onClick={ () => removeItem(item.objectID )} >Remove Me
               </Button> 
               </h4><hr/>
            </div>
            )
        }
      </div>
    )
  }
export default App;