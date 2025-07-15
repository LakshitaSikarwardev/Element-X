import './../Css/NotFound.css';

const NotFound = () => {
    return (
        <div className='notfound'>
            <div className="no-element-found">
                <img src="./../../public/end1.png" alt="Image" />
                <div className="no-element-text">
                    <div >404<br />Page Not Found</div>
                    <button onClick={() => navigateTo("/")}>Go To Home</button>
                </div>
            </div>
        </div>
    )
}

export default NotFound;