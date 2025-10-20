import './Style/Login.css'
import backround from './assets/images/icons/Backround.png'

const TitleLogin = () => (

  <div className="login-title-border">
    <h1 className="login-title">Login</h1>
    <h1 className="register-title">Sign up</h1>
  </div>
);

const Image = () => (
  <div className='ImagePosition'>
    <img 
      src={backround}
      alt="Example"
      className="rounded-2xl shadow-md"
    />
  </div>
);


const Form = () =>
 (
    <body className='login-body'>
    <TitleLogin></TitleLogin>
    <form className='login-form'>
    <input className='login-input' type='text' placeholder="Email or phone number"></input>
    <input className='login-input' type='password' placeholder="Password"></input>
    <button className='login-button'>Login</button>
    <div>
    <Image></Image>
    </div>
    </form>
    </body>
);






export default Form;

