import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

const ListItem = ({ listing, id }) => {
	const { data } = listing
	

  const onDelete = () => {}
  


	return (
		<li className='categoryListing'>
			<Link to={`/category/${data.type}/${id}`} className='categoryListingLink'>
				<img
					src={data.imgUrls[0]}
					alt={data.name}
					className='categoryListingImg'
				/>
				<div className='categoryListingDetails'>
					<p className='categoryListingLoca'>{data.location}</p>
					<p className='categoryListingName'>{data.name}</p>
					<p className='categoryListingPrice'>
						$
						{data.offer
							? data.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							: data.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						{data.type === 'rent' && ' / Month'}
					</p>
					<div className='categoryListingInfoDiv'>
						<img src={bedIcon} alt='bed' />
						<p className='categoryListingInfoText'>
							{data.bedrooms > 1 ? `${data.bedrooms} Bedrooms` : '1 Bedroom'}
						</p>
						<img src={bathtubIcon} alt='bathtub' />
						<p className='categoryListingInfoText'>
							{data.bathrooms > 1
								? `${data.bathrooms} Bathrooms`
								: '1 Bathroom'}
						</p>
					</div>
				</div>
			</Link>
			{onDelete && (
				<DeleteIcon
					className='removeIcon'
					fill='rgb(231, 76, 60)'
					onClick={() => onDelete(data.id, data.name)}
				/>
			)}
		</li>
	)
}

export default ListItem
