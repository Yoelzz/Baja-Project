
function Header(argue){
  
  return (
    <header>
      <h1>Elz Website</h1>
      <nav>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Service</li>
          <li>Contact</li>
          <li>{argue.val}</li>
          <li>{argue.bool.toString().toUpperCase()}</li>
        </ul>
      </nav>
    </header>
  )
}

export default Header