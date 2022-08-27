import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (searchText) {
      const URL = `https://content.guardianapis.com/search?api-key=test&q=${searchText}&show-fields=thumbnail,headline&show-tags=keyword&page=${page}&page-size=10`;
      setIsLoading(true);
      fetch(URL).then((res) =>
        res
          .json()
          .then((data) => {
            data = data?.response;
            setData(data);
          })
          .finally(() => setIsLoading(false))
      );
    }

    setData({ currentPage: 1, results: [] });
  }, [searchText, page]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  return (
    <div className="flex-center">
      <h1>News Lister</h1>
      <div className="search">
        <label htmlFor="search">Enter Search Text</label>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          name="Search"
          id="search"
        />
      </div>
      {isLoading ? (
        <div className="flex-center loader">
          <span>Loading...</span>
        </div>
      ) : data?.results?.length ? (
        <div>
          <div className="flex justify-between">
            <h2>Results for {searchText}</h2>
            <div>
              <span>Showing {data?.pageSize} Items</span>
              <h3>Total {data?.total} Items</h3>
            </div>
          </div>

          {data?.results?.map((item) => {
            return (
              <div key={item?.id} className="card">
                <a href={item?.webUrl}>
                  <div className="flex-center">
                    <img
                      width="200px"
                      src={
                        item?.fields?.thumbnail ||
                        "https://t4.ftcdn.net/jpg/02/07/87/79/360_F_207877921_BtG6ZKAVvtLyc5GWpBNEIlIxsffTtWkv.jpg"
                      }
                      alt={item?.headline}
                    />
                  </div>
                </a>
                <div className="title-and-keywords">
                  <a href={item?.webUrl}>{item?.webTitle}</a>
                  <div className="tag-container">
                    {item?.tags?.map((tag) => (
                      <button
                        key={tag?.id}
                        className="tags"
                        onClick={(e) => setSearchText(tag?.sectionName)}
                      >
                        {tag?.sectionName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={10}
            pageCount={data?.pages}
            previousLabel="< prev"
            renderOnZeroPageCount={null}
            className="flex-center pagination"
            activeClassName="active-page"
          />
        </div>
      ) : null}
    </div>
  );
}

export default App;
