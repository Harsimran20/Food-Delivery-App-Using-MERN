/**
 * The Header component renders a section with a title, description, and a button for viewing a food
 * menu.
 * @returns The `Header` component is being returned, which contains a header section with a title,
 * description, and a button to view the menu.
 */
import './Header.css'
const Header = () => {
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Order your favorite food here</h2>
            <p>Choose from a diverse menu featuring a delectable  array of dishes that can satisfy your cravings and elevate your dining experience</p>
            <button>View Menu</button>
        </div>
    </div>
  )
}

export default Header