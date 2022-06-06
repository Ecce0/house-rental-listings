import React from "react"
import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

const Explore = () => {
  
  
  return(
    <div className="explore">
      <header>
        <p className="pageHeader">
          Explorer
        </p>
      </header>
      <main>
        {/*slider*/}
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to='/category/rent'>
            <img src={rentCategoryImage} alt="rent" className='exploreCategoryImg' />
            <p className="exploreCategoryName">Places for Rent</p>
          </Link>
          <Link to='/category/sell'>
            <img src={sellCategoryImage} alt="sell" className='exploreCategoryImg' />
            <p className="exploreCategoryName">Places for Sale</p>
          </Link>
        </div>
      </main>
    </div>
  )
  
}

export default Explore
