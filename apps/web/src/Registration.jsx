import './Style/Login.css'
import backround from './assets/images/icons/Background2.png'

const TitleLogin = () => (

  <div className="login-title-border">
    <h1 className="register-title">Login</h1>
    <h1 className="login-title">Sign up</h1>
  </div>
);

const Image = () => (
  <div className='ImagePosition2'>
    <img 
      src={backround}
      alt="Example"
      className="rounded-2xl shadow-md"
    />
  </div>
);



const RegistrationForm = () =>
 (
     
    <body className='login-body'>
    
    <TitleLogin></TitleLogin>
    <form className='login-form'>
    <input className='login-input' type='text' placeholder="Full Name"></input>
    <input className='login-input' type='text' placeholder="Email or phone number"></input>
    <input className='login-input' type='password' placeholder="Password"></input>

    <select className='dropdown-input'>
    <option value='' disabled selected>Select Role</option>
    <option value='client'>Client</option>
    <option value='company'>Company</option>
    </select>

    <button className='login-button'>Login</button>
    <Image></Image>
    
    </form>
    </body>
);

export default RegistrationForm;