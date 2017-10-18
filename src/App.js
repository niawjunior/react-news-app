import React, { Component } from 'react';
import { Grid, Row, FormGroup } from 'react-bootstrap';
import {
  DEFAULT_PAGE,DEFAULT_QUERY,DEFAULT_HPP,PATH_BASE,PATH_SEARCH,PARAM_SEARCH,PARAM_PAGE,PARAM_HPP
} from './constants/index';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}
            &${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY 
    }

    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
 
  checkTopStoriesSearchTerm(searchTerm){
    return !this.state.results[searchTerm];
  }

  setTopStories(result){
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({ results: { ...results, [searchKey]: {hits: updatedHits, page} } });
  }

  fetchTopStories(searchTerm, page){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
      &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchTopStories(searchTerm, DEFAULT_PAGE);
  }

  onSubmit(event){
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.checkTopStoriesSearchTerm(searchTerm)) {
      this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
    }

    event.preventDefault();
  }
  removeItem(id){
    const {results, searchKey } = this.state;
    const { hits, page} = results[searchKey];
    const updatedList = hits.filter(item => item.objectID !== id);
    this.setState({ results: {...results,[searchKey]: { hits: updatedList, page}}})
  }

  searchValue(event){
    this.setState({ searchTerm: event.target.value });
  }
  render() {

    const { results, searchTerm, searchKey } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
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
      <Grid>
        <Row>
          <Table
          list= { list } 
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
        </Row>
      </Grid>
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
                 onClick={ () => removeItem(item.objectID )} >Remove
               </Button> 
               </h4><hr/>
            </div>
            )
        }
      </div>
    )
  }
export default App;