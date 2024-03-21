import {Auth} from '../components/Auth'
import Quote from '../components/Quote'

const Signin = () => {
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div>
          <Auth type='signin'/>
        </div>
        <div className='none md:block'>
          <Quote />
        </div>
      </div>
    </div>
  )
}

export default Signin