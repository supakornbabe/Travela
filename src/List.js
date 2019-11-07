import React from 'react';
import axios from 'axios';

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hits: [],
      total: 0,
      ready: false,
      query: props.query,
      page: 1
    }
  }
  componentWillMount() {
    this.handleSearchWithPage(1)
  }

  handleInputChange = (e) => {
    this.setState({
      query: e.target.value
    })
  }
  handleSearchWithPage = (n) => {
    let body = {
      "from": 10 * (n - 1), "size": 10,
      "query": {
        "multi_match": {
          "query": this.state.query,
          "fields": ["content", "title"],
          "operator": "and"
        }
      },
      "aggs": {
        "group_by_state": {
          "terms": {
            "field": "host"
          }
        }
      }
    }
    this.setState({
      ready: false
    })
    axios.post('http://35.247.134.8:9200/nutch/_search', body).then(response => {
      this.setState({
        hits: response.data.hits.hits,
        total: response.data.hits.total,
        ready: true,
        page:n
      })
    })
  }
  render() {
    const numberList = () => {
      let number = []
      if (this.state.page > 4) {
        number = [
          this.state.page - 3,
          this.state.page - 2,
          this.state.page - 1,
          this.state.page,
          this.state.page + 1,
          this.state.page + 2,
          this.state.page + 3
        ]
      }
      else {
        number = [1, 2, 3, 4, 5, 6, 7]
      }
      return number
    }
    let trimByWord = (sentence) => {
      let numberOfWord = 100
      var result = sentence;
      var resultArray = result.split(" ");
      if (resultArray.length > numberOfWord) {
        resultArray = resultArray.slice(0, numberOfWord);
        result = resultArray.join(" ") + "...";
      }
      return result;
    }
    return (
      <>
        {this.state.ready ?
          <div>
            <header class="static">
              <div class="container">
                <div class="row">
                  <div class="col-sm">
                    <div id="logo">
                      <img src="img/Travela.png" data-retina="true" alt="" width="auto" height="40 px" onClick={this.props.onClickBack} />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main>
              <div id="results">
                <div class="container">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="search_bar_list">
                        <input type="text" class="form-control" placeholder={this.state.query} onChange={this.handleInputChange} />
                        <input type="submit" value="Search" onClick={() => this.handleSearchWithPage(1)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="container margin_60_35" >
                <div class="row">
                  <div class="col-md-12">
                    {this.state.hits.map(p => <div class="strip_list wow fadeIn">
                      <small>{p._source.url}</small>
                      <a href={p._source.url}><h3>{p._source.title}</h3></a>
                      <p>{trimByWord(p._source.content)}</p>
                    </div>
                    )}
                    <nav aria-label="" class="add_top_20">
                      <ul class="pagination pagination-sm">
                        {/* <li class="page-item disabled">
                          <a class="page-link" href="#" tabindex="-1">Previous</a>
                        </li>
                        <li class="page-item active"><a class="page-link" href="#">1</a></li>
                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                        <li class="page-item">
                          <a class="page-link" href="#">Next</a>
                        </li> */}
                        <li class={this.state.page <= 1 ? "page-item disabled" : "page-item"}>
                          <a class="page-link" onClick={() => { this.handleSearchWithPage(this.state.page - 1); this.setState({ page: this.state.page - 1 }) }}>Previous</a>
                        </li>
                        {numberList().map(n => <li class={this.state.page === n ? "page-item active" : "page-item"}><a class="page-link" onClick={() => { this.handleSearchWithPage(n); this.setState({ page: n }) }}>{n}</a></li>)}
                        <li class={this.state.page >= Math.floor(this.state.total / 10) ? "page-item disabled" : "page-item"}>
                          <a class="page-link" onClick={() => { this.handleSearchWithPage(this.state.page + 1); this.setState({ page: this.state.page + 1 }) }}>Next</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </main>
          </div>
          :
          <div id="preloader">
            <div data-loader="circle-side"></div>
          </div>
        }
      </>
    );
  }
}

export default List;
