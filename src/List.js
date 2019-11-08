import React, { useState, useEffect } from 'react';
import axios from 'axios';

const List = props => {
  const [hits, setHITS] = useState([]);
  const [total, setTotal] = useState(0);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState(props.query);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    handleSearchWithPage(1) //ComponentDidMount
    return () => { console.log('unmount') } //componentWillUnmount
  },
    // eslint-disable-next-line
    []// value in array will trigger componentDidUpdate
  )

  const handleInputChange = e => {
    setQuery(e.target.value)
  }
  const numberList = () => {
    let number = [];
    if (total / 10 < 7) {
      let round = Math.ceil(total / 10)
      for (let i = 1; i <= round; i++) {
        number.push(i)
      }
    }
    else if (currentPage > 4) {
      number = [
        currentPage - 3,
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        currentPage + 3
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
  const handleSearchWithPage = n => {
    let body = {
      "from": 10 * (n - 1), "size": 10,
      "query": {
        "multi_match": {
          "query": query,
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
    setReady(false)
    axios.post('http://35.240.201.99:9200/nutch/_search', body).then(response => {
      setHITS(response.data.hits.hits)
      setTotal(response.data.hits.total)
      setReady(true)
      setCurrentPage(n)
    })
  }
  return (
    <>
      {ready ?
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
                      onClick={props.onClickBack}
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
                          placeholder={query}
                          onChange={handleInputChange}
                        />
                        <input
                          type="submit"
                          value="Search"
                          onClick={() => handleSearchWithPage(1)}
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
                  {hits.map(p =>
                    <div className="strip_list wow fadeIn">
                      <small>
                        {p._source.url}
                      </small>
                      <a
                        href={p._source.url}
                        // eslint-disable-next-line 
                        target="_blank"
                      >
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
                        currentPage <= 1 ?
                          "page-item disabled"
                          :
                          "page-item"}
                      >
                        <button
                          className="page-link"
                          onClick={() => {
                            handleSearchWithPage(currentPage - 1);
                          }}
                        >
                          Previous
                          </button>
                      </li>
                      {numberList().map(n =>
                        <li className={
                          currentPage === n ?
                            "page-item active"
                            :
                            "page-item"}
                        >
                          <button
                            className="page-link"
                            onClick={() => {
                              handleSearchWithPage(n)
                            }}
                          >
                            {n}
                          </button>
                        </li>
                      )}
                      <li
                        className={
                          currentPage > Math.floor(total / 10) ?
                            "page-item disabled"
                            :
                            "page-item"
                        }
                      >
                        <button
                          className="page-link"
                          onClick={() => {
                            handleSearchWithPage(currentPage + 1)
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
  )

}



export default List;