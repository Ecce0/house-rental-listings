import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

const ListItem = ({ listing, id, onEdit, onDelete }) => {
	return (
    <div className='mt-2 mb-12 rounded-xl p-1 bg-gradient-to-r from-[#d7a64c] via-[#3d2636] to-[#d7a64c] mx-auto'>
		<li>
			<Link to={`/type/${listing.type}/${id}`}>
			<div className='max-w-sm w-full lg:max-w-full lg:flex flex-row rounded-xl'>
				 <div className='h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden'
        style={{ backgroundImage: `url(${listing.imgUrls[0]})`, width: 'max-w-full', height: 'max-h-full' }}>          
        </div>
				<div className='border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 justify-between leading-normal'>
					<div className='mb-8'>
						<div className='text-gray-900 font-bold text-xl mb-2'>
							<p>{listing.location}</p>
							<p className='italic text-neutral-content text-base'>{listing.name}</p>
						</div>
						<p className='text-secondary text-base'>
							<p className='text-secondary'>
								$
								{listing.discount
									? listing.discountedPrice
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
									: listing.regularPrice
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								{listing.type === 'rent' && ' / Month'}
							</p>
							<div>
								<img src={bedIcon} alt='bed' />
								<p>
									{listing.bedrooms > 1
										? `${listing.bedrooms} Bedrooms`
										: '1 Bedroom'}
								</p>
								<img src={bathtubIcon} alt='bath' />
								<p>
									{listing.bathrooms > 1
										? `${listing.bathrooms} Bathrooms`
										: '1 Bathroom'}
								</p>
							</div>
						</p>
					</div>
					{onDelete && (
						<DeleteIcon
						
							fill='rgb(231, 76,60)'
							onClick={() => onDelete(listing.id, listing.name)}
						/>
					)}

					{onEdit && (
						<EditIcon  onClick={() => onEdit(id)} />
					)}
				</div> 
        
			</div>
      </Link>
		</li>
    </div>
	)
}

export default ListItem
