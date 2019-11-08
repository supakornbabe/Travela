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
    axios.post('http://35.240.242.187:9200/nutch/_search', body).then(response => {
      this.setState({
        hits: response.data.hits.hits,
        total: response.data.hits.total,
        ready: true,
        page: n
      })
    })
  }

  render() {
    const numberList = () => {
      let number = [];
      let total = this.state.total;
      let page = this.state.page;
      if (total / 10 < 7) {
        let round = Math.ceil(total / 10)
        for (let i = 1; i <= round; i++) {
          number.push(i)
        }
      }
      else if (page > 4) {
        number = [
          page - 3,
          page - 2,
          page - 1,
          page,
          page + 1,
          page + 2,
          page + 3
        ]
      }
      else {
        number = [1, 2, 3, 4, 5, 6, 7]
      }
      return number
    }

    let trimByWord = (sentence) => {
      let wordLength = 100
      var result = sentence;
      var resultArray = result.split(" ");
      if (resultArray.length > wordLength) {
        resultArray = resultArray.slice(0, wordLength);
        result = resultArray.join(" ") + "...";
      }
      return result;
    }

    return (
      <>
        {this.state.ready ?
          <div>

            <header className="static">
              <div className="container">
                <div className="row">
                  <div className="col-sm">
                    <div id="logo">
                      <img
                        src="img/Travela.png"
                        data-retina="true"
                        alt=""
                        width="auto"
                        height="40 px"
                        onClick={this.props.onClickBack}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main>
              <div id="results">
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="search_bar_list">
                        <form>
                          <input
                            className="form-control"
                            placeholder={this.state.query}
                            onChange={this.handleInputChange}
                          />
                          <input
                            type="submit"
                            value="Search"
                            onClick={() => this.handleSearchWithPage(1)}
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container margin_60_35" >
                <div className="row">
                  <div className="col-md-12">
                    {this.state.hits.map(p =>
                      <div className="strip_list wow fadeIn">
                        <small>
                          {p._source.url}
                        </small>
                        <a href={p._source.url}>
                          <h3>
                            {p._source.title}
                          </h3>
                        </a>
                        <p>
                          {trimByWord(p._source.content)}
                        </p>
                      </div>
                    )}
                    <nav aria-label="" className="add_top_20">
                      <ul className="pagination pagination-sm">
                        <li className={
                          this.state.page <= 1 ?
                            "page-item disabled"
                            :
                            "page-item"}
                        >
                          <button
                            className="page-link"
                            onClick={() => {
                              this.handleSearchWithPage(this.state.page - 1);
                            }}
                          >
                            Previous
                          </button>
                        </li>
                        {numberList().map(n =>
                          <li className={
                            this.state.page === n ?
                              "page-item active"
                              :
                              "page-item"}
                          >
                            <button
                              className="page-link"
                              onClick={() => {
                                this.handleSearchWithPage(n)
                              }}
                            >
                              {n}
                            </button>
                          </li>
                        )}
                        <li
                          className={
                            this.state.page > Math.floor(this.state.total / 10) ?
                              "page-item disabled"
                              :
                              "page-item"
                          }
                        >
                          <button
                            className="page-link"
                            onClick={() => {
                              this.handleSearchWithPage(this.state.page + 1)
                            }}
                          >
                            Next
                          </button>
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
            <div data-loader="circle-side" />
          </div>
        }
      </>
    );
  }
}

export default List;
