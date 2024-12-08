import style from './header.module.css';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className={style.container}>
      <Link to='/'>
        <h1 className={style.title}>Hori <span className={style.titleSpan}>currency</span></h1>
      </Link>
    </header>
  )
}
