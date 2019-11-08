import React from 'react';

const Search = props => {
    return (
        <div className="hero_home version_1">
            <div className="content">
                <h3>Travela! ACTION!!!!!!!!</h3>
                <p>The world is yours.</p>
                <form>
                    <div id="custom-search-input">
                        <div className="input-group">
                            <input className=" search-query" placeholder="Ex. City, Location ...." onChange={props.handleInputChange}></input>
                            <input type="submit" className="btn_search" value="Search" onClick={props.onClickSearch} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Search;
