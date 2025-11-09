import Footer from '../Footer/Footer.jsx'
import Header from '../Header/Header.jsx'
import Camera from './Camera/Camera.jsx';


const ScanQrCode = () => {

  
  return (    
    <div>
      <Header activeIndex={1}/>
      <Camera/>
      <Footer/>
    </div>
  )
}

export default ScanQrCode
