import { useState } from 'react';
import Footer from '../Footer/Footer.jsx'
import Header from '../Header/Header.jsx'
import Camera from './Camera/Camera.jsx';


const ScanQrCode = () => {
  const [urlToVisit, setUrlToVisit] = useState(null);
  console.log(urlToVisit);
  
  return (    
    <div>
      <Header/>
      <Camera setUrlToVisit={setUrlToVisit}/>
      {/* <div style={{width:"100%", position:"fixed", bottom:"0px"}}> */}
        <Footer/>
      {/* </div> */}
    </div>
  )
}

export default ScanQrCode
