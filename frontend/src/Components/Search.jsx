import './../Css/Search.css';
import BigProductCard from './BigProductCard';
import ProductCard from './ProductCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Search = () => {
  const query = new URLSearchParams(window.location.search).get('query');
  const [results, setResults] = useState([]);
  const navigateTo = useNavigate();  
  useEffect(()=>{
    const fetchResults = async () => {
      try {
        const response = await fetch(`https://elementx-7ure.onrender.com/search`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ search : query }),
        });
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };
    fetchResults();
  })
  return (
    <div className='search'>
    <div className="search-header">
    <div className="search-header-text">
      {results.length} search result{results.length !== 1 ? 's' : ''} found for "{query}"
    </div>
  </div>

    <div className="search-container">
      
      {
        results?.map((element) => (
                (element.category !== "form" && element.category !== "card") ? <ProductCard
                key={element._id} 
                html = {element.html}
                css={element.css}
                id={element._id}
                show = {true}
                height="50vh"
                likedPeople={element.likedPeople}
                username={element.username}
                background={element.background}
                /> : <BigProductCard 
                key={element._id} 
                html = {element.html}
                css={element.css}
                id={element._id}
                show = {true}
                likedPeople={element.likedPeople}
                username={element.username}
                background={element.background}
                />
            ))
      }
      <div className='searchimages'>
      <div className="no-element-found">
          <img src="end1.png" alt="Image" />
            <div className="no-element-text">
              <div >No more element found</div>
              <button onClick={()=>navigateTo(-1)}>Go to Back</button>    
                </div>
        </div>
        </div>
    </div>
    </div>
  );
}


export default Search;