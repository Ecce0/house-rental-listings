import React from "react"
import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Slider from '../components/Slider'

const Explore = () => {
  
  
  return(
    <div>
      <header>
        <p>
          Explorer
        </p>
      </header>
      <main>
        <Slider />
        <p>Categories</p>
        <div>
          <Link to='/category/rent'>
            <img src={rentCategoryImage} alt="rent" />
            <p >Places for Rent</p>
          </Link>
          <Link to='/category/sale'>
            <img src={sellCategoryImage} alt="sell" />
            <p>Places for Sale</p>
          </Link>
        </div>
      </main>
    </div>
  )
  
}

export default Explore
